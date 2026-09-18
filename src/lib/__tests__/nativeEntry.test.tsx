import { describe, it, expect } from 'vitest';
import { isRouteBlockedInNative } from '../nativeEntry';

describe('isRouteBlockedInNative', () => {
  it('bloquea la landing pública', () => {
    expect(isRouteBlockedInNative('/')).toBe(true);
  });

  it('bloquea rutas de categoría SEO', () => {
    expect(isRouteBlockedInNative('/contratar-dj')).toBe(true);
    expect(isRouteBlockedInNative('/contratar-dj/madrid')).toBe(true);
  });

  it('bloquea rutas de blog', () => {
    expect(isRouteBlockedInNative('/blog/precio-azafatas-madrid')).toBe(true);
  });

  it('bloquea el directorio público sin login', () => {
    expect(isRouteBlockedInNative('/directorio/dj')).toBe(true);
  });

  it('no bloquea auth ni dashboard', () => {
    expect(isRouteBlockedInNative('/auth')).toBe(false);
    expect(isRouteBlockedInNative('/dashboard')).toBe(false);
  });

  it('no bloquea el perfil público (necesario para compartir/deep link)', () => {
    expect(isRouteBlockedInNative('/p/algun-slug')).toBe(false);
  });
});
