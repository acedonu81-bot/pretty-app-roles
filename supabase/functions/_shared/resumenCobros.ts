// Datos de cobros para el panel admin (23 nov 2026): cruza los cobros y devoluciones
// de Stripe con los perfiles de XPEAK y calcula el resumen. Lógica pura, sin red,
// para poder probarla.

export type TipoMovimiento = 'cobro' | 'devolucion' | 'fallido' | 'disputa';

export interface Persona { user_id: string; nombre: string | null; email: string | null }

export interface Movimiento {
  id: string;
  fecha: string;          // ISO
  tipo: TipoMovimiento;
  importe: number;        // céntimos; las devoluciones en negativo
  concepto: string;
  persona: Persona | null;
  enlace: string;         // ficha del pago en Stripe
}

// Lo mínimo que se usa de los objetos de Stripe.
export interface CargoStripe {
  id: string; created: number; amount: number; status: string; customer: string | null;
  payment_intent: string | null; description: string | null; disputed?: boolean;
  failure_message?: string | null;
}
export interface DevolucionStripe { id: string; created: number; amount: number; status: string; charge: string | null }
export interface SuscripcionStripe {
  status: string;
  items: { data: { quantity?: number | null; price: { unit_amount: number | null; recurring: { interval: string } | null; product: string | { id: string } } }[] };
  discount?: unknown;
}

const PANEL = 'https://dashboard.stripe.com';
const enlacePago = (c: CargoStripe) => `${PANEL}/payments/${c.payment_intent ?? c.id}`;
const iso = (s: number) => new Date(s * 1000).toISOString();

export function construirMovimientos(
  cargos: CargoStripe[],
  devoluciones: DevolucionStripe[],
  personaDeCliente: (customer: string | null) => Persona | null,
): Movimiento[] {
  const porId = new Map(cargos.map(c => [c.id, c]));
  const lista: Movimiento[] = [];
  for (const c of cargos) {
    const persona = personaDeCliente(c.customer);
    const concepto = c.description ?? 'Suscripción XPEAK';
    if (c.status === 'succeeded') {
      lista.push({ id: c.id, fecha: iso(c.created), tipo: 'cobro', importe: c.amount, concepto, persona, enlace: enlacePago(c) });
      if (c.disputed) lista.push({ id: `${c.id}:disputa`, fecha: iso(c.created), tipo: 'disputa', importe: 0, concepto: 'El cliente ha abierto una disputa con su banco', persona, enlace: enlacePago(c) });
    } else if (c.status === 'failed') {
      lista.push({ id: c.id, fecha: iso(c.created), tipo: 'fallido', importe: c.amount, concepto: c.failure_message ?? 'Pago rechazado', persona, enlace: enlacePago(c) });
    }
  }
  for (const d of devoluciones) {
    if (d.status === 'failed' || d.status === 'canceled') continue;
    const c = d.charge ? porId.get(d.charge) : undefined;
    lista.push({
      id: d.id, fecha: iso(d.created), tipo: 'devolucion', importe: -d.amount,
      concepto: 'Devolución', persona: c ? personaDeCliente(c.customer) : null,
      enlace: c ? enlacePago(c) : `${PANEL}/refunds/${d.id}`,
    });
  }
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Ingreso mensual recurrente: suscripciones vivas, el anual repartido en 12 meses.
// Precio de tarifa (sin cupones), en céntimos.
export function ingresoMensual(subs: SuscripcionStripe[]): number {
  let total = 0;
  for (const s of subs) {
    if (s.status !== 'active' && s.status !== 'past_due') continue;
    for (const it of s.items.data) {
      const importe = (it.price.unit_amount ?? 0) * (it.quantity ?? 1);
      total += it.price.recurring?.interval === 'year' ? importe / 12 : importe;
    }
  }
  return Math.round(total);
}

// Mes natural de Madrid de una fecha ISO, como "2026-11".
export const mesMadrid = (fecha: string | Date) =>
  new Date(fecha).toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' }).slice(0, 7);

export function resumenDelMes(movs: Movimiento[], ahora = new Date()) {
  const mes = mesMadrid(ahora);
  const delMes = movs.filter(m => mesMadrid(m.fecha) === mes);
  const cobrado = delMes.filter(m => m.tipo === 'cobro').reduce((s, m) => s + m.importe, 0);
  const devuelto = -delMes.filter(m => m.tipo === 'devolucion').reduce((s, m) => s + m.importe, 0);
  return {
    mes,
    cobrado,
    devuelto,
    neto: cobrado - devuelto,
    cobros: delMes.filter(m => m.tipo === 'cobro').length,
    fallidos: delMes.filter(m => m.tipo === 'fallido').length,
    disputas: delMes.filter(m => m.tipo === 'disputa').length,
  };
}
