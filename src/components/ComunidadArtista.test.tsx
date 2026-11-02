import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PanelSeguidores } from './ComunidadArtista';

describe('PanelSeguidores', () => {
  it('sin lista (cargando o error) no llama organizadores a nadie', () => {
    render(<PanelSeguidores seguidores={null} total={2} />);
    expect(screen.getByText('2 seguidores')).toBeTruthy();
    expect(screen.queryByText(/persona/)).toBeNull();
  });
  it('profesionales con nombre y el resto contados sin nombre', () => {
    render(<PanelSeguidores seguidores={[{ user_id: 'u1', nombre: 'DJ Uno', foto: null, rol: 'dj' }]} total={3} />);
    expect(screen.getByText('DJ Uno')).toBeTruthy();
    expect(screen.getByText('Y 2 personas más')).toBeTruthy();
  });
  it('sin seguidores invita a ser el primero', () => {
    render(<PanelSeguidores seguidores={[]} total={0} />);
    expect(screen.getByText(/Sé el primero/)).toBeTruthy();
  });
});
