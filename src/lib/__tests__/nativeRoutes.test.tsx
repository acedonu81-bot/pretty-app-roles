import { describe, it, expect } from 'vitest';
import { shouldRegisterRoute } from '../nativeRoutes';

describe('shouldRegisterRoute', () => {
  it('en web registra todas las rutas', () => {
    expect(shouldRegisterRoute('/contratar-dj', false)).toBe(true);
    expect(shouldRegisterRoute('/', false)).toBe(true);
  });

  it('en nativo no registra rutas bloqueadas', () => {
    expect(shouldRegisterRoute('/contratar-dj', true)).toBe(false);
    expect(shouldRegisterRoute('/blog/precio-azafatas-madrid', true)).toBe(false);
  });

  it('en nativo sigue registrando dashboard y auth', () => {
    expect(shouldRegisterRoute('/dashboard', true)).toBe(true);
    expect(shouldRegisterRoute('/auth', true)).toBe(true);
  });
});
