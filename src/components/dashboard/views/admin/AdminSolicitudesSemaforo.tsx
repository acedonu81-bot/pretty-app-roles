import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Semáforo de solicitudes directas (17 oct 2026): una fila por solicitud de los
// últimos 14 días, con un color y una frase de qué hay que hacer. Lo que pide
// acción (rojo y amarillo) parpadea; lo resuelto no. El parpadeo se apaga con
// "reducir movimiento" del sistema (motion-reduce).
//
//   ROJO      el profesional no ha contestado.
//   AMARILLO  dijo que sí y todavía no han cruzado ningún mensaje.
//   VERDE     dijo que sí y ya hablan (o está completada).
//   GRIS      dijo que no o se canceló.

interface Fila {
  id: string;
  requester_name: string | null;
  professional_name: string | null;
  status: string | null;
  event_date: string | null;
  event_location: string | null;
  event_description: string | null;
  created_at: string;
  mensajes: number;
}

type Semaforo = { color: string; bg: string; etiqueta: string; accion: string; parpadea: boolean; orden: number };

const clasificar = (f: Fila): Semaforo => {
  const s = f.status ?? 'pending';
  if (s === 'rejected' || s === 'cancelled') {
    return { color: '#6b7280', bg: 'rgba(107,114,128,0.10)', etiqueta: 'Dijo que no', accion: 'Nada que hacer', parpadea: false, orden: 3 };
  }
  if (s === 'pending') {
    return { color: '#dc2626', bg: 'rgba(220,38,38,0.10)', etiqueta: 'Sin respuesta', accion: 'Espera a que conteste, o avísale tú', parpadea: true, orden: 0 };
  }
  if (f.mensajes === 0 && s !== 'completed') {
    return { color: '#d97706', bg: 'rgba(217,119,6,0.14)', etiqueta: 'Dijo que sí, no hablan', accion: 'Recuérdales que abran el chat', parpadea: true, orden: 1 };
  }
  return { color: '#16a34a', bg: 'rgba(22,163,74,0.10)', etiqueta: s === 'completed' ? 'Cerrado' : 'Hablando', accion: 'Todo bien', parpadea: false, orden: 2 };
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
    (supabase.rpc as any)('panel_admin_solicitudes_semaforo').then(({ data }: { data: Fila[] | null }) => {
      if (!cancelled) setFilas(data ?? []);
    });
    return () => { cancelled = true; };
  }, []);

  if (filas.length === 0) return null;

  const ordenadas = [...filas]
    .map(f => ({ f, s: clasificar(f) }))
    .sort((a, b) => a.s.orden - b.s.orden || +new Date(b.f.created_at) - +new Date(a.f.created_at));
  const cuenta = (o: number) => ordenadas.filter(x => x.s.orden === o).length;

  return (
    <div className="mb-6 rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
      <p className="text-base font-extrabold mb-1" style={{ color: '#1f2937' }}>Solicitudes: cómo van</p>
      <p className="text-xs mb-3 flex flex-wrap gap-x-4 gap-y-1" style={{ color: '#4b5563' }}>
        <span><b style={{ color: '#dc2626' }}>{cuenta(0)}</b> sin respuesta</span>
        <span><b style={{ color: '#d97706' }}>{cuenta(1)}</b> aceptadas sin hablar</span>
        <span><b style={{ color: '#16a34a' }}>{cuenta(2)}</b> hablando o cerradas</span>
        <span><b style={{ color: '#6b7280' }}>{cuenta(3)}</b> dijeron que no</span>
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
              <p style={{ color: s.color }}><b>{s.etiqueta}.</b> {s.accion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSolicitudesSemaforo;
