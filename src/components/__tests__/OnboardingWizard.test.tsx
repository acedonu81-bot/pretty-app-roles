import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Asistente de bienvenida del panel (auditoría 15 oct 2026): no vuelve a
// preguntar el oficio que ya se eligió al registrarse y se puede dejar para
// después desde el primer paso (antes tapaba todo el panel sin salida).

const estado = { role: 'pending', loading: false };

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('@/hooks/useProfile', () => ({
  useProfile: () => ({ role: estado.role, loading: estado.loading, updateField: vi.fn(async () => true), photo_url: null }),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { storage: { from: () => ({ upload: vi.fn(), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }, from: () => ({}) },
}));
vi.mock('@/lib/asistenteAlta', () => ({ logAsistente: () => {}, resumenAsistente: () => '' }));
vi.mock('sonner', () => ({ toast: { error: () => {}, success: () => {} } }));

import OnboardingWizard from '@/components/OnboardingWizard';

const montar = (onClose = vi.fn()) => {
  render(<OnboardingWizard onClose={onClose} onNavigate={() => {}} />);
  return onClose;
};

describe('OnboardingWizard', () => {
  beforeEach(() => {
    estado.role = 'pending'; estado.loading = false;
    localStorage.clear();
    window.history.replaceState({}, '', '/dashboard');
  });

  it('sin oficio guardado pregunta el oficio y deja salir con "Lo haré después"', () => {
    const onClose = montar();
    expect(screen.getByText('¿Cuál es tu perfil?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Lo haré después' }));
    expect(onClose).toHaveBeenCalled();
    expect(localStorage.getItem('xpeak_onboarded_u1')).toBe('1');
  });

  it('con oficio guardado salta a foto y ciudad, y sigue la salida', async () => {
    estado.role = 'dj';
    const onClose = montar();
    expect(await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 })).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('¿Cuál es tu perfil?')).toBeNull());
    fireEvent.click(screen.getByRole('button', { name: 'Lo haré después' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('mientras el perfil carga no salta', () => {
    estado.role = 'dj'; estado.loading = true;
    montar();
    expect(screen.getByText('¿Cuál es tu perfil?')).toBeTruthy();
  });

  it('"Cambiar de oficio" vuelve al paso del oficio y no salta otra vez', async () => {
    estado.role = 'dj';
    montar();
    fireEvent.click(await screen.findByRole('button', { name: /No es tu oficio/ }, { timeout: 3000 }));
    expect(await screen.findByText('¿Cuál es tu perfil?', {}, { timeout: 3000 })).toBeTruthy();
    await new Promise(r => setTimeout(r, 600));
    expect(screen.getByText('¿Cuál es tu perfil?')).toBeTruthy();
  });
});
