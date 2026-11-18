// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { procesarEventoStripe, type DbStripe, type FilaSuscripcion, type EventoStripe } from './procesarEventoStripe';

const env = {
  STRIPE_PRICE_STARTER_MENSUAL: 'p_sm', STRIPE_PRICE_STARTER_ANUAL: 'p_sa',
  STRIPE_PRICE_BUSINESS_MENSUAL: 'p_bm', STRIPE_PRICE_BUSINESS_ANUAL: 'p_ba',
};

function dbFalsa() {
  const eventos = new Set<string>();
  const filas = new Map<string, FilaSuscripcion>();
  const perfiles = [
    { user_id: 'u1', tier: 'free' },
    { user_id: 'u1', tier: 'free' },
    { user_id: 'u2', tier: 'free' },
  ];
  const clientes: Record<string, string> = { cus_1: 'u1' };
  let guardados = 0;
  const db: DbStripe = {
    async registrarEvento(id) { if (eventos.has(id)) return false; eventos.add(id); return true; },
    async leerSuscripcion(userId) { const f = filas.get(userId); return f ? { stripe_evento_at: f.stripe_evento_at } : null; },
    async userIdDeCustomer(c) { return clientes[c] ?? null; },
    async guardarSuscripcion(f) { guardados++; filas.set(f.user_id, f); },
    async ponerTierEnPerfiles(userId, tier) { perfiles.filter(p => p.user_id === userId).forEach(p => { p.tier = tier; }); },
  };
  return { db, filas, perfiles, guardados: () => guardados };
}

const sub = (id: string, created: number, status: string, extra: Record<string, unknown> = {}): EventoStripe => ({
  id, type: status === 'canceled' ? 'customer.subscription.deleted' : 'customer.subscription.updated', created,
  data: { object: {
    id: 'sub_1', customer: 'cus_1', status, cancel_at_period_end: false,
    metadata: { user_id: 'u1' },
    items: { data: [{ price: { id: 'p_bm' }, current_period_end: 1800000000 }] },
    ...extra,
  } },
});

describe('procesarEventoStripe', () => {
  it('activa el plan en todos los perfiles del usuario', async () => {
    const t = dbFalsa();
    expect(await procesarEventoStripe(sub('evt_1', 100, 'active'), t.db, env)).toBe('procesado');
    expect(t.perfiles.filter(p => p.user_id === 'u1').map(p => p.tier)).toEqual(['business', 'business']);
    expect(t.perfiles.find(p => p.user_id === 'u2')!.tier).toBe('free');
    expect(t.filas.get('u1')).toMatchObject({ plan: 'business', ciclo: 'mensual', estado: 'active', stripe_customer_id: 'cus_1' });
  });

  it('no procesa dos veces el mismo evento', async () => {
    const t = dbFalsa();
    await procesarEventoStripe(sub('evt_1', 100, 'active'), t.db, env);
    expect(await procesarEventoStripe(sub('evt_1', 100, 'active'), t.db, env)).toBe('duplicado');
    expect(t.guardados()).toBe(1);
  });

  it('usa el estado actual de Stripe aunque "created" llegue después de "updated"', async () => {
    const t = dbFalsa();
    const actual = async () => ({ ...sub('x', 0, 'active').data.object });
    // mismo segundo; llega primero la activa y luego la incompleta (orden cambiado)
    await procesarEventoStripe(sub('evt_u', 100, 'active'), t.db, env, actual);
    await procesarEventoStripe({ ...sub('evt_c', 100, 'incomplete'), type: 'customer.subscription.created' }, t.db, env, actual);
    expect(t.filas.get('u1')!.estado).toBe('active');
    expect(t.perfiles[0].tier).toBe('business');
  });

  it('descarta un evento más viejo que el último guardado', async () => {
    const t = dbFalsa();
    await procesarEventoStripe(sub('evt_2', 200, 'canceled'), t.db, env);
    expect(await procesarEventoStripe(sub('evt_1', 100, 'active'), t.db, env)).toBe('viejo');
    expect(t.perfiles[0].tier).toBe('free');
  });

  it('conserva el plan con impago temporal y lo quita al cancelarse', async () => {
    const t = dbFalsa();
    await procesarEventoStripe(sub('evt_1', 100, 'past_due'), t.db, env);
    expect(t.perfiles[0].tier).toBe('business');
    await procesarEventoStripe(sub('evt_2', 200, 'canceled'), t.db, env);
    expect(t.perfiles[0].tier).toBe('free');
  });

  it('encuentra al usuario por el cliente de Stripe si falta en metadata', async () => {
    const t = dbFalsa();
    expect(await procesarEventoStripe(sub('evt_1', 100, 'active', { metadata: {} }), t.db, env)).toBe('procesado');
    expect(t.perfiles[0].tier).toBe('business');
    await expect(procesarEventoStripe(sub('evt_2', 101, 'active', { metadata: {}, customer: 'cus_x' }), t.db, env)).rejects.toThrow();
  });

  it('lanza con un price desconocido', async () => {
    const t = dbFalsa();
    const e = sub('evt_1', 100, 'active', { items: { data: [{ price: { id: 'p_raro' }, current_period_end: 1 }] } });
    await expect(procesarEventoStripe(e, t.db, env)).rejects.toThrow();
  });

  it('ignora otros tipos y el pago fallido', async () => {
    const t = dbFalsa();
    expect(await procesarEventoStripe({ id: 'e1', type: 'invoice.payment_failed', created: 1, data: { object: {} } }, t.db, env)).toBe('ignorado');
    expect(await procesarEventoStripe({ id: 'e2', type: 'charge.refunded', created: 1, data: { object: {} } }, t.db, env)).toBe('ignorado');
  });
});
