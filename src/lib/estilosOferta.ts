// Oferta de DJ sin estilos concretos = "De todo un poco" (así se llama la casilla
// del formulario). Quien pide de todo no necesita a alguien que solo pincha House
// o Remember: 13 oct 2026, decisión del usuario. No se bloquea a nadie: se avisa
// al profesional antes de apuntarse y se enseñan sus estilos al organizador, y lo
// demás se habla por el chat.
const VERSATILES = [
  'Comercial', 'Top 40', 'Hits actuales', 'EDM', 'Pop Dance',
  'Reggaetón', 'Dembow', 'Moombahton', 'Dancehall',
  'Hip Hop', 'Trap', 'R&B', 'Afrobeats', 'Amapiano',
];
const norm = (t: string) => t.trim().toLowerCase();
const SET_VERSATILES = new Set(VERSATILES.map(norm));

/** La oferta pide música "de todo un poco" (DJ sin estilos concretos). */
export const pideDeTodo = (
  roles: string[] | null | undefined,
  estilos: string[] | null | undefined,
): boolean => (roles ?? []).includes('DJ / Artista') && (!estilos || estilos.length === 0);

/** Tiene estilos declarados y ninguno sirve para una fiesta de todo un poco. */
export const noEncajaEnDeTodo = (genres: string[] | null | undefined): boolean =>
  Array.isArray(genres) && genres.length > 0 && !genres.some(g => SET_VERSATILES.has(norm(g)));

/** "House, Remember" para poner en una frase (máx. 4). */
export const listarEstilos = (genres: string[] | null | undefined): string =>
  (genres ?? []).slice(0, 4).join(', ');
