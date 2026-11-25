import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const perfil = { id: 'perfil-1', role: 'dj', roles: ['dj'], subscription_tier: 'free', refresh: vi.fn() };
const efectivo: { plan: string | null | undefined } = { plan: 'pre' };
vi.mock('@/hooks/useMiPlan', () => ({ useMiPlan: () => efectivo.plan }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));
const iniciarPago = vi.fn();
const abrirPortal = vi.fn();
vi.mock('@/lib/pagos', () => ({ iniciarPago: (...a: unknown[]) => iniciarPago(...a), abrirPortal: () => abrirPortal(), leerMiSuscripcion: async () => null, cobrosActivos: () => import.meta.env.VITE_COBROS_ACTIVOS === 'true' }));
const nativo = { isNative: false };
vi.mock('@/lib/capacitor', () => ({ get isNative() { return nativo.isNative; } }));

import SubscriptionView from './SubscriptionView';

beforeEach(() => {
  perfil.role = 'dj'; perfil.roles = ['dj']; perfil.subscription_tier = 'free'; efectivo.plan = 'pre';
  nativo.isNative = false;
  iniciarPago.mockReset();
  vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
});

describe('SubscriptionView', () => {
  it('enseña los planes con IVA incluido a un DJ en la web', () => {
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getAllByText('Profesional').length).toBeGreaterThan(0);
    expect(screen.getByText(/6,99/)).toBeTruthy();
    expect(screen.getAllByText(/IVA incluido/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
    expect(screen.getByText(/69,90 € al año/)).toBeTruthy();
    expect(screen.getByText(/149,90 € al año/)).toBeTruthy();
    expect(screen.getAllByText(/ahorras 2 meses/i).length).toBeGreaterThan(0);
  });

  it('el anual enseña el regalo de bienvenida y el mensual no', () => {
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/Regalo de bienvenida/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
    expect(screen.getAllByText(/Regalo de bienvenida: te enviamos un detalle de merchandising de XPEAK/).length).toBe(2);
  });

  it('en Black Friday el anual enseña el 35 % y el precio de después', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-28T10:00:00Z'));
    try {
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
      expect(screen.getByText(/45,44 € el primer año/)).toBeTruthy();
      expect(screen.getByText(/97,44 € el primer año/)).toBeTruthy();
      expect(screen.getAllByText(/Black Friday/).length).toBeGreaterThan(0);
    } finally { vi.useRealTimers(); }
  });

  it('Premium: publicaciones al mes y "Todo lo de Profesional, más:" resaltado', () => {
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getByText('3 publicaciones al mes en las redes de XPEAK')).toBeTruthy();
    const todo = screen.getByText('Todo lo de Profesional, más:');
    expect(todo.getAttribute('style') ?? '').toMatch(/#8B6A00|rgb\(139, 106, 0\)/i);
  });

  it('un DJ ve sus ventajas de música y el banner de cabecera', () => {
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getByText('Sets ilimitados (10 en Profesional)')).toBeTruthy();
    expect(screen.getByText('Banner propio en tu cabecera de artista')).toBeTruthy();
  });

  it('un mago no ve ventajas de música ni de DJ, sí las comunes', () => {
    perfil.role = 'mago'; perfil.roles = ['mago'];
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/sets/i)).toBeNull();
    expect(screen.queryByText(/Banner propio/)).toBeNull();
    expect(screen.queryByText('Ofertas Flash Booking')).toBeNull();
    expect(screen.queryByText(/Concursos de DJs/)).toBeNull();
    expect(screen.getByText('Sales destacado en el Inicio de XPEAK')).toBeTruthy();
    expect(screen.getByText('Portafolio de 20 fotos y vídeos (12 en Profesional)')).toBeTruthy();
  });

  it('pide el pago del plan y ciclo elegidos', () => {
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Elegir Premium' }));
    expect(iniciarPago).toHaveBeenCalledWith('business', 'anual');
  });

  it('a quien ya paga le ofrece gestionar su plan', () => {
    perfil.subscription_tier = 'business';
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Gestionar mi plan' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Elegir Premium' })).toBeNull();
  });

  it('en la app nativa no enseña precios ni botones de pago', () => {
    nativo.isNative = true;
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/€/)).toBeNull();
    expect(screen.queryByRole('button', { name: /Elegir/ })).toBeNull();
  });

  it('con los cobros apagados no enseña precios', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'false');
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/€/)).toBeNull();
  });

  it('a un organizador no le enseña precios', () => {
    perfil.role = 'empresario'; perfil.roles = ['empresario'];
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/€/)).toBeNull();
  });

  it('a otros roles profesionales también les deja contratar', () => {
    perfil.role = 'mago'; perfil.roles = ['mago'];
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Elegir Profesional' })).toBeTruthy();
  });

  describe('según el plan efectivo de la BD', () => {
    it('antes del lanzamiento, sin pagar, figura como Profesional', () => {
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Profesional');
      expect(screen.queryByText(/fundador/i)).toBeNull();
    });

    it('fundador: Profesional sin pagar el primer año, y puede elegir plan', () => {
      efectivo.plan = 'starter';
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Profesional');
      expect(screen.getByText(/Eres fundador: tienes Profesional sin pagar durante tu primer año/)).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Elegir Premium' })).toBeTruthy();
    });

    it('no fundador tras el lanzamiento: Nivel base con su lista real y los planes para subir', () => {
      efectivo.plan = 'free';
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Nivel base');
      expect(screen.getByText('Portafolio de 6 fotos y vídeos')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Elegir Profesional' })).toBeTruthy();
      expect(screen.queryByText(/fundador/i)).toBeNull();
    });

    it('en la app, el nivel base enseña su lista y no la de Profesional', () => {
      efectivo.plan = 'free';
      nativo.isNative = true;
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      expect(screen.getByText('Portafolio de 6 fotos y vídeos')).toBeTruthy();
      expect(screen.queryByText('Portafolio de 12 fotos y vídeos')).toBeNull();
    });

    it('quien paga Premium sigue viendo Premium aunque la BD tarde', () => {
      perfil.subscription_tier = 'business';
      efectivo.plan = undefined;
      render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Premium');
    });
  });
});

describe('SubscriptionView: vuelta de Stripe', () => {
  it('"Pago recibido" sale al volver y se quita de la dirección para no quedarse pegado', () => {
    window.history.replaceState({}, '', '/dashboard?view=subscription&pago=ok');
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.getByText(/Pago recibido/)).toBeTruthy();
    expect(window.location.search).toBe('?view=subscription');
  });

  it('sin volver de Stripe no sale ningún aviso de pago', () => {
    window.history.replaceState({}, '', '/dashboard?view=subscription');
    render(<MemoryRouter><SubscriptionView /></MemoryRouter>);
    expect(screen.queryByText(/Pago recibido/)).toBeNull();
  });
});
