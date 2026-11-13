// Lógica pura de planes de pago. Sin imports de Deno ni npm: la usan
// las Edge Functions y Vitest.

export type PlanPago = 'starter' | 'business';
export type Ciclo = 'mensual' | 'anual';
type Env = Record<string, string | undefined>;

const PLANES: PlanPago[] = ['starter', 'business'];
const CICLOS: Ciclo[] = ['mensual', 'anual'];

const claveDe = (plan: PlanPago, ciclo: Ciclo) =>
  `STRIPE_PRICE_${plan.toUpperCase()}_${ciclo.toUpperCase()}`;

export function esPlanPago(x: unknown): x is PlanPago {
  return PLANES.includes(x as PlanPago);
}
export function esCiclo(x: unknown): x is Ciclo {
  return CICLOS.includes(x as Ciclo);
}

export function priceIdDe(plan: PlanPago, ciclo: Ciclo, env: Env): string {
  const id = env[claveDe(plan, ciclo)];
  if (!id) throw new Error(`Falta el secreto ${claveDe(plan, ciclo)}`);
  return id;
}

export function planDesdePriceId(priceId: string, env: Env): { plan: PlanPago; ciclo: Ciclo } | null {
  for (const plan of PLANES) for (const ciclo of CICLOS) {
    if (env[claveDe(plan, ciclo)] === priceId) return { plan, ciclo };
  }
  return null;
}

// past_due: Stripe sigue reintentando el cobro, se conserva el plan.
const ESTADOS_CON_PLAN = ['active', 'trialing', 'past_due'];
export function tierDesdeEstado(estado: string, plan: PlanPago): 'free' | PlanPago {
  return ESTADOS_CON_PLAN.includes(estado) ? plan : 'free';
}

const NO_PROFESIONALES = ['empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending'];
export function esProfesional(p: { role: string | null; roles: string[] | null }): boolean {
  const todos = [p.role, ...(p.roles ?? [])].filter((r): r is string => !!r);
  return todos.some(r => !NO_PROFESIONALES.includes(r));
}

const MUSICA = ['dj', 'grupo-musical', 'disco-movil'];
export function esMusica(role: string | null): boolean {
  return !!role && MUSICA.includes(role);
}

// Black Friday 2026: del viernes 27 nov 00:00 al domingo 30 nov 23:59, hora de Madrid (UTC+1).
export const INICIO_BLACK_FRIDAY = new Date('2026-11-26T23:00:00Z');
export const FIN_BLACK_FRIDAY = new Date('2026-11-30T23:00:00Z');

// Cupón del primer año del plan anual: 15 % normal (ANUAL1) o 20 % más en Black Friday (BF).
// Son cupones de importe fijo por plan, para que el total cuadre al céntimo.
export function cuponDe(plan: PlanPago, ciclo: Ciclo, ahora: Date, env: Env): string | null {
  if (ciclo !== 'anual') return null;
  const bf = ahora >= INICIO_BLACK_FRIDAY && ahora < FIN_BLACK_FRIDAY;
  const clave = `STRIPE_CUPON_${plan.toUpperCase()}_${bf ? 'BF' : 'ANUAL1'}`;
  const id = env[clave];
  if (!id) throw new Error(`Falta el secreto ${clave}`);
  return id;
}
