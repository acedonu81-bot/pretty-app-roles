/**
 * Foto de Supabase Storage al tamaño en que se va a mostrar.
 *
 * Las fotos de perfil se servían a tamaño original: hasta 2 MB para una
 * tarjeta de 400 px (Lighthouse móvil 30 sep 2026: 2,4 MB evitables solo en
 * /directorio/dj). El endpoint /render/image/ de Supabase las redimensiona y
 * recomprime al vuelo, con caché de CDN. Cualquier otra URL se devuelve igual.
 */
const OBJETO = '/storage/v1/object/public/';
const RENDER = '/storage/v1/render/image/public/';

export function fotoOptimizada(url: string | null | undefined, ancho: number, calidad = 72): string {
  if (!url) return url ?? '';
  if (!url.includes(OBJETO) || url.includes('?')) return url;
  return `${url.replace(OBJETO, RENDER)}?width=${ancho}&quality=${calidad}`;
}
