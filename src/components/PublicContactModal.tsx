import { useState } from 'react';
import { X, Send, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  professionalName: string;
  professionalUserId: string;
  // null for static/demo profiles — no activity event should be logged for those
  professionalRole: string | null;
  professionalZone: string | null;
  onClose: () => void;
}

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Evento corporativo', 'Comunión', 'Fiesta privada',
  'Festival / Concierto', 'Inauguración', 'Otro',
];

export default function PublicContactModal({ professionalName, professionalUserId, professionalRole, professionalZone, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', eventType: '', date: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.eventType) return;
    setStatus('sending');
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'flash_booking',
          data: {
            professional_user_id: professionalUserId,
            professional_name: professionalName,
            requester_name: form.name,
            requester_contact: form.email,
            event_date: form.date || 'Por confirmar',
            event_location: '',
            event_description: `[${form.eventType}] ${form.message}`,
          },
        },
      });
      setStatus('done');
      // Anonymous activity signal — must never block the contact flow if it fails.
      // Skip entirely for static/demo profiles (professionalRole is null): logging a
      // fabricated contact event would contradict the "zero simulated activity" rule.
      if (professionalRole) {
        try {
          const { error: contactEventError } = await supabase.from('contact_events').insert({
            professional_role: professionalRole,
            professional_zone: professionalZone,
          });
          if (contactEventError) {
            console.error('[PublicContactModal] contact_events insert error:', contactEventError);
          }
        } catch (err) {
          console.error('[PublicContactModal] contact_events insert threw:', err);
        }
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/5">
          <X size={16} style={{ color: 'rgba(22,20,18,0.4)' }} />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-black mb-2" style={{ color: 'rgba(22,20,18,0.9)' }}>¡Solicitud enviada!</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(22,20,18,0.55)' }}>
              <strong>{professionalName}</strong> recibirá tu mensaje y te contactará directamente.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#f5f4f0', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(22,20,18,0.7)' }}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <h3 className="text-lg font-black mb-0.5" style={{ color: 'rgba(22,20,18,0.9)' }}>Contactar con {professionalName}</h3>
              <p className="text-xs" style={{ color: 'rgba(22,20,18,0.45)' }}>Sin registro. Gratis. Te responderá directamente.</p>
            </div>

            <button type="button"
              onClick={() => {
                set('message', form.message || '¡Hola! Me interesa reservarte con carácter urgente vía Flash Booking. ¿Estás disponible?');
                document.getElementById('xpeak-contact-message')?.focus();
              }}
              className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.5)', color: '#16a34a' }}>
              <Zap size={15} /> Flash Booking — Reserva urgente
            </button>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(22,20,18,0.55)' }}>Tu nombre *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(22,20,18,0.88)' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(22,20,18,0.55)' }}>Tu email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(22,20,18,0.88)' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(22,20,18,0.55)' }}>Tipo de evento *</label>
                <select value={form.eventType} onChange={e => set('eventType', e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: form.eventType ? 'rgba(22,20,18,0.88)' : 'rgba(22,20,18,0.35)' }}>
                  <option value="" disabled>Selecciona el tipo de evento</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(22,20,18,0.55)' }}>Fecha del evento</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(22,20,18,0.88)' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(22,20,18,0.55)' }}>Cuéntale algo más (opcional)</label>
                <textarea id="xpeak-contact-message" value={form.message} onChange={e => set('message', e.target.value)} rows={3}
                  placeholder="Número de invitados, lugar, lo que necesitas..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(22,20,18,0.88)' }} />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-xs mt-3" style={{ color: '#dc2626' }}>Algo ha fallado. Intenta de nuevo o escríbenos a info@xpeak.es</p>
            )}

            <button type="submit" disabled={status === 'sending'}
              className="w-full mt-4 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: status === 'sending' ? 0.7 : 1 }}>
              <Send size={15} />
              {status === 'sending' ? 'Enviando…' : 'Enviar solicitud gratis'}
            </button>

            <p className="text-[0.65rem] text-center mt-3" style={{ color: 'rgba(22,20,18,0.3)' }}>
              Sin registro · Sin comisión · Respuesta directa del profesional
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
