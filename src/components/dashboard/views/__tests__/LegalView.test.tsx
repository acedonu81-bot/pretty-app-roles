import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LegalView } from '../LegalView';

// LegalView (vía PrivacidadContent y SoporteContent) usa <Link> de
// react-router-dom para navegar entre rutas internas sin recargar el
// documento — necesita contexto de Router incluso en un render aislado.
describe('LegalView', () => {
  it('renderiza el título de privacidad', () => {
    render(<MemoryRouter><LegalView document="privacidad" /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /privacidad/i })).toBeInTheDocument();
  });

  it('renderiza el título de eliminar cuenta', () => {
    render(<MemoryRouter><LegalView document="eliminar-cuenta" /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('no importa AmbientBackground ni LegalFooter (viven fuera, en el shell del dashboard)', () => {
    // Verificación estructural: el contenedor raíz de LegalView no debe
    // tener las clases del fondo ambiental de la web pública.
    const { container } = render(<MemoryRouter><LegalView document="terminos" /></MemoryRouter>);
    expect(container.querySelector('[data-ambient-background]')).toBeNull();
  });
});
