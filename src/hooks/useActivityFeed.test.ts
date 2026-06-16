import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useActivityFeed } from './useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockProfilesResponse(rows: any[]) {
  const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: rows, error: null }) });
  const gte = vi.fn().mockReturnValue({ order });
  const neq = vi.fn().mockReturnValue({ gte });
  const not = vi.fn().mockReturnValue({ neq });
  const select = vi.fn().mockReturnValue({ not });
  (supabase.from as any).mockReturnValue({ select });
  return { select, not, neq, gte, order };
}

describe('useActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps profile rows to activity text with zone', async () => {
    const now = new Date();
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([
      { id: expect.any(String), text: 'Marta (DJ / Artista) se unió desde Madrid' },
      { id: expect.any(String), text: 'Carlos (Staff / Camarero) se unió desde Barcelona' },
      { id: expect.any(String), text: 'Sonia (Maquilladora) se unió desde Valencia' },
    ]);
  });

  it('omits the zone segment when zone is null', async () => {
    const now = new Date();
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: null, created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items[0]).toEqual({ id: expect.any(String), text: 'Marta (DJ / Artista) se unió a XPEAK' });
  });

  it('returns an empty list when fewer than 3 rows exist even after fallback', async () => {
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
  });
});
