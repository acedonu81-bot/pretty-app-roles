// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest';

beforeAll(() => {
  (globalThis as any).Deno = { env: { get: (k: string) => (k === 'SUPABASE_SERVICE_ROLE_KEY' ? 'clave-de-prueba' : undefined) } };
});

const cargar = () => import('./trayectoria.ts');

describe('antifraude', () => {
  it('normaliza correos: minúsculas, sin alias + y sin puntos en Gmail', async () => {
    const { normalizarEmail } = await cargar();
    expect(normalizarEmail('Ana.Perez+x@gmail.com')).toBe('anaperez@gmail.com');
    expect(normalizarEmail(' Ana.Perez+x@Empresa.es ')).toBe('ana.perez@empresa.es');
  });
  it('detecta el correo propio aunque lleve alias', async () => {
    const { esCorreoPropio } = await cargar();
    expect(esCorreoPropio('ana+boda@gmail.com', ['ana@gmail.com'])).toBe(true);
    expect(esCorreoPropio('organizador@gmail.com', ['ana@gmail.com'])).toBe(false);
  });
  it('un correo confirma como máximo 5 eventos al mes', async () => {
    const { puedeConfirmarMas } = await cargar();
    expect(puedeConfirmarMas(4)).toBe(true);
    expect(puedeConfirmarMas(5)).toBe(false);
  });
});

describe('enlace firmado de confirmación', () => {
  it('un enlace firmado se lee de vuelta', async () => {
    const { firmarConfirmacion, leerConfirmacion } = await cargar();
    const url = await firmarConfirmacion('evento-1', 'conf-1');
    expect(url.startsWith('https://xpeak.es/confirmar-evento?t=')).toBe(true);
    const t = new URL(url).searchParams.get('t')!;
    expect(await leerConfirmacion(t)).toEqual({ e: 'evento-1', c: 'conf-1' });
  });
  it('un enlace manipulado no vale', async () => {
    const { firmarConfirmacion, leerConfirmacion } = await cargar();
    const t = new URL(await firmarConfirmacion('evento-1', 'conf-1')).searchParams.get('t')!;
    const cambiado = (t[0] === 'a' ? 'b' : 'a') + t.slice(1);
    expect(await leerConfirmacion(cambiado)).toBeNull();
  });
  it('un enlace de otro tipo (acceso de particulares) no vale', async () => {
    const { leerConfirmacion } = await cargar();
    const { firmarAcceso } = await import('./accesoParticular.ts');
    const t = new URL((await firmarAcceso('u-1', '/dashboard'))!).searchParams.get('t')!;
    expect(await leerConfirmacion(t)).toBeNull();
  });
  it('caduca a los 30 días', async () => {
    const { firmarConfirmacion, leerConfirmacion } = await cargar();
    const t = new URL(await firmarConfirmacion('evento-1', 'conf-1')).searchParams.get('t')!;
    vi.useFakeTimers({ now: Date.now() + 31 * 24 * 3600_000 });
    try {
      expect(await leerConfirmacion(t)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
