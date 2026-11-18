// Descuento por amigos (referidos). Sin red: Stripe y la base de datos llegan
// inyectados para poder probarlo con Vitest.
// 1 amigo que paga = 10 %, 2 o más = 20 % (tope), desde el siguiente cobro.

export const ESTADOS_QUE_PAGAN = ['active', 'trialing', 'past_due'];

type Env = Record<string, string | undefined>;

export function cuponReferidoPara(amigos: number, env: Env): string | null {
  if (amigos >= 2) return env.STRIPE_CUPON_REFERIDO_20 ?? null;
  if (amigos === 1) return env.STRIPE_CUPON_REFERIDO_10 ?? null;
  return null;
}

export const cuponesReferido = (env: Env) =>
  [env.STRIPE_CUPON_REFERIDO_10, env.STRIPE_CUPON_REFERIDO_20].filter((c): c is string => !!c);

export interface DepsReferidos {
  suscripcionDe(userId: string): Promise<{ stripe_subscription_id: string | null; estado: string | null } | null>;
  amigosQuePagan(userId: string): Promise<number>;
  // Cupón de referido que lleva ahora la suscripción en Stripe (o null).
  cuponReferidoActual(subscriptionId: string): Promise<string | null>;
  // Pone el cupón de referido (o lo quita con null) sin tocar otros descuentos.
  ponerCuponReferido(subscriptionId: string, cupon: string | null): Promise<void>;
}

export type ResultadoReferidos = 'sin_suscripcion' | 'sin_cupones' | 'igual' | 'cambiado';

export async function aplicarDescuentoReferidos(userId: string, d: DepsReferidos, env: Env): Promise<ResultadoReferidos> {
  if (cuponesReferido(env).length < 2) return 'sin_cupones';
  const s = await d.suscripcionDe(userId);
  if (!s?.stripe_subscription_id || !ESTADOS_QUE_PAGAN.includes(s.estado ?? '')) return 'sin_suscripcion';
  const quiero = cuponReferidoPara(await d.amigosQuePagan(userId), env);
  const tengo = await d.cuponReferidoActual(s.stripe_subscription_id);
  // Sin cambio no se toca Stripe: evita un bucle (cada cambio genera otro aviso).
  if (quiero === tengo) return 'igual';
  await d.ponerCuponReferido(s.stripe_subscription_id, quiero);
  return 'cambiado';
}
