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

describe('decidirSolicitud', () => {
  const base = { cobrosActivos: true, tier: 'business', correoOrganizador: 'organizador@empresa.es', correosPropios: ['ana@gmail.com'], confirmadosEsteMes: 0 };
  it('Premium con correo ajeno y cupo libre: ok', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud(base)).toBe('ok');
    for (const tier of ['premium', 'agency', 'elite']) expect(decidirSolicitud({ ...base, tier })).toBe('ok');
  });
  it('quien no es Premium no puede pedir confirmación', async () => {
    const { decidirSolicitud } = await cargar();
    for (const tier of ['free', 'starter', null]) expect(decidirSolicitud({ ...base, tier })).toBe('no_premium');
  });
  it('con los cobros apagados no se ofrece a nadie', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud({ ...base, cobrosActivos: false })).toBe('cobros_apagados');
  });
  it('no se puede confirmar con el propio correo', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud({ ...base, correoOrganizador: 'Ana+boda@gmail.com' })).toBe('correo_propio');
  });
  it('un correo mal escrito se rechaza', async () => {
    const { decidirSolicitud } = await cargar();
    for (const c of ['', 'sin-arroba', 'a@b']) expect(decidirSolicitud({ ...base, correoOrganizador: c })).toBe('correo_invalido');
  });
  it('un correo que ya confirmó 5 este mes no recibe más', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud({ ...base, confirmadosEsteMes: 5 })).toBe('limite_correo');
  });
});

describe('hashEmail', () => {
  it('da el mismo hash a las variantes de un correo y nunca el correo en claro', async () => {
    const { hashEmail } = await cargar();
    const a = await hashEmail('Ana.Perez+x@gmail.com');
    expect(a).toBe(await hashEmail('anaperez@gmail.com'));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('antifraude: correos equivalentes (revisión de seguridad)', () => {
  it('googlemail.com es gmail.com', async () => {
    const { normalizarEmail, esCorreoPropio } = await cargar();
    expect(normalizarEmail('Ana.Perez@googlemail.com')).toBe('anaperez@gmail.com');
    expect(esCorreoPropio('ana@googlemail.com', ['ana@gmail.com'])).toBe(true);
  });
  it('un punto final en el dominio no esquiva la comprobación', async () => {
    const { normalizarEmail, esCorreoPropio } = await cargar();
    expect(normalizarEmail('ana@gmail.com.')).toBe('ana@gmail.com');
    expect(esCorreoPropio('ana@empresa.es.', ['ana@empresa.es'])).toBe(true);
  });
  it('una dirección con más de una @ no normaliza a nada comparable', async () => {
    const { normalizarEmail } = await cargar();
    expect(normalizarEmail('a@b@c.com')).toBe('');
    expect(normalizarEmail('sin-arroba')).toBe('');
  });
  it('correosDelUsuario reúne todas las direcciones de la cuenta', async () => {
    const { correosDelUsuario } = await cargar();
    const u = { email: 'ana@gmail.com', new_email: 'ana2@gmail.com', user_metadata: { email: 'ana3@gmail.com' },
      identities: [{ identity_data: { email: 'ana@gmail.com' } }, { identity_data: { email: 'ana4@outlook.com' } }, { identity_data: {} }] };
    expect(correosDelUsuario(u).sort()).toEqual(['ana2@gmail.com', 'ana3@gmail.com', 'ana4@outlook.com', 'ana@gmail.com']);
    expect(correosDelUsuario({ email: null })).toEqual([]);
  });
});

describe('decidirSolicitud: tope por remitente (revisión de seguridad)', () => {
  const base = { cobrosActivos: true, tier: 'business', correoOrganizador: 'organizador@empresa.es', correosPropios: ['ana@gmail.com'], confirmadosEsteMes: 0 };
  it('un profesional no puede enviar más de 10 solicitudes en un día', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud({ ...base, solicitudesHoy: 9 })).toBe('ok');
    expect(decidirSolicitud({ ...base, solicitudesHoy: 10 })).toBe('limite_diario');
  });
  it('si no se pudo contar, se rechaza (falla cerrado)', async () => {
    const { decidirSolicitud } = await cargar();
    expect(decidirSolicitud({ ...base, solicitudesHoy: null })).toBe('limite_diario');
    expect(decidirSolicitud({ ...base, confirmadosEsteMes: null })).toBe('limite_correo');
  });
});
