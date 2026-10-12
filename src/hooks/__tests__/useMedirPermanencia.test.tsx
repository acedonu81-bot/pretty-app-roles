import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

const track = vi.fn();
vi.mock('@/lib/track', () => ({ track: (...a: unknown[]) => track(...a) }));

import { useMedirPermanencia, etiquetaToque, estadoCookies } from '@/hooks/useMedirPermanencia';

function Pagina() {
  useMedirPermanencia();
  return (
    <div>
      <button>Solo necesarias</button>
      <input name="email" />
      <p>texto suelto</p>
    </div>
  );
}

describe('useMedirPermanencia', () => {
  beforeEach(() => { vi.useFakeTimers(); track.mockClear(); localStorage.clear(); });
  afterEach(() => { vi.useRealTimers(); });

  it('manda "sigue" en cada hito mientras la página está visible', () => {
    render(<Pagina />);
    vi.advanceTimersByTime(5000);
    expect(track).toHaveBeenCalledWith('auth_sigue', expect.objectContaining({ seg: 5, cookies: 'pendiente', toques: 0 }));
    vi.advanceTimersByTime(5000);
    expect(track.mock.calls.filter(c => c[0] === 'auth_sigue')).toHaveLength(2);
  });

  it('registra qué se toca sin guardar lo escrito', () => {
    const { getByText, container } = render(<Pagina />);
    fireEvent.pointerDown(getByText('Solo necesarias'));
    fireEvent.pointerDown(container.querySelector('input')!);
    fireEvent.pointerDown(getByText('texto suelto'));
    const toques = track.mock.calls.filter(c => c[0] === 'auth_toque').map(c => (c[1] as { en: string }).en);
    expect(toques).toEqual(['Solo_necesarias', 'campo:email', 'fondo']);
  });

  it('manda la salida una sola vez al ocultarse la página', () => {
    render(<Pagina />);
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));
    expect(track.mock.calls.filter(c => c[0] === 'auth_salida')).toHaveLength(1);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('lee el estado del aviso de cookies', () => {
    expect(estadoCookies()).toBe('pendiente');
    localStorage.setItem('xpeak-cookie-consent', JSON.stringify({ marketing: false }));
    expect(estadoCookies()).toBe('necesarias');
    localStorage.setItem('xpeak-cookie-consent', JSON.stringify({ marketing: true }));
    expect(estadoCookies()).toBe('todas');
    expect(etiquetaToque(null)).toBe('fondo');
  });
});
