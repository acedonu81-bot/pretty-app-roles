import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const perfil = { role: 'dj' };
const sesion = { user: { id: 'yo' } };
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => sesion }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => perfil }));

let pendientesIds: string[] = [];
vi.mock('@/hooks/usePendingReviewsCount', () => ({ fetchPendingReviewTargets: async () => pendientesIds }));

let recibidas: unknown[] = [];
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (tabla: string) => {
      const q: any = {
        select: () => q, eq: () => q, in: () => q, order: () => q,
        limit: () => Promise.resolve({ data: recibidas }),
        then: (res: (v: unknown) => unknown) => res({ data: tabla === 'profiles' ? [{ user_id: 'otro', display_name: 'Sala Luna', role: 'empresario' }] : [] }),
      };
      return q;
    },
  },
}));
// El formulario real se prueba en HistorialTab; aquí solo que se abre con la persona correcta.
vi.mock('@/components/dashboard/views/empresario/HistorialTab', () => ({
  ReviewModal: ({ booking, onDone }: any) => (
    <div role="dialog">Valorando a {booking.professional_name}
      <button onClick={() => onDone(booking.professional_user_id, 5, null)}>enviar</button>
    </div>
  ),
}));

import ResenasView from '../ResenasView';

beforeEach(() => { pendientesIds = []; recibidas = []; });

describe('ResenasView', () => {
  it('sin nada pendiente ni reseñas, lo dice claro en los dos bloques', async () => {
    render(<ResenasView />);
    expect(await screen.findByText('No tienes valoraciones pendientes')).toBeTruthy();
    expect(screen.getByText('Todavía no te han dejado reseñas')).toBeTruthy();
  });

  it('con un trato sin valorar, enseña a quién y el botón Valorar abre el formulario; al enviar desaparece', async () => {
    pendientesIds = ['otro'];
    render(<ResenasView />);
    expect(await screen.findByText('Sala Luna')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Valorar' }));
    expect(screen.getByRole('dialog').textContent).toContain('Valorando a Sala Luna');
    fireEvent.click(screen.getByText('enviar'));
    await waitFor(() => expect(screen.getByText('No tienes valoraciones pendientes')).toBeTruthy());
  });

  it('enseña las reseñas recibidas con la media, "En revisión" si aún no están aprobadas, y oculta las rechazadas', async () => {
    recibidas = [
      { id: 'a', rating: 5, comment: 'Genial', event_type: 'Boda', created_at: '2026-10-01T10:00:00Z', reviewer_name: 'Ana', reviewer_role: 'empresario', approved: true, rejected_at: null },
      { id: 'b', rating: 3, comment: 'Correcto', event_type: null, created_at: '2026-10-02T10:00:00Z', reviewer_name: 'Luis', reviewer_role: null, approved: false, rejected_at: null },
      { id: 'c', rating: 1, comment: 'Oculta', event_type: null, created_at: '2026-10-03T10:00:00Z', reviewer_name: 'Rechazada', reviewer_role: null, approved: false, rejected_at: '2026-10-04T10:00:00Z' },
    ];
    render(<ResenasView />);
    expect(await screen.findByText('Genial')).toBeTruthy();
    expect(screen.getByText('En revisión')).toBeTruthy();
    expect(screen.queryByText('Oculta')).toBeNull();
    expect(screen.getByText(/5\.0 · 1 reseña/)).toBeTruthy();
  });
});
