import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const estado = {
  pendientes: [] as unknown[],
  search: '',
  focoRecibido: null as null | { requestId: string; n: number },
};
const marcarInteresadosVistos = vi.fn();
const onMessage = vi.fn();

vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'empresario' }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'organizador' } }) }));
vi.mock('@/hooks/useDashboardBadges', () => ({
  useDashboardBadges: () => ({ flashBadge: 0, msgBadge: 0, demandaBadge: 0 }),
  marcarOfertasVistas: vi.fn(),
}));
vi.mock('@/hooks/useInteresadosPendientes', () => ({
  useInteresadosPendientes: () => ({ pendientes: estado.pendientes, cargado: true, recargar: vi.fn() }),
  marcarInteresadosVistos: (...a: unknown[]) => marcarInteresadosVistos(...a),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({}), channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel: () => {} },
}));
vi.mock('../flashbooking/OfertaTab', () => ({ default: () => <div>CONTENIDO_OFERTA</div> }));
vi.mock('../flashbooking/DemandaTab', () => ({
  default: ({ foco }: { foco?: { requestId: string; n: number } | null }) => {
    estado.focoRecibido = foco ?? null;
    return <div>CONTENIDO_NUEVA_OFERTA {foco ? `foco:${foco.requestId}` : 'sin-foco'}</div>;
  },
}));
vi.mock('../flashbooking/SolicitudesTab', () => ({ default: () => <div>CONTENIDO_SOLICITUDES</div> }));

import FlashBookingWallView from '../FlashBookingWallView';

const manuel = {
  responseId: 'r1', requestId: 'q-burguerfest', titulo: 'Burguerfest',
  professionalUserId: 'pro-manuel', nombre: 'Manuel Jesús Frias Martín', creado: '2026-10-13T19:54:08Z',
};

const montar = () => render(
  <MemoryRouter initialEntries={[`/dashboard${estado.search}`]}>
    <FlashBookingWallView onMessage={onMessage} />
  </MemoryRouter>,
);

// 13 oct 2026: un DJ se apuntó a Burguerfest y el organizador no se enteró: su
// único aviso era la campana y el candidato estaba dentro de una tarjeta
// plegada. Ahora hay un aviso fijo arriba, con botones que actúan.
describe('Flash Booking del organizador con profesionales apuntados', () => {
  beforeEach(() => {
    estado.pendientes = []; estado.search = ''; estado.focoRecibido = null;
    marcarInteresadosVistos.mockClear(); onMessage.mockClear();
  });

  it('sin candidatos no enseña ningún aviso', async () => {
    montar();
    expect(await screen.findByText(/CONTENIDO_NUEVA_OFERTA/)).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('con un candidato dice quién y a qué oferta, y apaga el globo del menú', async () => {
    estado.pendientes = [manuel];
    montar();
    expect(await screen.findByText('Manuel Jesús Frias Martín se ha apuntado a Burguerfest')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
    await waitFor(() => expect(marcarInteresadosVistos).toHaveBeenCalledWith('organizador', [manuel]));
  });

  it('"Ver y elegir" abre la oferta concreta en Nueva oferta, aunque esté en otra pestaña', async () => {
    estado.pendientes = [manuel];
    montar();
    fireEvent.click(await screen.findByRole('button', { name: /^Oferta/ }));
    expect(await screen.findByText('CONTENIDO_OFERTA')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Ver y elegir' }));
    expect(await screen.findByText('CONTENIDO_NUEVA_OFERTA foco:q-burguerfest')).toBeTruthy();
  });

  it('"Escribir" abre el chat con ese profesional', async () => {
    estado.pendientes = [manuel];
    montar();
    fireEvent.click(await screen.findByRole('button', { name: 'Escribir' }));
    expect(onMessage).toHaveBeenCalledWith('pro-manuel', 'Manuel Jesús Frias Martín');
  });

  it('con varios candidatos resume cuántos son y los lista', async () => {
    estado.pendientes = [manuel, { ...manuel, responseId: 'r2', professionalUserId: 'pro-2', nombre: 'Ana DJ' }];
    montar();
    expect(await screen.findByText('Tienes 2 profesionales apuntados a tus ofertas')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Ver y elegir' })).toHaveLength(2);
  });

  it('el enlace del email/campana (?oferta=) abre esa oferta directamente', async () => {
    estado.search = '?view=flashbooking&tab=demanda&oferta=q-burguerfest';
    montar();
    expect(await screen.findByText('CONTENIDO_NUEVA_OFERTA foco:q-burguerfest')).toBeTruthy();
  });
});
