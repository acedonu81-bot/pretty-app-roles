import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// availability solo la lee su dueño (RLS): un visitante que la leía directamente
// recibía 0 filas y veía todos los días libres. Ahora se lee por una función
// segura que devuelve las fechas futuras ocupadas y la última marca.
const estado = { respuesta: { fechas: [] as string[], ultima_marca: null as string | null } };
const rpc = vi.fn(async () => ({ data: estado.respuesta, error: null }));
const from = vi.fn(() => { throw new Error('no debe leer availability directamente'); });

vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: (...a: unknown[]) => (rpc as any)(...a), from: (...a: unknown[]) => (from as any)(...a) } }));

import AvailabilityCalendar from './AvailabilityCalendar';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const diasBoton = () => screen.getAllByRole('button').filter(b => /^[LMXJVSD]\d{1,2}$/.test((b.textContent ?? '').trim()));

describe('AvailabilityCalendar visto por un visitante', () => {
  beforeEach(() => { rpc.mockClear(); from.mockClear(); estado.respuesta = { fechas: [], ultima_marca: null }; });

  it('lee las fechas ocupadas del profesional por la función segura, no por la tabla', async () => {
    render(<AvailabilityCalendar userId="u1" mode="view-request" />);
    await waitFor(() => expect(rpc).toHaveBeenCalled());
    expect(rpc).toHaveBeenCalledWith('fechas_ocupadas_publicas', { p_user: 'u1' });
    expect(from).not.toHaveBeenCalled();
  });

  it('un día ocupado sale bloqueado y no se puede pedir; el resto sí', async () => {
    const manana = new Date(); manana.setDate(manana.getDate() + 1);
    estado.respuesta = { fechas: [iso(manana)], ultima_marca: new Date().toISOString() };
    render(<AvailabilityCalendar userId="u1" mode="view-request" />);
    await waitFor(() => expect(screen.getByText(/Última fecha marcada por el profesional: hoy\./)).toBeTruthy());
    const bloqueados = diasBoton().filter(b => (b as HTMLButtonElement).disabled);
    expect(bloqueados).toHaveLength(1);
    expect(bloqueados[0].textContent).toContain(String(manana.getDate()));
    expect(diasBoton().length).toBe(14);
  });

  it('si nunca ha marcado nada lo dice y todo queda libre', async () => {
    render(<AvailabilityCalendar userId="u1" mode="view-request" />);
    expect(await screen.findByText(/aún no ha marcado fechas ocupadas/)).toBeTruthy();
    expect(diasBoton().filter(b => (b as HTMLButtonElement).disabled)).toHaveLength(0);
  });

  it('si la función falla, no rompe y deja el aviso de confirmar por mensaje', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'boom' } } as never);
    render(<AvailabilityCalendar userId="u1" mode="view-request" />);
    expect(await screen.findByText(/aún no ha marcado fechas ocupadas/)).toBeTruthy();
  });
});
