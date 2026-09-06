import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRecentBusinessView } from './useRecentBusinessView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

/**
 * Cadena del query builder de Supabase que usa el hook.
 *
 * IMPORTANTE: tiene que incluir TODOS los eslabones que llama el hook. Le
 * faltaba `.not()` (el filtro que descarta zonas nulas), así que `.eq()`
 * devolvía un objeto sin ese método, la llamada reventaba dentro del efecto y
 * `setLoading(false)` no llegaba a ejecutarse nunca: los tests no fallaban por
 * la aserción final sino por un waitFor que expiraba con loading en true.
 *
 * Cada eslabón se devuelve a sí mismo, así que añadir o reordenar filtros en
 * el hook ya no rompe el mock.
 */
function mockViewRows(rows: any[]) {
  const resultado = { data: rows, error: null };
  const chain: any = {};
  for (const metodo of ['select', 'eq', 'not', 'gte', 'order', 'limit']) {
    chain[metodo] = vi.fn().mockReturnValue(chain);
  }
  // `limit` cierra la cadena: es await-eable y devuelve las filas.
  chain.limit = vi.fn().mockResolvedValue(resultado);
  // Por si en el futuro se await-ea la cadena sin llamar a limit.
  chain.then = (resolve: any) => Promise.resolve(resultado).then(resolve);
  (supabase.from as any).mockReturnValue(chain);
}

describe('useRecentBusinessView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the most recent business view with its zone', async () => {
    (useAuth as any).mockReturnValue({ user: { id: 'user-1' } });
    mockViewRows([
      { viewer_zone: 'Madrid', created_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toEqual({
      zone: 'Madrid',
      createdAt: expect.any(String),
    });
  });

  it('returns null when there are no recent views', async () => {
    (useAuth as any).mockReturnValue({ user: { id: 'user-1' } });
    mockViewRows([]);

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toBeNull();
  });

  it('returns null when there is no logged-in user', async () => {
    (useAuth as any).mockReturnValue({ user: null });

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
