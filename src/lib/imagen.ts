/**
 * Foto de Supabase Storage al tamaño en que se va a mostrar.
 *
 * Las fotos de perfil se servían a tamaño original: hasta 2 MB para una
 * tarjeta de 400 px (Lighthouse móvil 30 sep 2026: 2,4 MB evitables solo en
 * /directorio/dj). El endpoint /render/image/ de Supabase las redimensiona y
 * recomprime al vuelo, con caché de CDN. Cualquier otra URL se devuelve igual.
 *
 * resize=contain es obligatorio: pedir solo `width` sin él NO escala
 * proporcionalmente (probado 30 sep 2026 contra el endpoint real) — deja el
 * alto igual al original y solo recorta el ancho, así que una foto casi
 * cuadrada salía 600x1091 en vez de 600x606. Eso deformaba el aspect ratio
 * real de la foto y, dentro de un contenedor con object-fit:cover, se veía
 * con zoom/recorte excesivo (la ficha pública mostraba las fotos "ampliadas").
 */
const OBJETO = '/storage/v1/object/public/';
const RENDER = '/storage/v1/render/image/public/';

export function fotoOptimizada(url: string | null | undefined, ancho: number, calidad = 72): string {
  if (!url) return url ?? '';
  if (!url.includes(OBJETO) || url.includes('?')) return url;
  return `${url.replace(OBJETO, RENDER)}?width=${ancho}&resize=contain&quality=${calidad}`;
}
