import { useState } from 'react';
import { X, Send, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackLead } from '@/lib/track';

interface Props {
  professionalName: string;
  professionalUserId: string;
  // null for static/demo profiles — no activity event should be logged for those
  professionalRole: string | null;
  professionalZone: string | null;
  isFlashActive?: boolean;
  onClose: () => void;
}

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Evento corporativo', 'Comunión', 'Fiesta privada',
  'Festival / Concierto', 'Inauguración', 'Otro',
];

export default function PublicContactModal({ professionalName, professionalUserId, professionalRole, professionalZone, isFlashActive, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', eventType: '', date: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.eventType) return;
    setStatus('sending');
    try {
      const payload = {
        professional_user_id: professionalUserId,
        professional_name: professionalName,
        professional_role: professionalRole ?? 'profesional',
        requester_name: form.name,
        requester_contact: form.email,
        event_date: form.date || 'Por confirmar',
        event_location: '',
        event_description: `[${form.eventType}] ${form.message}`,
        status: 'pending',
        created_by: null,
        source: 'public_contact_modal',
      };
      // Insert real en flash_bookings — antes este formulario SOLO mandaba
      // emails y nunca dejaba rastro en BD. El profesional no veía nada en
      // su panel "Solicitudes" (que lee de esta tabla), y si el email
      // fallaba silenciosamente, la solicitud se perdía sin que nadie se
      // enterara pese a que la UI mostraba "¡Solicitud enviada!" como éxito.
      const { error: insertError } = await supabase.from('flash_bookings' as any).insert(payload);
      if (insertError) throw insertError;

      trackLead('contact_modal', { role: professionalRole ?? 'unknown' });

      // Aviso a admin (registro interno)
      supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
        .catch((err: unknown) => console.warn('[PublicContactModal] admin email failed:', err));
      // Notificación al profesional — sin esto nunca se enteraba del contacto.
      if (professionalUserId) {
        supabase.functions.invoke('send-email', {
          body: { type: 'booking_received', data: payload },
        }).catch((err: unknown) => console.warn('[PublicContactModal] professional email failed:', err));
      }
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
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} aria-label="Cerrar"
          className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center rounded-lg hover:bg-black/5">
          <X size={18} style={{ color: '#333' }} />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>¡Solicitud enviada!</h3>
            <p className="text-sm mb-6" style={{ color: '#333' }}>
              <strong>{professionalName}</strong> recibirá tu mensaje y te contactará directamente.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#f5f4f0', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <h3 className="text-lg font-black mb-0.5 pr-10 break-words" style={{ color: '#111' }}>Escribe a {professionalName}</h3>
              <p className="text-xs" style={{ color: '#333' }}>Sin registro. Gratis.</p>
            </div>

            {isFlashActive && (
              <button type="button"
                onClick={() => {
                  set('message', form.message || '¡Hola! Me interesa reservarte con carácter urgente vía Flash Booking. ¿Estás disponible?');
                  document.getElementById('xpeak-contact-message')?.focus();
                }}
                className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.5)', color: '#16a34a' }}>
                <Zap size={15} /> Flash Booking — Reserva urgente
              </button>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Tu nombre *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required
                  placeholder="Nombre completo"
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Tu email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  placeholder="tu@email.com"
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Tipo de evento *</label>
                <select value={form.eventType} onChange={e => set('eventType', e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: form.eventType ? '#222' : '#333' }}>
                  <option value="" disabled>Selecciona el tipo de evento</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Fecha del evento</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Cuéntale algo más (opcional)</label>
                <textarea id="xpeak-contact-message" value={form.message} onChange={e => set('message', e.target.value)} rows={3}
                  placeholder="Número de invitados, lugar, lo que necesitas..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
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

            <p className="text-[0.65rem] text-center mt-3" style={{ color: '#333' }}>
              Sin registro · Sin comisión · Respuesta directa del profesional
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
