import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { logEvent } from '@/lib/track';

/**
 * Escuela colaboradora: Warm Up Academy (Madrid). Intercambio de enlaces
 * pactado en oct 2026: ellos enlazan a nuestro artículo de precios DJ y
 * nosotros a su web.
 *
 * Va en DOS sitios a propósito:
 * - Directorio de DJs dentro de la app (origen "app"): ahí lo ven los DJs,
 *   que son su público. Pero /dashboard está en Disallow de robots.txt, así
 *   que ese enlace NO cuenta para Google.
 * - /contratar-dj (origen "publica"): el único enlace indexable, el que
 *   cumple el trato. Un solo sitio público: un enlace repetido en todas las
 *   ciudades parecería intercambio masivo.
 *
 * Colores y letra son los de su marca (negro azulado + menta, Antonio), no
 * los de XPEAK: su logo es blanco y menta y solo se lee sobre oscuro.
 * Enlace sin nofollow: es una colaboración real entre webs del sector.
 */
const MENTA = '#B9D8D2';
const FONDO = '#10141A';
const URL_WARMUP = 'https://warmup-academy.com/';

let fuenteCargada = false;
function cargarAntonio() {
  if (fuenteCargada || typeof document === 'undefined') return;
  fuenteCargada = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Antonio:wght@700&display=swap';
  document.head.appendChild(link);
}

const WarmUpAcademyBanner = ({ origen, className = '' }: {
  origen: 'app' | 'publica';
  className?: string;
}) => {
  useEffect(cargarAntonio, []);
  // En la app va encima del listado: más baja para no esconder a los DJs.
  const compacta = origen === 'app';

  return (
    <a
      href={URL_WARMUP}
      target="_blank"
      rel="noopener"
      onClick={() => { void logEvent('partner_click', location.pathname, `warmup:${origen}`); }}
      className={`group relative block overflow-hidden rounded-2xl sm:rounded-3xl ${className}`}
      style={{ background: FONDO, border: `1px solid ${MENTA}` }}
    >
      <img
        src="/partners/warmup-academy-cabina.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Degradado: texto legible a la izquierda, la foto respira a la derecha */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(16,20,26,0.97) 0%, rgba(16,20,26,0.88) 50%, rgba(16,20,26,0.4) 100%)' }}
      />
      <div className={`relative flex flex-col gap-3 ${compacta ? 'p-5 sm:p-7' : 'p-5 sm:p-10 sm:gap-4'}`}>
        <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em]" style={{ color: MENTA }}>
          Escuela colaboradora
        </span>
        <img
          src="/partners/warmup-academy-logo.png"
          alt="Warm Up Academy, escuela de DJ y producción musical en Madrid"
          loading="lazy"
          className={`h-9 w-auto self-start ${compacta ? 'sm:h-10' : 'sm:h-12'}`}
        />
        <p
          className={`text-[1.9rem] leading-none uppercase max-w-xl ${compacta ? 'sm:text-4xl' : 'sm:text-5xl'}`}
          style={{ fontFamily: 'Antonio, Syne, sans-serif', fontWeight: 700, color: '#fff' }}
        >
          Detrás de un buen DJ hay horas de cabina
        </p>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: '#D5E6E2' }}>
          Warm Up Academy forma DJs y productores en Madrid, con profesionales en activo.
        </p>
        <span
          className="self-start flex items-center gap-2 mt-1 px-5 sm:px-6 py-3 rounded-full text-sm font-extrabold transition-transform group-hover:translate-x-1"
          style={{ background: MENTA, color: FONDO }}
        >
          Conocer Warm Up Academy <ArrowRight size={15} />
        </span>
      </div>
    </a>
  );
};

export default WarmUpAcademyBanner;
