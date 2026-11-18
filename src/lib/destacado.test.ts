// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { compararDirectorio, esDestacado, COMPLETENESS_MAX } from './dailyRotation';

const completo = { photo_url: 'https://x/f.jpg', bio: 'Bio', audio_session_urls: ['a'] };
const perfil = (id: string, extra: Record<string, unknown> = {}) => ({ user_id: id, ...completo, ...extra });
const orden = (lista: ReturnType<typeof perfil>[], d = new Date('2026-12-01T10:00:00Z')) => [...lista].sort((a, b) => compararDirectorio(a, b, d)).map(p => p.user_id);

describe('esDestacado', () => {
  it('solo Premium con foto', () => {
    expect(esDestacado({ subscription_tier: 'business', photo_url: 'https://x/f.jpg' })).toBe(true);
    expect(esDestacado({ subscription_tier: 'business', photo_url: null })).toBe(false);
    expect(esDestacado({ subscription_tier: 'starter', photo_url: 'https://x/f.jpg' })).toBe(false);
    expect(esDestacado({ subscription_tier: 'free', photo_url: 'https://x/f.jpg' })).toBe(false);
    expect(esDestacado({ subscription_tier: null, photo_url: 'https://x/f.jpg' })).toBe(false);
  });
  it('los tiers antiguos cuentan como Premium', () => {
    for (const t of ['premium', 'agency', 'elite']) expect(esDestacado({ subscription_tier: t, photo_url: 'https://x/f.jpg' })).toBe(true);
  });
});

describe('compararDirectorio con posición destacada', () => {
  it('Premium con foto sale por delante de un perfil completo sin plan', () => {
    const l = [perfil('libre'), perfil('premium', { subscription_tier: 'business' }), perfil('libre2')];
    expect(orden(l)[0]).toBe('premium');
  });

  it('Profesional no sube', () => {
    const l = [perfil('a'), perfil('pro', { subscription_tier: 'starter' }), perfil('b')];
    const o = orden(l);
    // sin plan de pago que valga, el orden es el de la rotación diaria entre los tres
    expect(o.sort()).toEqual(['a', 'b', 'pro']);
    const sinTier = orden([perfil('a'), perfil('pro'), perfil('b')]);
    expect(orden(l)).toEqual(sinTier);
  });

  it('un Premium sin foto sigue al final: la foto manda sobre el plan', () => {
    const l = [perfil('premium-sin-foto', { subscription_tier: 'business', photo_url: null }), perfil('libre')];
    expect(orden(l)).toEqual(['libre', 'premium-sin-foto']);
  });

  it('entre varios Premium se rota cada día, no queda uno fijo arriba', () => {
    const l = ['p1', 'p2', 'p3', 'p4', 'p5'].map(id => perfil(id, { subscription_tier: 'business' }));
    const primeros = new Set<string>();
    for (let dia = 1; dia <= 20; dia++) primeros.add(orden(l, new Date(`2026-12-${String(dia).padStart(2, '0')}T10:00:00Z`))[0]);
    expect(primeros.size).toBeGreaterThan(1);
  });

  it('los Premium van todos por delante de los demás', () => {
    const l = [perfil('x1'), perfil('p1', { subscription_tier: 'business' }), perfil('x2'), perfil('p2', { subscription_tier: 'premium' }), perfil('x3')];
    const o = orden(l);
    expect(new Set(o.slice(0, 2))).toEqual(new Set(['p1', 'p2']));
  });

  it('sin tier en los datos (home, Top Weekend) el orden no cambia', () => {
    const a = perfil('a'); const b = perfil('b');
    expect(orden([a, b])).toEqual(orden([b, a]));
    expect(COMPLETENESS_MAX).toBe(7);
  });
});
