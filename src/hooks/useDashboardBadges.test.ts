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
});
