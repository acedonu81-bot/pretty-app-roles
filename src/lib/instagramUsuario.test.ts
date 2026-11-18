// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { normalizarInstagram, esUsuarioInstagram } from './instagramUsuario';

describe('normalizarInstagram', () => {
  it.each([
    ['dj.kevin', 'dj.kevin'],
    ['@dj.kevin', 'dj.kevin'],
    ['  @dj.kevin  ', 'dj.kevin'],
    ['#inusualdj', 'inusualdj'],
    ['instagram.com/dj.kevin', 'dj.kevin'],
    ['https://www.instagram.com/dj.kevin/', 'dj.kevin'],
    ['https://instagram.com/dj.kevin?igsh=abc123', 'dj.kevin'],
    ['http://m.instagram.com/@dj.kevin', 'dj.kevin'],
    ['', ''],
  ])('%j -> %j', (entrada, esperado) => {
    expect(normalizarInstagram(entrada)).toBe(esperado);
  });

  it('un enlace a un post, reel o historia no es un perfil', () => {
    expect(normalizarInstagram('https://www.instagram.com/p/Cxyz123/')).toBe('');
    expect(normalizarInstagram('https://www.instagram.com/reel/Cxyz123/')).toBe('');
    expect(normalizarInstagram('instagram.com/stories/dj.kevin/123')).toBe('');
  });
});

describe('esUsuarioInstagram', () => {
  it('acepta letras, números, puntos y guiones bajos', () => {
    expect(esUsuarioInstagram('dj.kevin_96')).toBe(true);
  });
  it('rechaza espacios, emojis, vacío y más de 30', () => {
    expect(esUsuarioInstagram('dj kevin')).toBe(false);
    expect(esUsuarioInstagram('kevin✨')).toBe(false);
    expect(esUsuarioInstagram('')).toBe(false);
    expect(esUsuarioInstagram('a'.repeat(31))).toBe(false);
  });
});
