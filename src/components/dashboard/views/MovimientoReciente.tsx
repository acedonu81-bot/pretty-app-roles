import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES } from '@/lib/constants';

// 16 nov 2026: el Inicio no enseñaba que en XPEAK pasan cosas. Aquí salen las
// últimas solicitudes y ofertas REALES de los últimos 14 días (servicio, lugar
// y hace cuánto, nunca nombre ni contacto). Sin datos no se pinta nada: nada
// inventado. Los datos vienen de la función actividad_reciente_panel.
type Fila = { tipo: 'solicitud' | 'oferta'; servicio: string | null; lugar: string | null; creado: string };

function haceCuanto(iso: string): string {
  const min = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 60) return 'hace un momento';
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}

const MovimientoReciente = () => {
  const [filas, setFilas] = useState<Fila[]>([]);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const { data } = await (supabase.rpc as any)('actividad_reciente_panel');
        if (vivo && Array.isArray(data)) setFilas(data as Fila[]);
      } catch { /* sin datos no se muestra */ }
    })();
    return () => { vivo = false; };
  }, []);

  if (!filas.length) return null;

  return (
    <section className="mb-6" aria-label="Movimiento reciente en XPEAK">
      <h2 className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: '#8B6A00' }}>
        Movimiento reciente
      </h2>
      <ul className="flex flex-col gap-1.5">
        {filas.map((f, i) => {
          const servicio = f.servicio ? (ROLE_ES as Record<string, string>)[f.servicio] ?? f.servicio : 'un profesional';
          const texto = f.tipo === 'oferta'
            ? `Nueva oferta de organizador: ${servicio}`
            : `Nueva solicitud de ${servicio}`;
          return (
            <li key={`${f.creado}-${i}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.35)', color: '#0a0908' }}>
              <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: '#059669' }} />
              <span className="min-w-0 flex-1 truncate">
                {texto}{f.lugar ? ` en ${f.lugar}` : ''}
              </span>
              <span className="flex-shrink-0 text-xs" style={{ color: 'rgba(10,9,8,0.6)' }}>{haceCuanto(f.creado)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default MovimientoReciente;
