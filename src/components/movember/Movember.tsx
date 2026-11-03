import { useState } from 'react';
import type React from 'react';
import { X } from 'lucide-react';

// Bigote pequeño sobre el logo (mismo sitio que el sombrero de Halloween).
// Bigote: render clay de Higgsfield con fondo recortado (public/movember-bigote.webp,
// 560x190). `borde` ya no hace falta (el render se lee solo); se mantiene por
// compatibilidad con los usos anteriores.
export const Bigote = ({ className = '', ancho = 30, style }: { className?: string; ancho?: number; borde?: boolean; style?: React.CSSProperties }) => (
  <img src="/movember-bigote.webp" alt="" aria-hidden width={ancho} height={Math.round(ancho * 190 / 560)} decoding="async"
    className={className} style={{ width: ancho, height: 'auto', filter: 'drop-shadow(0 3px 4px rgba(60,35,10,0.35))', ...style }} />
);

const TEXTO = 'Movember: noviembre con bigote por la salud masculina.';
const CLAVE_CERRADA = 'xp_mv_franja_cerrada';

// Bloque grande de la portada, mismo sitio y peso que el titular de Halloween.
export const MovemberPastilla = () => (
  <div className="md:hidden max-w-2xl mx-auto mt-4 mb-5 px-4 text-center">
    <style>{`@keyframes mvFlota { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-5px) rotate(2deg); } }
      .mv-flota { animation: mvFlota 5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .mv-flota { animation: none; } }`}</style>
    <Bigote ancho={150} className="mx-auto mb-1 mv-flota" />
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

// Versión de ordenador: cinta en una línea ARRIBA del titular, para que se vea
// sin hacer scroll (el titular ocupa toda la pantalla).
export const MovemberCinta = () => (
  <div className="hidden md:flex justify-center mb-6">
    <div className="inline-flex items-center gap-4 rounded-full pl-5 pr-7 py-2.5"
      style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.7)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
      <Bigote ancho={92} />
      <div className="text-left leading-tight">
        <p className="text-xl font-black font-display" style={{ color: '#3B2A00' }}>Movember en XPEAK</p>
        <p className="text-sm font-bold" style={{ color: '#6B4F00' }}>Noviembre con bigote por la salud masculina.</p>
      </div>
    </div>
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
      <Bigote ancho={64} className="shrink-0" />
      <p className="text-sm sm:text-base font-extrabold" style={{ color: '#6B4F00' }}>{TEXTO}</p>
      <button onClick={cerrar} aria-label="Cerrar" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/5">
        <X className="w-4 h-4" style={{ color: '#6B4F00' }} />
      </button>
    </div>
  );
};
