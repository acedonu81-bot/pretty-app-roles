// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { planDe, nombrePlan, ventajasDe } from './ventajasPlan';

describe('ventajasPlan', () => {
  it('normaliza los tiers antiguos sin quitar nada a nadie', () => {
    expect(planDe(null)).toBe('free');
    expect(planDe('raro')).toBe('free');
    expect(planDe('starter')).toBe('starter');
    for (const t of ['business', 'premium', 'agency', 'elite']) expect(planDe(t)).toBe('business');
  });

  it('usa los nombres públicos', () => {
    expect([nombrePlan('free'), nombrePlan('starter'), nombrePlan('business')]).toEqual(['Esencial', 'Profesional', 'Premium']);
  });

  it('límites decididos el 13 nov', () => {
    expect([ventajasDe('free').fotos, ventajasDe('starter').fotos, ventajasDe('business').fotos]).toEqual([6, 12, 20]);
    expect([ventajasDe('free').sets, ventajasDe('starter').sets, ventajasDe('business').sets]).toEqual([3, 10, Infinity]);
    expect([ventajasDe('free').linksSesion, ventajasDe('starter').linksSesion, ventajasDe('business').linksSesion]).toEqual([1, 3, Infinity]);
  });

  it('redes ocultas solo en Esencial; vídeo, Inicio y exportar solo en Premium', () => {
    expect(ventajasDe('free').redesVisibles).toBe(false);
    expect(ventajasDe('starter').redesVisibles).toBe(true);
    expect(ventajasDe('starter').videoFondo).toBe(false);
    expect(ventajasDe('business').videoFondo).toBe(true);
    expect(ventajasDe('starter').destacadoInicio).toBe(false);
    expect(ventajasDe('business').exportarEstadisticas).toBe(true);
  });

  it('cada plan incluye todo lo del anterior', () => {
    const orden = ['free', 'starter', 'business'].map(ventajasDe);
    for (let i = 1; i < orden.length; i++) {
      for (const [k, v] of Object.entries(orden[i - 1])) {
        const sig = (orden[i] as Record<string, unknown>)[k];
        if (typeof v === 'number') expect(sig as number).toBeGreaterThanOrEqual(v);
        if (v === true) expect(sig).toBe(true);
      }
    }
  });
});
