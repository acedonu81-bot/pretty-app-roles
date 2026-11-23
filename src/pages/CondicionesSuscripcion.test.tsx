import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CondicionesSuscripcion from './CondicionesSuscripcion';

const pintar = () => render(
  <HelmetProvider><MemoryRouter><CondicionesSuscripcion /></MemoryRouter></HelmetProvider>,
);

describe('CondicionesSuscripcion', () => {
  it('dice quién vende, con nombre y NIF', () => {
    pintar();
    expect(screen.getAllByText(/Daniel Acedo Núñez/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/53022503M/).length).toBeGreaterThan(0);
    expect(screen.getByText(/FAMSAM, C\/ Hilados, 1, 28850 Torrejón de Ardoz \(Madrid\)/)).toBeTruthy();
  });

  it('explica el desistimiento de 14 días y la renuncia al empezar', () => {
    pintar();
    expect(screen.getAllByText(/14 días/).length).toBeGreaterThan(0);
    expect(screen.getByText(/renuncia/i)).toBeTruthy();
  });

  it('muestra los precios con IVA incluido', () => {
    pintar();
    expect(screen.getAllByText(/6,99/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/14,99/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/IVA incluido/i).length).toBeGreaterThan(0);
  });

  it('no usa rayas largas ni la palabra gratis', () => {
    const { container } = pintar();
    const texto = container.textContent ?? '';
    expect(texto).not.toMatch(/[—–]/);
    expect(texto).not.toMatch(/gratis/i);
  });
});

describe('CondicionesSuscripcion: orden del directorio', () => {
  it('explica la posición destacada y que está rotulada', () => {
    pintar();
    expect(screen.getByText(/aro dorado y la etiqueta "Destacado"/)).toBeTruthy();
    expect(screen.getByText(/rota cada día/)).toBeTruthy();
  });
});
