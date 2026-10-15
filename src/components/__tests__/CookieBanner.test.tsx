import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CookieBanner, { REGISTRO_PENDIENTE_META } from '@/components/CookieBanner';

const montar = (ruta: string) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <CookieBanner />
  </MemoryRouter>,
);

describe('CookieBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    delete (window as any).fbq;
    delete (window as any)._fbq;
    // cargarMetaPixelSiHaceFalta inserta su script delante del primero.
    document.head.appendChild(document.createElement('script'));
  });
  afterEach(() => { vi.useRealTimers(); });

  it('no sale en /auth (se pide después del alta)', () => {
    montar('/auth?fbclid=x');
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByRole('button', { name: 'Aceptar' })).toBeNull();
  });

  it('sale en el resto de páginas', () => {
    montar('/descubrir');
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeTruthy();
    // Rechazar en la misma capa que Aceptar (guía de la AEPD).
    expect(screen.getByRole('button', { name: 'Rechazar' })).toBeTruthy();
  });

  it('al aceptar todo cuenta a Meta el registro que se hizo sin píxel', () => {
    sessionStorage.setItem(REGISTRO_PENDIENTE_META, '1');
    montar('/dashboard');
    act(() => { vi.advanceTimersByTime(2000); });
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    const cola = (window as any).fbq.queue.map((args: unknown[]) => Array.from(args));
    expect(cola).toContainEqual(['track', 'CompleteRegistration']);
    expect(sessionStorage.getItem(REGISTRO_PENDIENTE_META)).toBeNull();
  });

  it('al rechazar no carga el píxel ni manda nada', () => {
    sessionStorage.setItem(REGISTRO_PENDIENTE_META, '1');
    montar('/dashboard');
    act(() => { vi.advanceTimersByTime(2000); });
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect((window as any).fbq).toBeUndefined();
    expect(sessionStorage.getItem(REGISTRO_PENDIENTE_META)).toBe('1');
  });
});
