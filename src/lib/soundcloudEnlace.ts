/**
 * Lee lo que pega un DJ en el formulario del concurso. Desde el móvil, la app
 * de SoundCloud copia un enlace corto (on.soundcloud.com/...) y a veces con
 * texto delante ("Escucha ... en #SoundCloud https://..."); el formulario solo
 * aceptaba el enlace largo y lo rechazaba (13 oct 2026). El corto se convierte
 * en largo con la función soundcloud-enlace; el largo se guarda sin el rastreo
 * de compartir (?si=, utm_...).
 */
export type EnlaceSoundcloud = { tipo: 'largo' | 'corto'; url: string };

export function leerEnlaceSoundcloud(texto: string): EnlaceSoundcloud | null {
  const encontrado = texto.match(/(https?:\/\/)?(on\.|www\.|m\.)?soundcloud\.com\/\S+/i)?.[0];
  if (!encontrado) return null;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(encontrado) ? encontrado : `https://${encontrado}`);
  } catch {
    return null;
  }
  const partes = u.pathname.split('/').filter(Boolean);
  const host = u.hostname.toLowerCase();
  if (host === 'on.soundcloud.com') return partes.length ? { tipo: 'corto', url: `https://on.soundcloud.com/${partes.join('/')}` } : null;
  if (partes.length < 2) return null;
  return { tipo: 'largo', url: `https://soundcloud.com/${partes.join('/')}` };
}
