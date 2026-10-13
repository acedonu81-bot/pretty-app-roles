import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { HZ } from '@/components/healthy-zone/clay';

// PROVISIONAL: banner del Desafío DJ XPEAK Madrid (13 oct - 2 nov 2026).
// Se oculta solo al cerrar el plazo; después se puede borrar el archivo y su
// uso en FeedView.
const FIN_CONCURSO = new Date('2026-11-02T23:59:59+01:00');

const ConcursoFeedBanner = () => {
  if (Date.now() > FIN_CONCURSO.getTime()) return null;

  return (
    <Link
      to="/concurso-dj-madrid"
      className="group relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 sm:p-6 mb-4 transition-transform hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: 'linear-gradient(120deg,#1d3fd6 0%,#2b6dff 40%,#a52ee0 100%)',
        boxShadow: '10px 14px 30px rgba(74,60,200,0.35), inset -6px -6px 14px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.25)',
      }}
    >
      {/* Haces de luz, mismo aire que el carrusel de Instagram */}
      <span aria-hidden className="absolute -left-10 top-[70%] h-[3px] w-[140%] -rotate-12 opacity-50" style={{ background: '#7fd3ff', filter: 'blur(2px)' }} />
      <span aria-hidden className="absolute -left-10 top-[90%] h-[3px] w-[140%] -rotate-[20deg] opacity-40" style={{ background: '#f08cff', filter: 'blur(2px)' }} />

      <div className="relative flex-1 min-w-0">
        <p className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: '#bfe8ff', fontFamily: HZ.body, fontWeight: 800 }}>
          <Trophy size={12} strokeWidth={2.5} /> Hasta el 2 nov
        </p>
        <p className="text-xl sm:text-2xl leading-tight text-white" style={{ fontFamily: HZ.display, fontWeight: 800 }}>
          Desafío DJ XPEAK Madrid
        </p>
        <p className="text-sm mt-1.5 max-w-md" style={{ color: 'rgba(255,255,255,0.88)', fontFamily: HZ.body }}>
          Gana unos Pioneer DJ HDJ-X5. Tus me gusta eligen a los 3 finalistas y el jurado decide.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-sm bg-white transition-transform group-hover:translate-x-0.5"
          style={{ color: '#3a1f9e', fontFamily: HZ.display, fontWeight: 800 }}>
          Participar <ArrowRight size={15} strokeWidth={2.75} />
        </span>
      </div>

      <img
        src="/concurso/cascos-hdj-x5.webp"
        alt="Auriculares Pioneer DJ HDJ-X5"
        width={360}
        height={358}
        loading="lazy"
        className="relative w-24 sm:w-36 h-auto shrink-0 -rotate-6"
        style={{ filter: 'drop-shadow(0 10px 18px rgba(20,0,60,0.45))' }}
      />
    </Link>
  );
};

export default ConcursoFeedBanner;
