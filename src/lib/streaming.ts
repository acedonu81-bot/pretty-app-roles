export interface ParsedStreamUrl {
  type: 'Twitch' | 'YouTube' | 'Mixcloud';
  embedUrl: string;
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
      const liveId = segments[0] === 'live' ? segments[1] : null;
      const embedId = segments[0] === 'embed' ? segments[1] : null;
      const watchId = url.searchParams.get('v');
      const id = watchId || liveId || embedId;

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
  } catch {
    return null;
  }

  return null;
};

export const normalizeStreamUrl = (value: string) => normalizeUrl(value);