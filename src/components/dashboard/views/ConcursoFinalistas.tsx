import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
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

  return (
    <div
      className="relative overflow-hidden rounded-3xl mb-4 p-4 sm:px-6 sm:py-5"
      style={{
        background: 'linear-gradient(120deg,#1d3fd6 0%,#2b6dff 40%,#a52ee0 100%)',
        boxShadow: '10px 14px 30px rgba(74,60,200,0.35), inset -6px -6px 14px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.25)',
      }}
    >
      <p className="inline-flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.2em] mb-1" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 800 }}>
        <Trophy size={12} strokeWidth={2.5} /> Concurso DJ XPEAK Madrid · Votos cerrados
      </p>
      <p className="text-xl sm:text-2xl leading-tight text-white" style={{ fontFamily: HZ.display, fontWeight: 800 }}>
        Los 3 con más me gusta
      </p>
      <p className="text-[0.8rem] sm:text-sm mt-1 max-w-2xl" style={{ color: 'rgba(255,255,255,0.88)', fontFamily: HZ.body }}>
        Estamos revisando los votos y el jurado escucha las sesiones. Anunciamos al ganador el 9 de noviembre.
      </p>

      {top && top.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3.5">
          {top.map((p, i) => (
            <div key={p.user_id} className="flex items-center gap-3 rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.16)', boxShadow: 'inset 3px 3px 8px rgba(255,255,255,0.28), inset -3px -3px 8px rgba(0,0,0,0.2), 0 6px 12px rgba(20,0,80,0.25)' }}>
              <span className="text-3xl leading-none tabular-nums shrink-0 w-7 text-center" style={{ fontFamily: HZ.display, fontWeight: 800, color: i === 0 ? '#ffe08a' : '#fff' }}>{i + 1}</span>
              {p.photo_url
                ? <img src={p.photo_url} alt="" loading="lazy" className="w-12 h-12 shrink-0 rounded-full object-cover" />
                : <span className="w-12 h-12 shrink-0 rounded-full bg-white/20" />}
              <div className="min-w-0 flex-1">
                <p className="text-base leading-tight text-white truncate" style={{ fontFamily: HZ.display, fontWeight: 800 }}>{p.display_name ?? 'DJ'}</p>
                <p className="text-xs truncate" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 700 }}>
                  {Number(p.me_gusta)} me gusta{p.zone ? ` · ${p.zone}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/concurso-dj-madrid/aspirantes"
        className="clay-btn-blanco inline-flex items-center gap-1.5 px-4 py-2 mt-3.5 rounded-full text-sm bg-white transition-transform hover:translate-x-0.5"
        style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
        Ver las sesiones <ArrowRight size={15} strokeWidth={2.75} />
      </Link>
    </div>
  );
};

export default ConcursoFinalistas;
