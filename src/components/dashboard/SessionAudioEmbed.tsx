import { useState, useEffect, useMemo } from 'react';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack } from '@/lib/streaming';

/**
 * Embed de audio (SoundCloud/Mixcloud/hearthis) o <audio> nativo si es un archivo subido.
 * hearthis.at rechaza mostrarse en iframe salvo con su URL /embed/{id}/ — sin pasar por
 * parseStreamUrl + resolveHearthisProfile/Track, el iframe queda en blanco (X-Frame-Options).
 */
const SessionAudioEmbed = ({ url, title = 'Sesión de audio', height }: { url: string; title?: string; height?: number }) => {
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const parsed = useMemo(() => parseStreamUrl(url), [url]);

  useEffect(() => {
    setEmbedSrc(null);
    if (!parsed) return;
    if (!parsed.needsResolve) { setEmbedSrc(parsed.embedUrl); return; }
    if (!parsed._hearthisUser) return;
    const resolver = parsed._hearthisSlug
      ? resolveHearthisTrack(parsed._hearthisUser, parsed._hearthisSlug)
      : resolveHearthisProfile(parsed._hearthisUser);
    resolver.then(u => setEmbedSrc(u));
  }, [parsed]);

  if (parsed) {
    if (!embedSrc) return null;
    return (
      <iframe
        src={embedSrc}
        width="100%"
        height={height ?? (parsed.type === 'SoundCloud' ? 166 : 120)}
        allow="autoplay"
        style={{ border: 'none' }}
        className="block"
        title={title}
      />
    );
  }

  return (
    <audio
      src={url}
      controls
      className="w-full"
      onError={(e) => {
        const audio = e.currentTarget;
        const p = document.createElement('p');
        p.textContent = 'Sesión no disponible temporalmente';
        p.style.cssText = 'font-size:11px;color:#444;padding:8px 12px;background:rgba(0,0,0,0.04);border-radius:8px;';
        audio.replaceWith(p);
      }}
    />
  );
};

export default SessionAudioEmbed;
