import type { HZTone } from '@/data/healthyZone';
import { TONES } from './clay';

const PATHS: Record<HZTone, JSX.Element> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  sky: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  leaf: <path d="M6 3h12l-2 9a4 4 0 0 1-8 0L6 3zM12 16v5M8 21h8" />,
  lilac: <path d="M12 21c-4-3-8-6-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-4 8-8 11z" />,
};

// Icono de cada guía dentro de una bola inflada de su color.
export default function HZIcon({ tone, size = 64 }: { tone: HZTone; size?: number }) {
  const t = TONES[tone];
  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: t.bubble,
        boxShadow: `6px 8px 14px rgba(${t.rgb},0.3), inset -5px -5px 10px rgba(0,0,0,0.12), inset 5px 5px 10px rgba(255,255,255,0.7)`,
      }}
    >
      <svg width={size * 0.47} height={size * 0.47} viewBox="0 0 24 24" fill="none" stroke={t.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {PATHS[tone]}
      </svg>
    </span>
  );
}
