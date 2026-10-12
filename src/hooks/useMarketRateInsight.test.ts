import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMarketRateInsight } from './useMarketRateInsight';
import { supabase } from '@/integrations/supabase/client';

// El cálculo (mínimo de 5 comparables, media de la categoría/zona, tarifa
// propia vacía) vive en la RPC market_rate_percent_diff desde SEC-06; el hook
// solo traslada su resultado.
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn() },
}));

const rpcDevuelve = (data: unknown) =>
  (supabase.rpc as ReturnType<typeof vi.fn>).mockResolvedValue({ data, error: null });

describe('useMarketRateInsight', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('pide el cálculo a la RPC con el id del usuario y devuelve su resultado', async () => {
    rpcDevuelve(20);
    const { result } = renderHook(() => useMarketRateInsight('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(supabase.rpc).toHaveBeenCalledWith('market_rate_percent_diff', { p_user_id: 'user-1' });
    expect(result.current.percentDiff).toBe(20);
  });

  it('devuelve null cuando la RPC no tiene comparación', async () => {
    rpcDevuelve(null);
    const { result } = renderHook(() => useMarketRateInsight('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBeNull();
  });

  it('sin usuario no consulta nada', async () => {
    const { result } = renderHook(() => useMarketRateInsight(undefined));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(result.current.percentDiff).toBeNull();
  });
});
