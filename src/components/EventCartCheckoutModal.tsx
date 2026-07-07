import { useState } from 'react';
import { X, Send, CheckCircle, Calendar, MapPin, MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CartItem, clearCart, removeFromCart } from '@/lib/eventCart';

interface Props {
  items: CartItem[];
  onClose: () => void;
  onRemove: (userId: string) => void;
}

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Evento corporativo', 'Comunión', 'Fiesta privada',
  'Festival / Concierto', 'Inauguración', 'Otro',
];

const EVENT_HOURS: Record<string, number> = {
  'Boda': 6, 'Comunión': 4, 'Evento corporativo': 5, 'Fiesta privada': 4,
  'Festival / Concierto': 8, 'Cumpleaños': 3, 'Inauguración': 3, 'Otro': 4,
};

export default function EventCartCheckoutModal({ items, onClose, onRemove }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', contact: '', eventType: '', date: '', location: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const estimatedHours = EVENT_HOURS[form.eventType] ?? 4;
  const estimatedTotal = items.reduce((sum, i) => sum + (i.hourlyRate ? i.hourlyRate * estimatedHours : 0), 0);
  const itemsWithoutRate = items.filter(i => !i.hourlyRate).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.eventType) return;
    setStatus('sending');

    const results = await Promise.allSettled(items.map(item => {
      const payload = {
        professional_name: item.displayName,
        professional_role: item.role,
        professional_user_id: item.userId,
        requester_name: form.name,
        requester_contact: form.contact,
        event_date: form.date || 'Por confirmar',
        event_location: form.location,
        event_description: `[${form.eventType}] ${form.message}`,
        agreed_price: null,
        status: 'pending',
        created_by: user?.id ?? null,
      };
      return supabase.from('flash_bookings' as any).insert(payload).then(({ error }) => {
        if (error) throw error;
        // Notificación al profesional (fire and forget, igual que Flash Booking individual)
        supabase.functions.invoke('send-email', {
          body: { type: 'booking_received', data: payload },
        }).catch((err: unknown) => console.warn('[EventCart] professional email failed:', err));
      });
    }));

    const anySuccess = results.some(r => r.status === 'fulfilled');
    if (!anySuccess) { setStatus('error'); return; }

    // Confirmación única al organizador (reutiliza flash_booking_confirm)
    if (form.contact.includes('@')) {
      supabase.functions.invoke('send-email', {
        body: {
          type: 'flash_booking_confirm',
          data: {
            requester_name: form.name,
            requester_contact: form.contact,
            event_date: form.date || 'Por confirmar',
            event_location: form.location,
            professional_name: items.map(i => i.displayName).join(', '),
          },
        },
      }).catch((err: unknown) => console.warn('[EventCart] confirm email failed:', err));
    }

    clearCart();
    setStatus('done');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/5">
          <X size={16} style={{ color: '#333' }} />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>¡Solicitudes enviadas!</h3>
            <p className="text-sm mb-6" style={{ color: '#333' }}>
              {items.length === 1 ? 'El profesional' : `Los ${items.length} profesionales`} de tu evento {items.length === 1 ? 'recibirá' : 'recibirán'} tu mensaje y te contactará{items.length === 1 ? '' : 'n'} directamente.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#f5f4f0', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-lg font-black mb-0.5" style={{ color: '#111' }}>Tu evento — {items.length} profesional{items.length !== 1 ? 'es' : ''}</h3>
              <p className="text-xs" style={{ color: '#333' }}>Un mensaje, un envío. Cada uno te contactará directamente.</p>
            </div>

            {/* Lista de profesionales en la cesta */}
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.userId} className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.displayName} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                      {item.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: '#111' }}>{item.displayName}</p>
                    <p className="text-[0.7rem]" style={{ color: '#333' }}>
                      {item.zone || 'España'}{item.hourlyRate ? ` · desde ${item.hourlyRate}€/h` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => { removeFromCart(item.userId); onRemove(item.userId); }}
                    className="p-1.5 rounded-lg hover:bg-black/5 flex-shrink-0">
                    <Trash2 size={13} style={{ color: '#999' }} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Tu nombre *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: '#333' }}>Email o teléfono *</label>
                  <input value={form.contact} onChange={e => set('contact', e.target.value)} required
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
                </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: '#333' }}>
                    <Calendar size={10} /> Fecha del evento
                  </label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: '#333' }}>
                    <MapPin size={10} /> Lugar
                  </label>
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="Sala / Ciudad"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: '#333' }}>
                  <MessageSquare size={10} /> Cuéntales algo más (opcional)
                </label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3}
                  placeholder="Número de invitados, horario, lo que necesites..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
              </div>
            </div>

            {estimatedTotal > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-4"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-xs" style={{ color: '#222' }}>
                  Presupuesto estimado: <span className="font-bold" style={{ color: '#8A6D0F' }}>~{estimatedTotal}€</span>
                  {itemsWithoutRate > 0 && (
                    <span className="ml-1" style={{ color: '#333' }}>
                      ({itemsWithoutRate} profesional{itemsWithoutRate !== 1 ? 'es' : ''} sin tarifa pública — a consultar)
                    </span>
                  )}
                </p>
              </div>
            )}

            {status === 'error' && (
              <p className="text-xs mt-3" style={{ color: '#dc2626' }}>Algo ha fallado enviando las solicitudes. Intenta de nuevo o escríbenos a info@xpeak.es</p>
            )}

            <button type="submit" disabled={status === 'sending' || items.length === 0}
              className="w-full mt-4 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Send size={15} />
              {status === 'sending' ? 'Enviando…' : `Contactar a los ${items.length} profesional${items.length !== 1 ? 'es' : ''}`}
            </button>

            <p className="text-[0.65rem] text-center mt-3" style={{ color: '#333' }}>
              Sin registro · Sin comisión · Cada profesional te contactará directamente
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
