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

  it('el botón de escribir solo existe si se le pasa onEscribir y avisa con id y nombre', () => {
    const { rerender } = render(<TarjetaOrganizador org={base} />);
    expect(screen.queryByText('Escribir por el chat')).toBeNull();
    const onEscribir = vi.fn();
    rerender(<TarjetaOrganizador org={base} onEscribir={onEscribir} />);
    fireEvent.click(screen.getByText('Escribir por el chat'));
    expect(onEscribir).toHaveBeenCalledWith('u1', 'Sala Norte');
  });
});
