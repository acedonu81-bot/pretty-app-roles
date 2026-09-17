import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMarketRateInsight } from './useMarketRateInsight';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockProfiles(me: { hourly_rate: number; category: string; zone: string } | null, peers: number[]) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table !== 'profiles') throw new Error(`unexpected table ${table}`);
    const maybeSingle = vi.fn().mockResolvedValue({ data: me, error: null });
    const eqSelf = vi.fn().mockReturnValue({ maybeSingle });
    const selectSelf = vi.fn().mockReturnValue({ eq: eqSelf });

    const gt = vi.fn().mockResolvedValue({
      data: peers.map(hourly_rate => ({ hourly_rate })),
      error: null,
    });
    const neq = vi.fn().mockReturnValue({ gt });
    const eqZone = vi.fn().mockReturnValue({ neq });
    const eqCategory = vi.fn().mockReturnValue({ eq: eqZone });
    const selectPeers = vi.fn().mockReturnValue({ eq: eqCategory });

    let call = 0;
    return {
      select: vi.fn().mockImplementation(() => {
        call += 1;
        return call === 1 ? selectSelf() : selectPeers();
      }),
    };
  });
}

describe('useMarketRateInsight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when fewer than 5 comparable peers exist', async () => {
    mockProfiles({ hourly_rate: 100, category: 'dj', zone: 'Madrid' }, [80, 90, 110]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBeNull();
  });

  it('returns percent difference vs peer average when 5+ peers exist', async () => {
    // peer avg = (80+90+100+110+120)/5 = 100, me = 120 -> +20%
    mockProfiles({ hourly_rate: 120, category: 'dj', zone: 'Madrid' }, [80, 90, 100, 110, 120]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBe(20);
  });

  it('returns null when own hourly_rate is missing or zero', async () => {
    mockProfiles({ hourly_rate: 0, category: 'dj', zone: 'Madrid' }, [80, 90, 100, 110, 120]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBeNull();
  });
});
