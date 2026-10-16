import { describe, it, expect, vi, beforeEach } from 'vitest';

const rpc = vi.fn();
const invoke = vi.fn(async () => ({ data: null }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a), functions: { invoke: (...a: unknown[]) => invoke(...(a as [])) } } }));
vi.mock('@/lib/track', () => ({ logEvent: vi.fn() }));
const existe = vi.fn();
vi.mock('@/lib/soundcloudEnlace', async (orig) => ({ ...(await orig<typeof import('@/lib/soundcloudEnlace')>()), pistaSoundcloudExiste: (u: string) => existe(u) }));

import { cambiarSesion } from './concursoInscripcion';

describe('cambiarSesion', () => {
  beforeEach(() => { rpc.mockReset(); invoke.mockClear(); existe.mockReset(); existe.mockResolvedValue(true); });

  it('cambia la sesión por una pública y avisa al admin', async () => {
    rpc.mockResolvedValue({ error: null });
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/otra-sesion', 'test');
    expect(r.ok).toBe(true);
    expect(rpc).toHaveBeenCalledWith('cambiar_sesion_concurso', { p_url: 'https://soundcloud.com/dj-vizard/otra-sesion' });
    expect(invoke).toHaveBeenCalled();
  });

  it('rechaza un enlace que no es de una sesión de SoundCloud', async () => {
    const r = await cambiarSesion('https://example.com/loquesea', 'test');
    expect(r.ok).toBe(false);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('rechaza una pista que SoundCloud no encuentra', async () => {
    existe.mockResolvedValue(false);
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/borrada', 'test');
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/no encuentra/);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('traduce el cierre del concurso', async () => {
    rpc.mockResolvedValue({ error: { message: 'el concurso ha cerrado' } });
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/otra-sesion', 'test');
    expect(r).toEqual({ ok: false, mensaje: 'El concurso ya ha cerrado.' });
  });
});
