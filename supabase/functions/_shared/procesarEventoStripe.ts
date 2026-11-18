// Procesa un evento de Stripe sin tocar la red: la base de datos llega
// inyectada (DbStripe) para poder probarlo con Vitest.
import { planDesdePriceId, tierDesdeEstado, type PlanPago, type Ciclo } from './stripePlanes.ts';

export interface EventoStripe {
  id: string;
  type: string;
  created: number;
  data: { object: any };
}

export interface FilaSuscripcion {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: PlanPago;
  ciclo: Ciclo;
  estado: string;
  periodo_fin: string | null;
  cancela_al_final: boolean;
  stripe_evento_at: string;
  // Huella de la tarjeta (Stripe): para que un amigo con la misma tarjeta no cuente como referido.
  tarjeta_huella?: string;
}

export interface DbStripe {
  registrarEvento(id: string, tipo: string): Promise<boolean>;
  leerSuscripcion(userId: string): Promise<{ stripe_evento_at: string | null } | null>;
  userIdDeCustomer(customerId: string): Promise<string | null>;
  guardarSuscripcion(fila: FilaSuscripcion): Promise<void>;
  ponerTierEnPerfiles(userId: string, tier: string): Promise<void>;
}

// Huella de la tarjeta con la que se cobra: la de la suscripción o, si no tiene, la
// predeterminada del cliente. Si no se puede saber, no se toca la guardada (no se borra con null).
export function huellaTarjeta(s: any): string | null {
  const pm = (typeof s.default_payment_method === 'object' && s.default_payment_method)
    || (typeof s.customer === 'object' && s.customer?.invoice_settings?.default_payment_method);
  const f = pm && typeof pm === 'object' ? pm.card?.fingerprint : null;
  return typeof f === 'string' ? f : null;
}

export type Resultado = 'procesado' | 'duplicado' | 'ignorado' | 'viejo';

const TIPOS_SUSCRIPCION = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
];

export async function procesarEventoStripe(
  evento: EventoStripe,
  db: DbStripe,
  env: Record<string, string | undefined>,
  // Estado ACTUAL de la suscripción en Stripe. Stripe fecha sus avisos al segundo y puede
  // entregar "created" (incompleta) después de "updated" (activa) en el primer pago; con el
  // estado leído al procesar, el orden de llegada ya no importa (18 nov 2026, prueba real).
  leerActual?: (subscriptionId: string) => Promise<any>,
): Promise<Resultado> {
  if (!TIPOS_SUSCRIPCION.includes(evento.type)) return 'ignorado';

  const payload = evento.data.object;
  const s = leerActual && evento.type !== 'customer.subscription.deleted' ? await leerActual(payload.id) : payload;
  const item = s.items?.data?.[0];
  const plan = planDesdePriceId(item?.price?.id ?? '', env);
  if (!plan) throw new Error(`Price desconocido: ${item?.price?.id}`);

  const customerId = typeof s.customer === 'object' ? s.customer?.id : s.customer;
  const userId = s.metadata?.user_id || (await db.userIdDeCustomer(customerId));
  if (!userId) throw new Error(`Sin usuario para el cliente ${s.customer}`);

  // Se registra después de validar: si falla, Stripe reintenta y se vuelve a procesar.
  if (!(await db.registrarEvento(evento.id, evento.type))) return 'duplicado';

  const eventoAt = new Date(evento.created * 1000).toISOString();
  const previa = await db.leerSuscripcion(userId);
  if (previa?.stripe_evento_at && previa.stripe_evento_at > eventoAt) return 'viejo';

  const estado = evento.type === 'customer.subscription.deleted' ? 'canceled' : s.status;
  const fin = item?.current_period_end ?? s.current_period_end;
  await db.guardarSuscripcion({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: s.id,
    plan: plan.plan,
    ciclo: plan.ciclo,
    estado,
    periodo_fin: fin ? new Date(fin * 1000).toISOString() : null,
    cancela_al_final: !!s.cancel_at_period_end,
    stripe_evento_at: eventoAt,
    ...(huellaTarjeta(s) ? { tarjeta_huella: huellaTarjeta(s)! } : {}),
  });
  await db.ponerTierEnPerfiles(userId, tierDesdeEstado(estado, plan.plan));
  return 'procesado';
}
