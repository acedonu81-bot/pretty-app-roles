import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const channelMock = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };

/**
 * Cadena encadenable del query builder: cada filtro se devuelve a sí mismo y
 * la cadena entera es await-eable, así que resuelve al mismo resultado la
 * llames como la llames.
 *
 * Antes cada tabla declaraba a mano su secuencia exacta de filtros
 * (`eq -> eq`, `in -> neq -> eq`...). El hook tiene DOS ramas para
 * flash_bookings — el profesional filtra `eq('status')` y quien contrata
 * `in('status', [...])` — y el mock solo cubría la primera, así que la rama
 * de empresario lanzaba "q.eq(...).in is not a function". El test seguía en
 * verde porque comprobaba msgBadge y la promesa de flash moría sin capturar:
 * un rechazo no gestionado que Vitest reportaba aparte.
 */
function cadena(resultado: unknown) {
  const chain: Record<string, unknown> = {};
  for (const metodo of ['select', 'eq', 'in', 'neq', 'or', 'not', 'gte', 'lte', 'order', 'limit']) {
    chain[metodo] = vi.fn(() => chain);
  }
  (chain as { then: unknown }).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resultado).then(resolve);
  return chain;
}

/** Última cadena creada para flash_bookings, para inspeccionar sus filtros. */
const flashChains: Record<string, unknown>[] = [];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'flash_bookings') {
        const c = cadena({ count: 3 });
        flashChains.push(c);
        return c;
      }
      if (table === 'conversations') return cadena({ data: [{ id: 'c1' }, { id: 'c2' }] });
      if (table === 'messages') return cadena({ count: 5 });
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

  // El nombre anterior de este test ("no consulta flash_bookings cuando
  // isEmpresario es true") describía una conducta que el hook ya no tiene: se
  // cambió a propósito porque el empresario se quedaba SIN NINGÚN aviso cuando
  // un profesional respondía a su solicitud. Ahora ambos roles cuentan, cada
  // uno lo suyo.
  it('al empresario le cuenta las respuestas recibidas, no las pendientes', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));

    await waitFor(() => expect(result.current.msgBadge).toBe(5));
    await waitFor(() => expect(result.current.flashBadge).toBe(3));

    // Filtra por quien creó la solicitud y por estados ya resueltos: es lo que
    // convierte el badge en "te han contestado" y no en "tienes pendientes".
    const cadenaFlash = flashChains[flashChains.length - 1];
    expect(cadenaFlash.eq).toHaveBeenCalledWith('created_by', 'user-123');
    expect(cadenaFlash.in).toHaveBeenCalledWith(
      'status',
      expect.arrayContaining(['confirmed', 'rejected']),
    );
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
