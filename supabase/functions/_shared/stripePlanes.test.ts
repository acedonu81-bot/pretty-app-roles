import { describe, it, expect } from 'vitest';
import { priceIdDe, planDesdePriceId, tierDesdeEstado, esProfesional, esMusica } from './stripePlanes.ts';
import { subscriptionPlans, PRECIOS_ANUALES, PRECIOS_ANUALES_PRIMER_ANO } from '../../../src/lib/subscriptions';

const env = {
  STRIPE_PRICE_STARTER_MENSUAL: 'p_sm', STRIPE_PRICE_STARTER_ANUAL: 'p_sa',
  STRIPE_PRICE_BUSINESS_MENSUAL: 'p_bm', STRIPE_PRICE_BUSINESS_ANUAL: 'p_ba',
};

describe('stripePlanes', () => {
  it('traduce plan y ciclo a price y vuelta', () => {
    expect(priceIdDe('business', 'anual', env)).toBe('p_ba');
    expect(planDesdePriceId('p_sm', env)).toEqual({ plan: 'starter', ciclo: 'mensual' });
    expect(planDesdePriceId('desconocido', env)).toBeNull();
  });

  it('lanza si falta el secreto del price', () => {
    expect(() => priceIdDe('business', 'mensual', {})).toThrow();
  });

  it('conserva el plan en activo, prueba e impago temporal y lo quita en el resto', () => {
    for (const e of ['active', 'trialing', 'past_due']) expect(tierDesdeEstado(e, 'business')).toBe('business');
    for (const e of ['canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused']) expect(tierDesdeEstado(e, 'business')).toBe('free');
  });

  it('solo los profesionales pueden contratar', () => {
    expect(esProfesional({ role: 'dj', roles: null })).toBe(true);
    expect(esProfesional({ role: 'pending', roles: ['camarero'] })).toBe(true);
    expect(esProfesional({ role: 'mago', roles: [] })).toBe(true);
    for (const r of ['empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending'])
      expect(esProfesional({ role: r, roles: [] })).toBe(false);
  });

  it('distingue los roles de música', () => {
    expect(esMusica('dj')).toBe(true);
    expect(esMusica('grupo-musical')).toBe(true);
    expect(esMusica('disco-movil')).toBe(true);
    expect(esMusica('camarero')).toBe(false);
  });

  it('precios decididos en la web', () => {
    expect(subscriptionPlans.find(p => p.id === 'starter')!.monthlyPrice).toBe(6.99);
    expect(subscriptionPlans.find(p => p.id === 'business')!.monthlyPrice).toBe(14.99);
    expect(PRECIOS_ANUALES).toEqual({ starter: 75.49, business: 161.89 });
    expect(PRECIOS_ANUALES_PRIMER_ANO).toEqual({ starter: 71.30, business: 152.90 });
  });
});

import { cuponDe, FIN_BLACK_FRIDAY } from './stripePlanes.ts';
describe('cuponDe', () => {
  const envC = { STRIPE_CUPON_STARTER_ANUAL1: 'c_sa1', STRIPE_CUPON_BUSINESS_ANUAL1: 'c_ba1', STRIPE_CUPON_STARTER_BF: 'c_sbf', STRIPE_CUPON_BUSINESS_BF: 'c_bbf' };
  it('el mensual no lleva cupón', () => {
    expect(cuponDe('starter', 'mensual', new Date('2026-11-28'), envC)).toBeNull();
  });
  it('el anual lleva el 15 % del primer año fuera del Black Friday', () => {
    expect(cuponDe('business', 'anual', new Date('2026-12-05T10:00:00Z'), envC)).toBe('c_ba1');
  });
  it('el anual lleva el Black Friday hasta el 30 nov a las 23:59 de Madrid', () => {
    expect(cuponDe('starter', 'anual', new Date('2026-11-27T09:00:00Z'), envC)).toBe('c_sbf');
    expect(cuponDe('starter', 'anual', new Date('2026-11-30T22:58:00Z'), envC)).toBe('c_sbf');
    expect(cuponDe('starter', 'anual', new Date('2026-11-30T23:00:00Z'), envC)).toBe('c_sa1');
    expect(FIN_BLACK_FRIDAY.toISOString()).toBe('2026-11-30T23:00:00.000Z');
  });
  it('el Black Friday empieza el 27 nov', () => {
    expect(cuponDe('starter', 'anual', new Date('2026-11-26T12:00:00Z'), envC)).toBe('c_sa1');
  });
  it('lanza si falta el cupón', () => {
    expect(() => cuponDe('starter', 'anual', new Date('2026-12-05'), {})).toThrow();
  });
});

describe('cuponDe una sola vez', () => {
  const envC = { STRIPE_CUPON_STARTER_ANUAL1: 'c_sa1', STRIPE_CUPON_STARTER_BF: 'c_sbf' };
  it('quien ya tuvo un plan no repite el descuento del primer año', () => {
    expect(cuponDe('starter', 'anual', new Date('2026-12-05T10:00:00Z'), envC, true)).toBeNull();
    expect(cuponDe('starter', 'anual', new Date('2026-11-28T10:00:00Z'), envC, true)).toBeNull();
  });
});
