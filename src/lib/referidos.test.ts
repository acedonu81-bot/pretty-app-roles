import { describe, it, expect } from 'vitest';
import { codigoValidoDelNavegador, descuentoReferidos } from './referidos';

const alta = '2026-11-18T20:00:00Z';
const t = (iso: string) => JSON.stringify({ c: 'abc123', t: new Date(iso).getTime() });

describe('referidos en el navegador', () => {
  it('vale si el enlace se abrió antes de crear la cuenta', () => {
    expect(codigoValidoDelNavegador(t('2026-11-18T19:50:00Z'), alta, Date.parse('2026-11-18T20:05:00Z'))).toBe('abc123');
  });
  it('no vale un enlace abierto después por alguien ya registrado (no cambia su padrino)', () => {
    expect(codigoValidoDelNavegador(t('2026-11-19T10:00:00Z'), alta, Date.parse('2026-11-19T10:01:00Z'))).toBeNull();
  });
  it('caduca a los 30 días y descarta basura', () => {
    expect(codigoValidoDelNavegador(t('2026-10-01T00:00:00Z'), '2026-11-18T20:00:00Z', Date.parse('2026-11-18T20:00:00Z'))).toBeNull();
    expect(codigoValidoDelNavegador('no-json', alta)).toBeNull();
    expect(codigoValidoDelNavegador(null, alta)).toBeNull();
  });
  it('10 % con un amigo, 20 % con dos o más', () => {
    expect([0, 1, 2, 3].map(descuentoReferidos)).toEqual([0, 10, 20, 20]);
  });
});
