import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

let filas: { role: string; roles: string[] | null; experience_level: string | null }[] = [];

// Cadena from().select().neq().not().or().limit() que resuelve con las filas simuladas.
vi.mock('@/integrations/supabase/client', () => {
  const cadena: Record<string, unknown> = {};
  for (const m of ['from', 'select', 'neq', 'not', 'or', 'limit']) cadena[m] = () => cadena;
  cadena.then = (ok: (r: { data: unknown }) => unknown) => Promise.resolve(ok({ data: filas }));
  return { supabase: cadena };
});

import ExplorarView from '../ExplorarView';

const ordenMusica = () =>
  screen.getAllByRole('button', { name: /^Ver / })
    .map(b => b.getAttribute('aria-label')!.replace('Ver ', ''))
    .filter(n => ['DJs & Artistas', 'Grupos Musicales', 'DJs Emergentes', 'Disco Móvil'].includes(n));

describe('ExplorarView: orden por número de profesionales', () => {
  beforeEach(() => { filas = []; });

  it('sin datos, Disco Móvil (vacía) queda a la derecha del todo en Música', () => {
    render(<ExplorarView />);
    expect(ordenMusica()).toEqual(['DJs & Artistas', 'Grupos Musicales', 'DJs Emergentes', 'Disco Móvil']);
  });

  it('cuando Disco Móvil tiene más perfiles que el resto, pasa a la izquierda', async () => {
    filas = [
      ...Array.from({ length: 5 }, () => ({ role: 'disco-movil', roles: null, experience_level: null })),
      { role: 'dj', roles: null, experience_level: null },
      { role: 'staff', roles: ['grupo-musical'], experience_level: null },
    ];
    render(<ExplorarView />);
    await waitFor(() => expect(ordenMusica()[0]).toBe('Disco Móvil'));
    // dj 1, grupo-musical 1 (como oficio secundario), emergentes 0
    expect(ordenMusica()).toEqual(['Disco Móvil', 'DJs & Artistas', 'Grupos Musicales', 'DJs Emergentes']);
  });

  it('nunca oculta una categoría aunque tenga 0 perfiles', async () => {
    filas = [{ role: 'dj', roles: null, experience_level: null }];
    render(<ExplorarView />);
    await waitFor(() => expect(ordenMusica()).toHaveLength(4));
    expect(screen.getByRole('button', { name: 'Ver Alquiler de Equipos' })).toBeInTheDocument();
  });
});
