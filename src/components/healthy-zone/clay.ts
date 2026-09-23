import type { CSSProperties } from 'react';
import type { HZTone } from '@/data/healthyZone';

// Estilo claymorphism de la Healthy Zone: verde + azul cielo, volúmenes
// inflados con sombra exterior + doble sombra interior. Diseño aprobado en
// https://claude.ai/artifact/GwmFu3MPAZsSZ2JgHMhJ9m (board "A2. Parque clay").

export const HZ = {
  bg: '#EAF6EF',
  surface: '#F7FCF9',
  ink: '#12302A',
  inkSoft: '#3B4F49',
  green: '#1F8A5B',
  blue: '#2477B3',
  sky: '#C9E9F8',
  inputBg: '#E4F2EA',
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Nunito Sans', sans-serif",
  fontsHref:
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap',
};

// Sombra clay: exterior teñida del color de la pieza + luz y sombra interiores.
export function clay(rgb: string, size: 'sm' | 'md' | 'lg' = 'md'): CSSProperties['boxShadow'] {
  const s = { sm: [5, 6, 12, 3], md: [12, 14, 28, 8], lg: [18, 22, 44, 12] }[size];
  return `${s[0]}px ${s[1]}px ${s[2]}px rgba(${rgb},0.2), inset -${s[3]}px -${s[3]}px ${s[3] * 2}px rgba(${rgb},0.12), inset ${s[3]}px ${s[3]}px ${s[3] * 2}px rgba(255,255,255,0.8)`;
}

// Botón inflado sobre color sólido.
export const clayButton = (rgb: string): CSSProperties['boxShadow'] =>
  `6px 8px 16px rgba(${rgb},0.38), inset -4px -5px 10px rgba(0,0,0,0.2), inset 4px 4px 10px rgba(255,255,255,0.35)`;

// Campo hundido.
export const clayInset: CSSProperties['boxShadow'] =
  'inset 5px 5px 10px rgba(31,96,70,0.14), inset -5px -5px 10px rgba(255,255,255,0.9)';

export const GREEN_RGB = '31,138,91';
export const BLUE_RGB = '36,119,179';
export const SURFACE_RGB = '31,96,70';

export const TONES: Record<HZTone, { card: string; bubble: string; stroke: string; rgb: string }> = {
  sun: { card: '#FFEFC2', bubble: '#FFD86E', stroke: '#7A5200', rgb: '201,138,0' },
  sky: { card: '#CFEAFA', bubble: '#8CCBEE', stroke: '#0F4A75', rgb: '36,119,179' },
  leaf: { card: '#C8EED8', bubble: '#7FD3A4', stroke: '#0F4F33', rgb: '31,138,91' },
  lilac: { card: '#DCE3FB', bubble: '#A9B8F5', stroke: '#28357A', rgb: '74,95,193' },
};
