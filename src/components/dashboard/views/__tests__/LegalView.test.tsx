import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LegalView } from '../LegalView';

describe('LegalView', () => {
  it('renderiza el título de privacidad', () => {
    render(<LegalView document="privacidad" />);
    expect(screen.getByRole('heading', { name: /privacidad/i })).toBeInTheDocument();
  });

  it('renderiza el título de eliminar cuenta', () => {
    render(<LegalView document="eliminar-cuenta" />);
    expect(screen.getByRole('heading', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('no importa AmbientBackground ni LegalFooter (viven fuera, en el shell del dashboard)', () => {
    // Verificación estructural: el contenedor raíz de LegalView no debe
    // tener las clases del fondo ambiental de la web pública.
    const { container } = render(<LegalView document="terminos" />);
    expect(container.querySelector('[data-ambient-background]')).toBeNull();
  });
});
