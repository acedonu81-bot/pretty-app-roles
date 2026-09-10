import { useState, useEffect } from 'react';
import { Calendar, MapPin, Euro, Users, Plus, X, Send, ChevronDown, ChevronUp, Check, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROLE_TAGS } from '@/lib/constants';

interface EventRequest {
  id: string;
  client_name: string;
  client_user_id: string | null;
  event_type: string;
  city: string;
  event_date: string | null;
  event_dates: string[] | null;
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

// Familias para agrupar los géneros de DJ: quien contrata no distingue Tech
// House de Minimal, pide "electrónica" o "de todo". El resto de roles no
// necesita agrupar (sus tags de ROLE_TAGS ya son pocos y concretos, tipo
// "Magia de bodas" o "Payaso clásico"), así que se ofrecen sueltos.
const FAMILIAS_DJ: { label: string; incluye: string[] }[] = [
  { label: 'House / Electrónica', incluye: ['Tech House','Deep House','House','Afro House','Organic House','Funky House','Tribal House','Progressive House','Latin House','Electro','Nu-Disco'] },
  { label: 'Techno', incluye: ['Techno','Melodic Techno','Minimal','Hard Techno','Industrial','Dub Techno'] },
  { label: 'Comercial / Hits', incluye: ['Comercial','Top 40','Hits actuales','EDM'] },
  { label: 'Reggaetón / Latino', incluye: ['Reggaetón','Dembow','Moombahton','Dancehall','Latin House'] },
  { label: 'Hip Hop / R&B', incluye: ['Hip Hop','Trap','R&B','Afrobeats','Amapiano'] },
  { label: 'Remember / Pachanga', incluye: ['Remember','Pachanga','Disco','Funk'] },
  { label: 'Ambiente / Chill', incluye: ['Ambient','Downtempo','Chillout'] },
];

// Etiqueta del formulario → slug real de profiles.role, para poder leer
// ROLE_TAGS y saber qué especialidades tiene ese rol (lo mismo que ya declara
// cada profesional en su perfil).
const ROLES_LIST = ['DJ / Artista', 'Fotógrafo', 'Camarero / Staff', 'Maquilladora', 'Grupo musical', 'Animador', 'Promotor / RRPP', 'Photo Booth', 'Catering'];
const ROL_UI_A_SLUG: Record<string, string> = {
  'DJ / Artista': 'dj',
  'Fotógrafo': 'media',
  'Camarero / Staff': 'staff',
  'Maquilladora': 'makeup',
  'Grupo musical': 'grupo-musical',
  'Animador': 'animador',
  'Promotor / RRPP': 'promotor',
  'Photo Booth': 'photo-booth',
  'Catering': 'catering',
};

// Opciones de estilo para un rol pedido: familias para DJ, tags sueltos (los
// mismos que declara el profesional en su perfil) para el resto.
const opcionesEstilo = (rolesUI: string[]): { label: string; incluye: string[] }[] => {
  if (rolesUI.includes('DJ / Artista')) return FAMILIAS_DJ;
  const slug = rolesUI.map(r => ROL_UI_A_SLUG[r]).find(s => s && ROLE_TAGS[s]);
  if (!slug) return [];
  return ROLE_TAGS[slug].tags.map(t => ({ label: t, incluye: [t] }));
};

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [responses, setResponses] = useState<Record<string, { id: string; name: string; photo: string | null; message: string | null; hired_at: string | null }[]>>({});
  const [hiring, setHiring] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [applyText, setApplyText] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_name: '',
    event_type: '',
    city: '',
    event_dates: [] as string[],
    estilos: [] as string[],
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

  // Quién se ha apuntado a MIS ofertas, ya ordenado por completitud de perfil:
  // cuando varios responden al mismo bolo, el organizador decide en segundos y
  // un perfil sin foto no compite. La RPC hace el orden en BD y comprueba que
  // la oferta es de quien pregunta.
  useEffect(() => {
    if (!user?.id || !isEmpresario || requests.length === 0) return;
    let cancelado = false;
    (async () => {
      const agrupado: Record<string, { id: string; name: string; photo: string | null; message: string | null; hired_at: string | null }[]> = {};
      for (const req of requests) {
        const { data } = await (supabase.rpc as any)('interesados_en_oferta', { p_request_id: req.id });
        const filas = (data ?? []) as { id: string; nombre: string; foto: string | null; mensaje: string | null; hired_at: string | null }[];
        if (filas.length > 0) {
          agrupado[req.id] = filas.map(f => ({
            id: f.id, name: f.nombre, photo: f.foto,
            message: f.mensaje, hired_at: f.hired_at,
          }));
        }
      }
      if (!cancelado) setResponses(agrupado);
    })();
    return () => { cancelado = true; };
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

  // El organizador se equivoca en la ciudad o el pago y hasta ahora tenía que
  // borrar la oferta entera y publicar otra — perdiendo las respuestas que ya
  // tuviera. Reutiliza el mismo modal de publicar, precargado.
  const startEdit = (req: EventRequest) => {
    setForm({
      client_name: req.client_name,
      event_type: req.event_type,
      city: req.city,
      event_dates: req.event_dates ?? (req.event_date ? [req.event_date] : []),
      estilos: [],
      budget_min: req.budget_min?.toString() ?? '',
      budget_max: req.budget_max?.toString() ?? '',
      roles_needed: req.roles_needed ?? [],
      description: req.description ?? '',
      contact_email: req.contact_email ?? '',
      contact_phone: req.contact_phone ?? '',
    });
    setEditingId(req.id);
    setShowForm(true);
  };

  const saveEdit = async () => {
    if (!editingId || !form.client_name || !form.event_type || !form.city) return;
    setSavingEdit(true);
    const { data, error } = await supabase
      .from('event_requests' as any)
      .update({
        client_name: form.client_name.trim(),
        event_type: form.event_type,
        city: form.city.trim(),
        event_date: form.event_dates[0] || null,
        event_dates: form.event_dates.length > 0 ? form.event_dates : null,
        budget_min: form.budget_min ? parseInt(form.budget_min) : null,
        budget_max: form.budget_max ? parseInt(form.budget_max) : null,
        roles_needed: form.roles_needed,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
      })
      .eq('id', editingId)
      .select()
      .single();
    setSavingEdit(false);
    if (error) { toast.error('No se pudo guardar el cambio.'); return; }
    setRequests(prev => prev.map(r => r.id === editingId ? (data as EventRequest) : r));
    setShowForm(false);
    setEditingId(null);
    setForm({ client_name: '', event_type: '', city: '', event_dates: [], estilos: [], budget_min: '', budget_max: '', roles_needed: [], description: '', contact_email: '', contact_phone: '' });
    toast.success('Oferta actualizada.');
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
        // event_date conserva la primera fecha por compatibilidad (la lee el
        // trigger de aviso y el cron de valoración); event_dates lleva todas.
        event_date: form.event_dates[0] || null,
        event_dates: form.event_dates.length > 0 ? form.event_dates : null,
        estilos: form.estilos.length > 0 ? form.estilos : null,
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
    setForm({ client_name: '', event_type: '', city: '', event_dates: [], estilos: [], budget_min: '', budget_max: '', roles_needed: [], description: '', contact_email: '', contact_phone: '' });
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
                    {/* Solo el dueño de la oferta la edita. Antes había que
                        borrarla y publicar otra, perdiendo las respuestas ya
                        recibidas. */}
                    {req.client_user_id === user?.id && (
                      <button type="button" onClick={() => startEdit(req)}
                        className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#555' }}>
                        <Pencil size={10} /> Editar
                      </button>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                      <MapPin size={10} /> {req.city}
                    </span>
                    {req.event_dates && req.event_dates.length > 1 ? (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                        <Calendar size={10} /> {req.event_dates.map(fmtDate).join(' y ')}
                      </span>
                    ) : req.event_date && (
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
                                  <div className="flex items-center gap-2 min-w-0">
                                    {resp.photo ? (
                                      <img src={resp.photo} alt={resp.name}
                                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                        style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                                    ) : (
                                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                                        style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}>
                                        {resp.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <p className="text-xs font-bold truncate" style={{ color: '#111' }}>{resp.name}</p>
                                  </div>
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
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditingId(null); } }}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="sticky top-0 flex items-center justify-between px-6 py-4"
              style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', zIndex: 1 }}>
              <div>
                <h4 className="font-black text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {editingId ? 'Editar solicitud de evento' : 'Publicar solicitud de evento'}
                </h4>
                <p className="text-xs" style={{ color: '#333' }}>
                  {editingId ? 'Los profesionales ya apuntados verán los cambios' : 'Visible 7 días para todos los profesionales'}
                </p>
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-black/5">
                <X size={16} style={{ color: '#333' }} />
              </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); editingId ? saveEdit() : handleSubmit(e); }} className="p-6 flex flex-col gap-4">
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
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>
                    FECHAS DEL EVENTO
                  </label>
                  {/* Varias fechas: el Burger Gourmet Fest era viernes Y sábado
                      y solo cabía una, así que el segundo día acabó explicado
                      en la descripción, donde ningún recordatorio lo lee. */}
                  {form.event_dates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.event_dates.map(d => (
                        <span key={d} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
                          {new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                          <button type="button" aria-label={`Quitar ${d}`}
                            onClick={() => setForm(f => ({ ...f, event_dates: f.event_dates.filter(x => x !== d) }))}
                            className="opacity-60 hover:opacity-100">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input type="date" value=""
                    onChange={e => {
                      const v = e.target.value;
                      if (!v) return;
                      setForm(f => f.event_dates.includes(v)
                        ? f
                        : { ...f, event_dates: [...f.event_dates, v].sort() });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <p className="text-[10px] mt-1" style={{ color: '#888' }}>
                    Añade un día cada vez si el evento dura varias jornadas.
                  </p>
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

              {/* Especialidad pedida: no solo para DJ. Antes una oferta de DJ
                  avisaba a los 47 géneros por igual — al de techno le llegaba
                  una boda de pachanga — y lo mismo pasaba en el resto de
                  roles (a un mago de bodas le llegaba una oferta de magia
                  infantil). Se usan las mismas tags que cada rol declara en
                  su perfil (ROLE_TAGS), así no hay que mantener dos listas. */}
              {(() => {
                const opciones = opcionesEstilo(form.roles_needed);
                if (opciones.length === 0) return null;
                const esDJ = form.roles_needed.includes('DJ / Artista');
                return (
                  <div>
                    <label className="text-xs font-black mb-2 block" style={{ color: '#333' }}>
                      {esDJ ? '¿QUÉ ESTILO DE MÚSICA QUIERES?' : '¿ALGUNA ESPECIALIDAD CONCRETA?'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button"
                        onClick={() => setForm(f => ({ ...f, estilos: [] }))}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: form.estilos.length === 0 ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${form.estilos.length === 0 ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.08)'}`,
                          color: form.estilos.length === 0 ? '#B8941E' : '#222',
                        }}>
                        De todo un poco
                      </button>
                      {opciones.map(e => {
                        const sel = e.incluye.every(g => form.estilos.includes(g)) && form.estilos.length > 0;
                        return (
                          <button key={e.label} type="button"
                            onClick={() => setForm(f => ({ ...f, estilos: e.incluye }))}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: sel ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)',
                              border: `1px solid ${sel ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.08)'}`,
                              color: sel ? '#B8941E' : '#222',
                            }}>
                            {e.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

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

              {!editingId && (
                <p className="text-[10px]" style={{ color: '#333' }}>
                  Al publicar aceptas que los profesionales de XPEAK puedan ver y responder a tu solicitud. Visible 7 días.
                </p>
              )}

              <button type="submit" disabled={submitting || savingEdit}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: (submitting || savingEdit) ? 0.7 : 1 }}>
                <Send size={14} /> {editingId
                  ? (savingEdit ? 'Guardando...' : 'Guardar cambios')
                  : (submitting ? 'Publicando...' : 'Publicar solicitud')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequestsSection;
