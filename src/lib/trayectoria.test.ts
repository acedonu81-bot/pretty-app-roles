import { describe, it, expect } from 'vitest';
import { puedePedirConfirmacion, MARCA } from './trayectoria';

describe('puedePedirConfirmacion', () => {
  it('solo Premium y con los cobros activos', () => {
    expect(puedePedirConfirmacion('business', true)).toBe(true);
    expect(puedePedirConfirmacion('elite', true)).toBe(true);
    expect(puedePedirConfirmacion('starter', true)).toBe(false);
    expect(puedePedirConfirmacion('free', true)).toBe(false);
    expect(puedePedirConfirmacion(null, true)).toBe(false);
    expect(puedePedirConfirmacion('business', false)).toBe(false);
  });
});

describe('MARCA', () => {
  it('nombra las tres marcas tal como se enseñan', () => {
    expect(MARCA).toEqual({ declarado: 'Declarado', pendiente: 'Declarado', confirmado: 'Confirmado', xpeak: 'Contrato XPEAK' });
  });
});
