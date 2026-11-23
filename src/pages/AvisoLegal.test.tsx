import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AvisoLegal from './AvisoLegal';

describe('AvisoLegal', () => {
  it('enseña el domicilio del titular', () => {
    render(<HelmetProvider><MemoryRouter><AvisoLegal /></MemoryRouter></HelmetProvider>);
    expect(screen.getByText(/Carretera de la Base, 8, 28850 Torrejón de Ardoz \(Madrid\)/)).toBeTruthy();
  });

  it('nombra al titular como responsable de datos y respeta el fuero del consumidor', () => {
    const { container } = render(<HelmetProvider><MemoryRouter><AvisoLegal /></MemoryRouter></HelmetProvider>);
    const texto = container.textContent ?? '';
    expect(texto).toMatch(/responsable del tratamiento de datos personales es Daniel Acedo Núñez/);
    expect(texto).toMatch(/Si el usuario es consumidor, serán competentes los del lugar de su domicilio/);
    expect(texto).not.toMatch(/renuncia expresa a cualquier otro fuero/);
    expect(texto).not.toMatch(/eventos y eventos/);
    expect(texto).not.toMatch(/Ley 21\/2022|9\/2021|NIF\/CIF/);
  });
});
