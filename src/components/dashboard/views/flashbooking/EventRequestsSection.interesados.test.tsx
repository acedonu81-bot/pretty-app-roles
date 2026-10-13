import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const estado = {
  candidatos: [] as unknown[],
  filasActualizadas: [{ id: 'r1' }] as unknown[],
  updates: [] as unknown[],
};
const onMessage = vi.fn();
const toastOk = vi.fn();
const toastError = vi.fn();

vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: (...a: unknown[]) => toastOk(...a), error: (...a: unknown[]) => toastError(...a) }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'empresario', roles: [] }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'organizador' } }) }));
vi.mock('@/components/dashboard/ContractModal', () => ({ default: () => null }));
vi.mock('@/components/dashboard/views/empresario/HistorialTab', () => ({ ReviewModal: () => null }));

const oferta = {
  id: 'q1', client_name: 'Burguerfest', client_user_id: 'organizador', event_type: 'Festival', city: 'Seseña',
  event_date: '2026-10-16', event_dates: ['2026-10-16', '2026-10-17'], budget_min: 100, budget_max: 100,
  roles_needed: ['DJ / Artista'], description: 'Se precisa DJ', contact_email: null, contact_phone: null,
  status: 'open', created_at: '2026-10-13T18:34:11Z', expires_at: new Date(Date.now() + 5 * 86400000).toISOString(),
  estilos: null, exact_address: null,
};

function cadena(resultado: () => unknown) {
  const c: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'or', 'order', 'limit', 'is', 'neq']) c[m] = () => c;
  (c as { then: unknown }).then = (ok: (v: unknown) => unknown, ko?: (e: unknown) => unknown) => Promise.resolve(resultado()).then(ok, ko);
  return c;
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (tabla: string) => {
      if (tabla === 'event_requests') return cadena(() => ({ data: [oferta], error: null }));
      if (tabla === 'event_request_slots') return cadena(() => ({ data: [{ id: 's1', role: 'DJ / Artista', request_id: 'q1' }] }));
      if (tabla === 'event_request_responses') {
        const c = cadena(() => ({ data: estado.filasActualizadas, error: null })) as Record<string, unknown>;
        c.update = (valores: unknown) => { estado.updates.push(valores); return c; };
        return c;
      }
      return cadena(() => ({ data: [], error: null }));
    },
    rpc: vi.fn(async () => ({ data: estado.candidatos, error: null })),
    channel: () => ({ on() { return this; }, subscribe() { return this; } }),
    removeChannel: () => {},
  },
}));

import EventRequestsSection from './EventRequestsSection';

const manuel = {
  id: 'r1', professional_user_id: 'pro-manuel', nombre: 'Manuel Jesús Frias Martín', foto: null, mensaje: null,
  slot_id: 's1', chosen_at: null, hired_at: null,
};

// 13 oct 2026: un DJ se apuntó a Burguerfest y el organizador no veía nada: el
// candidato estaba dentro de una tarjeta plegada y el aviso era solo la campana.
describe('Ofertas del organizador con un profesional apuntado', () => {
  beforeEach(() => {
    estado.candidatos = [manuel];
    estado.filasActualizadas = [{ id: 'r1' }];
    estado.updates = [];
    onMessage.mockClear(); toastOk.mockClear(); toastError.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('la tarjeta se abre sola y enseña al candidato con su botón Elegir', async () => {
    render(<EventRequestsSection onMessage={onMessage} />);
    expect(await screen.findByText('Manuel Jesús Frias Martín')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Elegir' })).toBeTruthy();
    expect(screen.getByText(/1 interesado/)).toBeTruthy();
  });

  it('con la tarjeta cerrada se ve igualmente "se ha apuntado" con un botón Ver y elegir', async () => {
    render(<EventRequestsSection onMessage={onMessage} />);
    fireEvent.click(await screen.findByRole('button', { name: /Cerrar/ }));
    expect(await screen.findByText('Manuel Jesús Frias Martín se ha apuntado')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ver y elegir/ }));
    expect(await screen.findByRole('button', { name: 'Elegir' })).toBeTruthy();
  });

  it('Elegir guarda la elección y avisa de lo que pasa después', async () => {
    render(<EventRequestsSection onMessage={onMessage} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Elegir' }));
    await waitFor(() => expect(toastOk).toHaveBeenCalled());
    expect(estado.updates).toHaveLength(1);
    expect(estado.updates[0]).toHaveProperty('chosen_at');
    expect(await screen.findByText('ESPERANDO SU CONFIRMACIÓN')).toBeTruthy();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('si la base de datos no actualiza ninguna fila, NO dice "avisado": muestra el error', async () => {
    estado.filasActualizadas = [];
    render(<EventRequestsSection onMessage={onMessage} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Elegir' }));
    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastOk).not.toHaveBeenCalled();
    expect(screen.queryByText('ESPERANDO SU CONFIRMACIÓN')).toBeNull();
  });

  it('Escribir abre el chat con el candidato y Ver perfil lleva a su ficha', async () => {
    render(<EventRequestsSection onMessage={onMessage} />);
    fireEvent.click(await screen.findByRole('button', { name: /Escribir/ }));
    expect(onMessage).toHaveBeenCalledWith('pro-manuel', 'Manuel Jesús Frias Martín');
    const perfil = screen.getByRole('link', { name: /Ver perfil/ }) as HTMLAnchorElement;
    expect(perfil.getAttribute('href')).toBe('/p/pro-manuel');
  });

  it('con foco en la oferta (enlace del email) la deja abierta y centrada', async () => {
    render(<EventRequestsSection foco={{ requestId: 'q1', n: 1 }} onMessage={onMessage} />);
    expect(await screen.findByRole('button', { name: 'Elegir' })).toBeTruthy();
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  });
});
