import { describe, it, expect, vi, beforeEach } from 'vitest';

const invoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: (...a: unknown[]) => invoke(...a) } } }));
vi.mock('@/lib/track', () => ({ logEvent: vi.fn() }));
const existe = vi.fn();
vi.mock('@/lib/soundcloudEnlace', async (orig) => ({ ...(await orig<typeof import('@/lib/soundcloudEnlace')>()), pistaSoundcloudExiste: (u: string) => existe(u) }));

import { cambiarSesion } from './concursoInscripcion';

describe('cambiarSesion', () => {
  beforeEach(() => { invoke.mockReset(); existe.mockReset(); existe.mockResolvedValue(true); });

  it('manda la sesión nueva a la función del servidor y avisa al admin', async () => {
    invoke.mockResolvedValue({ data: { ok: true }, error: null });
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/otra-sesion', 'test');
    expect(r.ok).toBe(true);
    expect(invoke).toHaveBeenCalledWith('concurso-cambiar-sesion', { body: { url: 'https://soundcloud.com/dj-vizard/otra-sesion' } });
    expect(invoke).toHaveBeenCalledWith('send-email', expect.anything());
  });

  it('rechaza un enlace que no es de una sesión de SoundCloud', async () => {
    const r = await cambiarSesion('https://example.com/loquesea', 'test');
    expect(r.ok).toBe(false);
    expect(invoke).not.toHaveBeenCalled();
  });

  it('rechaza una pista nueva que SoundCloud no encuentra', async () => {
    existe.mockResolvedValue(false);
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/borrada', 'test');
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/no encuentra/);
    expect(invoke).not.toHaveBeenCalled();
  });

  it('si la sesión actual funciona, el servidor no deja cambiarla', async () => {
    invoke.mockResolvedValue({ data: { error: 'sesion_actual_funciona' }, error: null });
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/otra-sesion', 'test');
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/se oye bien/);
  });

  it('traduce el cierre del concurso', async () => {
    invoke.mockResolvedValue({ data: { error: 'cerrado' }, error: null });
    const r = await cambiarSesion('https://soundcloud.com/dj-vizard/otra-sesion', 'test');
    expect(r).toEqual({ ok: false, mensaje: 'El concurso ya ha cerrado.' });
  });
});
