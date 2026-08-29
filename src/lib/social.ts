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
