import type React from 'react';

// Telaraña de esquina (arriba a la izquierda; espejo = derecha). Líneas finas
// en lila, sin relleno: se ve como detalle y no tapa nada. claro = sobre el
// fondo oscuro del hero.
export const Telarana = ({ espejo = false, claro = false, className = '', style }: { espejo?: boolean; claro?: boolean; className?: string; style?: React.CSSProperties }) => {
  const color = claro ? 'rgba(236,224,255,0.55)' : 'rgba(122,47,192,0.32)';
  // Radios desde la esquina (0,0) y anillos que cuelgan entre radio y radio.
  const radios = [0, 22, 45, 68, 90].map(g => (g * Math.PI) / 180);
  const anillos = [26, 48, 72, 98];
  const punto = (r: number, a: number) => [r * Math.cos(a), r * Math.sin(a)];
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}
      style={{ transform: espejo ? 'scaleX(-1)' : undefined, ...style }}>
      <g stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round">
        {radios.map((a, i) => {
          const [x, y] = punto(110, a);
          return <line key={i} x1="0" y1="0" x2={x} y2={y} />;
        })}
        {anillos.map(r => {
          let d = '';
          for (let i = 0; i < radios.length - 1; i++) {
            const [x1, y1] = punto(r, radios[i]);
            const [x2, y2] = punto(r, radios[i + 1]);
            // Punto de control hacia la esquina: el hilo cede como si colgara.
            const [cx, cy] = punto(r * 0.82, (radios[i] + radios[i + 1]) / 2);
            d += `${i === 0 ? `M${x1} ${y1}` : ''} Q${cx} ${cy} ${x2} ${y2} `;
          }
          return <path key={r} d={d} />;
        })}
      </g>
    </svg>
  );
};
