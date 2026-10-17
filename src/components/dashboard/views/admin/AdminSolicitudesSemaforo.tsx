import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Semáforo de solicitudes directas (17 oct 2026): una fila por solicitud de los
// últimos 14 días, con un color y una frase de qué hay que hacer. Lo que pide
// acción (rojo y amarillo sin hablar) parpadea; lo resuelto no. El parpadeo se
// apaga con "reducir movimiento" del sistema (motion-reduce).
//
// El ESTADO lo calcula la base de datos (panel_admin_solicitudes_estado) mirando
// primero el trato y no los mensajes: antes una reserva cerrada en el chat salía
// "aceptada sin hablar" y luego "Hablando, todo bien" cuando ya estaba cerrada
// (Magic Dreams / Mar~Iña, 400 €, 17 oct 2026). Aquí solo se traduce a color.
//
//   ROJO      sin_respuesta         el profesional no ha contestado.
//   AMARILLO  aceptada_sin_hablar   dijo que sí y no han cruzado ningún mensaje.
//   AMARILLO  hablando              hablan, falta que cierren el acuerdo.
//   VERDE     cerrado               acuerdo aceptado (en el chat) o completada.
//   GRIS      no                    dijo que no o se canceló.

export type Estado = 'sin_respuesta' | 'aceptada_sin_hablar' | 'hablando' | 'cerrado' | 'no';

interface Fila {
  id: string;
  requester_name: string | null;
  professional_name: string | null;
  status: string | null;
  source: string | null;
  agreed_price: number | string | null;
  event_date: string | null;
  event_location: string | null;
  event_description: string | null;
  created_at: string;
  mensajes: number;
  estado: Estado;
}

export type Semaforo = { color: string; bg: string; etiqueta: string; accion: string; parpadea: boolean; orden: number };

export const clasificar = (estado: Estado): Semaforo => {
  switch (estado) {
    case 'no':
      return { color: '#6b7280', bg: 'rgba(107,114,128,0.10)', etiqueta: 'Dijo que no', accion: 'Nada que hacer', parpadea: false, orden: 4 };
    case 'sin_respuesta':
      return { color: '#dc2626', bg: 'rgba(220,38,38,0.10)', etiqueta: 'Sin respuesta', accion: 'Espera a que conteste, o avísale tú', parpadea: true, orden: 0 };
    case 'aceptada_sin_hablar':
      return { color: '#d97706', bg: 'rgba(217,119,6,0.14)', etiqueta: 'Dijo que sí, no hablan', accion: 'Recuérdales que abran el chat', parpadea: true, orden: 1 };
    case 'hablando':
      return { color: '#d97706', bg: 'rgba(217,119,6,0.08)', etiqueta: 'Hablando, falta cerrar el trato', accion: 'Ya hablan; falta que acepten el acuerdo', parpadea: false, orden: 2 };
    default:
      return { color: '#16a34a', bg: 'rgba(22,163,74,0.10)', etiqueta: 'Trato cerrado', accion: 'Acuerdo aceptado', parpadea: false, orden: 3 };
  }
};

const fechaLegible = (d: string | null) => {
  const v = (d ?? '').trim();
  if (!v || /^por confirmar$/i.test(v)) return '';
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
};

const detalleCerrado = (f: Fila) => {
  const precio = f.agreed_price != null && Number(f.agreed_price) > 0 ? `${Number(f.agreed_price)} €` : '';
  const fecha = fechaLegible(f.event_date);
  return [precio, fecha && `evento ${fecha}`, f.event_location?.trim()].filter(Boolean).join(' · ');
};

const hace = (iso: string) => {
  const h = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (h < 1) return 'hace menos de 1 h';
  if (h < 24) return `hace ${Math.floor(h)} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'hace 1 día' : `hace ${d} días`;
};

const que = (d: string | null) => {
  const m = (d ?? '').match(/^\[Particular\]\s*\[[^\]]*\]\s*\[([^\]]*)\]/);
  return m ? m[1] : '';
};

const AdminSolicitudesSemaforo = () => {
  const [filas, setFilas] = useState<Fila[]>([]);

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('panel_admin_solicitudes_estado').then(({ data }: { data: Fila[] | null }) => {
      if (!cancelled) setFilas(data ?? []);
    });
    return () => { cancelled = true; };
  }, []);

  if (filas.length === 0) return null;

  const ordenadas = [...filas]
    .map(f => ({ f, s: clasificar(f.estado) }))
    .sort((a, b) => a.s.orden - b.s.orden || +new Date(b.f.created_at) - +new Date(a.f.created_at));
  const cuenta = (o: number) => ordenadas.filter(x => x.s.orden === o).length;

  return (
    <div className="mb-6 rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
      <p className="text-base font-extrabold mb-1" style={{ color: '#1f2937' }}>Solicitudes: cómo van</p>
      <p className="text-xs mb-3 flex flex-wrap gap-x-4 gap-y-1" style={{ color: '#4b5563' }}>
        <span><b style={{ color: '#dc2626' }}>{cuenta(0)}</b> sin respuesta</span>
        <span><b style={{ color: '#d97706' }}>{cuenta(1)}</b> aceptadas sin hablar</span>
        <span><b style={{ color: '#d97706' }}>{cuenta(2)}</b> hablando, sin cerrar</span>
        <span><b style={{ color: '#16a34a' }}>{cuenta(3)}</b> trato cerrado</span>
        <span><b style={{ color: '#6b7280' }}>{cuenta(4)}</b> dijeron que no</span>
      </p>
      <ul className="space-y-2">
        {ordenadas.slice(0, 12).map(({ f, s }) => (
          <li key={f.id} className="rounded-xl px-3 py-2 flex items-center gap-3" style={{ background: s.bg }}>
            <span
              aria-hidden
              className={`w-4 h-4 rounded-full flex-shrink-0 ${s.parpadea ? 'animate-pulse motion-reduce:animate-none' : ''}`}
              style={{ background: s.color, boxShadow: s.parpadea ? `0 0 10px ${s.color}` : 'none' }}
            />
            <div className="min-w-0 flex-1 text-xs" style={{ color: '#374151' }}>
              <p className="truncate">
                <b>{f.requester_name || 'Sin nombre'}</b> pidió{que(f.event_description) ? ` ${que(f.event_description)}` : ''} a <b>{f.professional_name || 'un profesional'}</b>
                <span style={{ opacity: 0.7 }}> · {hace(f.created_at)}</span>
              </p>
              <p style={{ color: s.color }}><b>{s.etiqueta}.</b> {f.estado === 'cerrado' && detalleCerrado(f) ? `${s.accion}: ${detalleCerrado(f)}` : s.accion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSolicitudesSemaforo;
