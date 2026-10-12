import { describe, it, expect } from 'vitest';
import { compararDirectorio } from '@/lib/dailyRotation';

// Perfiles con la forma mínima que usa el orden del directorio.
const completo = (user_id: string, extra: Record<string, unknown> = {}) => ({
  user_id,
  photo_url: 'https://x/foto.jpg',
  bio: 'DJ de bodas',
  audio_session_urls: ['https://x/sesion.mp3'],
  is_verified: false,
  score: 0,
  ...extra,
});

const dia = (n: number) => new Date(Date.UTC(2026, 9, 1 + n, 12));

describe('compararDirectorio', () => {
  // Caso real 12 oct 2026: 3 DJs verificados (2 completos + Judith sin bio ni
  // sesiones) y 14 completos sin verificar. "Verificado" iba antes que la
  // rotación, así que solo rotaban los 2 verificados completos.
  const verificadoIncompleto = { user_id: 'judith', photo_url: 'https://x/f.jpg', bio: '', is_verified: true, score: 700 };
  const perfiles = [
    verificadoIncompleto,
    completo('borja', { is_verified: true, score: 26 }),
    completo('gonzalo', { is_verified: true, score: 23 }),
    ...Array.from({ length: 14 }, (_, i) => completo(`dj-${i}`, { score: 14 - i })),
  ];

  it('un verificado con perfil incompleto queda por debajo de los completos', () => {
    const orden = [...perfiles].sort((a, b) => compararDirectorio(a, b, dia(0)));
    expect(orden.at(-1)?.user_id).toBe('judith');
  });

  it('el primer puesto rota entre todos los perfiles completos, no solo los verificados', () => {
    const primeros = new Set<string>();
    for (let n = 0; n < 60; n++) {
      primeros.add([...perfiles].sort((a, b) => compararDirectorio(a, b, dia(n)))[0].user_id);
    }
    // 60 días entre 16 completos: con un reparto razonable suben muchos
    // distintos, y nunca un perfil incompleto.
    expect(primeros.size).toBeGreaterThanOrEqual(10);
    expect(primeros.has('judith')).toBe(false);
  });

  it('el orden no cambia dentro del mismo día', () => {
    const a = [...perfiles].sort((x, y) => compararDirectorio(x, y, dia(3))).map(p => p.user_id);
    const b = [...perfiles].reverse().sort((x, y) => compararDirectorio(x, y, dia(3))).map(p => p.user_id);
    expect(a).toEqual(b);
  });

  it('sin foto siempre al final, aunque esté verificado', () => {
    const sinFoto = { ...completo('sin-foto', { is_verified: true }), photo_url: null };
    const orden = [sinFoto, completo('con-foto')].sort((a, b) => compararDirectorio(a, b, dia(0)));
    expect(orden.map(p => p.user_id)).toEqual(['con-foto', 'sin-foto']);
  });

  it('por debajo del máximo, verificado y después score deciden', () => {
    const base = { photo_url: 'https://x/f.jpg', bio: 'bio' };
    const orden = [
      { ...base, user_id: 'score-alto', score: 50, is_verified: false },
      { ...base, user_id: 'verificado', score: 1, is_verified: true },
      { ...base, user_id: 'score-bajo', score: 2, is_verified: false },
    ].sort((a, b) => compararDirectorio(a, b, dia(0)));
    expect(orden.map(p => p.user_id)).toEqual(['verificado', 'score-alto', 'score-bajo']);
  });

  it('la insignia de prioridad vigente sigue por delante del perfil completo', () => {
    const conPrioridad = { user_id: 'prioridad', photo_url: 'https://x/f.jpg', priority_badge_until: '2099-01-01T00:00:00Z' };
    const orden = [completo('completo'), conPrioridad].sort((a, b) => compararDirectorio(a, b, dia(0)));
    expect(orden[0].user_id).toBe('prioridad');
  });
});
