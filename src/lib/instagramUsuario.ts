/**
 * Instagram en el asistente de alta: la gente pega "@usuario", "usuario", "#usuario"
 * o el enlace entero del perfil. Se guarda solo el usuario.
 */

// Rutas de instagram.com que no son un perfil (un post, un reel...).
const RUTAS_QUE_NO_SON_PERFIL = new Set(['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'accounts', 'direct']);

export function normalizarInstagram(bruto: string): string {
  let t = (bruto || '').trim().replace(/^[@#]+/, '');
  t = t.replace(/^https?:\/\//i, '').replace(/^(www\.|m\.)?instagram\.com\//i, '');
  const trozo = t.split(/[?#/]/)[0].replace(/^[@#]+/, '').trim();
  if (RUTAS_QUE_NO_SON_PERFIL.has(trozo.toLowerCase())) return '';
  return trozo;
}

/** Reglas de Instagram: letras, números, puntos y guiones bajos, hasta 30. */
export function esUsuarioInstagram(usuario: string): boolean {
  return /^[A-Za-z0-9._]{1,30}$/.test(usuario);
}
