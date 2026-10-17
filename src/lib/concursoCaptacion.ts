// Captación a partir del Concurso DJ (17 oct 2026).

// Nombre del aspirante -> etiqueta corta y sin acentos para su enlace (?ref=).
// El ref queda en analytics_events.detalle y el panel cuenta las altas por enlace.
export const slugRef = (nombre: string | null | undefined): string =>
  (nombre ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 30) || 'dj';

export const enlacePedirVoto = (nombre: string | null | undefined): string =>
  `https://xpeak.es/concurso-dj-madrid/aspirantes?ref=${slugRef(nombre)}`;

export const mensajePedirVoto = (enlace: string): string =>
  `Estoy en el Concurso DJ XPEAK Madrid. Escucha mi sesión y vótame con un me gusta, es gratis y se hace en 10 segundos: ${enlace}`;

export const emailValido = (e: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

export const FUENTE_PROXIMA_EDICION = 'concurso-proxima-edicion';
