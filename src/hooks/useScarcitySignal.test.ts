import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScarcitySignal } from './useScarcitySignal';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));

function mockCounts(viewsCount: number, bookingsCount: number) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'profile_business_views') {
      const gte = vi.fn().mockResolvedValue({ count: viewsCount, error: null });
      const eq = vi.fn().mockReturnValue({ gte });
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

  it('returns zeros without querying when userId is undefined', async () => {
    const { result } = renderHook(() => useScarcitySignal(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.weeklyProfileViews).toBe(0);
    expect(result.current.weeklyContactRequests).toBe(0);
    expect(supabase.from).not.toHaveBeenCalled();
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
});
