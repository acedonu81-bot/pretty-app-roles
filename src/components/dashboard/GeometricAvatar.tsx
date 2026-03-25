/**
 * Luxury geometric avatar icons — monochromatic gold-to-black palette.
 * Each role gets a distinct abstract geometric pattern.
 */

interface GeometricAvatarProps {
  role: 'dj' | 'staff' | 'makeup' | 'vestuario' | 'media' | 'design' | 'promotor' | 'ambassador';
  seed: number;
  size?: number;
  className?: string;
  isLive?: boolean;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5D77A';
const BLACK = '#0D0D0D';

const seedHash = (seed: number, idx: number) =>
  ((seed * 2654435761 + idx * 7919) >>> 0) % 360;

const DJIcon = ({ seed, size }: { seed: number; size: number }) => {
  const rot = seedHash(seed, 1) % 30 - 15;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      <circle cx="50" cy="50" r="38" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.3" />
      <circle cx="50" cy="50" r="18" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.2" />
      <circle cx="50" cy="50" r="6" fill={GOLD} opacity="0.9" />
      <path d={`M25,45 Q25,22 50,20 Q75,22 75,45`} fill="none" stroke={GOLD_LIGHT} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${rot}, 50, 50)`} />
      <rect x="21" y="40" width="8" height="14" rx="3" fill={GOLD} opacity="0.8" transform={`rotate(${rot}, 50, 50)`} />
      <rect x="71" y="40" width="8" height="14" rx="3" fill={GOLD} opacity="0.8" transform={`rotate(${rot}, 50, 50)`} />
      {[30, 38, 46, 54, 62, 70].map((x, i) => {
        const h = 6 + (seedHash(seed, i + 10) % 12);
        return <rect key={i} x={x} y={85 - h} width="4" rx="1" height={h} fill={GOLD} opacity={0.3 + (i % 3) * 0.15} />;
      })}
    </svg>
  );
};

const StaffIcon = ({ seed, size }: { seed: number; size: number }) => {
  const shift = seedHash(seed, 2) % 8;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => {
          const cx = 25 + col * 25 + (row % 2 ? 12 : 0);
          const cy = 25 + row * 22 + shift;
          return (
            <polygon key={`${row}-${col}`}
              points={`${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`}
              fill="none" stroke={GOLD} strokeWidth="1" opacity={0.3 + ((row + col) % 3) * 0.2} />
          );
        })
      )}
      <polygon points="50,18 54,30 66,30 56,38 60,50 50,42 40,50 44,38 34,30 46,30" fill={GOLD} opacity="0.85" />
      <line x1="20" y1="78" x2="80" y2="78" stroke={GOLD} strokeWidth="0.8" opacity="0.3" />
      <line x1="30" y1="84" x2="70" y2="84" stroke={GOLD} strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
};

const MakeupIcon = ({ seed, size }: { seed: number; size: number }) => {
  const rot = seedHash(seed, 3) % 45;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse key={i} cx="50" cy="50" rx="22" ry="8" fill="none" stroke={GOLD} strokeWidth="0.8"
          opacity={0.25 + (i % 3) * 0.15} transform={`rotate(${angle + rot}, 50, 50)`} />
      ))}
      <circle cx="50" cy="50" r="10" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.5" opacity="0.7" />
      <circle cx="50" cy="50" r="3" fill={GOLD} opacity="0.9" />
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle + rot) * Math.PI / 180;
        const cx = 50 + Math.cos(rad) * 34;
        const cy = 50 + Math.sin(rad) * 34;
        return <circle key={i} cx={cx} cy={cy} r="2" fill={GOLD} opacity={0.5 + (i % 2) * 0.3} />;
      })}
    </svg>
  );
};

const PromotorIcon = ({ seed, size }: { seed: number; size: number }) => {
  const shift = seedHash(seed, 4) % 10;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {[18, 32, 46, 58, 72].map((x, i) => {
        const h = 20 + (seedHash(seed, i + 20) % 30);
        return <rect key={i} x={x} y={80 - h + shift} width="10" height={h} rx="1" fill="none" stroke={GOLD} strokeWidth="1" opacity={0.3 + (i % 3) * 0.2} />;
      })}
      <rect x="35" y="22" width="30" height="22" rx="3" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.5" opacity="0.7" />
      <rect x="44" y="16" width="12" height="8" rx="2" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="33" r="2.5" fill={GOLD} opacity="0.8" />
    </svg>
  );
};

// Camera/lens icon for Media
const MediaIcon = ({ seed, size }: { seed: number; size: number }) => {
  const rot = seedHash(seed, 5) % 20 - 10;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {/* Lens rings */}
      <circle cx="50" cy="52" r="30" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="52" r="22" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.35" />
      <circle cx="50" cy="52" r="14" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="52" r="5" fill={GOLD} opacity="0.9" />
      {/* Camera body top */}
      <rect x="28" y="20" width="44" height="12" rx="3" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.6" transform={`rotate(${rot}, 50, 26)`} />
      <rect x="42" y="15" width="16" height="8" rx="2" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.4" />
      {/* Flash dot */}
      <circle cx="66" cy="24" r="2" fill={GOLD_LIGHT} opacity="0.7" />
    </svg>
  );
};

// Pen/brush for Design
const DesignIcon = ({ seed, size }: { seed: number; size: number }) => {
  const rot = seedHash(seed, 6) % 15;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {/* Pen nib */}
      <path d="M50,80 L38,50 Q50,35 62,50 Z" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" transform={`rotate(${rot}, 50, 50)`} />
      <circle cx="50" cy="52" r="4" fill={GOLD} opacity="0.8" transform={`rotate(${rot}, 50, 50)`} />
      {/* Abstract geometric frame */}
      <rect x="20" y="15" width="60" height="60" rx="2" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.25" />
      <rect x="26" y="21" width="48" height="48" rx="1" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.15" />
      {/* Corner accents */}
      {[[20, 15], [80, 15], [20, 75], [80, 75]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={GOLD} opacity={0.5 + (i % 2) * 0.3} />
      ))}
    </svg>
  );
};

// Megaphone for Ambassador
const AmbassadorIcon = ({ seed, size }: { seed: number; size: number }) => {
  const shift = seedHash(seed, 7) % 8;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" fill={BLACK} />
      {/* Megaphone shape */}
      <path d="M30,40 L55,28 L55,62 L30,50 Z" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
      <rect x="22" y="40" width="10" height="10" rx="2" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.2" opacity="0.6" />
      {/* Sound waves */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M${60 + i * 8},${35 - shift} Q${68 + i * 8},45 ${60 + i * 8},${55 + shift}`}
          fill="none" stroke={GOLD} strokeWidth="1" opacity={0.5 - i * 0.12} />
      ))}
      {/* Star accent */}
      <polygon points="50,74 52,80 58,80 53,84 55,90 50,86 45,90 47,84 42,80 48,80"
        fill={GOLD} opacity="0.6" />
    </svg>
  );
};

const GeometricAvatar = ({ role, seed, size = 48, className, isLive }: GeometricAvatarProps) => {
  const IconMap: Record<string, typeof DJIcon> = {
    dj: DJIcon, staff: StaffIcon, makeup: MakeupIcon, vestuario: MakeupIcon,
    media: MediaIcon, design: DesignIcon, promotor: PromotorIcon, ambassador: AmbassadorIcon,
  };
  const Icon = IconMap[role] || DJIcon;

  return (
    <div
      className={`rounded-lg overflow-hidden flex-shrink-0 ${className ?? ''}`}
      style={{
        width: size, height: size,
        border: isLive ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.25)',
        boxShadow: isLive ? '0 0 12px rgba(212,175,55,0.3)' : undefined,
      }}
    >
      <Icon seed={seed} size={size} />
    </div>
  );
};

export default GeometricAvatar;
