import { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Calendar, MapPin, MessageSquare, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEventCart } from '@/lib/eventCart';

interface Props {
  onClose: () => void;
}

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Evento corporativo', 'Comunión', 'Fiesta privada',
  'Festival / Concierto', 'Inauguración', 'Otro',
];

const EVENT_HOURS: Record<string, number> = {
  'Boda': 6, 'Comunión': 4, 'Evento corporativo': 5, 'Fiesta privada': 4,
  'Festival / Concierto': 8, 'Cumpleaños': 3, 'Inauguración': 3, 'Otro': 4,
};

// Antes, un visitante sin sesión que ya había añadido 2-3 profesionales al
// carrito veía un muro de login nada más abrir el modal, sin poder ni
// empezar a rellenar su solicitud — la peor fricción posible justo cuando
// más comprometido estaba. Ahora rellena el formulario entero y el registro
// solo aparece al enviar, guardando lo escrito en sessionStorage para
// restaurarlo si vuelve tras crear la cuenta.
const DRAFT_KEY = 'xpeak_event_cart_draft';

function readDraft(): { name: string; contact: string; eventType: string; date: string; location: string; message: string } | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function EventCartCheckoutModal({ onClose }: Props) {
  const { user } = useAuth();
  const { items, remove, clear } = useEventCart();
  const [form, setForm] = useState(() => {
    const draft = readDraft();
    return { name: draft?.name ?? '', contact: draft?.contact ?? '', eventType: draft?.eventType ?? '', date: draft?.date ?? '', location: draft?.location ?? '', message: draft?.message ?? '', website: '' };
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  // Horas editables: se autorrellenan según el tipo de evento (tabla EVENT_HOURS),
  // pero el usuario puede ajustarlas — cada evento dura lo que dura, la tabla es
  // solo un punto de partida razonable, no un dato fijo.
  const [hours, setHours] = useState<number | ''>('');
  const [hoursTouched, setHoursTouched] = useState(false);
  // Este envío comparte nombre + contacto con cada profesional seleccionado —
  // mismo consentimiento explícito que pide el registro (Auth.tsx) antes de
  // compartir datos personales con terceros.
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalError, setLegalError] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleEventTypeChange = (v: string) => {
    set('eventType', v);
    if (!hoursTouched) setHours(EVENT_HOURS[v] ?? 4);
  };

  const estimatedHours = hours === '' ? 0 : hours;
  const estimatedTotal = items.reduce((sum, i) => sum + (i.hourlyRate ? i.hourlyRate * estimatedHours : 0), 0);
  const itemsWithoutRate = items.filter(i => !i.hourlyRate).length;

  // Si se vacía la cesta desde dentro del modal (última papelera), cerramos solos.
  useEffect(() => {
    if (items.length === 0 && status !== 'done') onClose();
  }, [items.length, status, onClose]);

  // Draft ya restaurado (o no) al montar — una vez leído no hace falta seguir
  // ocupando sessionStorage con datos que ya están en el formulario en memoria.
  useEffect(() => {
    if (user) sessionStorage.removeItem(DRAFT_KEY);
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.eventType) return;
    if (!legalAccepted) { setLegalError(true); return; }
    if (!user) {
      // Guarda lo ya escrito y lleva a registro — al volver (mismo pathname
      // vía ?redirect=), el modal se reabre con el formulario intacto en vez
      // de perder el trabajo que el usuario ya invirtió.
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name: form.name, contact: form.contact, eventType: form.eventType, date: form.date, location: form.location, message: form.message }));
      window.location.href = `/auth?role=empresario&mode=register&redirect=${encodeURIComponent(location.pathname)}`;
      return;
    }
    // Honeypot: campo oculto que un humano nunca rellena, pero un bot sí.
    if (form.website.trim()) { onClose(); return; }

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
        event_description: `[${form.eventType}${estimatedHours > 0 ? ` · ${estimatedHours}h` : ''}] ${form.message}`,
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

    setStatus('done');
    clear();
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
            {/* Honeypot anti-bot: invisible para humanos, los bots lo rellenan */}
            <input type="text" name="website" value={form.website} onChange={e => set('website', e.target.value)}
              tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
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
                    <img src={item.photoUrl} alt={item.displayName} loading="lazy" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
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
                  <button type="button" onClick={() => remove(item.userId)}
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
                <select value={form.eventType} onChange={e => handleEventTypeChange(e.target.value)} required
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
                  <Clock size={10} /> Horas contratadas {form.eventType && !hoursTouched && '(estimadas)'}
                </label>
                <input type="number" min={1} max={24} step={0.5}
                  value={hours}
                  onChange={e => { setHoursTouched(true); const v = e.target.value; setHours(v === '' ? '' : Number(v)); }}
                  placeholder="Nº de horas"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' }} />
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

            {estimatedHours > 0 && items.some(i => i.hourlyRate) && (
              <div className="rounded-xl mt-4 overflow-hidden"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="px-3 pt-2.5 space-y-1">
                  {items.filter(i => i.hourlyRate).map(i => (
                    <div key={i.userId} className="flex items-center justify-between text-[0.7rem]" style={{ color: '#555' }}>
                      <span className="truncate mr-2">{i.displayName}</span>
                      <span className="flex-shrink-0">{i.hourlyRate}€/h × {estimatedHours}h = <span className="font-bold" style={{ color: '#222' }}>{(i.hourlyRate ?? 0) * estimatedHours}€</span></span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 mt-1" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                  <p className="text-xs" style={{ color: '#222' }}>
                    Presupuesto estimado ({estimatedHours}h)
                    {itemsWithoutRate > 0 && (
                      <span className="block text-[0.65rem] mt-0.5" style={{ color: '#333' }}>
                        +{itemsWithoutRate} profesional{itemsWithoutRate !== 1 ? 'es' : ''} sin tarifa pública — a consultar
                      </span>
                    )}
                  </p>
                  <span className="font-black text-sm flex-shrink-0" style={{ color: '#8A6D0F' }}>~{estimatedTotal}€</span>
                </div>
              </div>
            )}
            {estimatedHours === 0 && form.eventType && (
              <p className="text-[0.7rem] mt-3" style={{ color: '#333' }}>
                Indica las horas contratadas para ver el presupuesto estimado.
              </p>
            )}

            <label
              htmlFor="cart-legal-accept"
              className={`flex items-start gap-2.5 cursor-pointer rounded-xl px-3 py-3 mt-4 ${legalError ? 'animate-field-shake' : ''}`}
              style={{
                background: legalError ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.03)',
                border: legalError ? '1.5px solid #ef4444' : legalAccepted ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(0,0,0,0.1)',
              }}>
              <input
                id="cart-legal-accept"
                type="checkbox"
                checked={legalAccepted}
                onChange={e => { setLegalAccepted(e.target.checked); if (e.target.checked) setLegalError(false); }}
                className="w-5 h-5 flex-shrink-0 mt-0.5 rounded-md accent-[#D4AF37]"
              />
              <span className="text-[0.7rem] leading-relaxed" style={{ color: legalError ? '#b91c1c' : 'rgba(0,0,0,0.65)' }}>
                {legalError && <span className="font-bold">☝️ Marca esta casilla para continuar — </span>}
                Acepto que mi nombre y contacto se compartan con cada profesional seleccionado, según la{' '}
                <a href="/privacidad" target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="underline" style={{ color: '#8B6A00' }}>Política de Privacidad</a>.
              </span>
            </label>

            {status === 'error' && (
              <p className="text-xs mt-3" style={{ color: '#dc2626' }}>Algo ha fallado enviando las solicitudes. Intenta de nuevo o escríbenos a info@xpeak.es</p>
            )}

            <button type="submit" disabled={status === 'sending' || items.length === 0}
              className="w-full mt-4 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Send size={15} />
              {status === 'sending' ? 'Enviando…' : user ? `Contactar a los ${items.length} profesional${items.length !== 1 ? 'es' : ''}` : 'Crear cuenta y enviar →'}
            </button>

            <p className="text-[0.65rem] text-center mt-3" style={{ color: '#333' }}>
              {user
                ? 'Sin comisión · Cada profesional te contactará directamente'
                : 'Cuenta gratis en 30 segundos · No perderás lo que has escrito'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
