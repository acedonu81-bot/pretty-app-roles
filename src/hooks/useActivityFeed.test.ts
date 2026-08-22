// src/hooks/useActivityFeed.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useActivityFeed } from './useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockTables(signupRows: any[], contactRows: any[]) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'profiles') {
      const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: signupRows, error: null }) });
      const gte = vi.fn().mockReturnValue({ order });
      const neq = vi.fn().mockReturnValue({ gte });
      const not = vi.fn().mockReturnValue({ neq });
      const select = vi.fn().mockReturnValue({ not });
      return { select };
    }
    if (table === 'contact_events') {
      const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: contactRows, error: null }) });
      const gte = vi.fn().mockReturnValue({ order });
      const select = vi.fn().mockReturnValue({ gte });
      return { select };
    }
    throw new Error(`unexpected table ${table}`);
  });
}

describe('useActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps profile rows to activity text with zone', async () => {
    const now = new Date();
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items.map(i => i.text)).toEqual([
      'Marta (DJ / Artista) se unió desde Madrid',
      'Carlos (Camarero) se unió desde Barcelona',
      'Sonia (Maquilladora) se unió desde Valencia',
    ]);
  });

  it('omits the zone segment when zone is null', async () => {
    const now = new Date();
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: null, created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items[0].text).toEqual('Marta (DJ / Artista) se unió a XPEAK');
  });

  it('shows the activity even when only one row exists (MIN_ITEMS = 1)', async () => {
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: new Date().toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ name: 'Marta' });
  });

  it('merges signup and contact events sorted by date, newest first', async () => {
    const t0 = new Date(Date.now() - 1000).toISOString();
    const t1 = new Date(Date.now() - 2000).toISOString();
    const t2 = new Date(Date.now() - 3000).toISOString();
    mockTables(
      [
        { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: t1 },
        { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: t2 },
      ],
      [
        { professional_role: 'dj', professional_zone: 'Valencia', created_at: t0 },
      ],
    );

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items.map(i => ({ kind: i.kind, text: i.text }))).toEqual([
      { kind: 'contact', text: 'Alguien contactó a un/a DJ / Artista en Valencia' },
      { kind: 'signup', text: 'Marta (DJ / Artista) se unió desde Madrid' },
      { kind: 'signup', text: 'Carlos (Camarero) se unió desde Barcelona' },
    ]);
  });
});
