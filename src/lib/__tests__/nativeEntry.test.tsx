import { describe, it, expect, vi } from 'vitest';
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

// Regresión: RastreadorDeRutas usaba isRouteBlockedInNative('/') === true para
// redirigir SÍNCRONAMENTE a /auth, ganando la carrera contra
// NativeRootRedirect (que espera sesión antes de decidir /dashboard vs
// /auth). useNativeGuardedPath debe excluir "/" exacto de ese guard síncrono
// — su destino es responsabilidad exclusiva de NativeRootRedirect.
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getSession: vi.fn(() => new Promise(() => {})) } },
}));

vi.mock('../capacitor', () => ({ isNative: true }));

describe('useNativeGuardedPath', () => {
  it('NO bloquea "/" de forma síncrona aunque isRouteBlockedInNative("/") sea true — evita ganar la carrera contra NativeRootRedirect', async () => {
    const { useNativeGuardedPath } = await import('../nativeEntry');
    expect(useNativeGuardedPath('/')).toBe(false);
  });

  it('sigue bloqueando el resto de rutas SEO/blog/directorio', async () => {
    const { useNativeGuardedPath } = await import('../nativeEntry');
    expect(useNativeGuardedPath('/contratar-dj')).toBe(true);
    expect(useNativeGuardedPath('/blog/algo')).toBe(true);
    expect(useNativeGuardedPath('/directorio/dj')).toBe(true);
  });
});
