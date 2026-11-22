// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { planDe, nombrePlan, ventajasDe, oficiosDe, listaVentajas } from './ventajasPlan';

describe('ventajasPlan', () => {
  it('normaliza los tiers antiguos sin quitar nada a nadie', () => {
    expect(planDe(null)).toBe('starter');
    expect(planDe('raro')).toBe('starter');
    expect(planDe('free')).toBe('starter'); // sin suscripción de pago cuenta como Profesional
    expect(planDe('starter')).toBe('starter');
    for (const t of ['business', 'premium', 'agency', 'elite']) expect(planDe(t)).toBe('business');
  });

  it('usa los nombres públicos', () => {
    expect([nombrePlan('free'), nombrePlan('starter'), nombrePlan('business')]).toEqual(['Profesional', 'Profesional', 'Premium']);
  });

  it('límites decididos el 13 nov', () => {
    expect([ventajasDe('starter').fotos, ventajasDe('business').fotos]).toEqual([12, 20]);
    expect([ventajasDe('starter').sets, ventajasDe('business').sets]).toEqual([10, Infinity]);
  });

  it('banner, Inicio y exportar solo en Premium', () => {
    expect(ventajasDe('starter').redesVisibles).toBe(true);
    expect(ventajasDe('starter').bannerCabecera).toBe(false);
    expect(ventajasDe('business').bannerCabecera).toBe(true);
    expect(ventajasDe('starter').destacadoInicio).toBe(false);
    expect(ventajasDe('business').exportarEstadisticas).toBe(true);
  });

  it('cada plan incluye todo lo del anterior', () => {
    const orden = ['starter', 'business'].map(ventajasDe);
    for (let i = 1; i < orden.length; i++) {
      for (const [k, v] of Object.entries(orden[i - 1])) {
        const sig = (orden[i] as Record<string, unknown>)[k];
        if (typeof v === 'number') expect(sig as number).toBeGreaterThanOrEqual(v);
        if (v === true) expect(sig).toBe(true);
      }
    }
  });
});

describe('qué ve cada oficio', () => {
  const lista = (roles: string[], plan: 'starter' | 'business') => listaVentajas(plan, oficiosDe(roles));

  it('un DJ ve sets y banner; un mago no', () => {
    expect(lista(['dj'], 'starter')).toContain('Hasta 10 sets en tu perfil');
    expect(lista(['dj'], 'business')).toContain('Sets ilimitados');
    expect(lista(['dj'], 'business')).toContain('Banner propio en tu cabecera de artista');
    for (const p of ['starter', 'business'] as const) {
      expect(lista(['mago'], p).join('|')).not.toMatch(/sets|Banner/i);
    }
  });

  it('un grupo musical ve sets pero no banner (el banner es de la ficha del DJ)', () => {
    expect(lista(['grupo-musical'], 'starter')).toContain('Hasta 10 sets en tu perfil');
    expect(lista(['grupo-musical'], 'business').join('|')).not.toMatch(/Banner/);
  });

  it('solo los oficios del formulario de ofertas ven "Ofertas Flash Booking"', () => {
    expect(lista(['dj'], 'starter')).toContain('Ofertas Flash Booking');
    expect(lista(['camarero'], 'starter')).toContain('Ofertas Flash Booking');
    for (const r of ['mago', 'bailarin', 'humorista', 'speaker', 'limpieza', 'azafata']) {
      expect(lista([r], 'starter')).not.toContain('Ofertas Flash Booking');
    }
  });

  it('nunca se anuncia lo que aún no existe', () => {
    const todo = ['starter', 'business'].flatMap(p => lista(['dj'], p as 'starter')).join('|');
    expect(todo).not.toMatch(/WhatsApp|ampliada|Sorteos|comunicados|vídeo de fondo|Soporte|Sello Premium|adelanto|Concursos|y web/i);
  });

  it('no usa rayas largas ni "gratis"', () => {
    const todo = ['starter', 'business'].flatMap(p => lista(['dj'], p as 'starter')).join('|');
    expect(todo).not.toMatch(/[—–]|gratis/i);
  });

  it('Premium anuncia la posición destacada y los demás planes no', () => {
    expect(lista(['dj'], 'business')).toContain('Posición destacada en el directorio, con aro dorado');
    expect(lista(['dj'], 'starter').join('|')).not.toMatch(/Posición destacada/);
    expect(ventajasDe('business').posicionDestacada).toBe(true);
    expect(ventajasDe('starter').posicionDestacada).toBe(false);
  });

  it('cada plan incluye lo del anterior en el texto', () => {
    expect(lista(['dj'], 'starter')[0]).toBe('Perfil en el directorio');
    expect(lista(['dj'], 'business')[0]).toBe('Todo lo de Profesional');
  });

  it('empresarios y particulares no son profesionales (no ven planes)', () => {
    expect(oficiosDe(['empresario']).profesional).toBe(false);
    expect(oficiosDe(['particular', 'pending']).profesional).toBe(false);
    expect(oficiosDe(['empresario', 'dj']).profesional).toBe(true);
  });
});

describe('trayectoria verificada', () => {
  it('pedir confirmación y el sello solo en Premium', () => {
    expect(ventajasDe('business').trayectoriaConfirmada).toBe(true);
    expect(ventajasDe('starter').trayectoriaConfirmada).toBe(false);
    expect(listaVentajas('business', oficiosDe(['camarero']))).toContain('Sello de eventos confirmados en tu ficha');
    expect(listaVentajas('starter', oficiosDe(['camarero']))).not.toContain('Sello de eventos confirmados en tu ficha');
  });
});

describe('trayectoria con los cobros apagados', () => {
  it('Mi plan no anuncia el sello si no se puede usar todavía', () => {
    const o = oficiosDe(['camarero']);
    expect(listaVentajas('business', o, { cobros: false })).not.toContain('Sello de eventos confirmados en tu ficha');
    expect(listaVentajas('business', o, { cobros: true })).toContain('Sello de eventos confirmados en tu ficha');
    expect(listaVentajas('business', o)).toContain('Sello de eventos confirmados en tu ficha');
  });
});
