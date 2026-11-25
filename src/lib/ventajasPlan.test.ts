// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { planDe, nombrePlan, ventajasDe, oficiosDe, listaVentajas, proximamente, ventajasAnual, listaBase } from './ventajasPlan';

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

  it('solo los oficios del formulario de ofertas ven Flash Booking, explicado en una línea', () => {
    const flash = 'Ofertas Flash Booking: trabajos urgentes que publican los organizadores y te llegan al momento';
    expect(lista(['dj'], 'starter')).toContain(flash);
    expect(lista(['camarero'], 'starter')).toContain(flash);
    for (const r of ['mago', 'bailarin', 'humorista', 'speaker', 'limpieza', 'azafata']) {
      expect(lista([r], 'starter').join('|')).not.toMatch(/Flash Booking/);
    }
  });

  it('la frase de redes dice para qué sirve', () => {
    expect(lista(['mago'], 'starter')).toContain('Tu Instagram, TikTok y Facebook en tu ficha: quien te visita puede seguirte sin tener que escribirte antes');
  });

  it('concursos y sorteos en Profesional; Premium los hereda sin repetirlos', () => {
    expect(lista(['mago'], 'starter')).toContain('Concursos y sorteos de XPEAK');
    const premium = lista(['mago'], 'business');
    expect(premium).toContain('Todo lo de Profesional, más:');
    expect(premium).not.toContain('Concursos y sorteos de XPEAK');
  });

  it('publicaciones en las redes de XPEAK: 1 al mes en Profesional, 3 en Premium', () => {
    expect(lista(['mago'], 'starter')).toContain('1 publicación al mes en las redes de XPEAK');
    expect(lista(['mago'], 'business')).toContain('3 publicaciones al mes en las redes de XPEAK');
    expect([ventajasDe('starter').publicacionesRedesMes, ventajasDe('business').publicacionesRedesMes]).toEqual([1, 3]);
  });

  it('directos: 1 al mes en Profesional, 5 en Premium', () => {
    expect(lista(['camarero'], 'starter')).toContain('1 directo al mes en XPEAK');
    expect(lista(['camarero'], 'business')).toContain('5 directos al mes en XPEAK');
    expect([ventajasDe('starter').directosMes, ventajasDe('business').directosMes]).toEqual([1, 5]);
  });

  it('próximamente: WhatsApp en Profesional (Premium lo hereda sin repetirlo); Facebook ya existe; el directo en vídeo solo en Premium', () => {
    const wa = 'Avisos por WhatsApp de mensajes, reseñas, solicitudes de particulares y ofertas de organizadores';
    expect(proximamente('starter', oficiosDe(['dj']))).toContain(wa);
    expect(proximamente('business', oficiosDe(['dj']))).not.toContain(wa);
    for (const p of ['starter', 'business'] as const) expect(proximamente(p, oficiosDe(['dj'])).join('|')).not.toMatch(/Facebook/);
    expect(proximamente('business', oficiosDe(['dj']))).toContain('Tu directo se ve en vídeo en el Inicio de XPEAK, no solo como aviso');
    expect(proximamente('starter', oficiosDe(['dj'])).join('|')).not.toMatch(/en vídeo/);
  });

  it('el anual trae regalo de bienvenida', () => {
    expect(ventajasAnual()).toEqual(['Regalo de bienvenida: te enviamos un detalle de merchandising de XPEAK']);
  });

  it('nunca se anuncia lo que aún no existe', () => {
    const todo = ['starter', 'business'].flatMap(p => lista(['dj'], p as 'starter')).join('|');
    expect(todo).not.toMatch(/WhatsApp|ampliada|comunicados|vídeo de fondo|Sello Premium|adelanto|y web/i);
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
    expect(lista(['dj'], 'business')[0]).toBe('Todo lo de Profesional, más:');
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

describe('nivel base (sin pagar y sin ser fundador, tras el lanzamiento)', () => {
  it('enseña lo que tiene de verdad, con los límites de la BD', () => {
    const dj = listaBase(oficiosDe(['dj']));
    expect(dj).toContain('Portafolio de 6 fotos y vídeos');
    expect(dj).toContain('Hasta 3 sets en tu perfil');
    expect(dj).toContain('Ofertas Flash Booking: trabajos urgentes que publican los organizadores y te llegan al momento');
    expect(dj).toContain('Visitas a tu ficha este mes');
    const mago = listaBase(oficiosDe(['mago'])).join('|');
    expect(mago).not.toMatch(/sets|Flash/);
  });
  it('no promete lo que es de pago', () => {
    expect(listaBase(oficiosDe(['dj'])).join('|')).not.toMatch(/Instagram|TikTok|sorteos|publicaci|directos? al mes|Estadísticas/i);
  });
});
