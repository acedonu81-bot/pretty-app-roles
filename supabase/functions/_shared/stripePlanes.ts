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
