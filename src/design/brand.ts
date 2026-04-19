/**
 * XPEAK Brand Guidelines
 * Codified brand identity — voice, copy rules, and structural constants.
 * Use these for consistent messaging across the platform.
 */

// ─── Core Identity ────────────────────────────────────────────────────────────

export const BRAND_NAME = 'XPEAK' as const;
export const BRAND_TAGLINE = 'El Directorio Profesional de la Noche' as const;
export const BRAND_REGION = 'Europa · España' as const;
export const BRAND_LANG = 'es' as const;

/** The brand wordmark as rendered in UI — never modify the gradient span */
export const BRAND_WORDMARK_PLAIN = 'XPEAK' as const;

// ─── Visual Identity ──────────────────────────────────────────────────────────

export const BRAND_IDENTITY = {
  primaryFont:   'Syne Variable',
  secondaryFont: 'Inter Variable',
  primaryColor:  '#D4AF37',
  darkColor:     '#060606',
  accentLive:    '#E53935',
  mood:          'luxury-minimal',
  grain:         true,
} as const;

// ─── Voice & Tone ─────────────────────────────────────────────────────────────

export const BRAND_VOICE = {
  /** Address the user informally (tutea) */
  informal: true,
  /** Language code */
  lang: 'es' as const,
  /** No emojis in UI copy */
  emojis: false,
  /** Tone pillars */
  tone: ['directo', 'exclusivo', 'profesional', 'real'] as const,
  /** CTAs should be imperative and short */
  ctaStyle: 'imperative-short' as const,
} as const;

// ─── Copy Templates ───────────────────────────────────────────────────────────

export const COPY = {
  /** Empty state messages */
  empty: {
    default:       'Sin resultados',
    noProfiles:    'Aún no hay profesionales registrados en esta categoría.',
    noMessages:    'Sin mensajes todavía.',
    noStats:       'Aún no tienes actividad que mostrar.',
    noResults: (city: string) => `Sin resultados en ${city}. Prueba con otra ciudad.`,
  },

  /** Loading states */
  loading: {
    default:    'Cargando...',
    directory:  'Cargando directorio...',
    messages:   'Cargando conversaciones...',
    profile:    'Cargando perfil...',
    stats:      'Cargando estadísticas...',
  },

  /** Error messages */
  error: {
    generic:    'Ha ocurrido un error. Inténtalo de nuevo.',
    network:    'Error de conexión. Comprueba tu internet.',
    auth:       'Sesión expirada. Por favor, vuelve a iniciar sesión.',
    upload:     'Error al subir el archivo.',
    send:       'No se pudo enviar el mensaje.',
    save:       'No se pudo guardar. Inténtalo de nuevo.',
  },

  /** Success messages */
  success: {
    saved:      'Cambios guardados.',
    sent:       'Mensaje enviado.',
    uploaded:   'Archivo subido correctamente.',
    deleted:    'Eliminado correctamente.',
    copied:     'Copiado al portapapeles.',
  },

  /** Upgrade nudges */
  upgrade: {
    freeLimit:     'Estás en Free — solo ves una parte del directorio.',
    flashBooking:  'Flash Booking requiere plan Starter o superior.',
    messaging:     'Los mensajes directos requieren plan Starter o superior.',
    streaming:     'El streaming requiere plan Business o superior.',
    analytics:     'Las estadísticas avanzadas requieren plan Business o superior.',
    cta:           'Ver planes',
  },

  /** Trial states */
  trial: {
    notStarted: 'Usa Flash Booking, streaming o sube una sesión para activar tus 15 días gratis',
    active: (days: number) => `Te quedan ${days} ${days === 1 ? 'día' : 'días'} de acceso gratuito`,
    expiring: (days: number) => `¡Solo quedan ${days} ${days === 1 ? 'día' : 'días'}! Suscríbete para no perder el acceso.`,
    expired: 'Tu periodo de prueba ha finalizado. Suscríbete al plan anual y ahorra un 30%.',
  },

  /** Confirmation dialogs */
  confirm: {
    delete: (item: string) => `¿Estás seguro de que quieres eliminar ${item}? Esta acción no se puede deshacer.`,
    logout: '¿Quieres cerrar sesión?',
    cancelSubscription: 'Si cancelas, perderás el acceso a todas las funciones premium al final del periodo de facturación.',
  },
} as const;

// ─── Navigation Labels ────────────────────────────────────────────────────────

export const NAV_LABELS: Record<string, string> = {
  dj:           'DJs & Artistas',
  rookie:       'DJ / Artista Promesa',
  staff:        'Staff & Promoción',
  makeup:       'Maquillaje & Peluquería',
  media:        'Media & Contenido',
  empresario:   'Panel Empresario',
  escenario:    'Escenario Virtual',
  flashbooking: 'Flash Booking',
  topweekend:   'TOP Weekend',
  profile:      'Mi Perfil',
  fanclub:      'Fan Club',
  stats:        'Estadísticas',
  subscription: 'Suscripción',
  calendar:     'Calendario',
  messages:     'Mensajes',
  settings:     'Ajustes',
};

// ─── Subscription Tier Labels ─────────────────────────────────────────────────

export const TIER_LABELS: Record<string, string> = {
  free:     'Free',
  starter:  'Starter',
  business: 'Business',
  premium:  'Business',   // legacy alias
  agency:   'Agencia',
  elite:    'Agencia',    // legacy alias
};

/** Returns the display label for any tier string, including aliases */
export const tierLabel = (tier: string): string => TIER_LABELS[tier] ?? 'Free';

// ─── Geo ──────────────────────────────────────────────────────────────────────

export const CITIES_ES = [
  'Todas las ciudades',
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
  'Málaga', 'Ibiza', 'Palma de Mallorca', 'Zaragoza',
  'Murcia', 'Alicante', 'Granada',
] as const;

export type CityES = typeof CITIES_ES[number];

// ─── Legal ────────────────────────────────────────────────────────────────────

export const BRAND_LEGAL = {
  company:        'XPEAK SL',
  country:        'España',
  gdprCompliant:  true,
  cookieVersion:  '1.0',
  privacyUrl:     '/privacidad',
  termsUrl:       '/terminos',
  cookieUrl:      '/cookies',
  supportWhatsApp:'https://wa.me/34600000000?text=Hola%2C%20necesito%20soporte%20con%20XPEAK',
} as const;
