import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { logEvent } from '@/lib/track';

/**
 * Escuela colaboradora: Warm Up Academy (Madrid). Intercambio de enlaces
 * pactado en oct 2026: ellos enlazan a nuestro artículo de precios DJ y
 * nosotros a su web.
 *
 * Dónde va:
 * - Directorio de DJs dentro de la app (origen "app"): ahí lo ven los DJs,
 *   que son su público. /dashboard está en Disallow de robots.txt, así que
 *   ese enlace NO cuenta para Google.
 * - /contratar-dj (origen "publica"): enlace indexable y sin nofollow, el que
 *   cumple el trato.
 * - Artículos de DJ del blog (origen "blog:<slug>", variante "tira"): versión
 *   pequeña. Con nofollow (rel="sponsored") porque se repite en una decena de
 *   artículos: el mismo enlace "que cuenta" en muchas páginas parecería
 *   intercambio masivo. Su objetivo aquí son las visitas, no Google.
 *
 * Todos los enlaces llevan utm_source=xpeak para que la escuela vea en su
 * propio Google Analytics las visitas que le mandamos (25 oct), y cada clic
 * queda en nuestra analítica como partner_click con el origen.
 *
 * Colores y letra son los de su marca (negro azulado + menta, Antonio), no
 * los de XPEAK: su logo es blanco y menta y solo se lee sobre oscuro.
 */
const MENTA = '#B9D8D2';
const FONDO = '#10141A';

export function urlWarmUp(origen: string) {
  const campana = origen.replace(/[^a-z0-9-]+/gi, '_');
  return `https://warmup-academy.com/?utm_source=xpeak&utm_medium=referral&utm_campaign=${campana}`;
}

export function clicWarmUp(origen: string) {
  void logEvent('partner_click', location.pathname, `warmup:${origen}`);
}

let fuenteCargada = false;
function cargarAntonio() {
  if (fuenteCargada || typeof document === 'undefined') return;
  fuenteCargada = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Antonio:wght@700&display=swap';
  document.head.appendChild(link);
}

const WarmUpAcademyBanner = ({ origen, variante = 'grande', paraDJs = false, className = '' }: {
  /** 'app', 'publica' o 'blog:<slug>' */
  origen: string;
  /** 'tira' = versión pequeña para los artículos del blog */
  variante?: 'grande' | 'tira';
  /** Artículos leídos por DJs: el texto les habla a ellos, no a quien contrata. */
  paraDJs?: boolean;
  className?: string;
}) => {
  useEffect(cargarAntonio, []);

  if (variante === 'tira') {
    return (
      <a
        href={urlWarmUp(origen)}
        target="_blank"
        rel="noopener sponsored"
        onClick={() => clicWarmUp(origen)}
        className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 overflow-hidden rounded-2xl p-4 sm:px-6 sm:py-5 ${className}`}
        style={{ background: FONDO, border: `1px solid ${MENTA}` }}
      >
        <img
          src="/partners/warmup-academy-cabina.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
        />
        <span aria-hidden className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(16,20,26,1) 45%, rgba(16,20,26,0.55) 100%)' }} />
        <img
          src="/partners/warmup-academy-logo.png"
          alt="Warm Up Academy, escuela de DJ y producción musical en Madrid"
          loading="lazy"
          className="relative h-8 sm:h-9 w-auto self-start sm:self-center flex-shrink-0"
        />
        <span className="relative flex-1 min-w-0">
          <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.14em] mb-0.5" style={{ color: MENTA }}>
            Escuela colaboradora
          </span>
          <span className="block text-sm sm:text-[0.95rem] font-semibold leading-snug" style={{ color: '#fff' }}>
            {paraDJs
              ? 'Mejora tu técnica y consigue más bolos: cursos de DJ y producción en Madrid.'
              : 'Escuela de DJ y producción musical en Madrid, con profesionales en activo.'}
          </span>
        </span>
        <span
          className="relative self-start sm:self-center flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-extrabold transition-transform group-hover:translate-x-1"
          style={{ background: MENTA, color: FONDO }}
        >
          {paraDJs ? 'Ver cursos' : 'Conocer la escuela'} <ArrowRight size={14} />
        </span>
      </a>
    );
  }

  // En la app va encima del listado: más baja para no esconder a los DJs.
  const compacta = origen === 'app';

  return (
    <a
      href={urlWarmUp(origen)}
      target="_blank"
      rel="noopener"
      onClick={() => clicWarmUp(origen)}
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
