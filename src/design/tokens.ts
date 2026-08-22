/**
 * XPEAK Design Tokens
 * Single source of truth for all design values.
 * Import from here — never hardcode magic numbers in components.
 *
 * Sync changes to DESIGN.md at the project root.
 */

// ─── Color Palette ────────────────────────────────────────────────────────────

export const color = {
  /** Brand gold — primary accent, CTAs, active states */
  gold: {
    200: '#F5D77A',   // light  — gradient endpoint, text gradient
    400: '#D4AF37',   // base   — THE brand color
    500: '#B8941E',   // dark   — gradient end, hover
  },

  /** Dark surfaces */
  surface: {
    base:     '#060606',  // page background
    card:     '#0E0E0E',  // card backgrounds
    elevated: '#141414',  // panels, dropdowns
    overlay:  '#1A1A1A',  // modals, overlays
    topbar:   'rgba(0,0,0,0.80)',
    sidebarBg:'#080808',
  },

  /** Semantic status */
  status: {
    success: '#22c55e',
    error:   '#ef4444',
    errorFg: '#fca5a5',
    warning: '#f59e0b',
    live:    '#E53935',  // LIVE indicator only
    liveGlow:'rgba(229,57,53,0.35)',
  },

  /** Text */
  text: {
    primary:   'rgba(255,255,255,0.95)',
    secondary: 'rgba(255,255,255,0.60)',
    tertiary:  'rgba(255,255,255,0.35)',
    disabled:  'rgba(255,255,255,0.20)',
    muted:     '#888898',
    gold:      '#D4AF37',
    goldLight: '#F5D77A',
  },

  /** Borders */
  border: {
    default: 'rgba(255,255,255,0.08)',
    subtle:  'rgba(255,255,255,0.05)',
    strong:  'rgba(255,255,255,0.14)',
    gold: {
      faint:  'rgba(212,175,55,0.08)',
      subtle: 'rgba(212,175,55,0.15)',
      medium: 'rgba(212,175,55,0.25)',
      strong: 'rgba(212,175,55,0.45)',
    },
    red: {
      subtle: 'rgba(229,57,53,0.15)',
      medium: 'rgba(229,57,53,0.30)',
    },
    success: {
      subtle: 'rgba(34,197,94,0.25)',
    },
    error: {
      subtle: 'rgba(239,68,68,0.25)',
    },
  },
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const font = {
  family: {
    display: "'Syne', sans-serif",
    body:    "'Inter', sans-serif",
    mono:    "'ui-monospace', 'SFMono-Regular', 'Menlo', monospace",
  },
  size: {
    '2xs': '0.55rem',
    xs:    '0.65rem',
    sm:    '0.75rem',
    base:  '0.875rem',
    md:    '1rem',
    lg:    '1.125rem',
    xl:    '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '3rem',
    display: '5rem',
  },
  weight: {
    light:    300,
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
    black:    900,
  },
  leading: {
    tight:   1.1,
    snug:    1.3,
    normal:  1.5,
    relaxed: 1.6,
  },
  tracking: {
    tight:   '-0.02em',
    normal:  '0em',
    wide:    '0.05em',
    wider:   '0.1em',
    widest:  '0.2em',  // logos / wordmarks
  },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

/** Base unit: 4px. Follow Tailwind 4-unit grid. */
export const space = {
  0:    '0',
  0.5:  '0.125rem',   //  2px
  1:    '0.25rem',    //  4px — micro (icon+label gap)
  1.5:  '0.375rem',   //  6px
  2:    '0.5rem',     //  8px — xs
  2.5:  '0.625rem',   // 10px
  3:    '0.75rem',    // 12px — sm
  4:    '1rem',       // 16px — md (standard)
  5:    '1.25rem',    // 20px
  6:    '1.5rem',     // 24px — lg
  8:    '2rem',       // 32px — xl
  10:   '2.5rem',     // 40px
  12:   '3rem',       // 48px — 2xl
  16:   '4rem',       // 64px
  20:   '5rem',       // 80px
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  sm:   '6px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl':'20px',
  full: '9999px',
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadow = {
  card:        '0 8px 24px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.05)',
  cardHover:   '0 12px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.08)',
  gold:        '0 0 20px rgba(212,175,55,0.30)',
  goldStrong:  '0 0 30px rgba(212,175,55,0.50)',
  goldButton:  '0 4px 16px rgba(212,175,55,0.35)',
  goldButtonHover: '0 6px 24px rgba(212,175,55,0.55)',
  panel:       '0 20px 60px rgba(0,0,0,0.80)',
  orb:         '0 0 6px rgba(212,175,55,0.60)',
  none:        'none',
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const gradient = {
  gold:         'linear-gradient(90deg, #D4AF37, #B8941E)',
  goldDiag:     'linear-gradient(135deg, #D4AF37, #F5D77A)',
  goldText:     'linear-gradient(135deg, #D4AF37, #F5D77A)',
  goldRadial:   'radial-gradient(circle at 40% 35%, #F5D77A, #D4AF37 60%, #B8941E)',
  surfaceGlow:  'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)',
  darkOverlay:  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.80) 100%)',
  darkFull:     'rgba(0,0,0,0.80)',
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────

export const duration = {
  instant: '0.10s',
  fast:    '0.15s',
  normal:  '0.20s',
  slow:    '0.35s',
  slower:  '0.50s',
} as const;

export const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  in:     'cubic-bezier(0.4, 0, 1, 1)',
  out:    'cubic-bezier(0, 0, 0.2, 1)',
} as const;

// ─── Subscription Tier Metadata ───────────────────────────────────────────────

export const TIER_ORDER = ['free', 'starter', 'business', 'premium', 'agency', 'elite'] as const;
export type Tier = typeof TIER_ORDER[number];

export const tierMeta: Record<Tier, { label: string; order: number; color: string; bg: string; border: string }> = {
  free:     { label: 'Free',     order: 0, color: '#8E8EA0', bg: 'rgba(255,255,255,0.04)',    border: 'rgba(142,142,160,0.20)' },
  starter:  { label: 'Starter',  order: 1, color: '#A8C5DA', bg: 'rgba(168,197,218,0.08)',  border: 'rgba(168,197,218,0.20)' },
  business: { label: 'Business', order: 2, color: '#D4AF37', bg: 'rgba(212,175,55,0.10)',   border: 'rgba(212,175,55,0.22)' },
  premium:  { label: 'Business', order: 2, color: '#D4AF37', bg: 'rgba(212,175,55,0.10)',   border: 'rgba(212,175,55,0.22)' },
  agency:   { label: 'Agencia',  order: 3, color: '#D4AF37', bg: 'rgba(212,175,55,0.15)',   border: 'rgba(212,175,55,0.30)' },
  elite:    { label: 'Agencia',  order: 3, color: '#D4AF37', bg: 'rgba(212,175,55,0.15)',   border: 'rgba(212,175,55,0.30)' },
};

// ─── Role Metadata ────────────────────────────────────────────────────────────

export const roleMeta: Record<string, { label: string; plural: string }> = {
  dj:         { label: 'DJ & Artista',       plural: 'DJs & Artistas' },
  rookie:     { label: 'DJ / Artista Promesa',plural: 'DJs & Artistas Promesa' },
  staff:      { label: 'Staff & Promotor',   plural: 'Staff & Promoción' },
  makeup:     { label: 'Maquillaje',         plural: 'Maquillaje' },
  peluqueria: { label: 'Peluquería a Domicilio', plural: 'Peluquería a Domicilio' },
  media:      { label: 'Media & Contenido',  plural: 'Media & Contenido' },
  empresario: { label: 'Empresario',         plural: 'Empresarios' },
};
