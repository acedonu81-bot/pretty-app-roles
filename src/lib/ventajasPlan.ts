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
  redesVisibles: boolean;    // Instagram, TikTok y Facebook en la ficha pública (Facebook desde el 25 nov 2026)
  estadisticas: Estadisticas;
  exportarEstadisticas: boolean;
  bannerCabecera: boolean;   // banner propio en la cabecera de artista (solo DJ)
  destacadoInicio: boolean;  // sale en la tarjeta del Inicio del panel
  posicionDestacada: boolean; // por delante en el directorio, con aro dorado y etiqueta Destacado
  publicacionesRedesMes: number; // publicaciones al mes en las redes de XPEAK (manual)
  directosMes: number;        // directos al mes en XPEAK (23 nov 2026; el límite aún no se aplica)
  trayectoriaConfirmada: boolean; // pedir al organizador que confirme eventos y sello en la ficha
};

const VENTAJAS: Record<Plan, Ventajas> = {
  starter: {
    fotos: 12, sets: 10, redesVisibles: true,
    estadisticas: 'basicas', exportarEstadisticas: false, bannerCabecera: false,
    destacadoInicio: false, posicionDestacada: false, publicacionesRedesMes: 1, directosMes: 1, trayectoriaConfirmada: false,
  },
  business: {
    fotos: 20, sets: Infinity, redesVisibles: true,
    estadisticas: 'avanzadas', exportarEstadisticas: true, bannerCabecera: true,
    destacadoInicio: true, posicionDestacada: true, publicacionesRedesMes: 3, directosMes: 5, trayectoriaConfirmada: true,
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
    if (o.flash) out.push('Ofertas Flash Booking: trabajos urgentes que publican los organizadores y te llegan al momento');
    out.push('Tu Instagram, TikTok y Facebook en tu ficha: quien te visita puede seguirte sin tener que escribirte antes', 'Estadísticas de visitas y mensajes');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push(`Hasta ${v.sets} sets en tu perfil`);
    out.push(`${v.directosMes} directo al mes en XPEAK`, `${v.publicacionesRedesMes} publicación al mes en las redes de XPEAK`, 'Concursos y sorteos de XPEAK');
  } else {
    out.push('Todo lo de Profesional, más:', 'Posición destacada en el directorio, con aro dorado', 'Sales destacado en el Inicio de XPEAK', `${v.publicacionesRedesMes} publicaciones al mes en las redes de XPEAK`, `${v.directosMes} directos al mes en XPEAK`);
    // Con los cobros apagados nadie puede pedir confirmaciones: no se anuncia.
    if (opciones.cobros !== false) out.push('Sello de eventos confirmados en tu ficha');
    out.push('Estadísticas avanzadas: visitas día a día, de dónde llegan y exportar');
    out.push(`Portafolio de ${v.fotos} fotos y vídeos`);
    if (o.musica) out.push('Sets ilimitados');
    if (o.banner) out.push('Banner propio en tu cabecera de artista');
    // Concursos y sorteos ya van en "Todo lo de Profesional": no se repiten aquí.
    out.push('Soporte prioritario: escribe directamente al equipo de XPEAK');
  }
  return out;
}

// Nivel base: quien no paga y no es fundador, tras el lanzamiento (decisión del 22 nov
// 2026). No se vende ni se anuncia como plan; es lo que tiene sin pagar. Los límites son
// los de limites_de('free') en la BD: 6 fotos y vídeos, 3 sets.
export const BASE = { fotos: 6, sets: 3 };
export function listaBase(o: Oficios): string[] {
  const out = ['Perfil en el directorio', 'Verificación de perfil', 'Mensajes y reseñas'];
  if (o.flash) out.push('Ofertas Flash Booking: trabajos urgentes que publican los organizadores y te llegan al momento');
  out.push('Visitas a tu ficha este mes', `Portafolio de ${BASE.fotos} fotos y vídeos`);
  if (o.musica) out.push(`Hasta ${BASE.sets} sets en tu perfil`);
  out.push('Concursos de XPEAK');
  return out;
}

// Ventajas decididas que aún NO existen: se enseñan con la etiqueta "Próximamente"
// (18 nov 2026, decisión de Daniel). Al construirlas, pasan a listaVentajas.
export function proximamente(plan: Plan, o: Oficios): string[] {
  const out: string[] = [];
  if (plan === 'starter') {
    // Comunes a los dos planes: en Premium ya van dentro de "Todo lo de Profesional".
    out.push('Avisos por WhatsApp de mensajes, reseñas, solicitudes de particulares y ofertas de organizadores');
    if (o.flash) out.push('Flash Booking con adelanto');
  } else if (plan === 'business') {
    if (o.flash) out.push('Flash Booking con el mayor adelanto');
    out.push('Tu directo se ve en vídeo en el Inicio de XPEAK, no solo como aviso');
  }
  return out;
}

// Solo en los planes anuales (23 nov 2026): el envío necesita la dirección, que pide el pago.
export function ventajasAnual(): string[] {
  return ['Regalo de bienvenida: te enviamos un detalle de merchandising de XPEAK'];
}
