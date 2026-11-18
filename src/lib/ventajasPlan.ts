// Qué incluye cada plan: ÚNICA fuente de verdad (18 nov 2026, decisiones del 13 nov
// y auditoría del 18 nov). Cualquier límite o ventaja se consulta aquí; nunca se
// compara el tier a mano.
//
// Solo figura lo que EXISTE y funciona. Ventajas decididas pero aún sin construir
// (no se anuncian hasta que existan; al construirlas, se añaden aquí y a "Mi plan"):
//   avisos por WhatsApp de trabajo, verificación ampliada, sorteos entre suscriptores,
//   prioridad en comunicados, posición destacada + aro dorado en el directorio,
//   sello Premium, Flash con adelanto, soporte prioritario, vídeo de fondo.
//
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
  fotos: number;             // portafolio: fotos y vídeos juntos
  sets: number;              // Infinity = ilimitados (archivos y enlaces cuentan igual)
  redesVisibles: boolean;    // Instagram y TikTok en la ficha pública
  estadisticas: Estadisticas;
  exportarEstadisticas: boolean;
  bannerCabecera: boolean;   // banner propio en la cabecera de artista (solo DJ)
  destacadoInicio: boolean;  // sale en la tarjeta del Inicio del panel
  redesXpeakMensual: boolean; // aparece una vez al mes en las redes de XPEAK (manual)
};

const VENTAJAS: Record<Plan, Ventajas> = {
  free: {
    fotos: 6, sets: 3, redesVisibles: false,
    estadisticas: 'ninguna', exportarEstadisticas: false, bannerCabecera: false,
    destacadoInicio: false, redesXpeakMensual: false,
  },
  starter: {
    fotos: 12, sets: 10, redesVisibles: true,
    estadisticas: 'basicas', exportarEstadisticas: false, bannerCabecera: false,
    destacadoInicio: false, redesXpeakMensual: false,
  },
  business: {
    fotos: 20, sets: Infinity, redesVisibles: true,
    estadisticas: 'avanzadas', exportarEstadisticas: true, bannerCabecera: true,
    destacadoInicio: true, redesXpeakMensual: true,
  },
};

export const ventajasDe = (tier: string | null | undefined): Ventajas => VENTAJAS[planDe(tier)];

// ── Qué aplica a cada oficio ────────────────────────────────────────────────
// Un oficio solo ve en "Mi plan" lo que de verdad puede usar.

// Música: sets (archivos y enlaces de sesión).
export const ROLES_MUSICA = ['dj', 'grupo-musical', 'disco-movil'];
// Banner de cabecera de artista: solo existe en la ficha del DJ.
export const ROLES_BANNER = ['dj'];
// Reciben ofertas Flash Booking: los oficios del formulario de ofertas
// (flash_rol_ui_a_roles en la BD). Mago, bailarín, humorista, speaker, limpieza,
// azafata... no están en ese formulario y no reciben ofertas.
export const ROLES_CON_FLASH = [
  'dj', 'media', 'staff', 'camarero', 'makeup', 'peluqueria', 'grupo-musical', 'disco-movil',
  'animador', 'promotor', 'photo-booth', 'catering', 'food-truck', 'tecnico', 'alquiler',
];
// No son profesionales: no tienen plan de pago.
export const ROLES_NO_PROFESIONALES = ['empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending'];

export type Oficios = { profesional: boolean; musica: boolean; banner: boolean; flash: boolean };

export function oficiosDe(roles: Array<string | null | undefined>): Oficios {
  const r = roles.filter((x): x is string => !!x);
  return {
    profesional: r.some(x => !ROLES_NO_PROFESIONALES.includes(x)),
    musica: r.some(x => ROLES_MUSICA.includes(x)),
    banner: r.some(x => ROLES_BANNER.includes(x)),
    flash: r.some(x => ROLES_CON_FLASH.includes(x)),
  };
}

// Lista de ventajas de un plan para un conjunto de oficios.
export function listaVentajas(plan: Plan, o: Oficios): string[] {
  const v = VENTAJAS[plan];
  const out: string[] = [];
  if (plan === 'free') {
    out.push('Perfil en el directorio', 'Verificación de perfil', 'Mensajes y reseñas');
    if (o.flash) out.push('Ofertas Flash Booking');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push(`Hasta ${v.sets} sets en tu perfil`);
  } else if (plan === 'starter') {
    out.push('Todo lo de Esencial', 'Tu Instagram y TikTok visibles en tu ficha', 'Estadísticas de visitas y mensajes');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push(`Hasta ${v.sets} sets en tu perfil`);
  } else {
    out.push('Todo lo de Profesional', 'Sales destacado en el Inicio de XPEAK', 'Apareces una vez al mes en las redes de XPEAK');
    out.push('Estadísticas avanzadas: visitas día a día, de dónde llegan y exportar');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push('Sets ilimitados');
    if (o.banner) out.push('Banner propio en tu cabecera de artista');
  }
  return out;
}
