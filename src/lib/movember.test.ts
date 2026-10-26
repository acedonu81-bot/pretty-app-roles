import { describe, it, expect } from 'vitest';
import { movemberActivo } from './movember';

describe('movemberActivo', () => {
  it('se enciende el 2 nov y se apaga el 1 dic', () => {
    expect(movemberActivo(new Date('2026-11-01T12:00:00+01:00'))).toBe(false);
    expect(movemberActivo(new Date('2026-11-02T00:00:00+01:00'))).toBe(true);
    expect(movemberActivo(new Date('2026-11-30T23:59:00+01:00'))).toBe(true);
    expect(movemberActivo(new Date('2026-12-01T00:00:00+01:00'))).toBe(false);
  });
});
