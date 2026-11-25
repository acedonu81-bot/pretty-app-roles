import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AvisoBlackFriday from './AvisoBlackFriday';

describe('AvisoBlackFriday', () => {
  it('se ve del 25 al 30 de noviembre con los precios tachados', () => {
    render(<AvisoBlackFriday ahora={new Date('2026-11-28T12:00:00Z')} />);
    expect(screen.getByText(/Oferta especial Black Friday/)).toBeTruthy();
    expect(screen.getByText(/45,44/)).toBeTruthy();
    expect(screen.getByText(/Hasta el 30 de noviembre/)).toBeTruthy();
  });

  it('no se ve antes ni después', () => {
    const { container: antes } = render(<AvisoBlackFriday ahora={new Date('2026-11-24T22:59:00Z')} />);
    expect(antes.textContent).toBe('');
    const { container: despues } = render(<AvisoBlackFriday ahora={new Date('2026-11-30T23:00:00Z')} />);
    expect(despues.textContent).toBe('');
  });

  it('no usa la palabra gratis ni rayas largas', () => {
    const { container } = render(<AvisoBlackFriday ahora={new Date('2026-11-28T12:00:00Z')} />);
    expect(container.textContent).not.toMatch(/gratis|[—–]/i);
  });
});
