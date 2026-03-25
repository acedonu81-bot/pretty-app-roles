import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const tracks = [
  { title: 'Deep Session Vol.1', artist: 'Luna Deep', src: '' },
  { title: 'Techno Industrial Mix', artist: 'Dani Tech', src: '' },
  { title: 'Urbano Night', artist: 'MC Ráfaga', src: '' },
];

const GlobalPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const next = () => {
    setCurrentTrack(i => (i + 1) % tracks.length);
    setProgress(0);
  };

  const prev = () => {
    setCurrentTrack(i => (i - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const track = tracks[currentTrack];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 px-4 md:px-6 py-2.5 backdrop-blur-xl"
      style={{
        background: 'rgba(0,0,0,0.92)',
        borderTop: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* Track info */}
      <div className="flex items-center gap-3 min-w-0 w-[180px]">
        <div
          className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-[0.5rem] font-bold"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
        >
          ♪
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{track.title}</p>
          <p className="text-[0.6rem] truncate" style={{ color: '#D4AF37' }}>{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={prev} className="p-1.5 rounded-md transition-colors hover:bg-white/5" style={{ color: '#8E8EA0' }}>
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <button onClick={next} className="p-1.5 rounded-md transition-colors hover:bg-white/5" style={{ color: '#8E8EA0' }}>
          <SkipForward size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-1 mx-2 hidden sm:block">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #B8941E)' }}
          />
        </div>
      </div>

      {/* Volume */}
      <button
        onClick={() => setMuted(!muted)}
        className="p-1.5 rounded-md transition-colors hover:bg-white/5 flex-shrink-0"
        style={{ color: muted ? '#ff5f56' : '#D4AF37' }}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
};

export default GlobalPlayer;
