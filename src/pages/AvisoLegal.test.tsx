import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AvisoLegal from './AvisoLegal';

describe('AvisoLegal', () => {
  it('el domicilio es el de la gestoría, con código postal', () => {
    render(<HelmetProvider><MemoryRouter><AvisoLegal /></MemoryRouter></HelmetProvider>);
    expect(screen.getByText(/FAMSAM, C\/ Hilados, 1, 28850 Torrejón de Ardoz \(Madrid\)/)).toBeTruthy();
  });
});
