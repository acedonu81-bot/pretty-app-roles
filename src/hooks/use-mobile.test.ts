import { renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useIsMobile } from './use-mobile';

// El sidebar del dashboard parpadeaba en móvil: useIsMobile devolvía false en
// el PRIMER render (estado inicial undefined) y el valor real solo tras el
// useEffect, así que el SidebarProvider montaba con defaultOpen=true y colapsaba
// acto seguido.
//
// Estos tests registran el valor de CADA render, no solo el final: renderHook
// envuelve el montaje en act(), que corre los efectos antes de dejarnos leer
// result.current, así que comprobar solo el valor final pasa incluso con el
// código antiguo y no demuestra nada.

const setViewport = (width: number) => {
  window.innerWidth = width;
  window.matchMedia = ((query: string) => ({
    matches: width < 768,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
};

/** Renderiza el hook y devuelve el valor de cada render, en orden. */
const recordRenders = () => {
  const renders: boolean[] = [];
  renderHook(() => {
    renders.push(useIsMobile());
  });
  return renders;
};

describe('useIsMobile', () => {
  beforeEach(() => {
    setViewport(1280);
  });

  it('ya es true en el primer render con viewport móvil (sin parpadeo)', () => {
    setViewport(390);
    const renders = recordRenders();

    expect(renders[0]).toBe(true);
  });

  it('nunca pasa de false a true durante el montaje en móvil', () => {
    setViewport(390);
    const renders = recordRenders();

    // Un false seguido de un true es exactamente el salto que colapsaba el
    // sidebar a la vista del usuario.
    expect(renders).not.toContain(false);
  });

  it('es false en el primer render con viewport desktop', () => {
    setViewport(1280);
    const renders = recordRenders();

    expect(renders[0]).toBe(false);
  });

  it('trata 767px como móvil y 768px como desktop (límite del breakpoint)', () => {
    setViewport(767);
    expect(recordRenders()[0]).toBe(true);

    setViewport(768);
    expect(recordRenders()[0]).toBe(false);
  });
});
