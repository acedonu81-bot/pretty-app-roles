import { ArrowRight } from 'lucide-react';
import { halloweenActivo } from '@/lib/halloween';
import { CalabazaDJ } from '@/components/halloween/HalloweenHero';

// PROVISIONAL: franja de Halloween arriba de todas las vistas del panel
// (25 oct - 1 nov 2026). El panel abre en el directorio de DJs, no en
// Explorar ni Feed, así que el banner del concurso no basta para que se vea.
// Organizador: buscar DJ para la noche del 31. Profesional: perfil al día,
// que es cuando más se busca a última hora.

const NARANJA = '#FF8A1F';
const MORADO = '#8B3FD9';

const HalloweenPanel = ({ isEmpresario, onViewChange }: { isEmpresario: boolean; onViewChange: (v: string) => void }) => {
  if (!halloweenActivo()) return null;
  return (
    <div className="relative mx-3 md:mx-6 mt-3 overflow-hidden rounded-2xl pl-4 pr-24 sm:pl-6 sm:pr-36 pt-6 pb-4 sm:pt-7 sm:pb-5"
      style={{
        background: 'linear-gradient(115deg,#4A1D7A 0%,#7A2FC0 55%,#F07212 100%)',
        boxShadow: '8px 12px 26px rgba(122,47,192,0.3), inset -5px -5px 12px rgba(0,0,0,0.16), inset 5px 5px 12px rgba(255,255,255,0.22)',
      }}>
      <style>{`
        @keyframes hwPanelBombilla { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .hw-panel-bombilla { animation: hwPanelBombilla 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .hw-panel-bombilla { animation: none; } }
      `}</style>
      {/* Guirnalda de bombillas por el borde de arriba */}
      <div aria-hidden className="absolute left-0 right-0 top-0 h-5">
        <span className="absolute left-0 right-0 top-[5px] h-px" style={{ background: 'rgba(255,255,255,0.35)' }} />
        {Array.from({ length: 16 }, (_, i) => {
          const color = i % 2 ? '#C9A3F5' : NARANJA;
          return (
            <span key={i} className="hw-panel-bombilla absolute block rounded-full"
              style={{
                left: `${(i + 0.5) * 6.25}%`, top: 2, width: 7, height: 10,
                background: color, boxShadow: `0 0 10px 2px ${color}`,
                animationDelay: `${(i % 4) * 0.4}s`,
              }} />
          );
        })}
      </div>

      <p className="text-[0.7rem] uppercase tracking-[0.2em] font-extrabold" style={{ color: '#FFD2A6' }}>
        Semana de Halloween
      </p>
      <p className="text-lg sm:text-2xl font-black leading-tight text-white font-display mt-0.5">
        {isEmpresario ? '¿Fiesta el 31 y sin DJ? Aún estás a tiempo' : 'La noche más movida del año: que te encuentren'}
      </p>
      <p className="text-sm mt-1 max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {isEmpresario
          ? 'DJs, animadores y staff para tu noche de Halloween, sin comisión.'
          : 'En Halloween se contrata a última hora. Ten tu foto, tus precios y tu música al día.'}
      </p>
      <button type="button" onClick={() => onViewChange(isEmpresario ? 'dj' : 'profile')}
        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black text-white transition-transform hover:scale-105"
        style={{ background: NARANJA, boxShadow: `0 6px 16px rgba(240,114,18,0.45), inset -3px -3px 8px rgba(0,0,0,0.18), inset 3px 3px 8px rgba(255,255,255,0.3)` }}>
        {isEmpresario ? 'Buscar DJ' : 'Revisar mi perfil'} <ArrowRight size={15} strokeWidth={2.75} />
      </button>

      <CalabazaDJ className="absolute right-2 bottom-1 sm:right-5 sm:bottom-2 w-20 sm:w-28 h-auto rotate-6"
        style={{ filter: `drop-shadow(0 8px 16px ${MORADO}88)` }} />
    </div>
  );
};

export default HalloweenPanel;
