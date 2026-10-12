import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';

const perfil = { loading: false, role: 'dj', created_at: '2026-09-20T10:00:00Z' };
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));
const logConsejo = vi.fn();
vi.mock('@/lib/track', () => ({ logConsejo: (...a: unknown[]) => logConsejo(...a) }));
// jsdom no termina las animaciones de salida de framer-motion: se prueba la lógica, no la animación.
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: { div: ({ initial: _i, animate: _a, exit: _e, transition: _t, ...p }: Record<string, unknown>) => <div {...p} /> },
}));

import ConsejosPanel from '../ConsejosPanel';
import { PUSH_ASK_EVENT } from '@/lib/pushAsk';

const visita = (props: Partial<React.ComponentProps<typeof ConsejosPanel>> = {}) => {
  const onNavigate = vi.fn();
  const onGoToReviews = vi.fn();
  const r = render(<ConsejosPanel isMobile onNavigate={onNavigate} onGoToReviews={onGoToReviews} {...props} />);
  act(() => { vi.advanceTimersByTime(2600); });
  return { ...r, onNavigate, onGoToReviews };
};
const nuevaVisita = () => sessionStorage.clear();

describe('ConsejosPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('xpeak-cookie-consent', '{"necessary":true}');
    Object.assign(perfil, { loading: false, role: 'dj', created_at: '2026-09-20T10:00:00Z' });
    logConsejo.mockClear();
  });
  afterEach(() => { vi.useRealTimers(); });

  it('la primera visita enseña el Feed y lleva a él', () => {
    const { onNavigate } = visita();
    expect(screen.getByText('El Feed')).toBeTruthy();
    expect(screen.getByText(/1 de 13/)).toBeTruthy();
    fireEvent.click(screen.getByText('Ir al Feed'));
    expect(onNavigate).toHaveBeenCalledWith('feed');
    expect(logConsejo).toHaveBeenCalledWith('ir', 'feed');
  });

  it('una sola ventana por visita aunque se vuelva a montar', () => {
    const a = visita();
    fireEvent.click(screen.getByText('Entendido'));
    a.unmount();
    visita();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('cada visita nueva enseña el siguiente apartado de arriba abajo y no repite', () => {
    const vistos: string[] = [];
    for (let i = 0; i < 13; i++) {
      const v = visita();
      vistos.push(screen.getByRole('dialog').getAttribute('aria-label')!.replace('Consejo: ', ''));
      v.unmount();
      nuevaVisita();
    }
    expect(vistos).toEqual(['El Feed', 'Inicio', 'Flash Booking', 'Mensajes', 'Directorio', 'Mi Perfil', 'Mi Ficha',
      'Estadísticas', 'Calendario', 'Contratos', 'Recursos', 'Reseñas', 'Ajustes']);
    visita();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Reseñas va por goToPendingReviews, no por una vista', () => {
    localStorage.setItem('xpeak_consejos_vistos_u1', JSON.stringify(
      ['feed', 'explorar', 'flashbooking', 'messages', 'directorio', 'profile', 'ficha', 'stats', 'calendar', 'contracts', 'resources']));
    const { onGoToReviews, onNavigate } = visita();
    fireEvent.click(screen.getByText('Ver Reseñas'));
    expect(onGoToReviews).toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('el empresario tiene su propio recorrido, sin Mi Ficha ni Estadísticas', () => {
    perfil.role = 'empresario';
    const titulos: string[] = [];
    for (let i = 0; i < 11; i++) {
      const v = visita();
      titulos.push(screen.getByRole('dialog').getAttribute('aria-label')!.replace('Consejo: ', ''));
      v.unmount();
      nuevaVisita();
    }
    expect(titulos).not.toContain('Mi Ficha');
    expect(titulos).not.toContain('Estadísticas');
    expect(titulos[1]).toBe('Inicio');
    expect(screen.queryByText(/de 11/)).toBeNull();
  });

  it('no sale si en esta visita ya salió la tarjeta de notificaciones', () => {
    sessionStorage.setItem('xpeak_push_ask_shown', '1');
    visita();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('se esconde si salta la tarjeta de notificaciones', () => {
    visita();
    expect(screen.getByText('El Feed')).toBeTruthy();
    act(() => { window.dispatchEvent(new CustomEvent(PUSH_ASK_EVENT)); });
    expect(screen.queryByText('El Feed')).toBeNull();
  });

  it('no sale con el aviso de cookies pendiente ni durante el alta', () => {
    localStorage.removeItem('xpeak-cookie-consent');
    const a = visita();
    expect(screen.queryByRole('dialog')).toBeNull();
    a.unmount();
    localStorage.setItem('xpeak-cookie-consent', '{}');
    perfil.role = 'pending';
    visita();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('a los recién llegados les deja primero el tour de bienvenida', () => {
    perfil.created_at = new Date().toISOString();
    const a = visita();
    expect(screen.queryByRole('dialog')).toBeNull();
    a.unmount();
    localStorage.setItem('xpeak_tour_v2_done', '1');
    visita();
    expect(screen.getByText('El Feed')).toBeTruthy();
  });
});
