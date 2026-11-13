import { describe, it, expect } from 'vitest';
import { decidirCheckout } from './decidirCheckout.ts';

const dj = [{ role: 'dj', roles: null }];
const base = { cobrosActivos: true, perfiles: dj, suscripcion: null, plan: 'starter', ciclo: 'mensual' };

describe('decidirCheckout', () => {
  it('rechaza todo con los cobros apagados', () => {
    expect(decidirCheckout({ ...base, cobrosActivos: false })).toEqual({ tipo: 'error', codigo: 'cobros_apagados' });
  });
  it('rechaza a quien no es profesional', () => {
    expect(decidirCheckout({ ...base, perfiles: [{ role: 'empresario', roles: [] }] })).toEqual({ tipo: 'error', codigo: 'no_profesional' });
  });
  it('rechaza planes y ciclos que no se venden', () => {
    for (const plan of ['free', 'agency']) expect(decidirCheckout({ ...base, plan })).toEqual({ tipo: 'error', codigo: 'plan_invalido' });
    expect(decidirCheckout({ ...base, ciclo: 'semanal' })).toEqual({ tipo: 'error', codigo: 'plan_invalido' });
  });
  it('manda a pagar a quien no tiene suscripción viva', () => {
    expect(decidirCheckout(base)).toEqual({ tipo: 'checkout' });
    expect(decidirCheckout({ ...base, suscripcion: { estado: 'canceled' } })).toEqual({ tipo: 'checkout' });
  });
  it('manda al portal a quien ya paga, para no crear otra suscripción', () => {
    for (const estado of ['active', 'past_due', 'trialing']) expect(decidirCheckout({ ...base, suscripcion: { estado } })).toEqual({ tipo: 'portal' });
  });
  it('acepta cualquier rol profesional, no solo DJ', () => {
    expect(decidirCheckout({ ...base, perfiles: [{ role: 'mago', roles: null }] })).toEqual({ tipo: 'checkout' });
  });
});
