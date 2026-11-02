import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HZ } from '@/components/healthy-zone/clay';

// Del 3 al 9 nov: votos cerrados, se revisan y el jurado escucha. El banner
// enseña los 3 con más me gusta (la misma lista y orden que /aspirantes, que
// ya descarta votantes no fiables) hasta que se anuncia el ganador. Se borra
// con ConcursoFeedBanner al terminar el concurso.
const CONCURSO = 'dj-madrid-2026';
type Fila = { user_id: string; display_name: string | null; photo_url: string | null; zone: string | null; me_gusta: number | string };

const sb = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: Fila[] | null; error: unknown }>;
};

const ConcursoFinalistas = () => {
  const [top, setTop] = useState<Fila[] | null>(null);

  useEffect(() => {
    sb.rpc('concurso_participantes', { p_concurso: CONCURSO })
      .then(({ data, error }) => {
        const lista = error ? [] : (data ?? []);
        setTop(lista.filter(p => Number(p.me_gusta) > 0).sort((a, b) => Number(b.me_gusta) - Number(a.me_gusta)).slice(0, 3));
      });
  }, []);

  // Orden visual de podio: 2 - 1 - 3 (el primero en el centro y más alto).
  const podio = top && top.length > 0
    ? [1, 0, 2].map(i => ({ p: top[i], i })).filter(x => !!x.p)
    : [];

  return (
    <div
      className="relative overflow-hidden rounded-3xl mb-4 px-4 pt-5 pb-5 sm:px-8 sm:pt-7"
      style={{
        background: 'radial-gradient(120% 90% at 50% 0%, #7a3cff 0%, #2b6dff 45%, #1d3fd6 100%)',
        boxShadow: '10px 14px 30px rgba(74,60,200,0.4), inset -6px -6px 14px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.25)',
      }}
    >
      <style>{`
        @keyframes cf-rise { from { opacity: 0; transform: translateY(34px) scale(.92); } to { opacity: 1; transform: none; } }
        @keyframes cf-float { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-7px) rotate(6deg); } }
        @keyframes cf-spin { to { transform: rotate(360deg); } }
        @keyframes cf-glow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        .cf-rise { animation: cf-rise .7s cubic-bezier(.2,.9,.3,1.2) both; }
        .cf-float { animation: cf-float 3.2s ease-in-out infinite; }
        .cf-spin { animation: cf-spin 5s linear infinite; }
        .cf-glow { animation: cf-glow 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cf-rise, .cf-float, .cf-spin, .cf-glow { animation: none !important; } }
      `}</style>

      {/* Aro fino dorado, fijo y sutil, en el borde del cuadro. */}
      <span aria-hidden className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 2px rgba(255,208,96,0.85)' }} />

      {/* Destellos de fondo */}
      <div aria-hidden className="cf-glow pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,224,138,0.55) 0%, rgba(255,224,138,0) 65%)' }} />

      <div className="relative text-center">
        <p className="inline-flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.22em] mb-1" style={{ color: '#d6efff', fontFamily: HZ.body, fontWeight: 800 }}>
          <Trophy size={13} strokeWidth={2.5} /> Concurso DJ XPEAK Madrid · Votos cerrados
        </p>
        <p className="text-2xl sm:text-4xl leading-tight text-white" style={{ fontFamily: HZ.display, fontWeight: 900, textShadow: '0 3px 18px rgba(20,0,80,0.45)' }}>
          Los 3 finalistas
        </p>
        <p className="text-[0.8rem] sm:text-sm mt-1 mx-auto max-w-xl" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: HZ.body }}>
          Estamos revisando los votos y el jurado escucha las sesiones. Anunciamos al ganador el 9 de noviembre.
        </p>
      </div>

      {podio.length > 0 && (
        <div className="relative grid grid-cols-3 items-end gap-2 sm:gap-4 mt-6 max-w-3xl mx-auto">
          {podio.map(({ p, i }) => {
            const oro = i === 0;
            const color = i === 0 ? ['#fff2b0', '#ffc933', '#ff9d1c'] : i === 1 ? ['#ffffff', '#d9e2f2', '#a9b8d4'] : ['#ffe0c2', '#e8995a', '#b9642a'];
            const alturaCajon = i === 0 ? 96 : i === 1 ? 74 : 62;
            const foto = oro ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-24 sm:h-24';
            return (
              <div key={p.user_id} className="cf-rise flex flex-col items-center min-w-0" style={{ animationDelay: `${i === 0 ? 0.55 : i === 1 ? 0.25 : 0.4}s` }}>
                {oro && <Crown size={34} strokeWidth={2.4} className="cf-float mb-1" style={{ color: '#ffe08a', fill: '#ffc933', filter: 'drop-shadow(0 4px 10px rgba(255,180,0,0.7))' }} />}
                <div className={`relative ${foto} shrink-0`}>
                  {oro && <span aria-hidden className="cf-spin absolute -inset-[5px] rounded-full" style={{ background: `conic-gradient(${color[0]}, ${color[2]}, ${color[0]}, ${color[1]}, ${color[0]})` }} />}
                  <span aria-hidden className="absolute -inset-[3px] rounded-full" style={{ background: `linear-gradient(145deg, ${color[0]}, ${color[1]} 55%, ${color[2]})`, opacity: oro ? 0 : 1 }} />
                  {p.photo_url
                    ? <img src={p.photo_url} alt={p.display_name ?? 'DJ'} loading="lazy" className="relative w-full h-full rounded-full object-cover" style={{ boxShadow: '0 8px 20px rgba(20,0,80,0.45)', border: '3px solid rgba(255,255,255,0.9)' }} />
                    : <span className="relative block w-full h-full rounded-full bg-white/25" />}
                </div>
                <p className="mt-2 text-sm sm:text-lg leading-tight text-white text-center w-full truncate px-0.5" style={{ fontFamily: HZ.display, fontWeight: 800, textShadow: '0 2px 8px rgba(20,0,80,0.4)' }}>
                  {p.display_name ?? 'DJ'}
                </p>
                <p className="text-[0.7rem] sm:text-sm text-center" style={{ color: '#ffe9a6', fontFamily: HZ.body, fontWeight: 800 }}>
                  {Number(p.me_gusta)} me gusta
                </p>
                {/* Cajón del podio */}
                <div className="w-full mt-2 rounded-t-2xl flex items-start justify-center pt-2"
                  style={{
                    height: alturaCajon,
                    background: `linear-gradient(180deg, ${color[0]} 0%, ${color[1]} 50%, ${color[2]} 100%)`,
                    boxShadow: 'inset 4px 4px 10px rgba(255,255,255,0.6), inset -4px -6px 12px rgba(0,0,0,0.22), 0 10px 22px rgba(20,0,80,0.35)',
                  }}>
                  <span className="text-4xl sm:text-5xl leading-none tabular-nums" style={{ fontFamily: HZ.display, fontWeight: 900, color: 'rgba(60,30,0,0.55)', textShadow: '0 2px 0 rgba(255,255,255,0.45)' }}>{i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative text-center mt-5">
        <Link to="/concurso-dj-madrid/aspirantes"
          className="clay-btn-blanco inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm bg-white transition-transform hover:translate-x-0.5"
          style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
          Ver las sesiones <ArrowRight size={15} strokeWidth={2.75} />
        </Link>
      </div>
    </div>
  );
};

export default ConcursoFinalistas;
