import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Al publicar una oferta, el organizador ya no escribe cada vez su nombre,
// ciudad y dirección: salen de su última oferta o, si es la primera, de su perfil.

const estado = { ultima: null as Record<string, unknown> | null };

vi.mock('sonner', () => ({ toast: Object.assign(() => {}, { success: () => {}, error: () => {} }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'empresario', roles: [], display_name: 'Sala Sol', zone: 'Getafe' }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'org-1' } }) }));
vi.mock('@/components/dashboard/ContractModal', () => ({ default: () => null }));
vi.mock('@/components/dashboard/views/empresario/HistorialTab', () => ({ ReviewModal: () => null }));

function tabla(t: string) {
  let uno = false;
  const c: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'or', 'order', 'limit', 'is', 'neq', 'not', 'single', 'insert', 'update']) c[m] = () => c;
  c.maybeSingle = () => { uno = true; return c; };
  (c as { then: unknown }).then = (ok: (v: unknown) => unknown) =>
    Promise.resolve(t === 'event_requests' && uno ? { data: estado.ultima, error: null } : { data: [], error: null }).then(ok);
  return c;
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (t: string) => tabla(t),
    rpc: vi.fn(async () => ({ data: [], error: null })),
    functions: { invoke: vi.fn(async () => ({ data: null, error: null })) },
    channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel: () => {},
  },
}));

import EventRequestsSection from './EventRequestsSection';

const publicar = async () => fireEvent.click(await screen.findByRole('button', { name: /Publicar evento/ }));

describe('Publicar oferta: autorrelleno con los datos del organizador', () => {
  beforeEach(() => { estado.ultima = null; });

  it('usa la última oferta: nombre, ciudad, dirección y tipo de evento', async () => {
    estado.ultima = { client_name: 'Burguerfest', city: 'Seseña', exact_address: 'Recinto ferial', event_type: 'Festival' };
    render(<EventRequestsSection />);
    await publicar();
    await waitFor(() => expect(screen.getByDisplayValue('Burguerfest')).toBeTruthy());
    expect(screen.getByDisplayValue('Seseña')).toBeTruthy();
    expect(screen.getByDisplayValue('Recinto ferial')).toBeTruthy();
    expect((screen.getByDisplayValue('Festival') as HTMLSelectElement).value).toBe('Festival');
    expect(screen.getByText(/Hemos puesto tus datos de la última vez/)).toBeTruthy();
  });

  it('sin ofertas previas usa el nombre y la zona del perfil', async () => {
    render(<EventRequestsSection />);
    await publicar();
    await waitFor(() => expect(screen.getByDisplayValue('Sala Sol')).toBeTruthy());
    expect(screen.getByDisplayValue('Getafe')).toBeTruthy();
  });
});
