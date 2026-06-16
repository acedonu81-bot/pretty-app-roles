import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailableNow } from './useAvailableNow';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockAvailableProfiles(rows: any[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const neq = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ neq });
  const select = vi.fn().mockReturnValue({ eq });
  (supabase.from as any).mockReturnValue({ select });
}

describe('useAvailableNow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps available profiles with role label and color', async () => {
    mockAvailableProfiles([
      { user_id: '1', display_name: 'Marta', role: 'dj', zone: 'Madrid', updated_at: new Date().toISOString() },
      { user_id: '2', display_name: 'Carlos', role: 'staff', zone: 'Barcelona', updated_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useAvailableNow());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.professionals).toEqual([
      { userId: '1', roleLabel: 'DJ / Artista', roleColor: '#4285F4', zone: 'Madrid' },
      { userId: '2', roleLabel: 'Staff / Camarero', roleColor: '#34D399', zone: 'Barcelona' },
    ]);
  });

  it('returns an empty list when nobody is available', async () => {
    mockAvailableProfiles([]);

    const { result } = renderHook(() => useAvailableNow());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.professionals).toEqual([]);
  });
});
