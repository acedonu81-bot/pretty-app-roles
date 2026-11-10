import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// La barra de abajo también cuenta escuchas de 5 minutos (10 nov 2026: antes
// solo contaban en la ficha del set y el usuario escuchó uno anclado sin que sumara).
const rpc = vi.fn(() => Promise.resolve({ data: true, error: null }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...(a as [])) } }));
vi.mock('@/lib/escuchas', async (orig) => ({ ...(await orig<typeof import('@/lib/escuchas')>()), navegadorNoCuenta: () => false }));

import { ReproductorConcursoProvider, useReproductorConcurso } from './ReproductorConcurso';

const Anclar = ({ escucha }: { escucha?: { djUserId: string; setUrl: string } }) => {
  const { reproducir } = useReproductorConcurso();
  return <button onClick={() => reproducir({ url: 'https://x/set.mp3', audioSrc: 'https://x/set.mp3', titulo: 'Set', escucha })}>anclar</button>;
};

const sonar = (segundos: number) => {
  const audio = document.querySelector('audio')!;
  fireEvent.play(audio);
  for (let t = 0; t <= segundos; t++) {
    Object.defineProperty(audio, 'currentTime', { value: t, configurable: true });
    act(() => { fireEvent.timeUpdate(audio); });
  }
};

describe('escuchas desde la barra de abajo', () => {
  beforeEach(() => rpc.mockClear());

  it('registra la escucha a los 5 minutos de un set de DJ anclado', () => {
    render(<MemoryRouter><ReproductorConcursoProvider><Anclar escucha={{ djUserId: 'dj-1', setUrl: 'https://x/set.mp3' }} /></ReproductorConcursoProvider></MemoryRouter>);
    fireEvent.click(screen.getByText('anclar'));
    sonar(299);
    expect(rpc).not.toHaveBeenCalled();
    sonar(301);
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('registrar_escucha', expect.objectContaining({ p_dj: 'dj-1', p_set_url: 'https://x/set.mp3' }));
  });

  it('sin DJ (sesiones del concurso) no registra nada', () => {
    render(<MemoryRouter><ReproductorConcursoProvider><Anclar /></ReproductorConcursoProvider></MemoryRouter>);
    fireEvent.click(screen.getByText('anclar'));
    sonar(400);
    expect(rpc).not.toHaveBeenCalled();
  });
});
