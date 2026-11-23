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
    expect(screen.getAllByText(/Carretera de la Base, 8, 28850 Torrejón de Ardoz \(Madrid\)/).length).toBeGreaterThan(0);
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
    expect(screen.queryByText(/prioridad por invitar/)).toBeNull();
  });
});

describe('CondicionesSuscripcion: revisión legal 23 nov', () => {
  it('explica el año de fundador y qué pasa después', () => {
    pintar();
    expect(screen.getByText(/Profesional sin coste durante un año/)).toBeTruthy();
    expect(screen.getByText(/pasan al nivel base salvo que se suscriban/)).toBeTruthy();
    expect(screen.queryByText(/precio de fundador/)).toBeNull();
  });

  it('incluye el modelo de formulario de desistimiento', () => {
    pintar();
    expect(screen.getByText(/Modelo de formulario de desistimiento/)).toBeTruthy();
  });

  it('dice dónde descargar las facturas', () => {
    pintar();
    expect(screen.getByText(/facturas de cada cobro/)).toBeTruthy();
  });
});
