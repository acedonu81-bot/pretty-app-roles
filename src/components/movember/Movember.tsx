import { useState } from 'react';
import { X } from 'lucide-react';

// Bigote pequeño sobre el logo (mismo sitio que el sombrero de Halloween).
export const Bigote = ({ className = '', ancho = 30, borde = false }: { className?: string; ancho?: number; borde?: boolean }) => (
  <svg aria-hidden viewBox="0 0 40 14" width={ancho} height={ancho * 0.35} className={className} style={{ overflow: 'visible' }}>
    <path d="M20 4 C16 0 8 0 3 3 C1 4 0 6 1 9 C4 6 9 6 13 8 C16 9 18 8 20 6 C22 8 24 9 27 8 C31 6 36 6 39 9 C40 6 39 4 37 3 C32 0 24 0 20 4 Z"
      fill={borde ? '#5A3A12' : '#1a1208'} stroke={borde ? '#FBF3DD' : 'none'} strokeWidth={borde ? 1.4 : 0} strokeLinejoin="round" />
  </svg>
);

const TEXTO = 'Movember: noviembre con bigote por la salud masculina.';
const CLAVE_CERRADA = 'xp_mv_franja_cerrada';

// Bloque grande de la portada, mismo sitio y peso que el titular de Halloween.
export const MovemberPastilla = () => (
  <div className="max-w-2xl mx-auto mt-6 md:mt-0 mb-5 px-4 text-center">
    <Bigote ancho={96} borde className="mx-auto mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" />
    <p className="text-3xl sm:text-5xl font-black tracking-tight font-display"
      style={{ color: '#fff', lineHeight: 1.1, textShadow: '0 3px 18px rgba(0,0,0,0.6)' }}>
      Movember en <span style={{ color: '#D4AF37' }}>XPEAK</span>
    </p>
    <p className="mt-2 inline-block rounded-full px-4 py-1.5 text-sm sm:text-base font-extrabold"
      style={{ background: '#FBF3DD', color: '#6B4F00', border: '1px solid rgba(212,175,55,0.6)', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }}>
      {TEXTO}
    </p>
  </div>
);

function leerCerrada() {
  try { return localStorage.getItem(CLAVE_CERRADA) === '1'; } catch { return false; }
}

// Franja fina arriba de las vistas del panel; se puede cerrar.
export const MovemberFranja = () => {
  const [cerrada, setCerrada] = useState(leerCerrada);
  if (cerrada) return null;
  const cerrar = () => {
    setCerrada(true);
    try { localStorage.setItem(CLAVE_CERRADA, '1'); } catch { /* sin almacenamiento: vuelve a salir al recargar */ }
  };
  return (
    <div className="relative mx-3 md:mx-6 mt-3 flex items-center gap-3 rounded-xl pl-4 pr-10 py-2.5"
      style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.45)' }}>
      <Bigote ancho={46} className="shrink-0" />
      <p className="text-sm sm:text-base font-extrabold" style={{ color: '#6B4F00' }}>{TEXTO}</p>
      <button onClick={cerrar} aria-label="Cerrar" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/5">
        <X className="w-4 h-4" style={{ color: '#6B4F00' }} />
      </button>
    </div>
  );
};
