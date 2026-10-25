import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/integrations/supabase/client', () => {
  const cadena: any = { select: () => cadena, eq: () => cadena, in: () => cadena, then: (f: any) => f({ count: 0 }) };
  return { supabase: { from: () => cadena } };
});
vi.mock('@/lib/pushNotifications', () => ({
  isPushSupported: () => true,
  isPushSubscribed: () => false,
  requestPushPermission: vi.fn(async () => false),
}));
vi.mock('@/lib/capacitor', () => ({ isNative: false }));
vi.mock('@/lib/track', () => ({ track: vi.fn() }));
let standalone = true;
vi.mock('@/hooks/useInstallPrompt', () => ({
  useInstallPrompt: () => ({ platform: 'other', iosBrowser: 'safari', isStandalone: standalone }),
}));

import PushAskCard from './PushAskCard';

function permiso(p: NotificationPermission) {
  (globalThis as any).Notification = { permission: p };
}

describe('PushAskCard con la app instalada', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); standalone = true; });

  it('pide activar los avisos si aún no se han pedido', () => {
    permiso('default');
    render(<PushAskCard userId="u1" />);
    expect(screen.getByText('Ya tienes XPEAK instalada, falta un paso')).toBeTruthy();
    expect(screen.getByText('Activar avisos')).toBeTruthy();
  });

  it('si están bloqueados explica cómo desbloquearlos, sin botón de activar', () => {
    permiso('denied');
    render(<PushAskCard userId="u1" />);
    expect(screen.getByText('Tus avisos de XPEAK están bloqueados')).toBeTruthy();
    expect(screen.getByText('En Notificaciones, elige Permitir.')).toBeTruthy();
    expect(screen.queryByText('Activar avisos')).toBeNull();
  });

  it('no sale si ya tiene los avisos activados', () => {
    permiso('granted');
    const { container } = render(<PushAskCard userId="u1" />);
    expect(container.textContent).toBe('');
  });

  it('no sale en el navegador sin instalar', () => {
    standalone = false;
    permiso('denied');
    const { container } = render(<PushAskCard userId="u1" />);
    expect(container.textContent).toBe('');
  });

  it('respeta los 14 días de descanso tras cerrarla', () => {
    permiso('denied');
    localStorage.setItem('xpeak_push_ask_snooze_until', String(Date.now() + 1e9));
    const { container } = render(<PushAskCard userId="u1" />);
    expect(container.textContent).toBe('');
  });
});
