import { describe, it, expect } from 'vitest';
import { halloweenActivo } from './halloween';

describe('halloweenActivo', () => {
  it('se enciende el 25 oct y se apaga al acabar el 1 nov', () => {
    expect(halloweenActivo(new Date('2026-10-24T23:59:00+02:00'))).toBe(false);
    expect(halloweenActivo(new Date('2026-10-25T00:00:00+02:00'))).toBe(true);
    expect(halloweenActivo(new Date('2026-10-31T23:00:00+01:00'))).toBe(true);
    expect(halloweenActivo(new Date('2026-11-01T23:59:00+01:00'))).toBe(true);
    expect(halloweenActivo(new Date('2026-11-02T00:00:00+01:00'))).toBe(false);
  });
});
