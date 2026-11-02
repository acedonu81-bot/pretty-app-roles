// Enlaces de la columna lateral del perfil de DJ (2 nov 2026), como el
// bloque "Enlaces" de Hearthis: sus perfiles de SoundCloud, Mixcloud y
// hearthis, sacados de las sesiones que ya ha pegado (sin pedirle nada más).

export interface EnlaceArtista { plataforma: 'SoundCloud' | 'Mixcloud' | 'hearthis'; url: string }

const PLATAFORMAS: { plataforma: EnlaceArtista['plataforma']; host: RegExp; base: string }[] = [
  { plataforma: 'SoundCloud', host: /(^|\.)soundcloud\.com$/i, base: 'https://soundcloud.com/' },
  { plataforma: 'Mixcloud', host: /(^|\.)mixcloud\.com$/i, base: 'https://www.mixcloud.com/' },
  { plataforma: 'hearthis', host: /(^|\.)hearthis\.at$/i, base: 'https://hearthis.at/' },
];

// Primeros tramos que no son un usuario.
const NO_USUARIO = new Set(['player', 'widget', 'embed', 'discover', 'search', 'live', 'tags']);

export const enlacesDeSesiones = (urls: string[]): EnlaceArtista[] => {
  const vistos = new Set<string>();
  const enlaces: EnlaceArtista[] = [];
  for (const u of urls) {
    let url: URL;
    try { url = new URL(u); } catch { continue; }
    const pl = PLATAFORMAS.find(p => p.host.test(url.hostname));
    if (!pl) continue;
    // on.soundcloud.com/xxxx es un enlace corto: no dice el usuario.
    if (/^on\./i.test(url.hostname)) continue;
    const usuario = url.pathname.split('/').filter(Boolean)[0];
    if (!usuario || NO_USUARIO.has(usuario.toLowerCase())) continue;
    const clave = `${pl.plataforma}:${usuario.toLowerCase()}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    enlaces.push({ plataforma: pl.plataforma, url: `${pl.base}${usuario}/` });
  }
  return enlaces;
};
