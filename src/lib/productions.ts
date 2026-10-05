export type ProductionType = 'spotify' | 'apple_music' | 'youtube' | 'bandcamp' | 'beatport' | 'patreon';

export const PRODUCTION_PLATFORM_LABEL: Record<ProductionType, string> = {
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  youtube: 'YouTube',
  bandcamp: 'Bandcamp',
  beatport: 'Beatport',
  patreon: 'Patreon',
};

function hostMatches(hostname: string, domain: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  return h === domain || h.endsWith('.' + domain);
}

export function detectProductionType(raw: string): ProductionType | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const h = u.hostname.toLowerCase();
  if (h === 'open.spotify.com') return 'spotify';
  if (h === 'music.apple.com') return 'apple_music';
  if (hostMatches(h, 'youtube.com') || h === 'youtu.be') return 'youtube';
  if (hostMatches(h, 'bandcamp.com')) return 'bandcamp';
  if (hostMatches(h, 'beatport.com')) return 'beatport';
  if (hostMatches(h, 'patreon.com')) return 'patreon';
  return null;
}

// Embed oficial solo para Spotify/Apple Music/YouTube. Bandcamp/Beatport/Patreon
// no tienen forma de construir un embed válido a partir de solo la URL pública
// (requieren un ID numérico interno que no está en el link) — se muestran como enlace.
export function buildProductionEmbedSrc(url: string, type: ProductionType): string | null {
  if (type === 'spotify') {
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/^\/(intl-[a-z-]+\/)?/, '/');
      return `https://open.spotify.com/embed${path}`;
    } catch {
      return null;
    }
  }
  if (type === 'apple_music') {
    try {
      const u = new URL(url);
      return `https://embed.music.apple.com${u.pathname}${u.search}`;
    } catch {
      return null;
    }
  }
  if (type === 'youtube') {
    try {
      const u = new URL(url);
      let id = u.searchParams.get('v');
      if (!id && u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}`;
    } catch {
      return null;
    }
  }
  return null;
}
