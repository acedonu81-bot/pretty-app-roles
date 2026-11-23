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
});
