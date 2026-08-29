import { describe, expect, it } from 'vitest';
import { extractInstagramHandle, instagramUrl } from './social';

// Varios perfiles reales en producción guardaron la URL completa de
// Instagram en vez del handle — sin normalizar, https://instagram.com/${raw}
// producía un link roto que abría el Instagram genérico en vez del perfil.
describe('extractInstagramHandle', () => {
  it('deja el handle limpio tal cual', () => {
    expect(extractInstagramHandle('djpoly_music')).toBe('djpoly_music');
  });

  it('quita la @ inicial', () => {
    expect(extractInstagramHandle('@djpoly_music')).toBe('djpoly_music');
  });

  it('extrae el handle de una URL sin protocolo', () => {
    expect(extractInstagramHandle('www.instagram.com/entudiamecole/')).toBe('entudiamecole');
  });

  it('extrae el handle de una URL completa con query params', () => {
    expect(extractInstagramHandle('https://www.instagram.com/sonidosalvaje.mlg?igsi=abc&utm_source=qr'))
      .toBe('sonidosalvaje.mlg');
  });
});

describe('instagramUrl', () => {
  it('construye la URL final a partir de un handle sucio', () => {
    expect(instagramUrl('https://www.instagram.com/sonidosalvaje.mlg?igsi=abc'))
      .toBe('https://instagram.com/sonidosalvaje.mlg');
  });
});
