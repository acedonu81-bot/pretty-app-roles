import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const perfil = { subscription_tier: 'business' };
let cobros = true;
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));
vi.mock('@/lib/pagos', () => ({ cobrosActivos: () => cobros }));
const listar = vi.fn();
const crear = vi.fn();
const pedir = vi.fn();
vi.mock('@/lib/trayectoria', async (orig) => ({
  ...(await orig<typeof import('@/lib/trayectoria')>()),
  listarMisEventos: (...a: unknown[]) => listar(...a),
  crearEvento: (...a: unknown[]) => crear(...a),
  pedirConfirmacion: (...a: unknown[]) => pedir(...a),
  borrarEvento: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import TrayectoriaEditor from './TrayectoriaEditor';

const evento = { id: 'e1', titulo: 'Boda en Casares', tipo: 'Boda', fecha: '2026-06-01', ciudad: 'Málaga', lugar: null, foto_url: null, estado: 'declarado', origen: 'declarado' };

describe('TrayectoriaEditor', () => {
  beforeEach(() => { listar.mockReset().mockResolvedValue([evento]); crear.mockReset(); pedir.mockReset(); cobros = true; perfil.subscription_tier = 'business'; });

  it('lista los eventos con su marca', async () => {
    render(<TrayectoriaEditor />);
    expect(await screen.findByText('Boda en Casares')).toBeTruthy();
    expect(screen.getByText('Declarado')).toBeTruthy();
  });

  it('Premium con cobros activos puede pedir confirmación', async () => {
    render(<TrayectoriaEditor />);
    await screen.findByText('Boda en Casares');
    expect(screen.getByRole('button', { name: 'Pedir confirmación' })).toBeTruthy();
  });

  it('Profesional no ve el botón ni nada de Premium', async () => {
    perfil.subscription_tier = 'starter';
    render(<TrayectoriaEditor />);
    await screen.findByText('Boda en Casares');
    expect(screen.queryByRole('button', { name: 'Pedir confirmación' })).toBeNull();
    expect(screen.queryByText(/Premium/)).toBeNull();
  });

  it('con los cobros apagados nadie ve el botón', async () => {
    cobros = false;
    render(<TrayectoriaEditor />);
    await screen.findByText('Boda en Casares');
    expect(screen.queryByRole('button', { name: 'Pedir confirmación' })).toBeNull();
  });

  it('añade un evento con título y fecha', async () => {
    crear.mockResolvedValue(undefined);
    render(<TrayectoriaEditor />);
    await screen.findByText('Boda en Casares');
    fireEvent.change(screen.getByLabelText('Nombre del evento'), { target: { value: 'Gala de empresa' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-05-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir evento' }));
    await waitFor(() => expect(crear).toHaveBeenCalledWith(expect.objectContaining({ titulo: 'Gala de empresa', fecha: '2026-05-10' })));
  });

  it('los límites no cuentan lo que hacen otros: mismo mensaje opaco', async () => {
    const { toast } = await import('sonner');
    render(<TrayectoriaEditor />);
    await screen.findByText('Boda en Casares');
    fireEvent.click(screen.getByRole('button', { name: 'Pedir confirmación' }));
    fireEvent.change(screen.getByLabelText('Correo del organizador'), { target: { value: 'org@empresa.es' } });
    pedir.mockRejectedValueOnce(new Error('limite_correo'));
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('No se puede enviar la solicitud ahora mismo. Inténtalo más tarde.'));
  });
});
