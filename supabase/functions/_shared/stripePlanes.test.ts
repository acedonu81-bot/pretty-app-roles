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
