/**
 * Fotos de perfil que son capturas de pantalla del móvil.
 *
 * Mucha gente sube como foto una captura de su galería (15 oct 2026: Laura
 * Villegas Arévalo; 28 sep: "Olé hop animaciones"): llega una imagen muy alta
 * (~9:19,5) con la barra de estado, el nombre del archivo ("DSC_0113.JPG") y
 * unas franjas negras arriba y abajo, y la foto buena en medio. Las tarjetas
 * recortan con object-position cerca del borde superior (10-15 %), pensado
 * para retratos normales, así que enseñaban justo la barra negra con la hora
 * y el nombre del archivo, y la cara cortada abajo.
 *
 * Para esas imágenes (alto/ancho >= 2,0: las pantallas de móvil actuales son
 * 18:9 a 20:9, es decir 2,0-2,2, y un retrato real no pasa de 1,9: una foto
 * vertical normal es 4:3 = 1,33, un vídeo vertical 16:9 = 1,78 y el recorte
 * alto de Susana López, 1,91) se coloca la ventana del recorte en la franja
 * central, donde está la foto, con la cara en el tercio superior de esa
 * franja. No hace falta detectar las barras. Medido el 15 oct 2026 en las
 * capturas reales: Laura (galería oscura) tiene barras del 15 % arriba y 15 %
 * abajo; "Olé hop animaciones" (Google Fotos) 19 % arriba (cabecera + hueco
 * negro) y 19 % abajo (Compartir/Editar + navegación). Se asume un 20 % arriba
 * y un 16 % abajo. Las fotos normales no se tocan (devuelve null).
 */
export const RATIO_CAPTURA = 2.0;
const BARRA_SUP = 0.2;
const BARRA_INF = 0.16;
const CARA = 0.34;

/**
 * object-position vertical para un recorte "cover" de una captura, o null si
 * la foto no lo es. `w`/`h`: tamaño real de la imagen; `boxW`/`boxH`: hueco
 * donde se pinta.
 */
export function posicionFotoCaptura(w: number, h: number, boxW: number, boxH: number): string | null {
  if (!(w > 0 && h > 0 && boxW > 0 && boxH > 0)) return null;
  if (h / w < RATIO_CAPTURA) return null;
  // Con cover y una imagen mucho más alta que el hueco, manda el ancho: lo que
  // se ve es esta fracción del alto de la imagen.
  const visible = (boxH * w) / (boxW * h);
  if (visible >= 1) return null;
  const centro = BARRA_SUP + CARA * (1 - BARRA_SUP - BARRA_INF);
  const arriba = Math.min(Math.max(centro - visible / 2, BARRA_SUP), 1 - BARRA_INF - visible);
  return `50% ${((arriba / (1 - visible)) * 100).toFixed(1)}%`;
}

/** Ajusta el recorte de una <img> ya cargada. Uso: ref={ajustarFotoCaptura} onLoad={e => ajustarFotoCaptura(e.currentTarget)}. */
export function ajustarFotoCaptura(img: HTMLImageElement | null): void {
  if (!img || !img.complete || !img.naturalWidth) return;
  const pos = posicionFotoCaptura(img.naturalWidth, img.naturalHeight, img.clientWidth, img.clientHeight);
  if (pos) img.style.objectPosition = pos;
}
