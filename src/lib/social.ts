// Varios perfiles reales guardaron la URL completa de Instagram en vez del
// handle ("https://www.instagram.com/sonidosalvaje.mlg?igsi=..." en vez de
// "sonidosalvaje.mlg") — el código que construía el link a mano
// (`https://instagram.com/${p.instagram}`) los concatenaba a ciegas,
// produciendo una URL rota que abría el Instagram genérico en vez del
// perfil real. extractInstagramHandle normaliza ambos casos al handle limpio.
export function extractInstagramHandle(raw: string): string {
  const trimmed = raw.trim().replace(/^@/, '');
  if (!/^https?:\/\/|^(www\.)?instagram\.com/i.test(trimmed)) return trimmed;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const handle = url.pathname.split('/').filter(Boolean)[0] ?? '';
    return handle;
  } catch {
    // URL malformada — mejor devolver el string tal cual (aunque el link
    // salga roto) que perder el dato por completo.
    return trimmed;
  }
}

export function instagramUrl(raw: string): string {
  return `https://instagram.com/${extractInstagramHandle(raw)}`;
}

// TikTok (25 nov 2026): admite "@usuario", "usuario" o la URL del perfil
// ("https://www.tiktok.com/@usuario?lang=es") y devuelve el usuario limpio.
export function extractTiktokHandle(raw: string): string {
  const t = raw.trim();
  const m = t.match(/tiktok\.com\/@([^/?#\s]+)/i);
  return (m ? m[1] : t).replace(/^@/, '').trim();
}

export function tiktokUrl(raw: string): string {
  return `https://www.tiktok.com/@${extractTiktokHandle(raw)}`;
}

// Facebook (25 nov 2026): misma limpieza que limpiar_facebook() en la BD. Devuelve la
// ruta de la página ("mipagina", "profile.php?id=123") o null si no es de Facebook.
// El enlace siempre se monta sobre https://www.facebook.com/, nunca con lo que pegue
// la persona, para que no se cuele otro dominio.
export function facebookRuta(raw: string | null | undefined): string | null {
  let v = (raw ?? '').trim()
    .replace(/^(https?:\/\/)?((www|m|web|es-es)\.)?(facebook\.com|fb\.com)\//i, '')
    .replace(/^@/, '');
  const id = v.match(/^profile\.php\?id=[0-9]+/);
  v = (id ? id[0] : v.replace(/[?#].*$/, '')).replace(/\/+$/, '');
  return /^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*(\?id=[0-9]+)?$/.test(v) ? v : null;
}

export function facebookUrl(ruta: string): string {
  return `https://www.facebook.com/${facebookRuta(ruta) ?? ''}`;
}
