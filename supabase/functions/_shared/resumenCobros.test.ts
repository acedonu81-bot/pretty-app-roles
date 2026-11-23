import { describe, it, expect } from 'vitest';
import { construirMovimientos, ingresoMensual, resumenDelMes, mesMadrid, type CargoStripe } from './resumenCobros';

const t = (iso: string) => Math.floor(new Date(iso).getTime() / 1000);
const dani = { user_id: 'u1', nombre: 'Daniel Torrez', email: 'd@x.es' };
const persona = (c: string | null) => (c === 'cus_1' ? dani : null);

const cargo = (o: Partial<CargoStripe>): CargoStripe => ({
  id: 'ch_1', created: t('2026-11-23T10:52:00Z'), amount: 1499, status: 'succeeded', customer: 'cus_1',
  payment_intent: 'pi_1', description: 'Subscription creation', ...o,
});

describe('construirMovimientos', () => {
  it('un cobro y su devolución salen con la persona de XPEAK, la devolución en negativo', () => {
    const m = construirMovimientos([cargo({})], [{ id: 're_1', created: t('2026-11-23T11:00:00Z'), amount: 1499, status: 'succeeded', charge: 'ch_1' }], persona);
    expect(m.map(x => [x.tipo, x.importe, x.persona?.nombre])).toEqual([['devolucion', -1499, 'Daniel Torrez'], ['cobro', 1499, 'Daniel Torrez']]);
    expect(m[1].enlace).toBe('https://dashboard.stripe.com/payments/pi_1');
  });

  it('marca los pagos rechazados y las disputas', () => {
    const m = construirMovimientos([cargo({ id: 'ch_2', status: 'failed', failure_message: 'Fondos insuficientes' }), cargo({ id: 'ch_3', disputed: true })], [], persona);
    expect(m.find(x => x.tipo === 'fallido')?.concepto).toBe('Fondos insuficientes');
    expect(m.some(x => x.tipo === 'disputa')).toBe(true);
  });

  it('ignora devoluciones fallidas y cargos pendientes', () => {
    const m = construirMovimientos([cargo({ status: 'pending' })], [{ id: 're_2', created: 1, amount: 100, status: 'failed', charge: 'ch_1' }], persona);
    expect(m).toEqual([]);
  });
});

describe('ingresoMensual', () => {
  const sub = (status: string, unit: number, interval: string) => ({ status, items: { data: [{ quantity: 1, price: { unit_amount: unit, recurring: { interval }, product: 'p' } }] } });
  it('suma mensuales y reparte el anual en 12; no cuenta canceladas', () => {
    expect(ingresoMensual([sub('active', 699, 'month'), sub('active', 6990, 'year'), sub('canceled', 1499, 'month')])).toBe(699 + 583);
  });
});

describe('resumenDelMes', () => {
  it('cuenta solo el mes de Madrid y resta lo devuelto', () => {
    const movs = construirMovimientos(
      [cargo({}), cargo({ id: 'ch_viejo', created: t('2026-10-31T22:30:00Z') })],
      [{ id: 're_1', created: t('2026-11-23T11:00:00Z'), amount: 1499, status: 'succeeded', charge: 'ch_1' }],
      persona,
    );
    // 31 oct 22:30 UTC son las 23:30 del 31 en Madrid: octubre. 23:30 UTC ya es 1 nov.
    expect(mesMadrid('2026-10-31T23:30:00Z')).toBe('2026-11');
    const r = resumenDelMes(movs, new Date('2026-11-23T12:00:00Z'));
    expect(r).toMatchObject({ mes: '2026-11', cobrado: 1499, devuelto: 1499, neto: 0, cobros: 1 });
  });
});
