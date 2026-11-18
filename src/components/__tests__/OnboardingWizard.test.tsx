import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Asistente de bienvenida del panel (auditoría 15 oct 2026): no vuelve a
// preguntar el oficio que ya se eligió al registrarse y se puede dejar para
// después desde el primer paso (antes tapaba todo el panel sin salida).

const estado = { role: 'pending', loading: false, zone: 'España' };
const updateField = vi.fn(async (_campos: Record<string, unknown>) => true);

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('@/hooks/useProfile', () => ({
  useProfile: () => ({ role: estado.role, loading: estado.loading, zone: estado.zone, updateField, photo_url: null }),
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
    updateField.mockClear();
    estado.role = 'pending'; estado.loading = false; estado.zone = 'España';
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

  it('los arranques de bio rellenan el campo y siguen siendo opcionales', async () => {
    estado.role = 'dj';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    const campo = document.getElementById('asistente-bio') as HTMLTextAreaElement;
    expect(campo.value).toBe('');
    fireEvent.click(screen.getByRole('button', { name: /\+ Mi estilo/ }));
    expect(campo.value).toBe('Mi estilo: ');
    fireEvent.click(screen.getByRole('button', { name: /\+ He trabajado en/ }));
    expect(campo.value).toBe('Mi estilo: He trabajado en ');
  });

  // 17 nov 2026: Instagram y bio solo se guardaban con "Guardar y continuar",
  // bloqueado sin foto. 38 altas sin foto, 0 con Instagram.
  it('el Instagram va arriba de la foto y se guarda al salir del campo, sin pulsar guardar', async () => {
    estado.role = 'dj';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    const campo = document.getElementById('asistente-instagram') as HTMLInputElement;
    const foto = screen.getByText(/añadir tu foto/);
    expect(campo.compareDocumentPosition(foto) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(campo, { target: { value: 'https://www.instagram.com/dj.kevin/?igsh=x' } });
    fireEvent.blur(campo);
    await waitFor(() => expect(updateField).toHaveBeenCalledWith({ instagram: 'dj.kevin' }));
    expect(campo.value).toBe('dj.kevin');
  });

  it('un Instagram con espacios no se guarda y avisa', async () => {
    estado.role = 'dj';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    const campo = document.getElementById('asistente-instagram') as HTMLInputElement;
    fireEvent.change(campo, { target: { value: 'dj kevin oficial' } });
    fireEvent.blur(campo);
    expect(screen.getByText(/Solo el usuario, sin espacios/)).toBeTruthy();
    expect(updateField).not.toHaveBeenCalled();
  });

  it('la bio se guarda al salir del campo solo si es real y de 40 caracteres o más', async () => {
    estado.role = 'dj';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    const campo = document.getElementById('asistente-bio') as HTMLTextAreaElement;
    fireEvent.change(campo, { target: { value: 'Mi estilo: ' } });
    fireEvent.blur(campo);
    expect(updateField).not.toHaveBeenCalled();
    const real = 'Pincho tech house y house desde hace ocho años en bodas y salas de Madrid.';
    fireEvent.change(campo, { target: { value: real } });
    fireEvent.blur(campo);
    await waitFor(() => expect(updateField).toHaveBeenCalledWith({ bio: real }));
  });

  // 17 nov 2026: el registro con correo ya pide la ciudad y el asistente la
  // volvía a pedir, bloqueando el botón.
  it('sin ciudad guardada pide la ciudad', async () => {
    estado.role = 'dj';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    expect(screen.getByText('Elige tu ciudad')).toBeTruthy();
  });

  it('con la ciudad del registro ya elegida no la vuelve a pedir', async () => {
    estado.role = 'dj'; estado.zone = 'Madrid';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    expect(screen.queryByText('Elige tu ciudad')).toBeNull();
  });

  it('una ciudad que no está en la lista llega en el campo libre de "Otra ciudad"', async () => {
    estado.role = 'dj'; estado.zone = 'Pueblo de Prueba';
    montar();
    await screen.findByText(/Foto y ciudad para aparecer/, {}, { timeout: 3000 });
    const libre = screen.getByPlaceholderText('Escribe tu ciudad') as HTMLInputElement;
    expect(libre.value).toBe('Pueblo de Prueba');
  });

  it('mientras el perfil carga no salta', () => {
    estado.role = 'dj'; estado.loading = true;
    montar();
    expect(screen.getByText('¿Cuál es tu perfil?')).toBeTruthy();
  });

  it('"Cambiar de oficio" vuelve al paso del oficio y no salta otra vez', async () => {
    estado.role = 'dj';
    montar();
    // findByText y no findByRole: role recorre el árbol de accesibilidad de
    // toda la pantalla y con la máquina cargada pasaba de 20 s (30 oct 2026).
    const noEsTuOficio = await screen.findByText(/No es tu oficio/, {}, { timeout: 10000 });
    fireEvent.click(noEsTuOficio.closest('button')!);
    expect(await screen.findByText('¿Cuál es tu perfil?', {}, { timeout: 10000 })).toBeTruthy();
    await new Promise(r => setTimeout(r, 600));
    expect(screen.getByText('¿Cuál es tu perfil?')).toBeTruthy();
  });
});
