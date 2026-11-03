import { describe, it, expect } from 'vitest';
import { dia25nActivo } from './dia25n';
import { movemberActivo } from './movember';

describe('dia25nActivo', () => {
  it('se enciende el 18 nov, incluye el 25 y se apaga el 26', () => {
    expect(dia25nActivo(new Date('2026-11-17T23:59:00+01:00'))).toBe(false);
    expect(dia25nActivo(new Date('2026-11-18T00:00:00+01:00'))).toBe(true);
    expect(dia25nActivo(new Date('2026-11-25T23:59:00+01:00'))).toBe(true);
    expect(dia25nActivo(new Date('2026-11-26T00:00:00+01:00'))).toBe(false);
  });
  it('nunca coincide con Movember', () => {
    for (let d = 1; d <= 30; d++) {
      const f = new Date(`2026-11-${String(d).padStart(2, '0')}T12:00:00+01:00`);
      expect(dia25nActivo(f) && movemberActivo(f)).toBe(false);
    }
  });
});
