import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FichaReal } from '@/components/FichasRealesTira';

let filas: FichaReal[] = [];

// Cadena from().select().neq().not().not().or().limit() que resuelve con las filas simuladas.
vi.mock('@/integrations/supabase/client', () => {
  const cadena: Record<string, unknown> = {};
  for (const m of ['from', 'select', 'neq', 'not', 'or', 'limit']) cadena[m] = () => cadena;
  cadena.then = (ok: (r: { data: unknown; error: null }) => unknown) => Promise.resolve(ok({ data: filas, error: null }));
  return { supabase: cadena };
});
vi.mock('@/lib/track', () => ({ track: vi.fn() }));

import FichasRealesTira, { elegirFichas, oficioCorto } from '@/components/FichasRealesTira';

const completo = (user_id: string, extra: Partial<FichaReal> = {}): FichaReal => ({
  user_id, display_name: `Pro ${user_id}`, role: 'dj', zone: 'Madrid',
  photo_url: `https://x.supabase.co/storage/v1/object/public/fotos/${user_id}.jpg`,
  bio: 'bio', audio_session_urls: ['https://x/s.mp3'], is_verified: false, score: 0, ...extra,
});

const montar = () => render(
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter><FichasRealesTira /></MemoryRouter>
  </QueryClientProvider>,
);

describe('elegirFichas', () => {
  it('solo perfiles completos con foto y oficio conocido, máximo 8', () => {
    const elegidas = elegirFichas([
      ...Array.from({ length: 10 }, (_, i) => completo(`ok-${i}`)),
      completo('sin-foto', { photo_url: null }),
      completo('sin-bio', { bio: '' }),
      completo('sin-media', { audio_session_urls: [] }),
      completo('empresa', { role: 'empresario' }),
      completo('pendiente', { role: 'pending' }),
    ]);
    expect(elegidas).toHaveLength(8);
    expect(elegidas.every(p => p.user_id.startsWith('ok-'))).toBe(true);
  });

  it('rota con el día como el directorio', () => {
    const pool = Array.from({ length: 12 }, (_, i) => completo(`p-${i}`));
    const primeros = new Set(Array.from({ length: 20 }, (_, d) =>
      elegirFichas(pool, new Date(Date.UTC(2026, 9, 1 + d)))[0].user_id));
    expect(primeros.size).toBeGreaterThan(3);
  });

  it('música delante: 6 de música y luego otros oficios', () => {
    const elegidas = elegirFichas([
      ...Array.from({ length: 5 }, (_, i) => completo(`foto-${i}`, { role: 'media' })),
      ...Array.from({ length: 6 }, (_, i) => completo(`dj-${i}`, { role: 'dj' })),
      ...Array.from({ length: 3 }, (_, i) => completo(`grupo-${i}`, { role: 'grupo-musical' })),
    ]);
    const musica = (id: string) => id.startsWith('dj-') || id.startsWith('grupo-');
    expect(elegidas.slice(0, 6).every(p => musica(p.user_id))).toBe(true);
    expect(elegidas.slice(6).every(p => p.user_id.startsWith('foto-'))).toBe(true);
  });

  it('si no hay otros oficios, rellena con más música', () => {
    const elegidas = elegirFichas(Array.from({ length: 10 }, (_, i) => completo(`dj-${i}`)));
    expect(elegidas).toHaveLength(8);
  });

  it('etiquetas de oficio cortas', () => {
    expect(oficioCorto('dj')).toBe('DJ');
    expect(oficioCorto('grupo-musical')).toBe('Grupo Musical');
    expect(oficioCorto('media')).toBe('Fotografía');
    expect(oficioCorto('mago')).toBe('Mago');
  });
});

describe('FichasRealesTira', () => {
  beforeEach(() => { filas = []; });

  it('pinta las fichas con enlace al perfil y "Ver todos" a /descubrir', async () => {
    filas = Array.from({ length: 4 }, (_, i) => completo(`u${i}`));
    montar();
    await waitFor(() => expect(screen.getByText('Pro u0')).toBeTruthy());
    expect(screen.getByText('Pro u0').closest('a')?.getAttribute('href')).toBe('/p/u0');
    expect(screen.getByText('Ver todos →').closest('a')?.getAttribute('href')).toBe('/descubrir');
    expect(screen.getAllByText('DJ · Madrid')).toHaveLength(4);
  });

  it('con menos de 3 perfiles no pinta nada', async () => {
    filas = [completo('solo')];
    const { container } = montar();
    await waitFor(() => expect(container.textContent).toBe(''));
  });
});
