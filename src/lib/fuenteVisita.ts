// De dónde llega una visita a la ficha pública (18 nov 2026). Se guarda solo una
// de estas etiquetas, nunca la URL ni el referrer completo: no identifica a nadie.

export type FuenteVisita = 'directo' | 'buscador' | 'redes' | 'otra_web' | 'inicio_premium' | 'inicio_nuevo' | 'interno';

// Valores que los enlaces internos pueden poner en ?v=
const INTERNAS: Record<string, FuenteVisita> = { inicio_premium: 'inicio_premium', inicio_nuevo: 'inicio_nuevo' };

const BUSCADORES = /(^|\.)(google|bing|duckduckgo|ecosia|yahoo|yandex|brave|qwant)\./i;
const REDES = /(^|\.)(instagram|facebook|fb|tiktok|twitter|x|t|linkedin|youtube|pinterest|whatsapp|wa|l\.facebook|lm\.facebook)\.(com|me|co|ly)$|^(l|lm)\.(instagram|facebook)\.com$/i;

function hostDe(url: string): string {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

// enEntrada: false si el usuario ya ha navegado dentro de la web (el referrer del documento
// sigue siendo el de la primera carga, p. ej. Google, y no vale para esta visita).
export function fuenteVisita(opts: { search?: string; referrer?: string; hostActual?: string; enEntrada?: boolean }): FuenteVisita {
  const v = new URLSearchParams(opts.search ?? '').get('v');
  if (v && INTERNAS[v]) return INTERNAS[v];

  if (opts.enEntrada === false) return 'interno';
  const host = hostDe(opts.referrer ?? '');
  if (!host) return 'directo';
  const propio = (opts.hostActual ?? '').toLowerCase().replace(/^www\./, '');
  if (propio && host.replace(/^www\./, '') === propio) return 'interno';
  if (/(^|\.)xpeak\.(es|site)$/.test(host)) return 'interno';
  if (BUSCADORES.test(host)) return 'buscador';
  if (REDES.test(host)) return 'redes';
  return 'otra_web';
}
