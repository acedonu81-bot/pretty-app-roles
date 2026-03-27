import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const tracks = [
  { title: 'I Want Your Soul (Club Mix)', artist: 'Armand Van Helden', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Armand%20Van%20Helden%20-%20I%20Want%20Your%20Soul%20(Club%20mix)%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9Bcm1hbmQgVmFuIEhlbGRlbiAtIEkgV2FudCBZb3VyIFNvdWwgKENsdWIgbWl4KSAoMTI4a2JpdF9BQUMpLm00YSIsImlhdCI6MTc3NDU3MDcxMiwiZXhwIjoxODA2MTA2NzEyfQ.46hy6fNGSPae4Xy3s3Hy7FrMIMxCWf2Sr84fF0B_dsc' },
  { title: 'Blue Berries (Extended Mix)', artist: 'XPEAK Select', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Blue%20Berries%20(Extended%20Mix)%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9CbHVlIEJlcnJpZXMgKEV4dGVuZGVkIE1peCkgKDEyOGtiaXRfQUFDKS5tNGEiLCJpYXQiOjE3NzQ1NzA3OTcsImV4cCI6MTgwNjEwNjc5N30.t5mzYuglvjWLq8UJEYNNBxnhh-AF2mnesCk5DpVH0mQ' },
  { title: 'Blessings (Extended Mix)', artist: 'Calvin Harris, Clementine Douglas', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Calvin%20Harris,%20Clementine%20Douglas%20-%20Blessings%20(Extended%20Mix%20-%20Official%20Audio)%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9DYWx2aW4gSGFycmlzLCBDbGVtZW50aW5lIERvdWdsYXMgLSBCbGVzc2luZ3MgKEV4dGVuZGVkIE1peCAtIE9mZmljaWFsIEF1ZGlvKSAoMTI4a2JpdF9BQUMpLm00YSIsImlhdCI6MTc3NDU3MDgxMywiZXhwIjoxODA2MTA2ODEzfQ.MkTkuR0-_PkKv0aautCxptAooDgDgI3mLkw9WfY7GJY' },
  { title: 'My Feelings (Club Mix)', artist: 'Junior Jack', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Junior%20Jack%20-%20My%20Feelings%20(Club%20Mix)%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9KdW5pb3IgSmFjayAtIE15IEZlZWxpbmdzIChDbHViIE1peCkgKDEyOGtiaXRfQUFDKS5tNGEiLCJpYXQiOjE3NzQ1NzA4MzQsImV4cCI6MTgwNjEwNjgzNH0.Y4uZDAGXtHJQVpmQqEQMHY4Oea5U3ca20U7LOY8llXE' },
  { title: "Just Won't Do Remix (Latin House)", artist: 'Tom Gasco', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Just%20Won\'t%20Do%20REMIX%20(%20Tom%20Gasco%20)%20LATIN%20HOUSE%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9KdXN0IFdvbid0IERvIFJFTUlYICggVG9tIEdhc2NvICkgTEFUSU4gSE9VU0UgKDEyOGtiaXRfQUFDKS5tNGEiLCJpYXQiOjE3NzQ1NzA4NDMsImV4cCI6MTgwNjEwNjg0M30.AFjOXQf2SGNqluUC0rePa6188V56ThQEIveqqPPkg1g' },
  { title: 'Ticket 2 Ride (Extended Mix)', artist: 'XPEAK Select', src: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/sign/Music/Ticket%202%20Ride%20(Extended%20Mix)%20(128kbit_AAC).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDRjMmE2My1kM2Y2LTQ2NmUtODk4Zi0xMjAwMDAxMjg1NDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNdXNpYy9UaWNrZXQgMiBSaWRlIChFeHRlbmRlZCBNaXgpICgxMjhrYml0X0FBQykubTRhIiwiaWF0IjoxNzc0NTcwODUxLCJleHAiOjE4MDYxMDY4NTF9.z41_IbqyKczKmt2oeWp53QqL6ULF_PFEJTA5skHUmrw' },
];

const GlobalPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const ensureAudio = (trackIndex: number) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[trackIndex].src);
      audioRef.current.volume = 0.4;
      audioRef.current.onended = () => {
        const nextIdx = (trackIndex + 1) % tracks.length;
        changeTrack(nextIdx);
        audioRef.current?.play().catch(() => {});
        setPlaying(true);
      };
    } else {
      audioRef.current.src = tracks[trackIndex].src;
      audioRef.current.onended = () => {
        const nextIdx = (trackIndex + 1) % tracks.length;
        changeTrack(nextIdx);
        audioRef.current?.play().catch(() => {});
        setPlaying(true);
      };
    }
    audioRef.current.muted = muted;
  };

  const togglePlay = () => {
    if (!audioRef.current) ensureAudio(currentTrack);
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const changeTrack = (newIndex: number) => {
    const wasPlaying = playing;
    if (audioRef.current) audioRef.current.pause();
    setCurrentTrack(newIndex);
    ensureAudio(newIndex);
    if (wasPlaying) {
      audioRef.current?.play().catch(() => {});
    }
  };

  const next = () => changeTrack((currentTrack + 1) % tracks.length);
  const prev = () => changeTrack((currentTrack - 1 + tracks.length) % tracks.length);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (audioRef.current) audioRef.current.muted = newMuted;
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
      <div className="flex items-center gap-3 min-w-0 w-[180px]">
        <div
          className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-[0.5rem] font-bold"
          style={{ background: playing ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
        >
          {playing ? '▶' : '♪'}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{track.title}</p>
          <p className="text-[0.6rem] truncate" style={{ color: '#D4AF37' }}>{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={prev} className="p-1.5 rounded-md transition-colors hover:bg-white/5" style={{ color: '#8E8EA0' }}>
          <SkipBack size={14} />
        </button>
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <button onClick={next} className="p-1.5 rounded-md transition-colors hover:bg-white/5" style={{ color: '#8E8EA0' }}>
          <SkipForward size={14} />
        </button>
      </div>

      <div className="flex-1 mx-2 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="text-[0.55rem] text-muted-foreground">LIVE</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full animate-pulse" style={{ width: playing ? '100%' : '0%', background: 'linear-gradient(90deg, #D4AF37, #B8941E)', transition: 'width 0.5s' }} />
          </div>
          <span className="text-[0.55rem] text-muted-foreground">STREAM</span>
        </div>
      </div>

      <button
        onClick={toggleMute}
        className="p-1.5 rounded-md transition-colors hover:bg-white/5 flex-shrink-0"
        style={{ color: muted ? '#ff5f56' : '#D4AF37' }}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
};

export default GlobalPlayer;
