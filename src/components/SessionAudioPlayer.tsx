import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack, resolveSoundcloudShort } from '@/lib/streaming';
import EmbedDiferido from '@/components/EmbedDiferido';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

// Reproductor propio para archivos de audio directos (no embebibles vía
// iframe de Mixcloud/SoundCloud/HearThis). Mismo placeholder "pulsa para
// escuchar" que EmbedDiferido.tsx (círculo dorado + ecualizador + texto) —
// antes tenía su propio estilo (botón verde pequeño + barra de progreso
// visible desde el principio), y al lado de las tarjetas de SoundCloud/
// HearThis en el feed se veía como un componente roto o de otra app
// (reportado por el usuario 2 oct 2026: "porque solo uno tiene un play").
// Los controles reales (play/pausa, progreso, volumen) solo aparecen tras
// pulsar, igual que el iframe diferido de las otras plataformas.
const CustomAudioPlayer = ({ url, alto = 70 }: { url: string; alto?: number }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [cargado, setCargado] = useState(false);
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

  if (!cargado) {
    const barras = [0.4, 0.75, 1, 0.55, 0.85, 0.35, 0.65];
    return (
      <button type="button" onClick={() => setCargado(true)} aria-label="Escuchar sesión de audio"
        className="embed-diferido-btn w-full flex items-center gap-3 px-4 text-left transition-colors hover:bg-black/[0.03] rounded-xl"
        style={{ height: alto, background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
        <span className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
          <Play size={16} fill="#000" color="#000" style={{ marginLeft: 2 }} />
        </span>
        <span className="flex items-end gap-[3px] h-6 flex-shrink-0" aria-hidden="true">
          {barras.map((h, i) => (
            <span key={i} className="eq-bar" style={{ '--h': h } as React.CSSProperties} />
          ))}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold" style={{ color: '#111' }}>Escuchar sesión de audio</span>
          <span className="block text-xs" style={{ color: '#6b7280' }}>Audio</span>
        </span>
        <style>{`
          .eq-bar { width: 3px; border-radius: 2px; background: linear-gradient(180deg, #D4AF37, #B8941E); height: calc(var(--h) * 100%); transform-origin: bottom; }
        `}</style>
      </button>
    );
  }

  return (
    <div className="w-full flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: 'rgba(10,9,8,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
      <audio
        ref={audioRef}
        src={url}
        autoPlay
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
    if (parsed._soundcloudShort) { resolveSoundcloudShort(parsed._soundcloudShort).then(u => setEmbedSrc(u)); return; }
    if (!parsed._hearthisUser) return;
    const resolver = parsed._hearthisSlug
      ? resolveHearthisTrack(parsed._hearthisUser, parsed._hearthisSlug)
      : resolveHearthisProfile(parsed._hearthisUser);
    resolver.then(u => setEmbedSrc(u));
  }, [parsed]);

  if (parsed) {
    if (!embedSrc) return null;
    return (
      <EmbedDiferido src={embedSrc} alto={parsed.type === 'SoundCloud' ? 166 : 120} tipo={parsed.type}
        titulo="Sesión de audio" className="rounded-xl" />
    );
  }
  return <CustomAudioPlayer url={url} />;
};

export default SessionAudioPlayer;
