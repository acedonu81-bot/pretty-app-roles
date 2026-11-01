import { describe, expect, it } from 'vitest';
import { picosDesdeMuestras } from './ondaAudio';

describe('picosDesdeMuestras', () => {
  it('estira la energía de cada tramo entre el más flojo (8) y el más fuerte (100)', () => {
    const c = new Float32Array([0.5, -0.5, 0.25, -0.25, 1, -1]);
    expect(picosDesdeMuestras([c], 3)).toEqual([39, 8, 100]);
  });
  it('mezcla los canales', () => {
    const izq = new Float32Array([0.5, 0.1]);
    const der = new Float32Array([0.5, 0.1]);
    expect(picosDesdeMuestras([izq, der], 2)).toEqual([100, 8]);
  });
  it('un set sin variación no se dibuja como silencio y sin audio no hay picos', () => {
    expect(picosDesdeMuestras([new Float32Array([0.3, 0.3, 0.3, 0.3])], 2)).toEqual([60, 60]);
    expect(picosDesdeMuestras([new Float32Array([0, 0])], 2)).toEqual([8, 8]);
    expect(picosDesdeMuestras([new Float32Array([])], 10)).toEqual([]);
  });
});
