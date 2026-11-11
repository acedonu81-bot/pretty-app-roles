import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRef } from 'react';
import RotulosAdmin from '../RotulosAdmin';

function Panel() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      <RotulosAdmin contenedor={ref} />
      <button title="Ver ficha pública"><svg /></button>
      <iframe title="preview-email" />
    </div>
  );
}

describe('RotulosAdmin', () => {
  it('enseña el rótulo al pasar por encima y quita el nativo', () => {
    render(<Panel />);
    const boton = screen.getByRole('button');
    act(() => { fireEvent.pointerOver(boton); });
    expect(screen.getByRole('tooltip').textContent).toBe('Ver ficha pública');
    expect(boton.getAttribute('title')).toBeNull();
    expect(boton.getAttribute('aria-label')).toBe('Ver ficha pública');
    act(() => { fireEvent.pointerOut(boton); });
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => { fireEvent.pointerOver(boton); });
    expect(screen.getByRole('tooltip').textContent).toBe('Ver ficha pública');
  });

  it('no saca rótulo en iframes', () => {
    const { container } = render(<Panel />);
    act(() => { fireEvent.pointerOver(container.querySelector('iframe')!); });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
