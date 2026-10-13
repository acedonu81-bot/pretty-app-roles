import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const estado = { porConfirmar: [] as unknown[] };

vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'dj' }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'pro-1' } }) }));
vi.mock('@/hooks/useDashboardBadges', () => ({
  useDashboardBadges: () => ({ flashBadge: 0, msgBadge: 0, demandaBadge: 0 }),
  marcarOfertasVistas: vi.fn(),
}));
vi.mock('@/hooks/useInteresadosPendientes', () => ({
  useInteresadosPendientes: () => ({ pendientes: [], cargado: true, recargar: vi.fn() }),
  marcarInteresadosVistos: vi.fn(),
  usePorConfirmar: () => ({ porConfirmar: estado.porConfirmar, recargar: vi.fn() }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => { const c: any = {}; for (const m of ['select', 'eq']) c[m] = () => c; c.then = (r: any) => Promise.resolve({ count: 0 }).then(r); return c; }, channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel: () => {} },
}));
vi.mock('../flashbooking/OfertaTab', () => ({ default: () => <div>CONTENIDO_OFERTA</div> }));
vi.mock('../flashbooking/DemandaTab', () => ({
  default: ({ foco }: { foco?: { requestId: string } | null }) => <div>CONTENIDO_NUEVA_OFERTA {foco ? `foco:${foco.requestId}` : 'sin-foco'}</div>,
}));
vi.mock('../flashbooking/SolicitudesTab', () => ({ default: () => <div>CONTENIDO_SOLICITUDES</div> }));

import FlashBookingWallView from '../FlashBookingWallView';

const elegido = { responseId: 'r1', requestId: 'q-burguerfest', titulo: 'Burguerfest', organizadorId: 'organizador' };
const montar = () => render(<MemoryRouter initialEntries={['/dashboard']}><FlashBookingWallView /></MemoryRouter>);

// 13 oct 2026: al profesional elegido solo le llegaba la campana y un enlace
// que no abría la oferta. Confirmar es lo único que le falta para cerrar el bolo.
describe('Flash Booking del profesional al que ya han elegido', () => {
  beforeEach(() => { estado.porConfirmar = []; });

  it('sin elecciones pendientes no enseña ningún aviso de confirmar', async () => {
    montar();
    expect(await screen.findByText('CONTENIDO_OFERTA')).toBeTruthy();
    expect(screen.queryByText(/te ha elegido/)).toBeNull();
  });

  it('con una elección pendiente dice quién y qué hacer, y el botón abre esa oferta', async () => {
    estado.porConfirmar = [elegido];
    montar();
    expect(await screen.findByText('Burguerfest te ha elegido')).toBeTruthy();
    expect(screen.getByText('Confirma tu plaza para cerrar el bolo.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Ver y confirmar' }));
    expect(await screen.findByText('CONTENIDO_NUEVA_OFERTA foco:q-burguerfest')).toBeTruthy();
  });

  it('con varias, resume cuántas', async () => {
    estado.porConfirmar = [elegido, { ...elegido, responseId: 'r2', requestId: 'q2', titulo: 'Boda Ana' }];
    montar();
    expect(await screen.findByText('2 organizadores te han elegido')).toBeTruthy();
  });
});
