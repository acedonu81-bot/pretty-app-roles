import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveStats } from './useLiveStats';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockFrom(impl: (table: string, callIndex: number) => any) {
  let callIndex = 0;
  (supabase.from as any).mockImplementation((table: string) => {
    const builder = impl(table, callIndex);
    callIndex++;
    return builder;
  });
}

describe('useLiveStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computes active professionals, available now, and distinct cities', async () => {
    mockFrom((table) => {
      if (table !== 'profiles') throw new Error(`unexpected table ${table}`);
      return {
        select: vi.fn((_cols: string, opts?: any) => {
          // count-only head queries (active professionals / available now)
          if (opts?.head) {
            const eqChain = {
              neq: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              then: undefined,
            };
            // Resolve with different counts depending on whether eq('is_flash_active', true) was chained.
            const result = { count: 12, error: null };
            eqChain.neq = vi.fn().mockReturnValue(Promise.resolve(result));
            eqChain.eq = vi.fn().mockReturnValue({
              neq: vi.fn().mockReturnValue(Promise.resolve({ count: 4, error: null })),
            });
            return eqChain;
          }
          // zone-listing query for distinct cities
          return {
            neq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({
                data: [{ zone: 'Madrid' }, { zone: 'Madrid' }, { zone: 'Valencia' }],
                error: null,
              }),
            }),
          };
        }),
      };
    });

    const { result } = renderHook(() => useLiveStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats).toEqual({
      activeProfessionals: 12,
      availableNow: 4,
      cities: 2,
    });
  });
});
