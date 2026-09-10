import { useState, useEffect } from 'react';
import { Calendar, MapPin, Euro, Users, Plus, X, Send, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EventRequest {
  id: string;
  client_name: string;
  client_user_id: string | null;
  event_type: string;
  city: string;
  event_date: string | null;
  budget_min: number | null;
  budget_max: number | null;
  roles_needed: string[];
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  expires_at: string;
  status: string;
}

const EVENT_TYPES = ['Boda', 'Comunión', 'Evento corporativo', 'Fiesta privada', 'Festival', 'Cumpleaños', 'Inauguración', 'Concierto', 'Otro'];
const ROLES_LIST = ['DJ / Artista', 'Fotógrafo', 'Camarero / Staff', 'Maquilladora', 'Grupo musical', 'Animador', 'Promotor / RRPP', 'Photo Booth', 'Catering'];

const daysLeft = (expires: string) => {
  const diff = new Date(expires).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

// La fecha se pintaba en crudo ("2026-09-14"); el resto de la app usa formato es-ES.
const fmtDate = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EventRequestsSection = () => {
  const profile = useProfile();
  const { user } = useAuth();
  const isEmpresario = profile.role === 'empresario';

  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [responses, setResponses] = useState<Record<string, { id: string; name: string; message: string | null; hired_at: string | null }[]>>({});
  const [hiring, setHiring] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [applyText, setApplyText] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_name: '',
    event_type: '',
    city: '',
    event_date: '',
    budget_min: '',
    budget_max: '',
    roles_needed: [] as string[],
    description: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    supabase
      .from('event_requests' as any)
      .select('*')
      .eq('status', 'open')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        // Sin manejar `error` ni rechazo, un fallo (RLS, tabla ausente) dejaba
        // los skeletons pulsando indefinidamente o fingía "sin solicitudes".
        if (error) console.error('[EventRequestsSection] load failed:', error.message);
        setRequests((data ?? []) as EventRequest[]);
        setLoading(false);
      }, (err: unknown) => {
        console.error('[EventRequestsSection] load rejected:', err);
        setLoading(false);
      });
  }, []);

  // Quién se ha apuntado a MIS ofertas. La RLS solo devuelve las respuestas de
  // ofertas propias, así que no hace falta filtrar por request_id aquí.
  useEffect(() => {
    if (!user?.id || !isEmpresario || requests.length === 0) return;
    supabase
      .from('event_request_responses' as any)
      .select('id, request_id, message, professional_user_id, hired_at')
      .in('request_id', requests.map(r => r.id))
      .then(async ({ data }) => {
        const rows = (data ?? []) as { id: string; request_id: string; message: string | null; professional_user_id: string; hired_at: string | null }[];
        if (rows.length === 0) return;
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', rows.map(r => r.professional_user_id));
        const nombres = Object.fromEntries(
          (profs ?? []).map((p: { user_id: string; display_name: string | null }) => [p.user_id, p.display_name || 'Profesional'])
        );
        const agrupado: Record<string, { id: string; name: string; message: string | null; hired_at: string | null }[]> = {};
        rows.forEach(r => {
          (agrupado[r.request_id] ??= []).push({
            id: r.id,
            name: nombres[r.professional_user_id] ?? 'Profesional',
            message: r.message,
            hired_at: r.hired_at,
          });
        });
        setResponses(agrupado);
      }, () => {});
  }, [user?.id, isEmpresario, requests]);

  // Candidaturas ya enviadas: sin esto el botón "Me interesa" reaparecía al
  // recargar y el profesional creía que no se había apuntado.
  useEffect(() => {
    if (!user?.id || isEmpresario) return;
    supabase
      .from('event_request_responses' as any)
      .select('request_id')
      .eq('professional_user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        setApplied(Object.fromEntries((data as { request_id: string }[]).map(r => [r.request_id, true])));
      }, () => {});
  }, [user?.id, isEmpresario]);

  // Marcar a quién se contrata. El trigger de BD avisa al elegido, avisa a los
  // descartados (que si no se quedan esperando) y cierra la oferta.
  const hireProfessional = async (req: EventRequest, responseId: string, nombre: string) => {
    setHiring(responseId);
    const { error } = await supabase
      .from('event_request_responses' as any)
      .update({ hired_at: new Date().toISOString() })
      .eq('id', responseId);
    setHiring(null);

    if (error) { toast.error('No se pudo confirmar la contratación.'); return; }

    setResponses(prev => ({
      ...prev,
      [req.id]: (prev[req.id] ?? []).map(r =>
        r.id === responseId ? { ...r, hired_at: new Date().toISOString() } : r
      ),
    }));
    setRequests(prev => prev.filter(r => r.id !== req.id));
    toast.success(`¡Contratación confirmada con ${nombre}!`);
  };

  const applyToRequest = async (req: EventRequest) => {
    if (!user?.id) { toast.error('Inicia sesión para apuntarte.'); return; }
    setApplying(req.id);
    const { error } = await supabase.from('event_request_responses' as any).insert({
      request_id: req.id,
      professional_user_id: user.id,
      message: (applyText[req.id] ?? '').trim() || null,
    });
    setApplying(null);

    if (error) {
      // 23505 = ya existe: se había apuntado antes, no es un fallo que contar.
      if ((error as { code?: string }).code === '23505') {
        setApplied(a => ({ ...a, [req.id]: true }));
        toast.info('Ya te habías apuntado a esta oferta.');
        return;
      }
      toast.error('No se pudo enviar. Inténtalo de nuevo.');
      return;
    }

    setApplied(a => ({ ...a, [req.id]: true }));
    toast.success('¡Enviado! El organizador ya lo ve en su panel.');

    // Email de refuerzo al organizador. La campana ya la escribe el trigger;
    // si el correo falla, el aviso principal sigue estando.
    if (req.client_user_id) {
      supabase.functions.invoke('send-email', {
        body: {
          type: 'new_message',
          data: {
            user_id: req.client_user_id,
            sender_name: profile.display_name || 'Un profesional',
          },
        },
      }).catch(() => {});
    }
  };

  const toggleRole = (r: string) => {
    setForm(f => ({
      ...f,
      roles_needed: f.roles_needed.includes(r)
        ? f.roles_needed.filter(x => x !== r)
        : [...f.roles_needed, r],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.event_type || !form.city) return;
    setSubmitting(true);
    const { data, error } = await (supabase
      .from('event_requests' as any)
      .insert({
        client_name: form.client_name.trim(),
        client_user_id: user?.id ?? null,
        event_type: form.event_type,
        city: form.city.trim(),
        event_date: form.event_date || null,
        budget_min: form.budget_min ? parseInt(form.budget_min) : null,
        budget_max: form.budget_max ? parseInt(form.budget_max) : null,
        roles_needed: form.roles_needed,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
      })
      .select()
      .single() as any);
    setSubmitting(false);
    if (error) { toast.error('Error al publicar. Inténtalo de nuevo.'); return; }
    toast.success('¡Solicitud publicada! Los profesionales podrán contactarte.');
    setRequests(prev => [data as EventRequest, ...prev]);
    setShowForm(false);
    setForm({ client_name: '', event_type: '', city: '', event_date: '', budget_min: '', budget_max: '', roles_needed: [], description: '', contact_email: '', contact_phone: '' });
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-black" style={{ color: '#222', fontFamily: 'Syne, sans-serif' }}>
            Solicitudes de Evento
          </h3>
          <p className="text-xs" style={{ color: '#333' }}>
            {isEmpresario ? 'Publica lo que necesitas — los profesionales te contactan' : 'Clientes buscando profesionales ahora'}
          </p>
        </div>
        {/* Publicar una solicitud de evento es cosa del empresario: al
            profesional (que viene a RESPONDERLAS) se le ofrecía el mismo CTA. */}
        {isEmpresario && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Plus size={12} /> Publicar evento
          </button>
        )}
      </div>

      {/* List */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2].map(i => <div key={i} className="glass-panel animate-pulse rounded-2xl h-28" />)}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="py-8 text-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Calendar size={24} className="mx-auto mb-2" style={{ color: 'rgba(212,175,55,0.3)' }} />
          <p className="text-xs font-bold mb-1" style={{ color: '#333' }}>Sin solicitudes abiertas</p>
          <p className="text-xs" style={{ color: 'rgba(22,20,18,0.25)' }}>
            {isEmpresario ? 'Publica tu evento y los pros disponibles te contactarán.' : 'Cuando un cliente publique un evento aparecerá aquí.'}
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requests.map(req => {
            const open = expanded === req.id;
            const days = daysLeft(req.expires_at);
            return (
              <div key={req.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                          style={{ background: 'rgba(212,175,55,0.12)', color: '#B8941E' }}>
                          {req.event_type}
                        </span>
                        <span className="text-[10px]" style={{ color: days <= 2 ? '#ef4444' : '#333' }}>
                          {days}d restantes
                        </span>
                      </div>
                      <p className="text-sm font-black truncate" style={{ color: '#111' }}>
                        {req.client_name}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                      <MapPin size={10} /> {req.city}
                    </span>
                    {req.event_date && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                        <Calendar size={10} /> {fmtDate(req.event_date)}
                      </span>
                    )}
                    {(req.budget_min || req.budget_max) && (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#8A6D0F' }}>
                        <Euro size={10} />
                        {req.budget_min && req.budget_max
                          ? `${req.budget_min}–${req.budget_max}€`
                          : req.budget_max ? `hasta ${req.budget_max}€` : `desde ${req.budget_min}€`}
                      </span>
                    )}
                  </div>

                  {/* Roles */}
                  {req.roles_needed?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {req.roles_needed.map(r => (
                        <span key={r} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(0,0,0,0.04)', color: '#333', border: '1px solid rgba(0,0,0,0.07)' }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expand */}
                  <button onClick={() => setExpanded(open ? null : req.id)}
                    className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all hover:bg-black/5"
                    style={{ color: '#333', border: '1px solid rgba(0,0,0,0.06)' }}>
                    {open ? <><ChevronUp size={12} /> Cerrar</> : <><ChevronDown size={12} /> Ver detalle y contactar</>}
                  </button>

                  {open && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      {req.description && (
                        <p className="text-xs leading-relaxed mb-3" style={{ color: '#222' }}>
                          {req.description}
                        </p>
                      )}
                      {/* El contacto se hace DENTRO de XPEAK. Antes se pintaban
                          mailto: y tel: con los datos del organizador: la
                          conversación se iba fuera y no quedaba registro de
                          quién se había apuntado ni de si el bolo se cerró. */}
                      {isEmpresario ? (
                        (responses[req.id]?.length ?? 0) > 0 ? (
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#8A6D0F' }}>
                              {responses[req.id].length} interesado{responses[req.id].length > 1 ? 's' : ''}
                            </p>
                            {responses[req.id].map(resp => (
                              <div key={resp.id} className="px-3 py-2 rounded-xl"
                                style={{
                                  background: resp.hired_at ? 'rgba(34,197,94,0.08)' : 'rgba(212,175,55,0.06)',
                                  border: `1px solid ${resp.hired_at ? 'rgba(34,197,94,0.3)' : 'rgba(212,175,55,0.18)'}`,
                                }}>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-bold" style={{ color: '#111' }}>{resp.name}</p>
                                  {resp.hired_at ? (
                                    <span className="flex items-center gap-1 text-[10px] font-black"
                                      style={{ color: '#16a34a' }}>
                                      <Check size={11} /> CONTRATADO
                                    </span>
                                  ) : (
                                    <button type="button"
                                      onClick={() => hireProfessional(req, resp.id, resp.name)}
                                      disabled={hiring === resp.id}
                                      className="px-2.5 py-1 rounded-lg text-[10px] font-black transition-all hover:scale-105 disabled:opacity-60 flex-shrink-0"
                                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                                      {hiring === resp.id ? '…' : 'Contratar'}
                                    </button>
                                  )}
                                </div>
                                {resp.message && (
                                  <p className="text-xs mt-0.5" style={{ color: '#333' }}>{resp.message}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-center py-2" style={{ color: '#333' }}>
                            Aún no se ha apuntado nadie. Te avisaremos en tus notificaciones.
                          </p>
                        )
                      ) : applied[req.id] ? (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)' }}>
                          <Check size={12} /> Te has apuntado — el organizador ya lo sabe
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={applyText[req.id] ?? ''}
                            onChange={e => setApplyText(t => ({ ...t, [req.id]: e.target.value }))}
                            placeholder="Preséntate en una línea (opcional): disponibilidad, equipo, experiencia…"
                            rows={2} maxLength={300}
                            className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none resize-none"
                            style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                          <button
                            type="button"
                            onClick={() => applyToRequest(req)}
                            disabled={applying === req.id}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                            <Send size={11} /> {applying === req.id ? 'Enviando…' : 'Me interesa este bolo'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="sticky top-0 flex items-center justify-between px-6 py-4"
              style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', zIndex: 1 }}>
              <div>
                <h4 className="font-black text-base" style={{ fontFamily: 'Syne, sans-serif' }}>Publicar solicitud de evento</h4>
                <p className="text-xs" style={{ color: '#333' }}>Visible 7 días para todos los profesionales</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-black/5">
                <X size={16} style={{ color: '#333' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>TU NOMBRE O EMPRESA *</label>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                    placeholder="María García / Eventos Sol" required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>TIPO DE EVENTO *</label>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))} required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="">Seleccionar...</option>
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>CIUDAD *</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Madrid, Sevilla..." required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>FECHA DEL EVENTO</label>
                  <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>PRESUPUESTO (€)</label>
                  <div className="flex gap-2">
                    <input type="number" value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))}
                      placeholder="Mín" className="w-1/2 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <input type="number" value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))}
                      placeholder="Máx" className="w-1/2 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black mb-2 block" style={{ color: '#333' }}>¿QUÉ PROFESIONALES NECESITAS?</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES_LIST.map(r => {
                    const sel = form.roles_needed.includes(r);
                    return (
                      <button key={r} type="button" onClick={() => toggleRole(r)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: sel ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${sel ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.08)'}`,
                          color: sel ? '#B8941E' : '#222',
                        }}>
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>DESCRIPCIÓN</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Cuéntanos más sobre el evento: nº de personas, estilo, necesidades especiales..."
                  rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>EMAIL DE CONTACTO</label>
                  <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>TELÉFONO</label>
                  <input type="tel" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <p className="text-[10px]" style={{ color: '#333' }}>
                Al publicar aceptas que los profesionales de XPEAK puedan ver y responder a tu solicitud. Visible 7 días.
              </p>

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: submitting ? 0.7 : 1 }}>
                <Send size={14} /> {submitting ? 'Publicando...' : 'Publicar solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequestsSection;
