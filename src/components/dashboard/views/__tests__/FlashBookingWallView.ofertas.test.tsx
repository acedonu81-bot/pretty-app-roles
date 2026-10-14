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

  it('abre siempre en las ofertas de organizadores, con o sin ofertas nuevas', async () => {
    montar();
    expect(await screen.findByText('CONTENIDO_DEMANDA')).toBeTruthy();
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

  it('las pestañas del profesional tienen nombres llanos: Ofertas para ti, Mis solicitudes, Estoy disponible', async () => {
    montar();
    expect(await screen.findByRole('button', { name: /Ofertas para ti/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Mis solicitudes/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Estoy disponible/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Demanda/ })).toBeNull();
  });

  // 13 oct 2026: la pestaña verde activa se veía "fatal": texto #22c55e sobre su
  // propio fondo verde pálido, contraste 1,86:1. Ahora el texto es verde oscuro.
  it('la pestaña Ofertas para ti activa tiene texto oscuro y legible, no el verde claro de marca', async () => {
    estado.search = '?tab=demanda';
    montar();
    const boton = await screen.findByRole('button', { name: /Ofertas para ti/ });
    expect(boton.style.color).toBe('rgb(22, 101, 52)'); // #166534
    expect(boton.style.color).not.toBe('rgb(34, 197, 94)'); // #22c55e
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
