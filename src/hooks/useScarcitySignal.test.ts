import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScarcitySignal } from './useScarcitySignal';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));

function mockCounts(viewsCount: number, bookingsCount: number, lastViewedAt: string | null = null) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'profile_business_views') {
      // Dos formas de encadenar sobre la misma tabla: .eq().gte() para el
      // conteo semanal, .eq().order().limit().maybeSingle() para la última
      // vista — el select() devuelve un objeto con ambas ramas, y cada
      // .eq() devuelve un objeto con ambos siguientes pasos posibles.
      const maybeSingle = vi.fn().mockResolvedValue({ data: lastViewedAt ? { created_at: lastViewedAt } : null, error: null });
      const limit = vi.fn().mockReturnValue({ maybeSingle });
      const order = vi.fn().mockReturnValue({ limit });
      const gte = vi.fn().mockResolvedValue({ count: viewsCount, error: null });
      const eq = vi.fn().mockReturnValue({ gte, order });
      const select = vi.fn().mockReturnValue({ eq });
      return { select };
    }
    throw new Error(`unexpected table ${table}`);
  });
  (supabase.rpc as any).mockImplementation((fn: string) => {
    if (fn === 'flash_bookings_last_7_days') {
      return Promise.resolve({ data: bookingsCount, error: null });
    }
    throw new Error(`unexpected rpc ${fn}`);
  });
}

describe('useScarcitySignal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns weekly view and booking counts for a user', async () => {
    mockCounts(7, 3);

    const { result } = renderHook(() => useScarcitySignal('user-123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weeklyProfileViews).toBe(7);
    expect(result.current.weeklyContactRequests).toBe(3);
  });

  it('returns the timestamp of the most recent profile view', async () => {
    mockCounts(7, 3, '2026-09-18T10:00:00.000Z');

    const { result } = renderHook(() => useScarcitySignal('user-123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.lastViewedAt).toBe('2026-09-18T10:00:00.000Z');
  });

  it('returns null lastViewedAt when there are no views', async () => {
    mockCounts(0, 0, null);

    const { result } = renderHook(() => useScarcitySignal('user-123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.lastViewedAt).toBeNull();
  });

  it('returns zeros without querying when userId is undefined', async () => {
    const { result } = renderHook(() => useScarcitySignal(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.weeklyProfileViews).toBe(0);
    expect(result.current.weeklyContactRequests).toBe(0);
    expect(result.current.lastViewedAt).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
});
