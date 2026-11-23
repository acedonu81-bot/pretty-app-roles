// Qué incluye cada plan: ÚNICA fuente de verdad (18 nov 2026, decisiones del 13 nov
// y auditoría del 18 nov). Cualquier límite o ventaja se consulta aquí; nunca se
// compara el tier a mano.
//
// Solo figura lo que EXISTE y funciona. Ventajas decididas pero aún sin construir
// (no se anuncian hasta que existan; al construirlas, se añaden aquí y a "Mi plan"):
//   avisos por WhatsApp de trabajo y Flash con adelanto (salen como "Próximamente",
//   ver proximamente()), verificación ampliada y sorteos (manuales), referidos.
// DESCARTADOS (18 nov 2026, Daniel): ficha con vídeo de fondo y links de sesión.
//
// Solo hay DOS planes: Profesional (starter) y Premium (business). No existe plan
// gratuito ni "Esencial" (decisión del 22 nov 2026). Quien no tiene suscripción de pago
// (tier 'free' en la base de datos: los perfiles actuales, que son fundadores un año)
// cuenta como Profesional. Agencia está fuera: los tiers antiguos (premium, agency,
// elite) se tratan como Premium para no quitar nada a nadie.

export type Plan = 'starter' | 'business';

// Cuenta oficial "XPEAK EVENTOS": el soporte prioritario de Premium es escribirle directamente.
export const CUENTA_XPEAK_ID = 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';

export const NOMBRE_PLAN: Record<Plan, string> = { starter: 'Profesional', business: 'Premium' };

export function planDe(tier: string | null | undefined): Plan {
  if (tier === 'business' || tier === 'premium' || tier === 'agency' || tier === 'elite') return 'business';
  return 'starter';
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
  posicionDestacada: boolean; // por delante en el directorio, con aro dorado y etiqueta Destacado
  redesXpeakMensual: boolean; // aparece una vez al mes en las redes de XPEAK (manual)
  trayectoriaConfirmada: boolean; // pedir al organizador que confirme eventos y sello en la ficha
};

const VENTAJAS: Record<Plan, Ventajas> = {
  starter: {
    fotos: 12, sets: 10, redesVisibles: true,
    estadisticas: 'basicas', exportarEstadisticas: false, bannerCabecera: false,
    destacadoInicio: false, posicionDestacada: false, redesXpeakMensual: false, trayectoriaConfirmada: false,
  },
  business: {
    fotos: 20, sets: Infinity, redesVisibles: true,
    estadisticas: 'avanzadas', exportarEstadisticas: true, bannerCabecera: true,
    destacadoInicio: true, posicionDestacada: true, redesXpeakMensual: true, trayectoriaConfirmada: true,
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
export function listaVentajas(plan: Plan, o: Oficios, opciones: { cobros?: boolean } = {}): string[] {
  const v = VENTAJAS[plan];
  const out: string[] = [];
  if (plan === 'starter') {
    out.push('Perfil en el directorio', 'Verificación de perfil', 'Mensajes y reseñas');
    if (o.flash) out.push('Ofertas Flash Booking');
    out.push('Tu Instagram y TikTok visibles para todos en tu ficha, sin que tengan que escribirte', 'Estadísticas de visitas y mensajes');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push(`Hasta ${v.sets} sets en tu perfil`);
  } else {
    out.push('Todo lo de Profesional', 'Posición destacada en el directorio, con aro dorado', 'Sales destacado en el Inicio de XPEAK', 'Apareces una vez al mes en las redes de XPEAK');
    // Con los cobros apagados nadie puede pedir confirmaciones: no se anuncia.
    if (opciones.cobros !== false) out.push('Sello de eventos confirmados en tu ficha');
    out.push('Estadísticas avanzadas: visitas día a día, de dónde llegan y exportar');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push('Sets ilimitados');
    if (o.banner) out.push('Banner propio en tu cabecera de artista');
    out.push('Soporte prioritario: escribe directamente al equipo de XPEAK');
  }
  return out;
}

// Ventajas decididas que aún NO existen: se enseñan con la etiqueta "Próximamente"
// (18 nov 2026, decisión de Daniel). Al construirlas, pasan a listaVentajas.
export function proximamente(plan: Plan, o: Oficios): string[] {
  const out: string[] = [];
  if (plan === 'starter') {
    out.push('Avisos por WhatsApp de trabajo: solicitudes de particulares y ofertas de organizadores');
    if (o.flash) out.push('Flash Booking con adelanto');
  } else if (plan === 'business') {
    if (o.flash) out.push('Flash Booking con el mayor adelanto');
  }
  return out;
}
