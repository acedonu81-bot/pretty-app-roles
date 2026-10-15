import { describe, it, expect } from 'vitest';
import { posicionFotoCaptura } from './fotoCaptura';

// Franjas de una captura de móvil: ~16 % de barra arriba y ~14 % abajo.
const ventana = (w: number, h: number, boxW: number, boxH: number) => {
  const pos = posicionFotoCaptura(w, h, boxW, boxH)!;
  const y = parseFloat(pos.split(' ')[1]) / 100;
  const visible = (boxH * w) / (boxW * h);
  const arriba = y * (1 - visible);
  return { pos, arriba, abajo: arriba + visible };
};

describe('posicionFotoCaptura', () => {
  it('no toca las fotos normales ni los vídeos verticales', () => {
    expect(posicionFotoCaptura(1200, 1600, 400, 300)).toBeNull();   // retrato 3:4
    expect(posicionFotoCaptura(1080, 1920, 400, 300)).toBeNull();   // 9:16
    expect(posicionFotoCaptura(1600, 1200, 400, 300)).toBeNull();   // horizontal
    expect(posicionFotoCaptura(0, 0, 400, 300)).toBeNull();
    expect(posicionFotoCaptura(739, 1600, 0, 0)).toBeNull();        // sin layout todavía
  });

  it('la captura de Laura (739x1600) sale sin las barras en cualquier hueco', () => {
    for (const [bw, bh] of [[400, 300], [300, 300], [300, 375], [379, 303], [130, 150]]) {
      const { arriba, abajo } = ventana(739, 1600, bw, bh);
      expect(arriba).toBeGreaterThanOrEqual(0.16 - 1e-6);
      expect(abajo).toBeLessThanOrEqual(0.86 + 1e-6);
    }
  });

  it('en un hueco 4:3 la ventana enseña la cara de Laura (al 38 % de la imagen) y no las barras', () => {
    const { arriba, abajo } = ventana(739, 1600, 400, 300);
    expect(arriba).toBeCloseTo(0.253, 2);
    expect(abajo).toBeCloseTo(0.599, 2);
    // cabeza (31-46 %) entera dentro de la ventana
    expect(arriba).toBeLessThan(0.31);
    expect(abajo).toBeGreaterThan(0.46);
  });

  it('una captura de iPhone (1125x2436) también', () => {
    const { arriba, abajo } = ventana(1125, 2436, 300, 300);
    expect(arriba).toBeGreaterThanOrEqual(0.16 - 1e-6);
    expect(abajo).toBeLessThanOrEqual(0.86 + 1e-6);
  });

  it('si el hueco es tan alto que se ve toda la imagen, no hace nada', () => {
    expect(posicionFotoCaptura(500, 1000, 100, 1000)).toBeNull();
  });
});
