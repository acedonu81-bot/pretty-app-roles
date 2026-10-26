import type React from 'react';

// Araña (render clay de Higgsfield, fondo recortado) que cuelga de un hilo y
// sube y baja despacio. Solo se ve en la app instalada (html.app-instalada,
// ver main.tsx); en el navegador no sale. claro: sobre fondo oscuro, hilo claro.
export const AranaColgante = ({ claro = false, className = '', style }: { claro?: boolean; className?: string; style?: React.CSSProperties }) => (
  <div aria-hidden className={`hidden [.app-instalada_&]:block pointer-events-none ${className}`} style={style}>
    <style>{`
      @keyframes aranaBaja { 0%,100% { transform: translateY(-30px); } 50% { transform: translateY(14px); } }
      @keyframes aranaBalanceo { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
      .arana-sube-baja { animation: aranaBaja 9s ease-in-out infinite; }
      .arana-balanceo { animation: aranaBalanceo 4.6s ease-in-out infinite; transform-origin: 50% 0; }
      @media (prefers-reduced-motion: reduce) { .arana-sube-baja, .arana-balanceo { animation: none; } }
    `}</style>
    <div className="arana-sube-baja relative flex flex-col items-center">
      {/* El hilo es largo y sale por arriba de la pantalla: al subir no se ve dónde acaba. */}
      <span className="block w-px -mt-[140px] h-[200px]" style={{ background: claro ? 'rgba(236,224,255,0.7)' : 'rgba(122,47,192,0.45)' }} />
      <div className="arana-balanceo">
        <img src="/halloween/arana.webp" alt="" width={200} height={233} decoding="async" loading="lazy" className="block w-[34px] h-auto"
          style={{ filter: claro ? 'drop-shadow(0 0 6px rgba(201,163,245,0.55)) drop-shadow(0 6px 8px rgba(20,0,60,0.4))' : 'drop-shadow(0 3px 4px rgba(74,29,122,0.3))' }} />
      </div>
    </div>
  </div>
);
