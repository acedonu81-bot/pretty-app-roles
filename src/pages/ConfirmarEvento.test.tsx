import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

const invoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: (...a: unknown[]) => invoke(...a) } } }));

import ConfirmarEvento from './ConfirmarEvento';

const pintar = (query: string) => {
  window.history.pushState({}, '', `/confirmar-evento${query}`);
  return render(<HelmetProvider><ConfirmarEvento /></HelmetProvider>);
};
const datos = { ok: true, nombre: 'Lucía Maquillaje', titulo: 'Boda en Casares', fecha: '2026-06-01', ciudad: 'Málaga', lugar: null, foto: null, oficio: null, ya: false };

describe('ConfirmarEvento', () => {
  beforeEach(() => invoke.mockReset());

  it('sin enlace dice que no es válido y no llama al servidor', async () => {
    pintar('');
    expect(await screen.findByText('El enlace no es válido')).toBeTruthy();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('enseña quién y qué evento, y solo confirma al pulsar el botón', async () => {
    invoke.mockResolvedValueOnce({ data: datos, error: null });
    pintar('?t=abc');
    expect(await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?')).toBeTruthy();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith('trayectoria-confirmar', { body: { t: 'abc', accion: 'ver' } });

    invoke.mockResolvedValueOnce({ data: { ...datos, ya: true }, error: null });
    fireEvent.click(screen.getByRole('button', { name: 'Sí, trabajó en mi evento' }));
    await waitFor(() => expect(screen.getByText('Gracias, queda confirmado')).toBeTruthy());
    expect(invoke).toHaveBeenLastCalledWith('trayectoria-confirmar', { body: { t: 'abc', accion: 'confirmar' } });
  });

  it('si ya estaba confirmado lo dice sin botón', async () => {
    invoke.mockResolvedValueOnce({ data: { ...datos, ya: true }, error: null });
    pintar('?t=abc');
    expect(await screen.findByText('Gracias, queda confirmado')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Sí, trabajó en mi evento' })).toBeNull();
  });

  it('un enlace rechazado por el servidor dice que no es válido', async () => {
    invoke.mockResolvedValueOnce({ data: null, error: new Error('400') });
    pintar('?t=malo');
    expect(await screen.findByText('El enlace no es válido')).toBeTruthy();
  });

  it('quita el token de la barra de direcciones tras leerlo', async () => {
    invoke.mockResolvedValueOnce({ data: datos, error: null });
    pintar('?t=secreto123');
    await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?');
    expect(window.location.search).toBe('');
    // sigue pudiendo confirmar con el token guardado en memoria
    invoke.mockResolvedValueOnce({ data: { ...datos, ya: true }, error: null });
    fireEvent.click(screen.getByRole('button', { name: 'Sí, trabajó en mi evento' }));
    await waitFor(() => expect(invoke).toHaveBeenLastCalledWith('trayectoria-confirmar', { body: { t: 'secreto123', accion: 'confirmar' } }));
  });

  it('solo pinta fotos https y sin enviar referer', async () => {
    invoke.mockResolvedValueOnce({ data: { ...datos, foto: 'http://rastreador.example/p.gif' }, error: null });
    const { container, unmount } = pintar('?t=abc');
    await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?');
    expect(container.querySelector('img')).toBeNull();
    unmount();
    invoke.mockResolvedValueOnce({ data: { ...datos, foto: 'https://rastreador.example/p.gif' }, error: null });
    const ajena = pintar('?t=abc');
    await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?');
    expect(ajena.container.querySelector('img')).toBeNull();
    ajena.unmount();
    invoke.mockResolvedValueOnce({ data: { ...datos, foto: 'https://otro-proyecto.supabase.co/storage/v1/object/public/a.jpg' }, error: null });
    const otroProyecto = pintar('?t=abc');
    await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?');
    expect(otroProyecto.container.querySelector('img')).toBeNull();
    otroProyecto.unmount();
    invoke.mockResolvedValueOnce({ data: { ...datos, foto: 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/a.jpg' }, error: null });
    const otra = pintar('?t=abc');
    await screen.findByText('¿Trabajó Lucía Maquillaje en Boda en Casares?');
    expect(otra.container.querySelector('img')?.getAttribute('referrerpolicy')).toBe('no-referrer');
  });
});
