// Ficha de un set de DJ (perfil tipo Hearthis, fase 1, 1 nov 2026): título,
// portada, etiquetas, BPM, mood y tracklist con minutos. Vive en la tabla
// dj_set_fichas, enlazada a la sesión por (user_id, set_url).

export interface TemaTracklist {
  /** Segundo del set en el que entra el tema. */
  t: number;
  artista: string;
  tema: string;
}

export interface SetFicha {
  set_url: string;
  titulo: string | null;
  portada_url: string | null;
  etiquetas: string[];
  bpm: number | null;
  mood: string | null;
  tracklist: TemaTracklist[];
}

export const MOODS: { valor: string; etiqueta: string }[] = [
  { valor: 'energetico', etiqueta: 'Energético' },
  { valor: 'elegante', etiqueta: 'Elegante' },
  { valor: 'melodico', etiqueta: 'Melódico' },
  { valor: 'oscuro', etiqueta: 'Oscuro' },
  { valor: 'festivo', etiqueta: 'Festivo' },
  { valor: 'relajado', etiqueta: 'Relajado' },
  { valor: 'hipnotico', etiqueta: 'Hipnótico' },
];

export const etiquetaMood = (valor: string | null | undefined): string | null =>
  MOODS.find(m => m.valor === valor)?.etiqueta ?? null;

// Mismos límites que los CHECK de la tabla: si cambian allí, cambiar aquí.
export const MAX_ETIQUETAS = 5;
export const MAX_TEMAS = 60;
export const MAX_TITULO = 80;
export const BPM_MIN = 60;
export const BPM_MAX = 200;

/** "14:20" o "1:02:03" a segundos. Devuelve null si no es un tiempo válido. */
export const parseTiempo = (texto: string): number | null => {
  const limpio = texto.trim();
  if (!/^\d{1,2}(:\d{2}){1,2}$/.test(limpio)) return null;
  const partes = limpio.split(':').map(Number);
  if (partes.slice(1).some(n => n > 59)) return null;
  return partes.reduce((acc, n) => acc * 60 + n, 0);
};

/** Segundos a "14:20" (o "1:02:03" si pasa de una hora). */
export const formatTiempo = (segundos: number): string => {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/**
 * Convierte una tracklist pegada (lo que exportan Rekordbox, Serato o lo que
 * el DJ tenga en la descripción de SoundCloud) en temas. Acepta líneas como
 * "00:00 Artista - Tema", "1. 03:20 Artista – Tema" o "[14:05] Artista - Tema".
 * Las líneas sin minuto o sin separador artista/tema se ignoran.
 */
export const parseTracklistTexto = (texto: string): TemaTracklist[] => {
  const temas: TemaTracklist[] = [];
  for (const bruta of texto.split(/\r?\n/)) {
    const linea = bruta.trim().replace(/^\d{1,3}[.)]\s+/, '');
    const m = linea.match(/^\[?(\d{1,2}(?::\d{2}){1,2})\]?\s+(.+)$/);
    if (!m) continue;
    const t = parseTiempo(m[1]);
    if (t === null) continue;
    const sep = m[2].match(/^(.+?)\s+[-–—]\s+(.+)$/);
    if (!sep) continue;
    temas.push({ t, artista: sep[1].trim(), tema: sep[2].trim() });
  }
  return ordenarTracklist(temas).slice(0, MAX_TEMAS);
};

export const ordenarTracklist = (temas: TemaTracklist[]): TemaTracklist[] =>
  [...temas].sort((a, b) => a.t - b.t);

/** Normaliza lo que llega de la BD (jsonb) por si hay filas a medias. */
export const tracklistDesdeBD = (valor: unknown): TemaTracklist[] => {
  if (!Array.isArray(valor)) return [];
  return ordenarTracklist(
    valor.filter((x): x is TemaTracklist =>
      !!x && typeof x === 'object'
      && typeof (x as TemaTracklist).t === 'number'
      && typeof (x as TemaTracklist).artista === 'string'
      && typeof (x as TemaTracklist).tema === 'string'),
  );
};

/** Una ficha sin nada relleno no se pinta: el set se ve como hasta ahora. */
export const fichaTieneContenido = (f: SetFicha | null | undefined): f is SetFicha =>
  !!f && !!(f.titulo || f.portada_url || f.etiquetas.length || f.bpm || f.mood || f.tracklist.length);
