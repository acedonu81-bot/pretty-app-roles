/**
 * XPEAK Theme Factory
 * Generates React-ready CSSProperties objects from design tokens.
 * Use these instead of inline magic numbers in components.
 *
 * Usage:
 *   import { surface, btn, badge, text } from '@/design';
 *   <div style={surface.card}>...</div>
 *   <button style={btn.primary}>...</button>
 */

import type { CSSProperties } from 'react';
import { color, gradient, radius, shadow, duration, easing, font, tierMeta, type Tier } from './tokens';

// ─── Surfaces ─────────────────────────────────────────────────────────────────

export const surface = {
  /** Main card — glass with blur */
  card: {
    background: 'rgba(14,14,14,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.xl,
    boxShadow: shadow.card,
  } satisfies CSSProperties,

  /** Subtle glass — lighter variant */
  glass: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${color.border.subtle}`,
    borderRadius: radius.lg,
  } satisfies CSSProperties,

  /** Gold-tinted surface — for premium sections */
  gold: {
    background: 'rgba(212,175,55,0.06)',
    border: `1px solid ${color.border.gold.subtle}`,
    borderRadius: radius.xl,
  } satisfies CSSProperties,

  /** Flat dark — sidebar, opaque panels */
  dark: {
    background: color.surface.sidebarBg,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.xl,
  } satisfies CSSProperties,

  /** Topbar */
  topbar: {
    background: color.surface.topbar,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${color.border.default}`,
  } satisfies CSSProperties,

  /** Elevated — modals, dropdowns */
  elevated: {
    background: 'rgba(8,8,12,0.97)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${color.border.gold.medium}`,
    borderRadius: radius.xl,
    boxShadow: shadow.panel,
  } satisfies CSSProperties,

  /** Section with live/red accent */
  live: {
    background: 'rgba(0,0,0,0.60)',
    border: `1px solid ${color.border.red.subtle}`,
    borderRadius: radius.lg,
  } satisfies CSSProperties,
} as const;

// ─── Buttons ──────────────────────────────────────────────────────────────────

export const btn = {
  primary: {
    background: gradient.gold,
    color: '#000000',
    border: 'none',
    borderRadius: radius.md,
    fontWeight: font.weight.bold,
    boxShadow: shadow.goldButton,
    cursor: 'pointer',
    transition: `all ${duration.normal} ${easing.smooth}`,
  } satisfies CSSProperties,

  secondary: {
    background: 'rgba(255,255,255,0.05)',
    color: color.gold[400],
    border: `1px solid ${color.border.gold.medium}`,
    borderRadius: radius.md,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `all ${duration.normal} ${easing.smooth}`,
  } satisfies CSSProperties,

  ghost: {
    background: 'rgba(255,255,255,0.04)',
    color: color.text.secondary,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    fontWeight: font.weight.medium,
    cursor: 'pointer',
    transition: `all ${duration.normal} ${easing.smooth}`,
  } satisfies CSSProperties,

  danger: {
    background: 'rgba(239,68,68,0.12)',
    color: color.status.errorFg,
    border: `1px solid ${color.border.error.subtle}`,
    borderRadius: radius.md,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `all ${duration.normal} ${easing.smooth}`,
  } satisfies CSSProperties,

  live: {
    background: 'rgba(229,57,53,0.12)',
    color: color.status.live,
    border: `1px solid ${color.border.red.medium}`,
    borderRadius: radius.md,
    fontWeight: font.weight.bold,
    cursor: 'pointer',
    transition: `all ${duration.normal} ${easing.smooth}`,
  } satisfies CSSProperties,
} as const;

// ─── Badges / Pills ───────────────────────────────────────────────────────────

export const badge = {
  gold: {
    background: 'rgba(212,175,55,0.12)',
    color: color.gold[400],
    border: `1px solid ${color.border.gold.subtle}`,
    borderRadius: radius.full,
    fontWeight: font.weight.bold,
  } satisfies CSSProperties,

  goldStrong: {
    background: 'rgba(212,175,55,0.20)',
    color: color.gold[400],
    border: `1px solid ${color.border.gold.medium}`,
    borderRadius: radius.full,
    fontWeight: font.weight.bold,
  } satisfies CSSProperties,

  live: {
    background: 'rgba(229,57,53,0.15)',
    color: color.status.live,
    border: `1px solid ${color.border.red.subtle}`,
    borderRadius: radius.full,
    fontWeight: font.weight.bold,
  } satisfies CSSProperties,

  success: {
    background: 'rgba(34,197,94,0.12)',
    color: '#4ade80',
    border: `1px solid ${color.border.success.subtle}`,
    borderRadius: radius.full,
    fontWeight: font.weight.bold,
  } satisfies CSSProperties,

  muted: {
    background: 'rgba(255,255,255,0.05)',
    color: color.text.tertiary,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.full,
    fontWeight: font.weight.semibold,
  } satisfies CSSProperties,

  new: {
    background: 'rgba(212,175,55,0.15)',
    color: color.gold[400],
    border: `1px solid ${color.border.gold.medium}`,
    borderRadius: radius.sm,
    fontWeight: font.weight.bold,
  } satisfies CSSProperties,
} as const;

/** Returns the badge style for a given subscription tier */
export const tierBadge = (tier: string): CSSProperties => {
  const t = tier as Tier;
  const meta = tierMeta[t] ?? tierMeta.free;
  return {
    background: meta.bg,
    color: meta.color,
    border: `1px solid ${meta.border}`,
    borderRadius: radius.full,
    fontWeight: font.weight.bold,
  };
};

// ─── Text ─────────────────────────────────────────────────────────────────────

export const text = {
  primary:   { color: color.text.primary }   satisfies CSSProperties,
  secondary: { color: color.text.secondary } satisfies CSSProperties,
  tertiary:  { color: color.text.tertiary }  satisfies CSSProperties,
  disabled:  { color: color.text.disabled }  satisfies CSSProperties,
  muted:     { color: color.text.muted }     satisfies CSSProperties,
  gold:      { color: color.gold[400] }      satisfies CSSProperties,
  goldLight: { color: color.gold[200] }      satisfies CSSProperties,
  live:      { color: color.status.live }    satisfies CSSProperties,
  success:   { color: color.status.success } satisfies CSSProperties,
  error:     { color: color.status.errorFg } satisfies CSSProperties,

  /** Display headline — Syne Black */
  display: {
    fontFamily: font.family.display,
    fontWeight: font.weight.black,
    lineHeight: 1.1,
  } satisfies CSSProperties,

  /** Logo / wordmark */
  logo: {
    fontFamily: font.family.display,
    fontWeight: font.weight.black,
    letterSpacing: font.tracking.widest,
  } satisfies CSSProperties,
} as const;

// ─── Input ────────────────────────────────────────────────────────────────────

export const input = {
  default: {
    background: 'rgba(0,0,0,0.60)',
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    color: color.text.primary,
    outline: 'none',
    fontFamily: font.family.body,
    transition: `border ${duration.fast} ${easing.smooth}, box-shadow ${duration.fast} ${easing.smooth}`,
  } satisfies CSSProperties,
} as const;

// ─── Dividers ─────────────────────────────────────────────────────────────────

export const divider = {
  default: { borderTop: `1px solid ${color.border.default}` }   satisfies CSSProperties,
  subtle:  { borderTop: `1px solid ${color.border.subtle}` }    satisfies CSSProperties,
  gold:    { borderTop: `1px solid ${color.border.gold.subtle}` } satisfies CSSProperties,
} as const;

// ─── Overlay helpers ──────────────────────────────────────────────────────────

/** Cover a container with a semi-transparent dark overlay */
export const overlay = {
  dark:   { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' } satisfies CSSProperties,
  darker: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.80)' } satisfies CSSProperties,
} as const;
