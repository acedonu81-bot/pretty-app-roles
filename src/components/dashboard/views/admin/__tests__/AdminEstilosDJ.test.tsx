import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const djs = [
  { id: 'a', user_id: 'ua', display_name: 'Sin Estilos', zone: 'Madrid', bio: '', genres: [], audio_embed_url: null, audio_session_urls: ['https://mixcloud.com/x'], experience_level: null },
  { id: 'b', user_id: 'ub', display_name: 'Con Estilos', zone: 'Madrid', bio: '', genres: ['Remember'], audio_embed_url: null, audio_session_urls: null, experience_level: null },
];
const updates: unknown[] = [];

vi.mock('@/integrations/supabase/client', () => {
  const lista: Record<string, unknown> = {};
  ['select', 'or', 'neq', 'order'].forEach(m => { lista[m] = () => lista; });
  lista.limit = () => Promise.resolve({ data: djs, error: null });
  return {
    supabase: {
      from: () => ({
        ...lista,
        update: (v: unknown) => { updates.push(v); return { eq: () => Promise.resolve({ error: null }) }; },
      }),
    },
  };
});
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import AdminEstilosDJ from '../AdminEstilosDJ';

describe('AdminEstilosDJ', () => {
  beforeEach(() => { updates.length = 0; });

  it('enseña primero a los que no tienen estilos y guarda al marcar', async () => {
    render(<AdminEstilosDJ />);
    await screen.findByText('Sin Estilos');
    expect(screen.queryByText('Con Estilos')).toBeNull();
    expect(screen.getByText(/1 sin ningún estilo de 2/)).toBeTruthy();
    expect(screen.getByText('Escuchar sesión').closest('a')?.getAttribute('href')).toBe('https://mixcloud.com/x');

    fireEvent.click(screen.getAllByRole('button', { name: 'Remember' })[0]);
    await waitFor(() => expect(updates).toEqual([{ genres: ['Remember'] }]));
    // sigue a la vista para poder marcarle más
    expect(screen.getByText('Sin Estilos')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Techno' })[0]);
    await waitFor(() => expect(updates[1]).toEqual({ genres: ['Remember', 'Techno'] }));
  });
});
