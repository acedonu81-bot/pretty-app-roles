// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { etiquetaAlta, siguienteIndice, imagenSegura } from './nuevosEnXpeak';

// 16 nov 2026 22:50 en Madrid (UTC+1) = 21:50 UTC
const AHORA = Date.UTC(2026, 10, 16, 21, 50);

describe('etiquetaAlta', () => {
  it('mismo día en Madrid: "hoy"', () => {
    expect(etiquetaAlta('2026-11-16T07:00:00Z', AHORA)).toBe('hoy');
  });
  it('cuenta el día natural de Madrid, no las 24 h: 00:30 de Madrid ya es "hoy"', () => {
    // 15 nov 23:30 UTC = 16 nov 00:30 Madrid
    expect(etiquetaAlta('2026-11-15T23:30:00Z', AHORA)).toBe('hoy');
  });
  it('día anterior: "ayer"', () => {
    expect(etiquetaAlta('2026-11-15T12:00:00Z', AHORA)).toBe('ayer');
  });
  it('varios días: "hace N días"', () => {
    expect(etiquetaAlta('2026-11-13T14:38:00Z', AHORA)).toBe('hace 3 días');
  });
  it('fecha inválida: cadena vacía, nunca "NaN"', () => {
    expect(etiquetaAlta('no es una fecha', AHORA)).toBe('');
  });
});

describe('siguienteIndice', () => {
  it('avanza y da la vuelta', () => {
    expect(siguienteIndice(0, 3)).toBe(1);
    expect(siguienteIndice(2, 3)).toBe(0);
  });
  it('con 0 o 1 elementos se queda en 0', () => {
    expect(siguienteIndice(0, 0)).toBe(0);
    expect(siguienteIndice(0, 1)).toBe(0);
  });
});

describe('imagenSegura', () => {
  it('solo deja pasar https', () => {
    expect(imagenSegura('https://x.supabase.co/a.jpg')).toBe('https://x.supabase.co/a.jpg');
    expect(imagenSegura('http://x.com/a.jpg')).toBeNull();
    expect(imagenSegura('javascript:alert(1)')).toBeNull();
    expect(imagenSegura('')).toBeNull();
    expect(imagenSegura(null)).toBeNull();
  });
  it('una url con comillas o paréntesis no sale (va dentro de url() en CSS)', () => {
    expect(imagenSegura('https://x.com/a").jpg')).toBeNull();
    expect(imagenSegura("https://x.com/a'b.jpg")).toBeNull();
    expect(imagenSegura('https://x.com/a(b).jpg')).toBeNull();
  });
});
