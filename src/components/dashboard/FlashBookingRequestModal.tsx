import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Props {
  professionalName: string;
  professionalRole: string;
  professionalUserId?: string; // real user_id for RLS
  onClose: () => void;
}

const FlashBookingRequestModal = ({ professionalName, professionalRole, professionalUserId, onClose }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', contact: '', date: '', location: '', description: '' });
  const [sending, setSending] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const send = async () => {
    if (!form.name.trim() || !form.contact.trim() || !form.date.trim()) {
      toast.error('Rellena tu nombre, contacto y fecha del evento.');
      return;
    }
    setSending(true);
    const payload: Record<string, unknown> = {
      professional_name: professionalName,
      professional_role: professionalRole,
      requester_name: form.name,
      requester_contact: form.contact,
      event_date: form.date,
      event_location: form.location,
      event_description: form.description,
      status: 'pending',
    };
    // Attach professional_user_id so RLS lets them read their own bookings
    if (professionalUserId) payload.professional_user_id = professionalUserId;
    const { error } = await supabase.from('flash_bookings' as any).insert(payload);
    if (error) { setSending(false); toast.error('Error al enviar la solicitud. Inténtalo de nuevo.'); return; }

    // Email a admin
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
      .catch((err: unknown) => console.warn('[FlashBooking] admin email failed:', err));
    if (form.contact.includes('@')) {
      supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
        .catch((err: unknown) => console.warn('[FlashBooking] confirm email failed:', err));
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
          style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
              <Zap size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Flash Booking</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Solicitud para {professionalName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
              <X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Tu nombre *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Sala Berlín / Pedro G." className="nightlife-input text-sm !py-2 w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Contacto (tel/email) *</label>
                <input value={form.contact} onChange={e => set('contact', e.target.value)}
                  placeholder="+34 600..." className="nightlife-input text-sm !py-2 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <Calendar size={10} /> Fecha del evento *
                </label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="nightlife-input text-sm !py-2 w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <MapPin size={10} /> Lugar
                </label>
                <input value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="Sala / Ciudad" className="nightlife-input text-sm !py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <MessageSquare size={10} /> Descripción del evento
              </label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Tipo de evento, aforo estimado, horario..." rows={3}
                className="nightlife-input text-sm !py-2 w-full resize-none" />
            </div>
          </div>

          <div className="px-5 pb-5">
            <button onClick={send} disabled={sending}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {sending ? 'Enviando...' : `Enviar solicitud a ${professionalName} ⚡`}
            </button>
            <p className="text-center text-[0.6rem] mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              El profesional recibirá tu solicitud y te contactará directamente.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashBookingRequestModal;
