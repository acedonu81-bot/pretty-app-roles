/**
 * Compresión de imágenes en el navegador antes de subir.
 * Evita rechazar fotos de móvil (6-12MB) por límite de tamaño: se redimensionan
 * y recomprimen a JPEG, quedando en ~200-600KB sin pérdida visible al tamaño de uso.
 */

/** Tope duro para el archivo original — por encima de esto algo raro pasa. */
export const MAX_RAW_IMAGE_MB = 25;

export async function compressImage(file: File, maxDim = 1600, quality = 0.85): Promise<File> {
  // GIF: recomprimir mataría la animación — se sube tal cual.
  if (file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob: Blob | null = await new Promise(resolve =>
      canvas.toBlob(b => resolve(b), 'image/jpeg', quality)
    );
    if (!blob || blob.size >= file.size) return file; // la compresión no ayudó

    return new File([blob], file.name.replace(/\.\w+$/i, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    // Formato que el navegador no puede decodificar (HEIC antiguo, etc.) — subir original.
    return file;
  }
}
