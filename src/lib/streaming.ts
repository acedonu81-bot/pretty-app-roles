export interface ParsedStreamUrl {
  type: 'Twitch' | 'YouTube' | 'Mixcloud' | 'HearThis' | 'SoundCloud' | 'Vimeo' | 'Spotify' | 'IVS';
  embedUrl: string;
  isHls?: boolean;
  isProfile?: boolean;
  _hearthisUser?: string;
  /** hearthis: el iframe solo funciona con ID numérico — hay que resolverlo async vía API */
  needsResolve?: boolean;
  _hearthisSlug?: string;
}

export async function resolveHearthisProfile(username: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api-v2.hearthis.at/${username}/?type=tracks&count=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || !data[0].id) return null;
    return `https://hearthis.at/embed/${data[0].id}/`;
  } catch { return null; }
}

/** Resuelve el embed de un track concreto de hearthis (el widget solo acepta ID numérico). */
export async function resolveHearthisTrack(username: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api-v2.hearthis.at/${username}/${slug}/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.id) return null;
    return `https://hearthis.at/embed/${data.id}/`;
  } catch { return null; }
}

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const parseStreamUrl = (value?: string | null): ParsedStreamUrl | null => {
  if (!value) return null;

  const normalized = normalizeUrl(value);

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();

    if (hostname.includes('twitch.tv')) {
      const segments = url.pathname.split('/').filter(Boolean);
      const channel = segments[0];
      if (!channel) return null;

      return {
        type: 'Twitch',
        embedUrl: `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${window.location.hostname}`,
      };
    }

    if (hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (!id) return null;

      return {
        type: 'YouTube',
        embedUrl: `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&playsinline=1`,
      };
    }

    if (hostname.includes('youtube.com')) {
      const segments = url.pathname.split('/').filter(Boolean);
      const shortsId = segments[0] === 'shorts' ? segments[1] : null;
      const liveId = segments[0] === 'live' ? segments[1] : null;
      const embedId = segments[0] === 'embed' ? segments[1] : null;
      // studio.youtube.com/video/ID/... — YouTube Studio creator URLs
      const studioId = segments[0] === 'video' && segments[1] ? segments[1] : null;
      const watchId = url.searchParams.get('v');
      const id = watchId || shortsId || liveId || embedId || studioId;

      if (!id) return null;

      return {
        type: 'YouTube',
        embedUrl: `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&playsinline=1`,
      };
    }

    if (hostname.includes('mixcloud.com')) {
      const feed = url.pathname.startsWith('/') ? url.pathname : `/${url.pathname}`;
      if (feed === '/') return null;

      return {
        type: 'Mixcloud',
        embedUrl: `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(feed)}`,
      };
    }

    if (hostname.includes('hearthis.at')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length === 0) return null;
      const username = segments[0];
      if (segments.length >= 2) {
        // El widget de hearthis solo carga con ID numérico; el consumidor debe
        // llamar a resolveHearthisTrack(_hearthisUser, _hearthisSlug) para obtener la URL final.
        return {
          type: 'HearThis',
          embedUrl: '',
          needsResolve: true,
          _hearthisUser: username,
          _hearthisSlug: segments[1],
        };
      }
      return {
        type: 'HearThis',
        embedUrl: '',
        isProfile: true,
        needsResolve: true,
        _hearthisUser: username,
      };
    }

    if (hostname.includes('soundcloud.com')) {
      return {
        type: 'SoundCloud',
        embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(normalized)}&color=%23D4AF37&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`,
      };
    }

    if (hostname.includes('vimeo.com')) {
      const segments = url.pathname.split('/').filter(Boolean);
      // player.vimeo.com/video/ID  or  vimeo.com/ID  or  vimeo.com/channels/x/ID
      const videoId = segments.find(s => /^\d+$/.test(s));
      if (!videoId) return null;
      return {
        type: 'Vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&playsinline=1`,
      };
    }

    // Amazon IVS playback URLs — pattern: *.cloudfront.net/...index.m3u8
    // or the short form: *.ivs.rocks/...index.m3u8
    if (
      (hostname.endsWith('.cloudfront.net') || hostname.endsWith('.ivs.rocks')) &&
      url.pathname.endsWith('.m3u8')
    ) {
      return {
        type: 'IVS',
        embedUrl: normalized,
        isHls: true,
      };
    }

    if (hostname.includes('spotify.com')) {
      // open.spotify.com/track/ID  →  open.spotify.com/embed/track/ID
      // open.spotify.com/playlist/ID  →  open.spotify.com/embed/playlist/ID
      const segments = url.pathname.split('/').filter(Boolean);
      // Remove "embed" prefix if already present
      const clean = segments[0] === 'embed' ? segments.slice(1) : segments;
      if (clean.length < 2) return null;
      const [resourceType, resourceId] = clean;
      return {
        type: 'Spotify',
        embedUrl: `https://open.spotify.com/embed/${resourceType}/${resourceId}?utm_source=generator&theme=0`,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const normalizeStreamUrl = (value: string) => normalizeUrl(value);