import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const estado = { rolOtro: 'dj' as string | null };
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ maybeSingle: async () => ({ data: estado.rolOtro ? { role: estado.rolOtro } : null }) }) }) }) }),
    }),
  },
}));
vi.mock('@/lib/track', () => ({ logEvent: vi.fn() }));
vi.mock('@/components/dashboard/ContractModal', () => ({ default: () => <div>MODAL CONTRATO</div> }));

import AcuerdoChatBar from './AcuerdoChatBar';

const montar = (miRol: string) => render(
  <MemoryRouter><AcuerdoChatBar otherUserId="u2" otherName="Ana" miRol={miRol} /></MemoryRouter>,
);

describe('AcuerdoChatBar', () => {
  beforeEach(() => { estado.rolOtro = 'dj'; });

  it('el organizador ve "Cerrar acuerdo" y abre el contrato', async () => {
    montar('empresario');
    fireEvent.click(await screen.findByRole('button', { name: /Cerrar acuerdo/ }));
    expect(await screen.findByText('MODAL CONTRATO')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Reservas y ofertas/ })).toBeTruthy();
  });

  it('el profesional que habla con un organizador ve sus reservas, sin contrato', async () => {
    estado.rolOtro = 'empresario';
    montar('dj');
    expect(await screen.findByRole('button', { name: /Mis reservas y ofertas/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Cerrar acuerdo/ })).toBeNull();
  });

  it('dos profesionales no ven nada que cerrar', async () => {
    montar('dj');
    await waitFor(() => expect(screen.queryByText(/acordado|acordéis/)).toBeNull());
  });
});
