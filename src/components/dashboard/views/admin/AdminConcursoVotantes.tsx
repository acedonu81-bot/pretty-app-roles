import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Quién vota en el Concurso DJ (17 oct 2026). Solo lectura: un resumen por DJ y
// la lista de los últimos votantes, para ver de un vistazo si los votos llegan
// en rachas o de cuentas creadas minutos antes de votar. No decide nada: anular
// un voto sigue siendo cosa del admin según el "Juego limpio" de las bases.

export interface Voto {
  dj: string;
  votante: string | null;
  rol: string | null;
  cuenta_creada: string;
  voto: string;
  minutos_hasta_voto: number | string;
  via: string | null;
  consentimiento_marketing: boolean;
  con_foto: boolean;
}

// Una cuenta es "nueva" si votó dentro de la hora siguiente a crearla.
export const CUENTA_NUEVA_MIN = 60;
const VENTANA_RACHA_MIN = 10;

export const esCuentaNueva = (v: Pick<Voto, 'minutos_hasta_voto'>) => Number(v.minutos_hasta_voto) <= CUENTA_NUEVA_MIN;

// Mayor número de votos de un DJ dentro de una ventana deslizante de 10 minutos.
export const mayorRacha = (horas: string[]): number => {
  const t = horas.map(h => new Date(h).getTime()).sort((a, b) => a - b);
  let max = 0;
  for (let i = 0, j = 0; i < t.length; i++) {
    while (t[i] - t[j] > VENTANA_RACHA_MIN * 60_000) j++;
    max = Math.max(max, i - j + 1);
  }
  return max;
};

export const resumir = (votos: Voto[], ahora = Date.now()) => {
  const porDj = new Map<string, Voto[]>();
  for (const v of votos) porDj.set(v.dj, [...(porDj.get(v.dj) ?? []), v]);
  return [...porDj.entries()].map(([dj, vs]) => ({
    dj,
    votos: vs.length,
    nuevas: vs.filter(esCuentaNueva).length,
    ultimas3h: vs.filter(v => ahora - new Date(v.voto).getTime() <= 3 * 3600_000).length,
    racha: mayorRacha(vs.map(v => v.voto)),
  })).sort((a, b) => b.votos - a.votos);
};

const hora = (iso: string) => new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const hace = (m: number) => (m < 1 ? 'segundos' : m < 90 ? `${Math.round(m)} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} días`);

export default function AdminConcursoVotantes() {
  const [votos, setVotos] = useState<Voto[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('panel_admin_concurso_votantes').then(({ data }: { data: Voto[] | null }) => {
      if (!cancelled) setVotos(data ?? []);
    });
    return () => { cancelled = true; };
  }, []);

  const resumen = useMemo(() => resumir(votos ?? []), [votos]);

  if (!votos || votos.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <p className="text-base font-extrabold mb-1" style={{ color: '#1f2937' }}>Quién vota</p>
      <p className="text-xs mb-4" style={{ color: '#4b5563' }}>
        Solo lectura. "Cuenta nueva" es votar en la hora siguiente a crear la cuenta; "racha" es el máximo de votos en 10 minutos.
        Alta con Google y desde el móvil no es sospechoso por sí solo.
      </p>

      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left" style={{ color: '#6b7280' }}>
              <th className="py-1 pr-3">DJ</th><th className="pr-3">Votos</th><th className="pr-3">Cuenta nueva</th>
              <th className="pr-3">Últimas 3 h</th><th>Racha 10 min</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map(r => (
              <tr key={r.dj} className="border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <td className="py-1.5 pr-3 font-bold">{r.dj}</td>
                <td className="pr-3 tabular-nums">{r.votos}</td>
                <td className="pr-3 tabular-nums" style={{ color: r.votos && r.nuevas / r.votos > 0.5 ? '#b45309' : undefined }}>
                  {r.nuevas} ({r.votos ? Math.round((r.nuevas / r.votos) * 100) : 0}%)
                </td>
                <td className="pr-3 tabular-nums">{r.ultimas3h}</td>
                <td className="tabular-nums" style={{ color: r.racha >= 5 ? '#b45309' : undefined }}>{r.racha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-bold mb-2" style={{ color: '#374151' }}>Últimos votos</p>
      <ul className="space-y-1">
        {votos.slice(0, 30).map((v, i) => (
          <li key={i} className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: '#374151' }}>
            <span className="tabular-nums" style={{ color: '#6b7280' }}>{hora(v.voto)}</span>
            <b>{v.votante || 'Sin nombre'}</b>
            <span>votó a <b>{v.dj}</b></span>
            {esCuentaNueva(v)
              ? <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(217,119,6,0.14)', color: '#92400e' }}>cuenta nueva (votó a los {hace(Number(v.minutos_hasta_voto))})</span>
              : <span style={{ color: '#6b7280' }}>cuenta de hace {hace(Number(v.minutos_hasta_voto))}</span>}
            <span style={{ color: '#6b7280' }}>· {v.via ?? 'sin dato'}{v.rol && v.rol !== 'pending' ? ` · ${v.rol}` : ' · sin rol'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
