import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface IVSPlayerProps {
  src: string;
  className?: string;
}

/**
 * Plays an HLS stream (Amazon IVS or any .m3u8 URL) using hls.js in browsers
 * that don't support HLS natively, and falls back to native <video> in Safari.
 */
const IVSPlayer = ({ src, className }: IVSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      hlsRef.current = new Hls({ lowLatencyMode: true });
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(video);
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className ?? 'absolute inset-0 w-full h-full'}
      autoPlay
      muted
      playsInline
      style={{ objectFit: 'cover', background: '#000', border: 'none' }}
    />
  );
};

export default IVSPlayer;
