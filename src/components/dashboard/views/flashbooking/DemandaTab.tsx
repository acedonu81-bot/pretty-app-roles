import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Clock, MapPin, Plus, X, MessageCircle, Lock, Send, CheckCheck, ChevronUp, RefreshCw, Zap } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sanitizeInput } from '@/lib/contentFilter';

interface Offer {
  id: string;
  author: string;
  avatar: string;
  gradient: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  expiresIn: number;    // seconds remaining
  createdAt: number;    // ms timestamp
  posterId?: string;
}

const fmtCountdown = (s: number) => {
  if (s <= 0) return '0:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const urgencyColor = (s: number) => {
  if (s < 1800) return '#ff5f56';
  if (s < 7200) return '#D4AF37';
  return '#22c55e';
};

const DemandaTab = () => {
  const currentUser = useProfile();
  const { user } = useAuth();
  const isEmpresario = currentUser.role === 'empresario';

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPay, setNewPay] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [replyingToOffer, setReplyingToOffer] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<Record<string, { text: string; time: string }[]>>({});

  /* ─── Load real jobs from Supabase ─── */
  const fetchJobs = useCallback(async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flash_jobs')
      .select('id, employer_id, title, description, pay, location, expires_at, created_at')
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) { setLoading(false); return; }

    if (!data || data.length === 0) {
      setOffers([]);
      setLoading(false);
      return;
    }

    // Enrich with employer display name
    const employerIds = [...new Set(data.map(j => j.employer_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, photo_url')
      .in('user_id', employerIds);

    const profileMap: Record<string, { name: string; initials: string }> = {};
    (profiles ?? []).forEach((p: any) => {
      profileMap[p.user_id] = {
        name: p.display_name || 'Empresario',
        initials: (p.display_name || 'E').charAt(0).toUpperCase(),
      };
    });

    const nowMs = Date.now();
    const mapped: Offer[] = data.map(j => {
      const expiresMs = new Date(j.expires_at!).getTime();
      const createdMs = new Date(j.created_at!).getTime();
      const expiresIn = Math.max(0, Math.round((expiresMs - nowMs) / 1000));
      const employer  = profileMap[j.employer_id] ?? { name: 'Empresario', initials: 'E' };
      return {
        id: j.id,
        author: employer.name,
        avatar: employer.initials,
        gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
        title: j.title,
        description: j.description ?? '',
        location: j.location ?? 'Sin especificar',
        pay: j.pay ?? 'A convenir',
        expiresIn,
        createdAt: createdMs,
        posterId: j.employer_id,
      };
    });

    setOffers(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  /* ─── Realtime: nuevas ofertas aparecen sin refresh ─── */
  useEffect(() => {
    const channel = supabase
      .channel('flash_jobs_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_jobs' }, () => {
        fetchJobs();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'flash_jobs' }, (payload) => {
        setOffers(prev => prev.filter(o => o.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchJobs]);

  /* ─── Realtime: empresario ve respuestas a sus ofertas sin refresh ─── */
  const [newReplies, setNewReplies] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isEmpresario || !user?.id) return;
    const channel = supabase
      .channel('flash_replies_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_bookings' }, (payload) => {
        const booking = payload.new as any;
        if (booking.created_by === user.id) return; // ignore own inserts
        // map back to offer id via event_description prefix
        const match = booking.event_description?.match(/\[Respuesta a oferta Flash: (.+?)\]/);
        if (!match) return;
        const offerTitle = match[1];
        setOffers(prev => {
          const offer = prev.find(o => o.title === offerTitle);
          if (!offer) return prev;
          setNewReplies(r => ({ ...r, [offer.id]: (r[offer.id] ?? 0) + 1 }));
          return prev;
        });
        toast.success(`Nueva respuesta a tu oferta: ${booking.professional_name}`, { duration: 5000 });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isEmpresario, user?.id]);

  /* ─── Countdown ticker ─── */
  useEffect(() => {
    const iv = setInterval(() => {
      setOffers(prev =>
        prev
          .map(o => ({ ...o, expiresIn: Math.max(0, o.expiresIn - 1) }))
          .filter(o => o.expiresIn > 0)
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  /* ─── Post new offer to Supabase ─── */
  const addOffer = async () => {
    if (!user || !newTitle.trim()) return;
    for (const field of [newTitle, newDesc, newLocation, newPay].filter(Boolean)) {
      const { clean, reason } = sanitizeInput(field);
      if (!clean) { toast.error(reason); return; }
    }
    setSubmitting(true);
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('flash_jobs').insert({
      employer_id: user.id,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      location: newLocation.trim() || 'Sin especificar',
      pay: newPay.trim() || 'A convenir',
      expires_at: expiresAt,
    } as any);
    setSubmitting(false);
    if (error) { toast.error('Error al publicar la oferta'); return; }
    setNewTitle(''); setNewDesc(''); setNewLocation(''); setNewPay('');
    setShowForm(false);
    toast.success('Oferta publicada — visible 2h para todos los profesionales');
    fetchJobs();
  };

  /* ─── Reply via Supabase messages ─── */
  const sendReply = async (offer: Offer) => {
    if (!replyText.trim() || !user?.id) return;
    const { clean, reason } = sanitizeInput(replyText.trim());
    if (!clean) { toast.error(reason); return; }
    if (!offer.posterId) {
      toast.info('No se puede contactar al autor de esta oferta.');
      return;
    }
    setSending(true);
    try {
      const myId = user.id;
      const msgText = replyText.trim();
      const employerId = offer.posterId;
      const [pA, pB] = [myId, employerId].sort();

      const { data: existing, error: fetchErr } = await supabase
        .from('conversations').select('id').eq('participant_a', pA).eq('participant_b', pB).maybeSingle();
      if (fetchErr) throw fetchErr;

      let convId = existing?.id;
      if (!convId) {
        const { data: created, error: createErr } = await supabase
          .from('conversations').insert({ participant_a: pA, participant_b: pB }).select('id').single();
        if (createErr) throw createErr;
        convId = created?.id;
      }

      if (convId) {
        const { error: msgErr } = await supabase.from('messages').insert({
          conversation_id: convId, sender_id: myId, content: msgText,
        });
        if (msgErr) throw msgErr;
      }

      // Create flash_booking so it appears in SolicitudesTab (professional) and HistorialTab (employer)
      await supabase.from('flash_bookings' as any).insert({
        professional_user_id: myId,
        professional_name: currentUser.display_name || 'Profesional',
        professional_role: currentUser.role,
        requester_name: offer.author,
        requester_contact: offer.posterId ?? '',
        event_description: `[Respuesta a oferta Flash: ${offer.title}] ${msgText}`,
        status: 'pending',
        created_by: offer.posterId ?? null,
      });

      const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setSentMessages(prev => ({
        ...prev,
        [offer.id]: [...(prev[offer.id] ?? []), { text: msgText, time }],
      }));
      setReplyText('');
      toast.success('Solicitud enviada — visible en tus Solicitudes y en Mensajes.');
    } catch {
      toast.error('Error al enviar. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="glass-panel p-4 mb-5 flex items-center gap-3"
        style={{ border: '1px solid rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.02)' }}>
        <Megaphone size={16} style={{ color: '#22c55e' }} />
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Ofertas de Empresarios</p>
          <p className="text-xs text-muted-foreground">Necesidades urgentes. Responde rápido para asegurar tu contratación.</p>
        </div>
        <button onClick={fetchJobs} className="p-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--nightlife-border)' }}
          title="Actualizar">
          <RefreshCw size={12} style={{ color: '#8E8EA0' }} />
        </button>
        {isEmpresario && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {showForm ? <X size={12} /> : <Plus size={12} />}
            {showForm ? 'Cancelar' : 'Publicar'}
          </button>
        )}
      </div>

      {!isEmpresario && (
        <div className="glass-panel p-4 mb-4 flex items-center gap-3"
          style={{ border: '1px solid rgba(255,95,86,0.15)' }}>
          <Lock size={14} style={{ color: '#ff5f56' }} />
          <p className="text-xs text-muted-foreground">Solo los empresarios pueden publicar ofertas. Cambia tu rol en Ajustes.</p>
        </div>
      )}

      {!isEmpresario && (
        <div className="glass-panel p-3 mb-4 flex items-center gap-3"
          style={{ border: 'rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.02)' }}>
          <Zap size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>
            Acceso en tiempo real — ves las ofertas al instante
          </p>
        </div>
      )}

      {isEmpresario && showForm && (
        <div className="glass-panel p-5 mb-5 animate-[fadeIn_0.3s_ease]">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Megaphone size={13} style={{ color: '#D4AF37' }} /> Nueva oferta urgente (caduca en 2h)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título (ej: DJ Techno URGENTE)" maxLength={80} className="nightlife-input !py-2.5 text-sm" />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Ubicación" maxLength={60} className="nightlife-input !py-2.5 text-sm" />
            <input value={newPay} onChange={e => setNewPay(e.target.value)} placeholder="Pago (ej: €300)" maxLength={30} className="nightlife-input !py-2.5 text-sm" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción breve" maxLength={200} className="nightlife-input !py-2.5 text-sm" />
          </div>
          <button onClick={addOffer} disabled={submitting || !newTitle.trim()}
            className="btn-nightlife-primary !py-2.5 !px-6 text-xs disabled:opacity-50">
            {submitting ? 'Publicando…' : 'Publicar oferta'}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-xs text-muted-foreground animate-pulse">Cargando ofertas…</div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {offers.map(offer => {
            const isReplying = replyingToOffer === offer.id;
            const msgs = sentMessages[offer.id] ?? [];

            return (
              <div key={offer.id} className="glass-panel flex flex-col transition-all duration-200"
                style={{ borderColor: offer.expiresIn < 1800 ? 'rgba(255,95,86,0.2)' : undefined }}>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: offer.gradient, color: 'white' }}>
                      {offer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold truncate">{offer.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{offer.author}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold flex-shrink-0"
                      style={{ background: `${urgencyColor(offer.expiresIn)}12`, color: urgencyColor(offer.expiresIn), border: `1px solid ${urgencyColor(offer.expiresIn)}30` }}>
                      <Clock size={11} /> {fmtCountdown(offer.expiresIn)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 flex-1">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {offer.location}</span>
                      <span className="font-bold text-sm" style={{ color: '#D4AF37' }}>{offer.pay}</span>
                    </div>
                    {!isEmpresario ? (
                      <button type="button"
                        onClick={() => { setReplyingToOffer(isReplying ? null : offer.id); setReplyText(''); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
                        style={{
                          background: isReplying ? 'rgba(212,175,55,0.08)' : 'linear-gradient(90deg,#D4AF37,#B8941E)',
                          color: isReplying ? '#D4AF37' : '#000',
                          border: isReplying ? '1px solid rgba(212,175,55,0.3)' : 'none',
                        }}>
                        {isReplying ? <><ChevronUp size={13} /> Cerrar</> : <><MessageCircle size={13} /> Responder</>}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {(newReplies[offer.id] ?? 0) > 0 && (
                          <button
                            onClick={() => setNewReplies(r => ({ ...r, [offer.id]: 0 }))}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
                            <MessageCircle size={11} />
                            {newReplies[offer.id]} nueva{(newReplies[offer.id] ?? 0) > 1 ? 's' : ''}
                          </button>
                        )}
                        <span className="text-xs text-muted-foreground italic">Tu oferta</span>
                      </div>
                    )}
                  </div>
                </div>

                {isReplying && (
                  <div className="border-t px-5 pb-5 pt-4 animate-[fadeIn_0.2s_ease]"
                    style={{ borderColor: 'rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.02)' }}>
                    {msgs.length > 0 && (
                      <div className="mb-3 flex flex-col gap-1.5">
                        {msgs.map((m, i) => (
                          <div key={i} className="flex items-end gap-2 justify-end">
                            <span className="text-[0.75rem] text-muted-foreground">{m.time}</span>
                            <div className="text-xs px-3 py-1.5 rounded-xl rounded-br-sm max-w-[80%]"
                              style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>
                              {m.text}
                            </div>
                            <CheckCheck size={11} style={{ color: '#22c55e', flexShrink: 0 }} />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mb-2">
                      Mensaje a <span className="font-bold" style={{ color: '#D4AF37' }}>{offer.author}</span>
                      {msgs.length === 0 && ' — También aparecerá en Mensajes'}
                    </p>
                    <div className="flex gap-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(offer); } }}
                        placeholder="Escribe tu respuesta..."
                        rows={2}
                        maxLength={500}
                        className="nightlife-input flex-1 text-xs resize-none !py-2"
                      />
                      <button type="button" onClick={() => sendReply(offer)}
                        disabled={sending || !replyText.trim()}
                        className="px-3 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', minWidth: 36 }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && offers.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
            <Megaphone size={24} style={{ color: 'rgba(34,197,94,0.22)' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No hay ofertas activas
            </p>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
              {isEmpresario
                ? 'Publica una oferta urgente con el botón de arriba. Caduca en 2h — ideal para necesidades de última hora.'
                : 'Los empresarios publicarán sus necesidades aquí. Revisa pronto para no perderte ninguna oportunidad.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaTab;
