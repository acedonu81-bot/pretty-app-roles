import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const perfil = { role: 'dj', roles: ['dj'], subscription_tier: 'free', refresh: vi.fn() };
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));
const iniciarPago = vi.fn();
const abrirPortal = vi.fn();
vi.mock('@/lib/pagos', () => ({ iniciarPago: (...a: unknown[]) => iniciarPago(...a), abrirPortal: () => abrirPortal(), leerMiSuscripcion: async () => null, cobrosActivos: () => import.meta.env.VITE_COBROS_ACTIVOS === 'true' }));
const nativo = { isNative: false };
vi.mock('@/lib/capacitor', () => ({ get isNative() { return nativo.isNative; } }));

import SubscriptionView from './SubscriptionView';

beforeEach(() => {
  perfil.role = 'dj'; perfil.roles = ['dj']; perfil.subscription_tier = 'free';
  nativo.isNative = false;
  iniciarPago.mockReset();
  vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
});

describe('SubscriptionView', () => {
  it('enseña los planes con IVA incluido a un DJ en la web', () => {
    render(<SubscriptionView />);
    expect(screen.getByText('Profesional')).toBeTruthy();
    expect(screen.getByText(/6,99/)).toBeTruthy();
    expect(screen.getAllByText(/IVA incluido/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
    expect(screen.getByText(/71,30/)).toBeTruthy();
  });

  it('Premium incluye aparecer en las redes una vez al mes', () => {
    render(<SubscriptionView />);
    expect(screen.getByText('Apareces una vez al mes en las redes de XPEAK')).toBeTruthy();
  });

  it('un DJ ve sus ventajas de música y el vídeo de fondo', () => {
    render(<SubscriptionView />);
    expect(screen.getByText('Sets ilimitados')).toBeTruthy();
    expect(screen.getByText('Ficha con vídeo de fondo')).toBeTruthy();
  });

  it('un mago no ve ventajas de música ni de DJ, sí las comunes', () => {
    perfil.role = 'mago'; perfil.roles = ['mago'];
    render(<SubscriptionView />);
    expect(screen.queryByText(/sets/i)).toBeNull();
    expect(screen.queryByText('Ficha con vídeo de fondo')).toBeNull();
    expect(screen.queryByText(/Concursos de DJs/)).toBeNull();
    expect(screen.getByText('Sales destacado en el Inicio de XPEAK')).toBeTruthy();
    expect(screen.getByText('Portafolio de 20 fotos y vídeos')).toBeTruthy();
  });

  it('pide el pago del plan y ciclo elegidos', () => {
    render(<SubscriptionView />);
    fireEvent.click(screen.getByRole('button', { name: /Anual/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Elegir Premium' }));
    expect(iniciarPago).toHaveBeenCalledWith('business', 'anual');
  });

  it('a quien ya paga le ofrece gestionar su plan', () => {
    perfil.subscription_tier = 'business';
    render(<SubscriptionView />);
    expect(screen.getByRole('button', { name: 'Gestionar mi plan' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Elegir Premium' })).toBeNull();
  });

  it('en la app nativa no enseña precios ni botones de pago', () => {
    nativo.isNative = true;
    render(<SubscriptionView />);
    expect(screen.queryByText(/€/)).toBeNull();
    expect(screen.queryByRole('button', { name: /Elegir/ })).toBeNull();
  });

  it('con los cobros apagados no enseña precios', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'false');
    render(<SubscriptionView />);
    expect(screen.queryByText(/€/)).toBeNull();
  });

  it('a un organizador no le enseña precios', () => {
    perfil.role = 'empresario'; perfil.roles = ['empresario'];
    render(<SubscriptionView />);
    expect(screen.queryByText(/€/)).toBeNull();
  });

  it('a otros roles profesionales también les deja contratar', () => {
    perfil.role = 'mago'; perfil.roles = ['mago'];
    render(<SubscriptionView />);
    expect(screen.getByRole('button', { name: 'Elegir Profesional' })).toBeTruthy();
  });
});
