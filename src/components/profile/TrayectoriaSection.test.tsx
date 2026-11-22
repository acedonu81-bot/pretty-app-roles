import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrayectoriaSection from './TrayectoriaSection';

const e = (id: string, titulo: string, estado: string, origen = 'declarado') =>
  ({ id, titulo, tipo: null, fecha: '2026-06-01', ciudad: 'Málaga', lugar: null, foto_url: null, estado, origen }) as any;

describe('TrayectoriaSection', () => {
  it('pinta las tres marcas', () => {
    render(<TrayectoriaSection eventos={[e('1', 'Boda A', 'declarado'), e('2', 'Gala B', 'confirmado'), e('3', 'Fiesta C', 'declarado', 'xpeak')]} />);
    expect(screen.getByText('Declarado')).toBeTruthy();
    expect(screen.getByText('Confirmado')).toBeTruthy();
    expect(screen.getByText('Contrato XPEAK')).toBeTruthy();
  });

  it('un evento pendiente se enseña como Declarado', () => {
    render(<TrayectoriaSection eventos={[e('1', 'Boda A', 'pendiente')]} />);
    expect(screen.getByText('Declarado')).toBeTruthy();
  });

  it('resume cuántos están confirmados', () => {
    render(<TrayectoriaSection eventos={[e('1', 'A', 'confirmado'), e('2', 'B', 'declarado'), e('3', 'C', 'declarado', 'xpeak')]} />);
    expect(screen.getByText('3 eventos · 2 confirmados')).toBeTruthy();
  });

  it('sin eventos no pinta nada', () => {
    const { container } = render(<TrayectoriaSection eventos={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('nunca enseña correos', () => {
    const { container } = render(<TrayectoriaSection eventos={[{ ...e('1', 'Boda A', 'confirmado'), email: 'org@x.es', email_hash: 'abc' }]} />);
    expect(container.textContent).not.toMatch(/@|abc/);
  });
});
