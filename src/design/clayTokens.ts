/**
 * Tokens claymorphism para la app nativa (Capacitor).
 * Activos solo bajo body.is-native-app — ver src/index.css.
 * Reutiliza los colores de marca existentes en --nightlife-* (index.css);
 * no introduce colores nuevos.
 */
export const clay = {
  radius: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  },
  accent: {
    gold: '#D4AF37',
    goldDeep: '#B8941E',
    green: '#16a34a',
    red: '#dc2626',
  },
  shadow: {
    light: '-8px -8px 16px rgba(255,255,255,0.9)',
    dark: '10px 10px 22px rgba(150,130,90,0.28)',
    insetLight: 'inset -5px -5px 10px rgba(255,255,255,0.7)',
    insetDark: 'inset 6px 6px 12px rgba(150,130,90,0.20)',
  },
} as const;
