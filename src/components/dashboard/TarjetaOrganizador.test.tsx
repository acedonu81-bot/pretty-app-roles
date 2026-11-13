import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TarjetaOrganizador, { textoContrataciones } from './TarjetaOrganizador';

const base = { user_id: 'u1', nombre: 'Sala Norte', logo: null, ciudad: 'Madrid', descripcion: 'Bodas y eventos de empresa', contrataciones: 3 };

describe('textoContrataciones', () => {
  it('usa singular, plural y el caso sin contrataciones', () => {
    expect(textoContrataciones(0)).toBe('Aún sin contrataciones en XPEAK');
    expect(textoContrataciones(1)).toBe('1 contratación en XPEAK');
    expect(textoContrataciones(7)).toBe('7 contrataciones en XPEAK');
  });
});

describe('TarjetaOrganizador', () => {
  it('enseña nombre, ciudad, descripción y contrataciones, y la inicial si no hay logo', () => {
    render(<TarjetaOrganizador org={base} />);
    expect(screen.getByText('Sala Norte')).toBeTruthy();
    expect(screen.getByText('Madrid')).toBeTruthy();
    expect(screen.getByText('Bodas y eventos de empresa')).toBeTruthy();
    expect(screen.getByText('3 contrataciones en XPEAK')).toBeTruthy();
    expect(screen.getByText('S')).toBeTruthy();
  });

  it('no pinta ciudad ni descripción si faltan', () => {
    render(<TarjetaOrganizador org={{ ...base, ciudad: null, descripcion: null }} />);
    expect(screen.queryByText('Madrid')).toBeNull();
    expect(screen.queryByText('Bodas y eventos de empresa')).toBeNull();
  });

  it('"Ver ofertas" solo sale con ofertas activas y con onVerOfertas, y no hay botón de chat', () => {
    const onVer = vi.fn();
    const { rerender } = render(<TarjetaOrganizador org={{ ...base, ofertas_activas: 2 }} />);
    expect(screen.queryByText('Ver sus 2 ofertas activas')).toBeNull();
    rerender(<TarjetaOrganizador org={{ ...base, ofertas_activas: 0 }} onVerOfertas={onVer} />);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<TarjetaOrganizador org={{ ...base, ofertas_activas: 2 }} onVerOfertas={onVer} />);
    fireEvent.click(screen.getByText('Ver sus 2 ofertas activas'));
    expect(onVer).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Escribir por el chat')).toBeNull();
  });
});
