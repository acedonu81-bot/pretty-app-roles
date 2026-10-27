import { useLocation } from 'react-router-dom';
import { halloweenActivo } from '@/lib/halloween';
import { MurcielagoColgado } from '@/components/halloween/HalloweenHero';
import { Telarana } from '@/components/halloween/Telarana';

// PROVISIONAL: guirnalda de luces de verbena colgada del borde de arriba en
// todas las páginas durante Halloween (25 oct - 1 nov 2026). Es el hilo común
// del tema: la portada ya lleva la suya dentro del hero, así que ahí no sale.
// Fija, sin eventos de ratón y por encima de las barras pegajosas (z-50).

const COLORES = ['#FF8A1F', '#C9A3F5'];
const BOMBILLAS = 28;

const GuirnaldaLuces = () => {
  const { pathname } = useLocation();
  if (!halloweenActivo()) return null;
  // La portada lleva su propia guirnalda dentro del hero.
  if (pathname === '/') return null;
  return (
    <>
    {/* Telarañas en las esquinas de arriba: en ordenador y en la app instalada. */}
    <Telarana className="hidden md:block [.app-instalada_&]:block fixed left-0 z-[59] pointer-events-none w-[92px]" style={{ top: 'env(safe-area-inset-top, 0px)' }} />
    <Telarana espejo className="hidden md:block [.app-instalada_&]:block fixed right-0 z-[59] pointer-events-none w-[92px]" style={{ top: 'env(safe-area-inset-top, 0px)' }} />
    <div aria-hidden className="fixed left-0 right-0 z-[60] pointer-events-none h-3"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <style>{`
        @keyframes guirnaldaParpadeo { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .guirnalda-bombilla { animation: guirnaldaParpadeo 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .guirnalda-bombilla { animation: none; } }
        @media (max-width: 640px) { .guirnalda-bombilla:nth-of-type(4n+3), .guirnalda-bombilla:nth-of-type(4n) { display: none; } }
      `}</style>
      <svg className="absolute inset-x-0 top-0 w-full" height="10" viewBox="0 0 1000 10" preserveAspectRatio="none">
        <path d="M0 1 Q125 9 250 3 T500 3 T750 3 T1000 1" stroke="rgba(74,29,122,0.35)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* En los márgenes laterales: ahí no hay botones ni texto en ninguna página. */}
      <MurcielagoColgado modelo="a" className="w-[14px] sm:w-[24px]" style={{ left: '1.2%', top: 3 }} />
      <MurcielagoColgado modelo="b" className="w-[13px] sm:w-[22px]" retraso={1.3} style={{ right: '1.6%', top: 3 }} />
      {/* Ordenador: el centro de la guirnalda queda muy vacío. */}
      <MurcielagoColgado modelo="a" className="hidden md:block w-[24px]" retraso={0.6} style={{ left: '52%', top: 3 }} />
      {Array.from({ length: BOMBILLAS }, (_, i) => {
        const x = (i + 0.5) / BOMBILLAS;
        const color = COLORES[i % 2];
        return (
          <span key={i} className="guirnalda-bombilla absolute block rounded-full"
            style={{
              left: `${x * 100}%`, top: 2 + Math.abs(Math.sin(x * Math.PI * 4)) * 4,
              width: 5, height: 7, background: color, boxShadow: `0 0 6px 1px ${color}`,
              animationDelay: `${(i % 5) * 0.5}s`,
            }} />
        );
      })}
    </div>
    </>
  );
};

export default GuirnaldaLuces;
