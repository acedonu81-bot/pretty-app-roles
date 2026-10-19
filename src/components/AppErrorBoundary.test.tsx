import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppErrorBoundary from './AppErrorBoundary';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) }, rpc: async () => ({}) },
}));

const Roto = ({ mensaje }: { mensaje: string }) => { throw new Error(mensaje); };

describe('AppErrorBoundary', () => {
  const reload = vi.fn();
  beforeEach(() => {
    sessionStorage.clear(); reload.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(window, 'location', { value: { ...window.location, reload, href: 'http://x/' }, writable: true });
  });
  afterEach(() => vi.restoreAllMocks());

  // Caso real (19 oct 2026): tras un deploy salía un instante "Algo ha fallado" y se iba solo.
  it('chunk viejo: recarga sola y NO enseña la ventana de error', () => {
    render(<AppErrorBoundary><Roto mensaje="Failed to fetch dynamically imported module: https://xpeak.es/assets/X-abc.js" /></AppErrorBoundary>);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Algo ha fallado/)).toBeNull();
  });

  it('chunk viejo por segunda vez: ya no recarga y sí enseña el aviso', () => {
    sessionStorage.setItem('xpeak_chunk_reload_attempted', '1');
    render(<AppErrorBoundary><Roto mensaje="Failed to fetch dynamically imported module: x" /></AppErrorBoundary>);
    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByText(/Algo ha fallado/)).toBeTruthy();
  });

  it('otro error: enseña el aviso y no recarga', () => {
    render(<AppErrorBoundary><Roto mensaje="x is undefined" /></AppErrorBoundary>);
    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByText(/Algo ha fallado/)).toBeTruthy();
  });
});
