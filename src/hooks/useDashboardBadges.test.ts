import { act, renderHook, waitFor } from '@testing-library/react';
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
  for (const metodo of ['select', 'eq', 'in', 'neq', 'or', 'not', 'is', 'gte', 'lte', 'order', 'limit', 'update']) {
    chain[metodo] = vi.fn(() => chain);
  }
  (chain as { then: unknown }).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resultado).then(resolve);
  return chain;
}

/** Última cadena creada para flash_bookings, para inspeccionar sus filtros. */
const flashChains: Record<string, unknown>[] = [];
const notifChains: Record<string, unknown>[] = [];
/** Candidaturas sin elegir a las ofertas abiertas del organizador. */
let interesados: unknown[] = [];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'flash_bookings') {
        const c = cadena({ count: 3, data: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] });
        flashChains.push(c);
        return c;
      }
      if (table === 'event_request_responses') return cadena({ data: interesados });
      if (table === 'profiles') return cadena({ data: [{ user_id: 'pro-1', display_name: 'Manuel Jesús' }] });
      if (table === 'conversations') return cadena({ data: [{ id: 'c1' }, { id: 'c2' }] });
      if (table === 'messages') return cadena({ count: 5 });
      if (table === 'notifications') {
        const c = cadena({ count: 4 });
        notifChains.push(c);
        return c;
      }
      throw new Error(`unexpected table: ${table}`);
    }),
    channel: vi.fn(() => channelMock),
    removeChannel: vi.fn(),
  },
}));

describe('useDashboardBadges', () => {
  beforeEach(() => { channelMock.on.mockClear(); channelMock.subscribe.mockClear(); localStorage.clear(); interesados = []; });

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

  // 13 oct 2026: el globo de Flash Booking del empresario contaba TODAS las
  // reservas ya respondidas, para siempre ("se quedan clavadas"): ninguna
  // acción lo apagaba. Ahora cuenta solo las respuestas que aún no ha visto y
  // se apaga al abrir Flash Booking.
  it('al empresario solo le cuenta las respuestas que aún no ha visto', async () => {
    localStorage.setItem('xpeak_flash_visto_user-123', JSON.stringify(['a']));
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.flashBadge).toBe(2));
  });

  it('marcarFlashVisto apaga el globo del empresario y se recuerda entre visitas', async () => {
    const { useDashboardBadges, marcarFlashVisto } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.flashBadge).toBe(3));

    await act(async () => { await marcarFlashVisto('user-123'); });
    await waitFor(() => expect(result.current.flashBadge).toBe(0));
    expect(JSON.parse(localStorage.getItem('xpeak_flash_visto_user-123') ?? '[]').sort()).toEqual(['a', 'b', 'c']);

    // Otra visita: sigue en 0 aunque las reservas respondidas sigan existiendo.
    const segundo = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(segundo.result.current.msgBadge).toBe(5));
    expect(segundo.result.current.flashBadge).toBe(0);
  });

  // 13 oct 2026: un DJ se apuntó a Burguerfest y el organizador no tenía ningún
  // globo: solo contaba flash_bookings, no las candidaturas a sus ofertas.
  const candidatura = (id: string, caduca = new Date(Date.now() + 86400000).toISOString()) => ({
    id, request_id: 'q1', professional_user_id: 'pro-1', created_at: '2026-10-13T19:54:08Z',
    event_requests: { client_name: 'Burguerfest', expires_at: caduca },
  });

  it('al empresario le suma los profesionales apuntados a sus ofertas que aún no ha visto', async () => {
    interesados = [candidatura('r1')];
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.flashBadge).toBe(4));
  });

  it('no cuenta candidaturas de ofertas ya caducadas', async () => {
    interesados = [candidatura('r1', new Date(Date.now() - 1000).toISOString())];
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.flashBadge).toBe(3));
  });

  it('marcarInteresadosVistos apaga ese aviso y se recuerda', async () => {
    interesados = [candidatura('r1')];
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { cargarInteresadosPendientes, marcarInteresadosVistos } = await import('./useInteresadosPendientes');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.flashBadge).toBe(4));

    const lista = await cargarInteresadosPendientes('user-123');
    expect(lista).toHaveLength(1);
    expect(lista[0]).toMatchObject({ responseId: 'r1', requestId: 'q1', titulo: 'Burguerfest', nombre: 'Manuel Jesús' });

    await act(async () => { marcarInteresadosVistos('user-123', lista); });
    await waitFor(() => expect(result.current.flashBadge).toBe(3));
    expect(JSON.parse(localStorage.getItem('xpeak_interesados_visto_user-123') ?? '[]')).toEqual(['r1']);
  });

  it('a un profesional no le afecta lo visto: cuenta sus pendientes', async () => {
    localStorage.setItem('xpeak_flash_visto_user-123', JSON.stringify(['a', 'b', 'c']));
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', false));
    await waitFor(() => expect(result.current.flashBadge).toBe(3));
  });

  // 13 oct 2026: un profesional buscó la oferta de Burguerfest y no la encontró
  // ("ha dado vueltas"): el menú solo avisaba de reservas directas pendientes,
  // no de ofertas nuevas de organizadores. demandaBadge cuenta las ofertas
  // nuevas sin ver (notificaciones 'event_request' sin leer).
  it('al profesional le cuenta las ofertas nuevas sin ver (demandaBadge)', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', false));
    await waitFor(() => expect(result.current.demandaBadge).toBe(4));

    const cadenaNotif = notifChains[notifChains.length - 1];
    expect(cadenaNotif.eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(cadenaNotif.eq).toHaveBeenCalledWith('type', 'event_request');
    expect(cadenaNotif.eq).toHaveBeenCalledWith('is_read', false);
  });

  it('el empresario no tiene demandaBadge (publica ofertas, no las recibe)', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));
    await waitFor(() => expect(result.current.msgBadge).toBe(5));
    expect(result.current.demandaBadge).toBe(0);
  });

  it('marcarOfertasVistas las marca leídas y apaga el globo', async () => {
    const { useDashboardBadges, marcarOfertasVistas } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', false));
    await waitFor(() => expect(result.current.demandaBadge).toBe(4));

    const { supabase } = await import('@/integrations/supabase/client');
    const llamadas = (supabase.from as ReturnType<typeof vi.fn>).mock.calls.length;
    notifChains.length = 0;
    await act(async () => { await marcarOfertasVistas('user-123'); });
    const update = notifChains.find(c => (c.update as ReturnType<typeof vi.fn> | undefined)?.mock.calls.length);
    expect(update).toBeTruthy();
    expect((update!.update as ReturnType<typeof vi.fn>).mock.calls[0][0]).toEqual({ is_read: true });
    expect((supabase.from as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(llamadas);
  });

  it('devuelve 0 sin userId, sin lanzar', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges(undefined, false));
    expect(result.current).toEqual({ flashBadge: 0, msgBadge: 0, demandaBadge: 0 });
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
