import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

const invoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: (...a: unknown[]) => invoke(...a) } } }));

import AcuerdoCerrado from './AcuerdoCerrado';

const pintar = (query: string) => {
  window.history.pushState({}, '', `/acuerdo-cerrado${query}`);
  return render(<HelmetProvider><AcuerdoCerrado /></HelmetProvider>);
};
const ver = { ok: true, titulo: 'Boda en Casares', fecha: '2026-12-01', respuesta: null, esProfesional: false, anadido: false };

describe('AcuerdoCerrado', () => {
  beforeEach(() => { invoke.mockReset(); });

  it('sin enlace dice que no es válido', async () => {
    pintar('');
    expect(await screen.findByText('El enlace no es válido')).toBeTruthy();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('abrir el enlace solo pregunta; responde al pulsar Sí', async () => {
    invoke.mockResolvedValueOnce({ data: ver, error: null });
    pintar('?t=abc');
    expect(await screen.findByText('¿Se cerró el acuerdo para Boda en Casares?')).toBeTruthy();
    expect(invoke).toHaveBeenCalledTimes(1);
    invoke.mockResolvedValueOnce({ data: { ...ver, respuesta: 'si' }, error: null });
    fireEvent.click(screen.getByRole('button', { name: 'Sí, se cerró' }));
    await waitFor(() => expect(invoke).toHaveBeenLastCalledWith('acuerdo-cerrado-responder', { body: { t: 'abc', accion: 'responder', r: 'si' } }));
    expect(await screen.findByText('Gracias por contestar')).toBeTruthy();
  });

  it('el profesional que dice Sí puede añadirlo a su trayectoria', async () => {
    invoke.mockResolvedValueOnce({ data: { ...ver, respuesta: 'si', esProfesional: true }, error: null });
    pintar('?t=abc');
    const boton = await screen.findByRole('button', { name: 'Añadir a mi trayectoria' });
    invoke.mockResolvedValueOnce({ data: { ...ver, respuesta: 'si', esProfesional: true, anadido: true }, error: null });
    fireEvent.click(boton);
    await waitFor(() => expect(invoke).toHaveBeenLastCalledWith('acuerdo-cerrado-responder', { body: { t: 'abc', accion: 'anadir' } }));
    expect(await screen.findByText('Añadido a tu trayectoria')).toBeTruthy();
  });

  it('quien no es profesional no ve el botón de añadir', async () => {
    invoke.mockResolvedValueOnce({ data: { ...ver, respuesta: 'si' }, error: null });
    pintar('?t=abc');
    await screen.findByText('Gracias por contestar');
    expect(screen.queryByRole('button', { name: 'Añadir a mi trayectoria' })).toBeNull();
  });

  it('quita el token de la barra de direcciones', async () => {
    invoke.mockResolvedValueOnce({ data: ver, error: null });
    pintar('?t=secreto');
    await screen.findByText('¿Se cerró el acuerdo para Boda en Casares?');
    expect(window.location.search).toBe('');
  });

  it('no promete lo que no es cierto sobre la otra parte', async () => {
    invoke.mockResolvedValueOnce({ data: ver, error: null });
    const { container } = pintar('?t=abc');
    await screen.findByText('¿Se cerró el acuerdo para Boda en Casares?');
    expect(container.textContent).not.toMatch(/No se lo contamos a la otra parte/);
  });
});
