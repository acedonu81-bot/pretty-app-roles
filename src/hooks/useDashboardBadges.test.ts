import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const channelMock = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'flash_bookings') {
        return { select: () => ({ eq: () => ({ eq: () => Promise.resolve({ count: 3 }) }) }) };
      }
      if (table === 'conversations') {
        return { select: () => ({ or: () => ({ limit: () => Promise.resolve({ data: [{ id: 'c1' }, { id: 'c2' }] }) }) }) };
      }
      if (table === 'messages') {
        return { select: () => ({ in: () => ({ neq: () => ({ eq: () => Promise.resolve({ count: 5 }) }) }) }) };
      }
      throw new Error(`unexpected table: ${table}`);
    }),
    channel: vi.fn(() => channelMock),
    removeChannel: vi.fn(),
  },
}));

describe('useDashboardBadges', () => {
  beforeEach(() => { channelMock.on.mockClear(); channelMock.subscribe.mockClear(); });

  it('devuelve flashBadge y msgBadge para un profesional', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', false));

    await waitFor(() => expect(result.current.flashBadge).toBe(3));
    await waitFor(() => expect(result.current.msgBadge).toBe(5));

    const { supabase } = await import('@/integrations/supabase/client');
    for (const [topic] of (supabase.channel as ReturnType<typeof vi.fn>).mock.calls) {
      expect(topic).toContain('user-123');
    }
  });

  it('no consulta flash_bookings cuando isEmpresario es true', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));

    await waitFor(() => expect(result.current.msgBadge).toBe(5));
    expect(result.current.flashBadge).toBe(0);
  });

  it('devuelve 0 sin userId, sin lanzar', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges(undefined, false));
    expect(result.current).toEqual({ flashBadge: 0, msgBadge: 0 });
  });

  it('usa un nombre de canal único por instancia, no un topic fijo compartido', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    (supabase.channel as ReturnType<typeof vi.fn>).mockClear();
    const { useDashboardBadges } = await import('./useDashboardBadges');

    renderHook(() => useDashboardBadges('user-abc', false));
    await waitFor(() => expect(supabase.channel).toHaveBeenCalled());

    const topics = (supabase.channel as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0] as string);
    // Ningún topic debe ser el nombre fijo antiguo compartido entre sidebar y campanita
    expect(topics).not.toContain('sidebar_flash_bookings');
    expect(topics).not.toContain('badges_msgs');
    for (const topic of topics) {
      expect(topic).toContain('user-abc');
    }
  });
});
