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

function mockViewRows(rows: any[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const gte = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  (supabase.from as any).mockReturnValue({ select });
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
