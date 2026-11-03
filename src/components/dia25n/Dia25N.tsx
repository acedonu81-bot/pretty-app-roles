import { useState } from 'react';
import type React from 'react';
import { X } from 'lucide-react';

// Lazo morado clay (render de Higgsfield, fondo recortado, public/25n-lazo.webp, 212x360).
export const Lazo = ({ className = '', ancho = 30, style }: { className?: string; ancho?: number; style?: React.CSSProperties }) => (
  <img src="/25n-lazo.webp" alt="" aria-hidden width={ancho} height={Math.round(ancho * 360 / 212)} decoding="async"
    className={className} style={{ width: ancho, height: 'auto', filter: 'drop-shadow(0 3px 5px rgba(50,20,100,0.35))', ...style }} />
);

const MORADO = '#5B2DA8';
const FONDO = '#F4EEFB';
const BORDE = 'rgba(109,63,192,0.55)';
const TITULO = '25N. Día contra la violencia de género';
const AYUDA = 'Si la sufres o conoces a alguien que la sufre, llama al 016. Gratuito, confidencial y 24 horas.';
const CLAVE_CERRADA = 'xp_25n_franja_cerrada';

// Ordenador: cinta en una línea ARRIBA del titular, visible sin hacer scroll.
export const Cinta25N = () => (
  <div className="hidden md:flex justify-center mb-6">
    <div className="inline-flex items-center gap-4 rounded-2xl pl-5 pr-7 py-3"
      style={{ background: FONDO, border: `1px solid ${BORDE}`, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
      <Lazo ancho={40} />
      <div className="text-left leading-tight max-w-[760px]">
        <p className="text-xl font-black font-display whitespace-nowrap" style={{ color: MORADO }}>{TITULO}</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: '#3B1F72' }}>{AYUDA}</p>
      </div>
    </div>
  </div>
);

// Móvil: bloque centrado bajo el titular.
export const Bloque25N = () => (
  <div className="md:hidden max-w-2xl mx-auto mt-4 mb-5 px-4 text-center">
    <Lazo ancho={52} className="mx-auto mb-2" />
    <p className="text-2xl font-black tracking-tight font-display" style={{ color: '#fff', lineHeight: 1.15, textShadow: '0 3px 18px rgba(0,0,0,0.6)' }}>
      25N. Contra la violencia de género
    </p>
    <p className="mt-2 inline-block rounded-2xl px-4 py-2 text-sm font-bold" style={{ background: FONDO, color: '#3B1F72', border: `1px solid ${BORDE}` }}>
      {AYUDA}
    </p>
  </div>
);

function leerCerrada() {
  try { return localStorage.getItem(CLAVE_CERRADA) === '1'; } catch { return false; }
}

// Franja fina arriba de las vistas del panel; se puede cerrar.
export const Franja25N = () => {
  const [cerrada, setCerrada] = useState(leerCerrada);
  if (cerrada) return null;
  const cerrar = () => {
    setCerrada(true);
    try { localStorage.setItem(CLAVE_CERRADA, '1'); } catch { /* sin almacenamiento: vuelve a salir al recargar */ }
  };
  return (
    <div className="relative mx-3 md:mx-6 mt-3 flex items-center gap-3 rounded-xl pl-4 pr-10 py-2.5"
      style={{ background: FONDO, border: `1px solid ${BORDE}` }}>
      <Lazo ancho={30} className="shrink-0" />
      <p className="text-sm sm:text-base font-bold" style={{ color: '#3B1F72' }}>
        <span className="font-extrabold" style={{ color: MORADO }}>25N.</span> {AYUDA}
      </p>
      <button onClick={cerrar} aria-label="Cerrar" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/5">
        <X className="w-4 h-4" style={{ color: MORADO }} />
      </button>
    </div>
  );
};
