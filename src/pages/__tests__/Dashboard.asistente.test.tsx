import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Regresión (17 nov 2026): el asistente de bienvenida dejó de abrirse para
// TODO el mundo desde el 12 nov por la noche. Dashboard leía `loading` de
// useProfile() en su propio cuerpo, que está POR ENCIMA del <ProfileProvider>
// que el propio Dashboard pinta: ahí useProfile() devuelve el valor por
// defecto del contexto (loading: true, role: 'dj') para siempre, y la
// condición `showWizard && !profileLoading` nunca se cumplía. InusualDJ se
// registró sin oficio, nadie le abrió el asistente y se quedó en 'pending'.
//
// El test de OnboardingWizard no lo podía ver porque simula useProfile. Este
// pinta el Dashboard de verdad con el ProfileProvider de verdad.

const datos = vi.hoisted(() => ({
  fila: {} as Record<string, unknown>,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1', user_metadata: {} }, loading: false }),
}));

vi.mock('@/integrations/supabase/client', () => {
  // Cadena tipo query-builder: cualquier método devuelve otra cadena y al
  // esperarla resuelve con `datos`. Solo `profiles` devuelve la fila del test.
  const cadena = (filas: unknown[]): any =>
    new Proxy(() => {}, {
      get: (_t, prop) => {
        if (prop === 'then') return (ok: (v: unknown) => unknown) => ok({ data: filas, error: null, count: filas.length });
        if (prop === 'maybeSingle' || prop === 'single') {
          return () => Promise.resolve({ data: filas[0] ?? null, error: null });
        }
        return () => cadena(filas);
      },
    });
  const canal: any = { on: () => canal, subscribe: () => canal, unsubscribe: () => {} };
  return {
    supabase: {
      from: (tabla: string) => cadena(tabla === 'profiles' ? [datos.fila] : []),
      rpc: () => Promise.resolve({ data: null, error: null }),
      channel: () => canal,
      removeChannel: () => {},
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      storage: { from: () => ({ upload: vi.fn(), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    },
  };
});

// Piezas pesadas del panel que no intervienen en esta comprobación.
vi.mock('@/components/dashboard/DashboardSidebar', () => ({ default: () => null, DashboardSidebarInner: () => null }));
vi.mock('@/components/dashboard/DashboardTopbar', () => ({ default: () => null }));
vi.mock('@/components/dashboard/RecentBusinessViewLine', () => ({ default: () => null }));
vi.mock('@/components/dashboard/TodaysRequestsLine', () => ({ default: () => null }));
vi.mock('@/components/dashboard/NuevaOfertaBanner', () => ({ default: () => null }));
vi.mock('@/components/comunicados/ComunicadosCarrusel', () => ({ default: () => null }));
vi.mock('@/components/dashboard/PendingReviewsBanner', () => ({ default: () => null }));
vi.mock('@/components/dashboard/MobileBottomNav', () => ({ default: () => null }));
vi.mock('@/components/dashboard/NativeStackTransition', () => ({ NativeStackTransition: ({ children }: any) => children ?? null }));
vi.mock('@/components/AdminGuard', () => ({ default: ({ children }: any) => children ?? null }));
vi.mock('@/components/PushAskCard', () => ({ default: () => null }));
vi.mock('@/components/AppIconBadge', () => ({ default: () => null }));
vi.mock('@/components/dashboard/PerfilTabs', () => ({ default: () => null }));
vi.mock('@/components/FuegosArtificiales', () => ({ default: () => null }));
vi.mock('@/components/halloween/HalloweenPanel', () => ({ default: () => null }));
vi.mock('@/components/movember/Movember', () => ({ MovemberFranja: () => null }));
vi.mock('@/components/dia25n/Dia25N', () => ({ Franja25N: () => null }));
vi.mock('@/components/dashboard/OnboardingTour', () => ({ default: () => null }));
vi.mock('@/components/dashboard/ConsejosPanel', () => ({ default: () => null }));
vi.mock('@/components/dashboard/SupportChat', () => ({ default: () => null }));
vi.mock('@/components/AmbientBackground', () => ({ default: () => null }));
vi.mock('@/components/dashboard/views/ProfileView', () => ({ default: () => <div data-testid="vista-profile" /> }));
vi.mock('@/components/dashboard/views/DJView', () => ({ default: () => <div data-testid="vista-dj" /> }));
vi.mock('@/components/dashboard/views/EmpresarioView', () => ({ default: () => <div data-testid="vista-empresario" /> }));
vi.mock('@/components/dashboard/views/ExplorarView', () => ({ default: () => <div data-testid="vista-explorar" /> }));
vi.mock('@/components/dashboard/views/StaffView', () => ({ default: () => null }));

// Las dos piezas que sí se observan.
vi.mock('@/components/OnboardingWizard', () => ({ default: () => <div data-testid="asistente-alta" /> }));
vi.mock('@/components/FeedbackWebCard', () => ({ default: ({ rol }: { rol?: string }) => <div data-testid="rol-en-dashboard">{rol}</div> }));

import Dashboard from '@/pages/Dashboard';

const montar = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>
    </HelmetProvider>,
  );

const perfilNuevo = (cambios: Record<string, unknown> = {}) => ({
  id: 'p1', user_id: 'u1', is_primary: true, display_name: 'InusualDJ',
  role: 'pending', roles: [], zone: 'España', photo_url: null,
  ...cambios,
});

describe('Dashboard: asistente de alta', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/dashboard');
    datos.fila = perfilNuevo();
  });

  it('abre el asistente a quien acaba de registrarse sin oficio (rol pending) en cuanto el perfil carga', async () => {
    montar();
    expect(await screen.findByTestId('asistente-alta', {}, { timeout: 3000 })).toBeTruthy();
  });

  it('no lo abre si ese aparato ya lo marcó como visto', async () => {
    localStorage.setItem('xpeak_onboarded_u1', '1');
    montar();
    await waitFor(() => expect(screen.getByTestId('rol-en-dashboard')).toBeTruthy());
    expect(screen.queryByTestId('asistente-alta')).toBeNull();
  });
});

// Mismo origen que lo anterior: el cuerpo de Dashboard leía useProfile() fuera
// del provider y veía SIEMPRE el rol por defecto ('dj'), desde el primer commit
// (27 mar 2026). Todo lo que depende del rol en el panel (vista inicial, avisos
// de empresario, perfil de los sin oficio, rol en analítica) trabajaba con 'dj'.
describe('Dashboard: el panel conoce el rol real', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('xpeak_onboarded_u1', '1'); // sin asistente de por medio
    window.history.replaceState({}, '', '/dashboard');
  });

  const rolVisto = () => screen.getByTestId('rol-en-dashboard').textContent;

  it('un empresario sin vista guardada aterriza en su panel', async () => {
    datos.fila = perfilNuevo({ role: 'empresario' });
    montar();
    await waitFor(() => expect(rolVisto()).toBe('empresario'), { timeout: 3000 });
    expect(await screen.findByTestId('vista-empresario')).toBeTruthy();
    expect(screen.queryByTestId('vista-explorar')).toBeNull();
  });

  it('quien no ha elegido oficio (pending) aterriza en su perfil, no en explorar', async () => {
    datos.fila = perfilNuevo({ role: 'pending' });
    montar();
    await waitFor(() => expect(rolVisto()).toBe('pending'), { timeout: 3000 });
    expect(await screen.findByTestId('vista-profile')).toBeTruthy();
    expect(screen.queryByTestId('vista-explorar')).toBeNull();
  });

  it('un DJ sin vista guardada sigue aterrizando en explorar', async () => {
    datos.fila = perfilNuevo({ role: 'dj', roles: ['dj'] });
    montar();
    await waitFor(() => expect(rolVisto()).toBe('dj'), { timeout: 3000 });
    expect(await screen.findByTestId('vista-explorar')).toBeTruthy();
  });

  it('la vista guardada gana al rol', async () => {
    localStorage.setItem('xpeak_view', 'dj');
    datos.fila = perfilNuevo({ role: 'empresario' });
    montar();
    await waitFor(() => expect(rolVisto()).toBe('empresario'), { timeout: 3000 });
    expect(await screen.findByTestId('vista-dj')).toBeTruthy();
    expect(screen.queryByTestId('vista-empresario')).toBeNull();
  });
});
