import { useState, useEffect } from 'react';
import { Megaphone, Clock, MapPin, Plus, X, MessageCircle, Lock, Send, CheckCheck, ChevronUp } from 'lucide-react';
import { empresarios } from '@/data/profiles';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sanitizeInput } from '@/lib/contentFilter';

interface Offer {
  id: number;
  author: string;
  avatar: string;
  gradient: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  expiresIn: number;
}

const buildInitialOffers = (): Offer[] => {
  let id = 1;
  const list: Offer[] = [];
  for (const e of empresarios) {
    for (const o of e.offers) {
      list.push({ id: id++, author: e.name, avatar: e.avatar, gradient: e.gradient, ...o });
    }
  }
  return list.slice(0, 3);
};

const fmtCountdown = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const urgencyColor = (s: number) => {
  if (s < 1800) return '#ff5f56';
  if (s < 3600) return '#D4AF37';
  return '#22c55e';
};

const DemandaTab = () => {
  const currentUser = useProfile();
  const { user } = useAuth();
  const isEmpresario = currentUser.role === 'empresario';
  const isFreeUser = currentUser.subscription_tier === 'free';
  const canSeePay = isEmpresario || !isFreeUser;

  const [offers, setOffers] = useState(buildInitialOffers);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPay, setNewPay] = useState('');

  const [replyingToOffer, setReplyingToOffer] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<Record<number, { text: string; time: string }[]>>({});

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

  const addOffer = () => {
    if (!newTitle.trim()) return;
    for (const field of [newTitle, newDesc, newLocation, newPay].filter(Boolean)) {
      const { clean, reason } = sanitizeInput(field);
      if (!clean) { toast.error(reason); return; }
    }
    setOffers(prev => [{
      id: Date.now(), author: 'Tú (Empresario)', avatar: 'TU',
      gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
      title: newTitle, description: newDesc,
      location: newLocation || 'Sin especificar',
      pay: newPay || 'A convenir',
      expiresIn: 7200,
    }, ...prev]);
    setNewTitle(''); setNewDesc(''); setNewLocation(''); setNewPay('');
    setShowForm(false);
    toast.success('Oferta publicada — caduca en 2h');
  };

  const sendReply = async (offer: Offer) => {
    if (!replyText.trim() || !user?.id) return;
    const { clean, reason } = sanitizeInput(replyText.trim());
    if (!clean) { toast.error(reason); return; }
    setSending(true);
    try {
      const myId = user.id;
      const msgText = replyText.trim();
      const employerId = `mock-employer-${offer.id}`;
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

      const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setSentMessages(prev => ({
        ...prev,
        [offer.id]: [...(prev[offer.id] ?? []), { text: msgText, time }],
      }));
      setReplyText('');
      toast.success('Mensaje enviado. También visible en Mensajes.');
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
          <p className="text-[0.6rem] text-muted-foreground">Necesidades urgentes. Responde rápido para asegurar tu contratación.</p>
        </div>
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

      {isEmpresario && showForm && (
        <div className="glass-panel p-5 mb-5 animate-[fadeIn_0.3s_ease]">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Megaphone size={13} style={{ color: '#D4AF37' }} /> Nueva oferta urgente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título (ej: DJ Techno URGENTE)" className="nightlife-input !py-2.5 text-sm" />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Ubicación" className="nightlife-input !py-2.5 text-sm" />
            <input value={newPay} onChange={e => setNewPay(e.target.value)} placeholder="Pago (ej: €300)" className="nightlife-input !py-2.5 text-sm" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción breve" className="nightlife-input !py-2.5 text-sm" />
          </div>
          <button onClick={addOffer} className="btn-nightlife-primary !py-2.5 !px-6 text-xs">
            Publicar (caduca en 2h)
          </button>
        </div>
      )}

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
                    <h3 className="text-sm font-bold">{offer.title}</h3>
                    <p className="text-xs text-muted-foreground">{offer.author}</p>
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
                    {canSeePay ? (
                      <span className="font-bold text-sm" style={{ color: '#D4AF37' }}>{offer.pay}</span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium" style={{ color: '#555' }}>
                        <Lock size={10} /> Solo Business+
                      </span>
                    )}
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
                    <span className="text-[0.6rem] text-muted-foreground italic">Tu oferta</span>
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
                          <span className="text-[0.55rem] text-muted-foreground">{m.time}</span>
                          <div className="text-xs px-3 py-1.5 rounded-xl rounded-br-sm max-w-[80%]"
                            style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>
                            {m.text}
                          </div>
                          <CheckCheck size={11} style={{ color: '#22c55e', flexShrink: 0 }} />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[0.6rem] text-muted-foreground mb-2">
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

      {offers.length === 0 && (
        <div className="glass-panel p-10 text-center">
          <Megaphone size={36} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No hay ofertas activas. ¡Publica la primera!</p>
        </div>
      )}
    </div>
  );
};

export default DemandaTab;
