/**
 * XPEAK Design System — public API
 *
 * Import anything you need from '@/design':
 *
 *   import { color, font, radius, shadow, gradient, duration, easing } from '@/design';      // tokens
 *   import { surface, btn, badge, tierBadge, text, input, divider, overlay } from '@/design'; // theme factory
 *   import { BRAND_NAME, BRAND_VOICE, COPY, NAV_LABELS, tierLabel, CITIES_ES } from '@/design'; // brand
 */

// Tokens (primitive values)
export {
  color,
  font,
  space,
  radius,
  shadow,
  gradient,
  duration,
  easing,
  TIER_ORDER,
  tierMeta,
  roleMeta,
} from './tokens';
export type { Tier } from './tokens';

// Theme factory (component style objects)
export {
  surface,
  btn,
  badge,
  tierBadge,
  text,
  input,
  divider,
  overlay,
} from './theme';

// Brand guidelines
export {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_REGION,
  BRAND_LANG,
  BRAND_WORDMARK_PLAIN,
  BRAND_IDENTITY,
  BRAND_VOICE,
  BRAND_LEGAL,
  COPY,
  NAV_LABELS,
  TIER_LABELS,
  tierLabel,
  CITIES_ES,
} from './brand';
export type { CityES } from './brand';
