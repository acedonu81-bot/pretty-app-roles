import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

const perfil = { id: 'perfil-1', subscription_tier: 'free' };
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));
const sesion = { user: { id: 'user-1' } }; // estable: si cambia en cada render, la carga se reinicia sin parar
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => sesion }));
const escasez = { loading: false, weeklyProfileViews: 0, weeklyContactRequests: 0, lastViewedAt: null };
vi.mock('@/hooks/useScarcitySignal', () => ({ useScarcitySignal: () => escasez }));
const mercado = { loading: false, percentDiff: null };
vi.mock('@/hooks/useMarketRateInsight', () => ({ useMarketRateInsight: () => mercado }));

const plan: { valor: string | null | undefined } = { valor: 'free' };
vi.mock('@/hooks/useMiPlan', () => ({ useMiPlan: () => plan.valor }));
vi.mock('@/components/dashboard/views/EstadisticasPremium', () => ({ default: () => <div>Estadísticas avanzadas (bloque)</div> }));

// Cadena de consultas que responde con una cuenta fija y lista vacía.
const consultas: string[] = [];
const cadena = (tabla: string): any => {
  const c: any = new Proxy(() => {}, {
    get: (_t, prop) => {
      if (prop === 'then') return (res: (v: unknown) => void) => res({ data: [], count: tabla === 'profile_business_views' ? 7 : 0, error: null });
      return () => { if (prop === 'select') consultas.push(tabla); return c; };
    },
  });
  return c;
};
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: (t: string) => cadena(t), rpc: async () => ({ data: null }) } }));

import StatsView from './StatsView';

beforeEach(() => { consultas.length = 0; plan.valor = 'free'; });

describe('StatsView por plan', () => {
  it('Esencial: solo las visitas del mes, resto difuminado y con invitación', async () => {
    const ir = vi.fn();
    render(<StatsView onNavigate={ir} />);
    expect(await screen.findByText('Visitas este mes')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('7')).toBeTruthy());
    expect(screen.getByText('Mejora a Profesional para ver quién te busca')).toBeTruthy();
    expect(screen.queryByText('Resumen 2026')).toBeNull();
    expect(screen.queryByText('Estadísticas avanzadas (bloque)')).toBeNull();
    // No se piden mensajes ni conversaciones: solo las visitas.
    expect(consultas.every(t => t === 'profile_business_views')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Ver planes' }));
    expect(ir).toHaveBeenCalledWith('subscription');
  });

  it('Profesional: ve todo lo básico y una invitación a Premium, sin lo avanzado', async () => {
    plan.valor = 'starter';
    render(<StatsView onNavigate={() => {}} />);
    expect(await screen.findByText('Con Premium, aún más')).toBeTruthy();
    expect(screen.queryByText('Estadísticas avanzadas (bloque)')).toBeNull();
    expect(screen.queryByText('Mejora a Profesional para ver quién te busca')).toBeNull();
  });

  it('Premium: ve el bloque de estadísticas avanzadas', async () => {
    plan.valor = 'business';
    render(<StatsView onNavigate={() => {}} />);
    expect(await screen.findByText('Estadísticas avanzadas (bloque)')).toBeTruthy();
    expect(screen.queryByText('Con Premium, aún más')).toBeNull();
  });

  it('antes del lanzamiento (pre) lo ve todo, como hasta ahora', async () => {
    plan.valor = 'pre';
    render(<StatsView onNavigate={() => {}} />);
    expect(await screen.findByText('Estadísticas avanzadas (bloque)')).toBeTruthy();
  });

  it('si la consulta del plan falla, se enseña lo básico sin bloquear la pantalla', async () => {
    plan.valor = null;
    render(<StatsView onNavigate={() => {}} />);
    expect(await screen.findByText('Con Premium, aún más')).toBeTruthy();
  });
});
