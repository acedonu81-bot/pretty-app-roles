import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, Phone, AlertTriangle } from 'lucide-react';

// Aviso de solicitudes de cliente que nadie ha respondido. Hermano del banner
// verde de altas nuevas (AdminNewProfileAlert) y del rojo de bajas.
//
// Nace del caso del 22 ago 2026: un cliente real, sin cuenta, pidió un camarero
// para un cumpleaños en Torrent y mandó la petición a 5 profesionales. Ninguno
// respondió — los avisos estaban rotos — y nadie lo supo hasta 12 días después,
// con el evento a la vuelta de la esquina. El email al admin sí se envió, pero
// un correo se pierde; el panel es donde se entra a mirar.
//
// Ámbar y no rojo: no es una alarma de sistema roto, es trabajo pendiente que
// caduca. Y caduca de verdad — quien pide un camarero para el sábado no espera
// tres días.

interface PendingBooking {
  id: string;
  requester_name: string | null;
  requester_contact: string | null;
  professional_name: string | null;
  event_date: string | null;
  event_location: string | null;
  created_at: string;
  horas_esperando: number;
}

const urgencia = (h: number) => (h >= 24 ? '#b91c1c' : h >= 4 ? '#b45309' : '#92400e');

const esperando = (h: number) => {
  if (h < 1) return 'hace menos de 1 h';
  if (h < 24) return `hace ${Math.floor(h)} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'hace 1 día' : `hace ${d} días`;
};

const AdminPendingBookingsAlert = ({ onOpenBookings }: { onOpenBookings?: () => void } = {}) => {
  const [pending, setPending] = useState<PendingBooking[]>([]);

  useEffect(() => {
    let cancelled = false;
    (supabase.from('admin_pending_bookings' as any) as any)
      .select('id, requester_name, requester_contact, professional_name, event_date, event_location, created_at, horas_esperando')
      .limit(20)
      .then(({ data }: { data: PendingBooking[] | null }) => {
        // Si la vista aún no existe (migración sin aplicar), el panel debe
        // seguir usable: sin datos, sin banner.
        if (!cancelled) setPending(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);

  if (pending.length === 0) return null;

  const masAntigua = Math.max(...pending.map(p => p.horas_esperando));

  return (
    <div
      role="status"
      className="mb-6 rounded-2xl overflow-hidden"
      style={{ background: '#fffbeb', border: '2px solid #d97706', boxShadow: '0 4px 16px rgba(217,119,6,0.16)' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <CalendarClock size={22} strokeWidth={2.5} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold" style={{ color: '#78350f' }}>
              {pending.length === 1
                ? 'Hay 1 solicitud de cliente sin responder'
                : `Hay ${pending.length} solicitudes de cliente sin responder`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>
              La más antigua lleva esperando {esperando(masAntigua)}. Un cliente que pide para el fin de semana
              y no recibe respuesta contrata en otro sitio y no vuelve.
            </p>

            <ul className="mt-3 space-y-1.5">
              {pending.slice(0, 8).map(p => (
                <li key={p.id} className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: '#92400e' }}>
                  <span className="font-bold">{p.requester_name || 'Sin nombre'}</span>
                  {p.professional_name && <span>· pidió a {p.professional_name}</span>}
                  {p.event_location && <span>· {p.event_location}</span>}
                  {p.event_date && <span>· evento {p.event_date}</span>}
                  <span
                    className="px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1"
                    style={{ background: 'rgba(217,119,6,0.14)', color: urgencia(p.horas_esperando) }}
                  >
                    {p.horas_esperando >= 24 && <AlertTriangle size={10} strokeWidth={3} />}
                    {esperando(p.horas_esperando)}
                  </span>
                  {/* El contacto se muestra entero: es lo que permite rescatar
                      la solicitud a mano llamando al cliente, que es justo lo
                      que no se pudo hacer con la de agosto. */}
                  {p.requester_contact && (
                    <a
                      href={p.requester_contact.includes('@') ? `mailto:${p.requester_contact}` : `tel:${p.requester_contact}`}
                      className="inline-flex items-center gap-1 font-bold underline"
                      style={{ color: '#78350f' }}
                    >
                      <Phone size={10} strokeWidth={3} />{p.requester_contact}
                    </a>
                  )}
                </li>
              ))}
              {pending.length > 8 && (
                <li className="text-xs" style={{ color: '#92400e', opacity: 0.8 }}>y {pending.length - 8} más…</li>
              )}
            </ul>

            {onOpenBookings && (
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={onOpenBookings}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: '#d97706', color: '#fff' }}
                >
                  Ver solicitudes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingBookingsAlert;
