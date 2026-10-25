import { useEffect, useState } from 'react';
import type React from 'react';

// PROVISIONAL: modo Halloween de la portada (25 oct - 1 nov 2026, ver
// halloweenActivo). Capa encima del vídeo del hero: tinte morado, focos de
// escenario naranja y morado, guirnalda de bombillas, niebla de máquina de
// humo y un murciélago que cruza una sola vez por visita. Sin negro (paleta
// de páginas públicas). Al acabar se puede borrar la carpeta y sus usos en
// Landing.tsx y ConcursoFeedBanner.tsx.

const NARANJA = '#FF8A1F';
const MORADO = '#8B3FD9';

const BOMBILLAS = 22;

// Murciélago en silueta morada (no negra), alas con aleteo por CSS.
const Murcielago = () => (
  <svg viewBox="0 0 120 50" width="72" height="30" aria-hidden className="hw-murcielago">
    <g fill="#4A1D7A">
      <path className="hw-ala-izq" d="M60 26 C50 10 34 6 18 12 C24 16 24 22 20 26 C28 24 32 28 32 34 C38 28 46 28 52 32 Z" />
      <path className="hw-ala-der" d="M60 26 C70 10 86 6 102 12 C96 16 96 22 100 26 C92 24 88 28 88 34 C82 28 74 28 68 32 Z" />
      <ellipse cx="60" cy="28" rx="8" ry="10" />
      <path d="M54 20 L55 13 L58 19 Z M66 20 L65 13 L62 19 Z" />
    </g>
    <circle cx="57" cy="25" r="1.4" fill={NARANJA} />
    <circle cx="63" cy="25" r="1.4" fill={NARANJA} />
  </svg>
);

const HalloweenHero = () => {
  // El murciélago solo pasa en la primera visita de la sesión: no molestar.
  const [murcielago, setMurcielago] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('xp_hw_murcielago')) return;
      sessionStorage.setItem('xp_hw_murcielago', '1');
    } catch { /* sin almacenamiento: que pase igual */ }
    const t = window.setTimeout(() => setMurcielago(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes hwFocoA { 0%,100% { transform: rotate(-28deg); } 50% { transform: rotate(14deg); } }
        @keyframes hwFocoB { 0%,100% { transform: rotate(26deg); } 50% { transform: rotate(-16deg); } }
        @keyframes hwBombilla { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes hwNiebla { 0% { transform: translate3d(-8%,0,0); } 50% { transform: translate3d(8%,-6px,0); } 100% { transform: translate3d(-8%,0,0); } }
        @keyframes hwVuelo { 0% { transform: translate3d(-12vw, 40px, 0) scale(0.7); opacity: 0; } 8% { opacity: 1; } 50% { transform: translate3d(50vw, -30px, 0) scale(1.1); } 92% { opacity: 1; } 100% { transform: translate3d(112vw, 20px, 0) scale(0.8); opacity: 0; } }
        @keyframes hwAlaI { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-22deg); } }
        @keyframes hwAlaD { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(22deg); } }
        .hw-foco { position: absolute; top: -10%; width: 34vw; max-width: 460px; height: 130%; transform-origin: 50% 0; mix-blend-mode: screen; filter: blur(6px); }
        .hw-foco-a { left: 6%; animation: hwFocoA 7s ease-in-out infinite; }
        .hw-foco-b { right: 6%; animation: hwFocoB 8.5s ease-in-out infinite; }
        .hw-bombilla { animation: hwBombilla 1.8s ease-in-out infinite; }
        .hw-niebla { animation: hwNiebla 14s ease-in-out infinite; will-change: transform; }
        .hw-vuelo { position: absolute; top: 18%; left: 0; animation: hwVuelo 6.5s ease-in-out 1 forwards; }
        .hw-ala-izq { transform-origin: 60px 26px; animation: hwAlaI 0.28s ease-in-out infinite; }
        .hw-ala-der { transform-origin: 60px 26px; animation: hwAlaD 0.28s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hw-foco-a, .hw-foco-b, .hw-bombilla, .hw-niebla, .hw-ala-izq, .hw-ala-der { animation: none; }
          .hw-vuelo { display: none; }
        }
      `}</style>

      {/* Tinte de noche: morado arriba, se funde con el blanco del final del hero. */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(74,29,122,0.62) 0%, rgba(110,40,170,0.38) 45%, rgba(255,138,31,0.18) 78%, rgba(255,255,255,0) 100%)',
      }} />

      {/* Focos de escenario */}
      <div className="hw-foco hw-foco-a" style={{ background: `linear-gradient(180deg, ${NARANJA}cc 0%, ${NARANJA}33 55%, transparent 85%)`, clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)' }} />
      <div className="hw-foco hw-foco-b" style={{ background: `linear-gradient(180deg, ${MORADO}dd 0%, ${MORADO}40 55%, transparent 85%)`, clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)' }} />

      {/* Guirnalda de bombillas colgando bajo el menú */}
      <svg className="absolute left-0 top-0 w-full" height="46" viewBox="0 0 1000 46" preserveAspectRatio="none">
        <path d="M0 6 Q250 40 500 10 T1000 8" stroke="#5B2A86" strokeWidth="2" fill="none" />
      </svg>
      <div className="absolute left-0 right-0 top-0 h-12">
        {/* Colgados justo del cable: la curva del SVG pasa por y≈21 en el 18%
            y por y≈17 en el 42% (Q de 0,6 a 500,10 con control en 250,40). */}
        <MurcielagoColgado claro ancho={26} style={{ left: '18%', top: 20 }} />
        <MurcielagoColgado claro ancho={21} retraso={1.1} style={{ left: '42%', top: 16 }} />
        {Array.from({ length: BOMBILLAS }, (_, i) => {
          const x = (i + 0.5) / BOMBILLAS;
          // Misma curva que el cable: dos senos aproximan el Q/T del SVG.
          const y = 6 + Math.sin(x * Math.PI * 2) * 13 + 9;
          const color = i % 2 ? MORADO : NARANJA;
          return (
            <span key={i} className="hw-bombilla absolute block rounded-full"
              style={{
                left: `${x * 100}%`, top: y, width: 9, height: 12,
                background: color, boxShadow: `0 0 12px 3px ${color}`,
                animationDelay: `${(i % 4) * 0.4}s`,
              }} />
          );
        })}
      </div>

      {/* Niebla de máquina de humo al pie del hero */}
      <div className="hw-niebla absolute -left-[10%] bottom-[6%] w-[120%] h-40" style={{
        background: 'radial-gradient(ellipse at 20% 60%, rgba(255,255,255,0.55), transparent 60%), radial-gradient(ellipse at 60% 50%, rgba(236,220,255,0.5), transparent 55%), radial-gradient(ellipse at 90% 65%, rgba(255,230,205,0.45), transparent 60%)',
        filter: 'blur(14px)',
      }} />

      {murcielago && <div className="hw-vuelo"><Murcielago /></div>}
    </div>
  );
};

export default HalloweenHero;

// Calabaza con cascos de DJ (render clay generado en Higgsfield, fondo
// recortado), para el banner del concurso en la landing y en el panel.
export const CalabazaDJ = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <img src="/halloween/calabaza-dj.webp" alt="Calabaza de Halloween con cascos de DJ" width={360} height={337}
    loading="lazy" decoding="async" className={className}
    style={{ filter: 'drop-shadow(0 10px 18px rgba(74,29,122,0.4))', ...style }} />
);

// Sombrero de bruja pequeño para poner sobre la X del logo.
export const SombreroBruja = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 40 30" width="22" height="17" className={className}>
    <path d="M4 26 Q20 20 36 26 L30 26 C26 16 22 8 12 2 C16 10 16 18 12 26 Z" fill="#6B2FB3" />
    <rect x="11" y="21" width="17" height="3" rx="1.5" fill="#FF8A1F" />
  </svg>
);

// Murciélago colgado boca abajo de la guirnalda, con las alas plegadas y un
// balanceo lento. Morado noche (sin negro), ojos naranja.
// claro: para fondo oscuro (hero de la portada), cuerpo morado vivo con borde lila.
export const MurcielagoColgado = ({ ancho = 16, retraso = 0, claro = false, style }: { ancho?: number; retraso?: number; claro?: boolean; style?: React.CSSProperties }) => {
  const cuerpo = claro ? '#8B3FD9' : '#4A1D7A';
  const cabeza = claro ? '#A770E8' : '#5B2A86';
  const borde = claro ? { stroke: '#E6D3FF', strokeWidth: 0.8 } : {};
  return (
  <span aria-hidden className="murcielago-colgado absolute block" style={{ width: ancho, transformOrigin: '50% 0', animationDelay: `${retraso}s`, ...style }}>
    <style>{`
      @keyframes murcielagoBalanceo { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
      .murcielago-colgado { animation: murcielagoBalanceo 3.2s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .murcielago-colgado { animation: none; } }
    `}</style>
    <svg viewBox="0 0 24 34" width="100%" height="auto" style={{ display: 'block' }}>
      {/* patas agarradas al cable */}
      <path d="M10 0 L10.6 4 M14 0 L13.4 4" stroke={claro ? '#E6D3FF' : cuerpo} strokeWidth="1.4" strokeLinecap="round" />
      {/* alas plegadas envolviendo el cuerpo */}
      <path d="M12 3 C5 4 2 10 3 18 C4 24 7 27 9 29 C8 25 8 21 9 18 C10 22 11 26 12 30 C13 26 14 22 15 18 C16 21 16 25 15 29 C17 27 20 24 21 18 C22 10 19 4 12 3 Z" fill={cuerpo} {...borde} />
      {/* cabeza abajo con orejas apuntando hacia el suelo */}
      <ellipse cx="12" cy="27.5" rx="4" ry="3.6" fill={cabeza} {...borde} />
      <path d="M9 29.5 L8.2 33.5 L10.6 30.8 Z M15 29.5 L15.8 33.5 L13.4 30.8 Z" fill={cabeza} />
      <circle cx="10.6" cy="27" r="0.9" fill="#FF8A1F" />
      <circle cx="13.4" cy="27" r="0.9" fill="#FF8A1F" />
    </svg>
  </span>
  );
};
