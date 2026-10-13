import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const estado = {
  misRespuestas: [] as unknown[],
  filasActualizadas: [{ id: 'r1' }] as unknown[],
  updates: [] as unknown[],
  inserts: [] as unknown[],
  yo_contratado: false,
};
const onMessage = vi.fn();
const toastOk = vi.fn();
const toastError = vi.fn();
const toastNeutro = vi.fn();
const invoke = vi.fn(async () => ({ data: null, error: null }));

vi.mock('sonner', () => ({ toast: Object.assign((...a: unknown[]) => toastNeutro(...a), { success: (...a: unknown[]) => toastOk(...a), error: (...a: unknown[]) => toastError(...a) }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'dj', roles: [], display_name: 'Manuel' }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'pro-1' } }) }));
vi.mock('@/components/dashboard/ContractModal', () => ({ default: () => null }));
vi.mock('@/components/dashboard/views/empresario/HistorialTab', () => ({ ReviewModal: () => null }));

const oferta = () => ({
  id: 'q1', client_name: 'Burguerfest', client_user_id: 'organizador', event_type: 'Festival', city: 'Seseña',
  event_date: '2026-10-16', event_dates: ['2026-10-16', '2026-10-17'], budget_min: 100, budget_max: 100,
  roles_needed: ['DJ / Artista'], description: 'Se precisa DJ', contact_email: null, contact_phone: null,
  status: 'open', created_at: '2026-10-13T18:34:11Z', expires_at: new Date(Date.now() + 5 * 86400000).toISOString(),
  estilos: null, exact_address: null,
  event_request_responses: estado.yo_contratado ? [{ hired_at: '2026-10-13T20:05:00Z', professional_user_id: 'pro-1' }] : [],
});

function tabla(resolver: (ultimo: string | null) => unknown) {
  let ultimo: string | null = null;
  const c: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'or', 'order', 'limit', 'is', 'neq', 'not', 'single']) c[m] = () => c;
  c.insert = (v: unknown) => { estado.inserts.push(v); ultimo = 'insert'; return c; };
  c.update = (v: unknown) => { estado.updates.push(v); ultimo = 'update'; return c; };
  (c as { then: unknown }).then = (ok: (v: unknown) => unknown, ko?: (e: unknown) => unknown) => Promise.resolve(resolver(ultimo)).then(ok, ko);
  return c;
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (t: string) => {
      if (t === 'event_requests') return tabla(() => ({ data: [oferta()], error: null }));
      if (t === 'event_request_slots') return tabla(() => ({ data: [{ id: 's1', role: 'DJ / Artista', request_id: 'q1' }] }));
      if (t === 'event_request_responses') return tabla(u =>
        u === 'insert' ? { data: { id: 'nueva' }, error: null }
        : u === 'update' ? { data: estado.filasActualizadas, error: null }
        : { data: estado.misRespuestas, error: null });
      return tabla(() => ({ data: [], error: null }));
    },
    rpc: vi.fn(async () => ({ data: [], error: null })),
    functions: { invoke: (...a: unknown[]) => invoke(...(a as [])) },
    channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel: () => {},
  },
}));

import EventRequestsSection from './EventRequestsSection';

const abrir = async () => fireEvent.click(await screen.findByRole('button', { name: /Ver detalle y contactar/ }));

describe('Oferta vista por el profesional: cada paso dice qué hacer', () => {
  beforeEach(() => {
    estado.misRespuestas = []; estado.filasActualizadas = [{ id: 'r1' }]; estado.updates = []; estado.inserts = []; estado.yo_contratado = false;
    onMessage.mockClear(); toastOk.mockClear(); toastError.mockClear(); toastNeutro.mockClear(); invoke.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('apuntarse dice qué pasa después y NO manda el email falso de "te ha enviado un mensaje"', async () => {
    render(<EventRequestsSection onMessage={onMessage} />);
    await abrir();
    fireEvent.click(await screen.findByRole('button', { name: /Me interesa este bolo/ }));
    await waitFor(() => expect(toastOk).toHaveBeenCalled());
    expect(String(toastOk.mock.calls[0][0])).toMatch(/Si te elige, te avisamos y tendrás que confirmar/);
    expect(await screen.findByText(/Te has apuntado\. El organizador ya lo sabe\. Si te elige, te avisamos y tendrás que confirmar\./)).toBeTruthy();
    // Antes se invocaba send-email con type new_message: el organizador recibía "X te ha enviado un mensaje" sin ningún mensaje.
    expect(invoke).not.toHaveBeenCalled();
  });

  it('elegido: dice quién le eligió y qué hacer; Aceptar el bolo lo confirma y ofrece abrir el chat', async () => {
    estado.misRespuestas = [{ id: 'r1', request_id: 'q1', chosen_at: '2026-10-13T20:00:00Z', hired_at: null }];
    render(<EventRequestsSection onMessage={onMessage} />);
    await abrir();
    expect(await screen.findByText(/Burguerfest te ha elegido\. Confirma tu plaza para cerrar el .*Si no respondes, puede elegir a otro\./)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Aceptar el bolo/ }));
    await waitFor(() => expect(toastOk).toHaveBeenCalled());
    expect(estado.updates[0]).toHaveProperty('hired_at');
    // La tarjeta no desaparece: pasa a "Bolo confirmado" con el botón del chat.
    expect(await screen.findByText(/Bolo confirmado\. Está en tu calendario y el chat con Burguerfest está abierto/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Abrir el chat/ }));
    expect(onMessage).toHaveBeenCalledWith('organizador', 'Burguerfest');
    const opciones = toastOk.mock.calls[0][1] as { action?: { label: string } };
    expect(opciones.action?.label).toBe('Abrir el chat');
  });

  it('Rechazar actualiza la tarjeta al momento (antes seguía diciendo "te han elegido")', async () => {
    estado.misRespuestas = [{ id: 'r1', request_id: 'q1', chosen_at: '2026-10-13T20:00:00Z', hired_at: null }];
    render(<EventRequestsSection onMessage={onMessage} />);
    await abrir();
    fireEvent.click(await screen.findByRole('button', { name: 'Rechazar' }));
    await waitFor(() => expect(toastNeutro).toHaveBeenCalled());
    expect(estado.updates[0]).toEqual({ chosen_at: null });
    expect(screen.queryByText(/te ha elegido\./)).toBeNull();
    expect(await screen.findByText(/Te has apuntado\./)).toBeTruthy();
  });

  it('si la base de datos no actualiza ninguna fila al aceptar, no dice "confirmado"', async () => {
    estado.misRespuestas = [{ id: 'r1', request_id: 'q1', chosen_at: '2026-10-13T20:00:00Z', hired_at: null }];
    estado.filasActualizadas = [];
    render(<EventRequestsSection onMessage={onMessage} />);
    await abrir();
    fireEvent.click(await screen.findByRole('button', { name: /Aceptar el bolo/ }));
    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastOk).not.toHaveBeenCalled();
  });

  it('ya contratado (al volver a entrar) NO vuelve a ofrecer "Me interesa": dice que está confirmado', async () => {
    estado.yo_contratado = true;
    render(<EventRequestsSection onMessage={onMessage} />);
    await abrir();
    expect(await screen.findByText(/Bolo confirmado\. Está en tu calendario/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Me interesa este bolo/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Abrir el chat/ })).toBeTruthy();
  });
});
