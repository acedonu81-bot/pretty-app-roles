import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Calendar, MapPin, MessageSquare, Euro, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { trackLead } from '@/lib/track';

const EVENT_HOURS: Record<string, number> = {
  'Boda': 6, 'Comunión': 4, 'Evento corporativo': 5, 'Fiesta privada': 4,
  'Festival': 8, 'Cumpleaños': 3, 'Inauguración': 3, 'Club / Discoteca': 5,
};
const EVENT_TYPES = Object.keys(EVENT_HOURS);

interface Props {
  professionalName: string;
  professionalRole: string;
  professionalUserId?: string;
  onClose: () => void;
}

const FlashBookingRequestModal = ({ professionalName, professionalRole, professionalUserId, onClose }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', contact: '', date: '', location: '', description: '', price: '', eventType: '', website: '' });
  const [sending, setSending] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);

  useEffect(() => {
    if (!professionalUserId) return;
    supabase.from('profiles').select('hourly_rate').eq('user_id', professionalUserId).maybeSingle()
      .then(({ data }) => { if (data?.hourly_rate) setHourlyRate(data.hourly_rate as number); });
  }, [professionalUserId]);

  const estimatedPrice = hourlyRate && form.eventType ? hourlyRate * (EVENT_HOURS[form.eventType] ?? 4) : null;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const send = async () => {
    if (!user) { toast.error('Inicia sesión para contactar con profesionales.'); return; }
    if (!form.name.trim() || !form.contact.trim() || !form.date.trim()) {
      toast.error('Rellena tu nombre, contacto y fecha del evento.');
      return;
    }
    // Honeypot: campo oculto que un humano nunca rellena, pero un bot sí.
    // Fallamos en silencio (sin error visible) para no delatar la trampa.
    if (form.website.trim()) { onClose(); return; }
    setSending(true);
    const payload: Record<string, unknown> = {
      professional_name: professionalName,
      professional_role: professionalRole,
      requester_name: form.name,
      requester_contact: form.contact,
      event_date: form.date,
      event_location: form.location,
      event_description: form.description,
      agreed_price: form.price ? parseFloat(form.price) : null,
      status: 'pending',
      created_by: user?.id ?? null,
    };
    // Attach professional_user_id so RLS lets them read their own bookings
    if (professionalUserId) payload.professional_user_id = professionalUserId;
    const { error } = await supabase.from('flash_bookings' as any).insert(payload);
    if (error) { setSending(false); toast.error('Error al enviar la solicitud. Inténtalo de nuevo.'); return; }

    trackLead('flash_booking', { role: professionalRole || 'unknown' });

    // Email a admin
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
      .catch((err: unknown) => console.warn('[FlashBooking] admin email failed:', err));
    // Confirmación al solicitante (si dio email)
    if (form.contact.includes('@')) {
      supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
        .catch((err: unknown) => console.warn('[FlashBooking] confirm email failed:', err));
    }
    // Notificación al profesional
    if (professionalUserId) {
      supabase.functions.invoke('send-email', {
        body: { type: 'booking_received', data: { ...payload, professional_user_id: professionalUserId } },
      }).catch((err: unknown) => console.warn('[FlashBooking] professional email failed:', err));

      supabase.functions.invoke('send-push', {
        body: {
          user_id: professionalUserId,
          title: 'Nueva solicitud Flash Booking',
          body: `${form.name} quiere contratarte para el ${form.date}`,
          url: '/dashboard?view=flashbooking&tab=solicitudes',
        },
      }).catch((err: unknown) => console.warn('[FlashBooking] push failed:', err));
    }

    setSending(false);
    toast.success(`Solicitud enviada a ${professionalName}. Te contactará pronto.`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
              <Zap size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Flash Booking</p>
              <p className="text-xs" style={{ color: '#222' }}>Solicitud para {professionalName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
              <X size={14} style={{ color: '#222' }} />
            </button>
          </div>

          {!user ? (
            <div className="p-5 text-center">
              <p className="text-sm mb-4" style={{ color: '#333' }}>
                Inicia sesión para contactar con {professionalName} — así evitamos spam y sabe que habla con alguien real.
              </p>
              <a href={`/auth?role=empresario&mode=register&redirect=${encodeURIComponent(location.pathname)}`}
                className="inline-block px-6 py-2.5 rounded-xl text-sm font-black"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                Iniciar sesión / Crear cuenta
              </a>
            </div>
          ) : (
          <div className="p-5 space-y-3">
            {/* Honeypot anti-bot: invisible para humanos, los bots lo rellenan */}
            <input type="text" name="website" value={form.website} onChange={e => set('website', e.target.value)}
              tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Tu nombre *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Sala Berlín / Pedro G." className="nightlife-input text-sm !py-2 w-full" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Contacto (tel/email) *</label>
                <input value={form.contact} onChange={e => set('contact', e.target.value)}
                  placeholder="+34 600..." className="nightlife-input text-sm !py-2 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: '#222' }}>
                  <Calendar size={10} /> Fecha del evento *
                </label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="nightlife-input text-sm !py-2 w-full" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: '#222' }}>
                  <MapPin size={10} /> Lugar
                </label>
                <input value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="Sala / Ciudad" className="nightlife-input text-sm !py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: '#222' }}>
                Tipo de evento
              </label>
              <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                className="nightlife-input text-sm !py-2 w-full appearance-none">
                <option value="">Seleccionar...</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {estimatedPrice && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <Sparkles size={12} style={{ color: '#8A6D0F' }} />
                <p className="text-xs" style={{ color: '#222' }}>
                  Presupuesto estimado: <span className="font-bold" style={{ color: '#8A6D0F' }}>~{estimatedPrice}€</span>
                  <span className="ml-1" style={{ color: '#333' }}>
                    ({hourlyRate}€/h × {EVENT_HOURS[form.eventType] ?? 4}h)
                  </span>
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: '#222' }}>
                  <MessageSquare size={10} /> Descripción
                </label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Aforo, horario, detalles..." rows={3}
                  className="nightlife-input text-sm !py-2 w-full resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: '#222' }}>
                  <Euro size={10} /> Caché acordado (€)
                </label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder={estimatedPrice ? `~${estimatedPrice}` : 'ej. 300'} className="nightlife-input text-sm !py-2 w-full" />
                <p className="text-[0.65rem] mt-1" style={{ color: 'rgba(0,0,0,0.1)' }}>Opcional — para tu registro de gastos</p>
              </div>
            </div>
          </div>
          )}

          {user && (
          <div className="px-5 pb-5">
            <button onClick={send} disabled={sending}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {sending ? 'Enviando...' : <span className="block leading-tight">Enviar solicitud a <span className="block sm:inline truncate max-w-[180px] sm:max-w-none align-bottom">{professionalName}</span></span>}
            </button>
            <p className="text-center text-xs mt-2" style={{ color: '#333' }}>
              El profesional recibirá tu solicitud y te contactará directamente.
            </p>
          </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashBookingRequestModal;
