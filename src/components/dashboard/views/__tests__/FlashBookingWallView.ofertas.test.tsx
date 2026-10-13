import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const estado = { role: 'dj', demandaBadge: 0, search: '' };
const marcarOfertasVistas = vi.fn(async () => {});

vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: estado.role }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('@/hooks/useDashboardBadges', () => ({
  useDashboardBadges: () => ({ flashBadge: 0, msgBadge: 0, demandaBadge: estado.demandaBadge }),
  marcarOfertasVistas: (...a: unknown[]) => marcarOfertasVistas(...(a as [string])),
}));
vi.mock('@/integrations/supabase/client', () => {
  const cadena: any = {};
  for (const m of ['select', 'eq']) cadena[m] = () => cadena;
  cadena.then = (r: (v: unknown) => unknown) => Promise.resolve({ count: 0 }).then(r);
  return { supabase: { from: () => cadena, channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel: () => {} } };
});
vi.mock('../flashbooking/OfertaTab', () => ({ default: () => <div>CONTENIDO_OFERTA</div> }));
vi.mock('../flashbooking/DemandaTab', () => ({ default: () => <div>CONTENIDO_DEMANDA</div> }));
vi.mock('../flashbooking/SolicitudesTab', () => ({ default: () => <div>CONTENIDO_SOLICITUDES</div> }));

import FlashBookingWallView from '../FlashBookingWallView';

const montar = () => render(<MemoryRouter initialEntries={[`/dashboard${estado.search}`]}><FlashBookingWallView /></MemoryRouter>);

// 13 oct 2026: un profesional buscó la oferta de Burguerfest y "dio vueltas":
// Flash Booking abría en "Oferta" (profesionales disponibles) y las ofertas de
// organizadores están en "Demanda". Ahora abre en Demanda cuando hay nuevas.
describe('Flash Booking del profesional con ofertas nuevas', () => {
  beforeEach(() => { estado.role = 'dj'; estado.demandaBadge = 0; estado.search = ''; marcarOfertasVistas.mockClear(); });

  it('sin ofertas nuevas abre como siempre, en Oferta', async () => {
    montar();
    expect(await screen.findByText('CONTENIDO_OFERTA')).toBeTruthy();
    expect(screen.queryByText(/Tienes \d+ ofertas? nuevas? de organizadores/)).toBeNull();
  });

  it('con ofertas nuevas abre directamente en Demanda y las marca como vistas', async () => {
    estado.demandaBadge = 3;
    montar();
    expect(await screen.findByText('CONTENIDO_DEMANDA')).toBeTruthy();
    await waitFor(() => expect(marcarOfertasVistas).toHaveBeenCalledWith('u1'));
  });

  it('si el profesional elige otra pestaña, muestra un aviso claro que lleva a Demanda', async () => {
    estado.demandaBadge = 2;
    estado.search = '?tab=oferta';
    montar();
    expect(await screen.findByText('CONTENIDO_OFERTA')).toBeTruthy();
    expect(screen.getByText('Tienes 2 ofertas nuevas de organizadores')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Ver las ofertas' }));
    expect(await screen.findByText('CONTENIDO_DEMANDA')).toBeTruthy();
  });

  it('la pestaña se llama "Nueva oferta" (dj, staff, lo que sea), ya no "Demanda"', async () => {
    montar();
    expect(await screen.findByRole('button', { name: /Nueva oferta/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Demanda/ })).toBeNull();
    expect(screen.getByText('(dj, staff, lo que sea)')).toBeTruthy();
  });

  it('el enlace ?tab=demanda (email) abre en Demanda', async () => {
    estado.search = '?tab=demanda';
    montar();
    expect(await screen.findByText('CONTENIDO_DEMANDA')).toBeTruthy();
  });

  it('el empresario no ve el aviso de ofertas nuevas', async () => {
    estado.role = 'empresario';
    estado.demandaBadge = 5;
    montar();
    expect(await screen.findByText('CONTENIDO_DEMANDA')).toBeTruthy();
    expect(screen.queryByText(/ofertas nuevas de organizadores/)).toBeNull();
    expect(marcarOfertasVistas).not.toHaveBeenCalled();
  });
});
