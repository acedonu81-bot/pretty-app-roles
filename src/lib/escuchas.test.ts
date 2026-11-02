import { describe, expect, it } from 'vitest';
import { sumarEscuchado } from './escuchas';

describe('sumarEscuchado', () => {
  it('suma el avance normal de la reproducción', () => {
    let acum = 0;
    let ant: number | null = null;
    for (const t of [0, 0.25, 0.5, 1, 1.5, 2.5]) { acum = sumarEscuchado(acum, ant, t); ant = t; }
    expect(acum).toBeCloseTo(2.5);
  });
  it('un salto con la onda o la tracklist no cuenta', () => {
    expect(sumarEscuchado(10, 60, 900)).toBe(10);
  });
  it('volver atrás no cuenta', () => {
    expect(sumarEscuchado(10, 600, 100)).toBe(10);
  });
  it('la primera lectura no suma', () => {
    expect(sumarEscuchado(0, null, 120)).toBe(0);
  });
});
