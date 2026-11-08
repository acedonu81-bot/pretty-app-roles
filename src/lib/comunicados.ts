// Tablón de comunicados internos (6 nov 2026). Las categorías son los mismos
// grupos del sidebar (DIRECTORY_GROUPS) más organizadores; la SQL equivalente
// es public.categoria_de_rol (migración 20261106120000_comunicados.sql).

export const CATEGORIAS_COMUNICADO = [
  { id: 'todos', label: 'Todos' },
  { id: 'musica', label: 'Música' },
  { id: 'sala', label: 'Sala, Catering, Locales & Limpieza' },
  { id: 'imagen', label: 'Imagen & Media' },
  { id: 'azafatas', label: 'Azafatas & RRPP' },
  { id: 'belleza', label: 'Belleza & Estética' },
  { id: 'entretenimiento', label: 'Entretenimiento' },
  { id: 'tecnica', label: 'Técnica & Producción' },
  { id: 'organizadores', label: 'Organizadores' },
] as const;
export type CategoriaComunicado = typeof CATEGORIAS_COMUNICADO[number]['id'];

export const etiquetaCategoria = (id: string): string =>
  CATEGORIAS_COMUNICADO.find(c => c.id === id)?.label ?? 'XPEAK';

/** "Música + Organizadores": la principal y las extra. */
export const etiquetaDestino = (c: { categoria: string; categorias_extra?: string[] | null }): string =>
  [c.categoria, ...(c.categorias_extra ?? [])].map(etiquetaCategoria).join(' + ');

// Tipo de contenido de Novedades (8 nov 2026): una sola tabla, tres tipos.
// "Siguiendo" es una vista del feed, no un tipo guardado aquí.
export const TIPOS_COMUNICADO = [
  { id: 'xpeak', label: 'XPEAK', color: '#8B6A00', punto: '#D4AF37' },
  { id: 'noticia', label: 'Noticias', color: '#2563EB', punto: '#2563EB' },
  { id: 'comunidad', label: 'Comunidad', color: '#059669', punto: '#059669' },
] as const;
export type TipoComunicado = typeof TIPOS_COMUNICADO[number]['id'];

/** Los comunicados anteriores a la columna `tipo` son de XPEAK. */
export const tipoDe = (c: { tipo?: string | null }): TipoComunicado =>
  TIPOS_COMUNICADO.find(t => t.id === c.tipo)?.id ?? 'xpeak';

export const infoTipo = (id: string) => TIPOS_COMUNICADO.find(t => t.id === id) ?? TIPOS_COMUNICADO[0];

export interface Comunicado {
  id: string;
  titulo: string;
  cuerpo: string;
  imagen_url: string | null;
  video_url: string | null;
  cta_texto: string | null;
  cta_url: string | null;
  categoria: string;
  /** Otras categorias que tambien reciben el aviso (8 nov 2026). */
  categorias_extra?: string[];
  /** xpeak | noticia | comunidad. Ausente en filas anteriores al 8 nov: cuenta como xpeak. */
  tipo?: string;
  push: boolean;
  fijado: boolean;
  caduca_at: string;
  destinatarios: number;
  created_at: string;
  publico?: boolean;
  comentarios_on?: boolean;
  encuesta_pregunta?: string | null;
  encuesta_opciones?: string[] | null;
  encuesta_cierra_at?: string | null;
}

export interface Interaccion {
  comunicado_id: string;
  likes: number;
  comentarios: number;
  yo_like: boolean;
  mi_voto: number | null;
  votos: number[] | null;
}

// Mismo algoritmo que toSlug de src/data/profiles.ts y del prerender (no se
// importa de ahí para no arrastrar los perfiles demo al bundle del panel).
export const toSlugTexto = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** /novedades/<titulo>-<8 primeros del id>, igual que /socials/<slug>. */
export const slugNovedad = (titulo: string, id: string): string =>
  `${toSlugTexto(titulo).slice(0, 70).replace(/-$/, '')}-${id.slice(0, 8)}`;

/** Los 8 caracteres de id al final del slug. */
export const idCortoDeSlug = (slug: string): string | null => {
  const m = /([0-9a-f]{8})$/.exec(slug);
  return m ? m[1] : null;
};

export const porcentajes = (votos: number[]): number[] => {
  const total = votos.reduce((a, b) => a + b, 0);
  return votos.map(v => (total ? Math.round((v / total) * 100) : 0));
};

// Mención en el texto: @[Nombre visible](user_id). El editor la inserta al
// elegir a alguien del buscador; al pintar se convierte en enlace a /p/<id>.
const MENCION_RE = /@\[([^\]\n]{1,80})\]\(([0-9a-f-]{36})\)/g;

export type TrozoTexto =
  | { tipo: 'texto'; valor: string }
  | { tipo: 'mencion'; nombre: string; userId: string };

export function trocearCuerpo(cuerpo: string): TrozoTexto[] {
  const trozos: TrozoTexto[] = [];
  let ultimo = 0;
  for (const m of cuerpo.matchAll(MENCION_RE)) {
    const i = m.index ?? 0;
    if (i > ultimo) trozos.push({ tipo: 'texto', valor: cuerpo.slice(ultimo, i) });
    trozos.push({ tipo: 'mencion', nombre: m[1], userId: m[2] });
    ultimo = i + m[0].length;
  }
  if (ultimo < cuerpo.length) trozos.push({ tipo: 'texto', valor: cuerpo.slice(ultimo) });
  return trozos;
}

/** Texto sin la marca de las menciones, para resúmenes de una línea. */
export const textoPlano = (cuerpo: string): string =>
  cuerpo.replace(MENCION_RE, '$1').replace(/\s+/g, ' ').trim();

export const formatoMencion = (nombre: string, userId: string): string =>
  `@[${nombre.replace(/[[\]\n]/g, '').trim()}](${userId})`;

/** Orden del carrusel: fijados primero, luego el más reciente. */
export function ordenarComunicados<T extends Pick<Comunicado, 'fijado' | 'created_at'>>(lista: T[]): T[] {
  return [...lista].sort((a, b) =>
    Number(b.fijado) - Number(a.fijado) || b.created_at.localeCompare(a.created_at));
}

/** Enlace del botón: rutas internas se abren dentro de la app, el resto en pestaña nueva. */
export const esEnlaceInterno = (url: string): boolean =>
  url.startsWith('/') && !url.startsWith('//');

/** "Para siempre": caduca_at es NOT NULL, así que se guarda una fecha lejana. */
export const CADUCA_NUNCA = '2100-01-01T00:00:00.000Z';
export const esParaSiempre = (iso: string): boolean => new Date(iso).getUTCFullYear() >= 2099;

/** Extracto para tarjetas: texto plano sin repetir el título si el cuerpo empieza por él. */
export function resumenSinTitulo(cuerpo: string, titulo: string): string {
  const plano = textoPlano(cuerpo);
  const t = titulo.trim().toLowerCase();
  return t && plano.toLowerCase().startsWith(t) ? plano.slice(t.length).trim() : plano;
}
