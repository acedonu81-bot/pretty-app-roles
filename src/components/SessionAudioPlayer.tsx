import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack } from '@/lib/streaming';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

// Reproductor propio para archivos de audio directos (no embebibles vía
// iframe de Mixcloud/SoundCloud/HearThis) — antes caía en <audio controls>,
// los controles grises nativos del navegador desentonaban con el resto del
// diseño dorado/negro de la marca.
const CustomAudioPlayer = ({ url }: { url: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [errored, setErrored] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause(); else audio.play();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrent(time);
  };

  if (errored) {
    return (
      <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#444', background: 'rgba(0,0,0,0.04)' }}>
        Sesión no disponible temporalmente
      </p>
    );
  }

  return (
    <div className="w-full flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: 'rgba(10,9,8,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
        onError={() => setErrored(true)}
      />
      <button type="button" onClick={togglePlay}
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}
        aria-label={playing ? 'Pausar' : 'Reproducir'}>
        {playing ? <Pause size={14} fill="#000" /> : <Play size={14} fill="#000" style={{ marginLeft: 1 }} />}
      </button>
      <span className="text-[0.65rem] font-bold tabular-nums shrink-0" style={{ color: '#7a6216', minWidth: 32 }}>
        {formatTime(current)}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        onChange={seek}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #D4AF37 ${duration ? (current / duration) * 100 : 0}%, rgba(0,0,0,0.1) 0%)`,
          accentColor: '#D4AF37',
        }}
      />
      <span className="text-[0.65rem] font-semibold tabular-nums shrink-0" style={{ color: '#888', minWidth: 32 }}>
        {formatTime(duration)}
      </span>
      <button type="button"
        onClick={() => { const a = audioRef.current; if (!a) return; a.muted = !a.muted; setMuted(a.muted); }}
        className="shrink-0 w-6 h-6 flex items-center justify-center"
        style={{ color: '#888' }}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
};

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
  return <CustomAudioPlayer url={url} />;
};

export default SessionAudioPlayer;
