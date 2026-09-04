import { useState, useEffect, useMemo } from 'react';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack } from '@/lib/streaming';

// Extraído de PublicProfile.tsx (antes definido localmente ahí como
// `SessionAudio`). Reproduce las sesiones desde audio_session_urls /
// audio_embed_url, que son casi siempre links externos de Mixcloud,
// SoundCloud o HearThis, no archivos servidos directamente.
const SessionAudioPlayer = ({ url }: { url: string }) => {
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const parsed = useMemo(() => parseStreamUrl(url), [url]);

  useEffect(() => {
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
        height={parsed.type === 'SoundCloud' ? 166 : 120}
        allow="autoplay"
        className="rounded-xl"
        style={{ border: 'none' }}
        title="Sesión de audio"
      />
    );
  }
  return (
    <audio
      src={url}
      controls
      className="w-full rounded-xl"
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

export default SessionAudioPlayer;
