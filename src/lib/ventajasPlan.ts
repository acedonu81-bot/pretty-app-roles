// Qué incluye cada plan: ÚNICA fuente de verdad (18 nov 2026, decisiones del 13 nov).
// Cualquier límite o ventaja se consulta aquí; nunca se compara el tier a mano.
// Los nombres internos siguen siendo free / starter / business; los públicos son
// Esencial / Profesional / Premium. Agencia está fuera: los tiers antiguos
// (premium, agency, elite) se tratan como Premium para no quitar nada a nadie.

export type Plan = 'free' | 'starter' | 'business';

export const NOMBRE_PLAN: Record<Plan, string> = { free: 'Esencial', starter: 'Profesional', business: 'Premium' };

export function planDe(tier: string | null | undefined): Plan {
  if (tier === 'starter') return 'starter';
  if (tier === 'business' || tier === 'premium' || tier === 'agency' || tier === 'elite') return 'business';
  return 'free';
}

export const nombrePlan = (tier: string | null | undefined) => NOMBRE_PLAN[planDe(tier)];

export type Estadisticas = 'ninguna' | 'basicas' | 'avanzadas';

export type Ventajas = {
  fotos: number;
  sets: number;            // Infinity = ilimitados
  linksSesion: number;     // Infinity = ilimitados
  redesVisibles: boolean;  // Instagram, TikTok y web en la ficha pública
  estadisticas: Estadisticas;
  exportarEstadisticas: boolean;
  videoFondo: boolean;
  destacadoInicio: boolean;
  posicionDestacada: boolean; // aro dorado y orden en el directorio
  avisosWhatsapp: boolean;
  verificacionAmpliada: boolean;
  flashAdelanto: 'ninguno' | 'adelanto' | 'mayor';
  prioridadComunicados: boolean;
  redesXpeakMensual: boolean;
  soportePrioritario: boolean;
  sorteos: boolean;
};

const VENTAJAS: Record<Plan, Ventajas> = {
  free: {
    fotos: 6, sets: 3, linksSesion: 1, redesVisibles: false,
    estadisticas: 'ninguna', exportarEstadisticas: false, videoFondo: false,
    destacadoInicio: false, posicionDestacada: false, avisosWhatsapp: false,
    verificacionAmpliada: false, flashAdelanto: 'ninguno', prioridadComunicados: false,
    redesXpeakMensual: false, soportePrioritario: false, sorteos: false,
  },
  starter: {
    fotos: 12, sets: 10, linksSesion: 3, redesVisibles: true,
    estadisticas: 'basicas', exportarEstadisticas: false, videoFondo: false,
    destacadoInicio: false, posicionDestacada: false, avisosWhatsapp: true,
    verificacionAmpliada: true, flashAdelanto: 'adelanto', prioridadComunicados: false,
    redesXpeakMensual: false, soportePrioritario: false, sorteos: true,
  },
  business: {
    fotos: 20, sets: Infinity, linksSesion: Infinity, redesVisibles: true,
    estadisticas: 'avanzadas', exportarEstadisticas: true, videoFondo: true,
    destacadoInicio: true, posicionDestacada: true, avisosWhatsapp: true,
    verificacionAmpliada: true, flashAdelanto: 'mayor', prioridadComunicados: true,
    redesXpeakMensual: true, soportePrioritario: true, sorteos: true,
  },
};

export const ventajasDe = (tier: string | null | undefined): Ventajas => VENTAJAS[planDe(tier)];
