import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CabeceraArtistaDJ from './CabeceraArtistaDJ';

const base = { nombre: 'DJ Prueba', foto: null, banner: null, zona: 'Madrid', estilos: ['Techno'], verificado: false, acciones: null };

describe('CabeceraArtistaDJ', () => {
  it('un visitante no ve las cámaras', () => {
    render(<CabeceraArtistaDJ {...base} />);
    expect(screen.queryByLabelText('Cambiar el fondo del banner')).toBeNull();
    expect(screen.queryByLabelText('Cambiar la foto de perfil')).toBeNull();
  });

  it('el propio DJ cambia banner y foto', () => {
    const onBanner = vi.fn();
    const onFoto = vi.fn();
    const { container } = render(<CabeceraArtistaDJ {...base} onCambiarBanner={onBanner} onCambiarFoto={onFoto} />);
    expect(screen.getByLabelText('Cambiar el fondo del banner')).toBeTruthy();
    expect(screen.getByLabelText('Cambiar la foto de perfil')).toBeTruthy();
    const [inputBanner, inputFoto] = container.querySelectorAll('input[type=file]');
    const img = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    fireEvent.change(inputBanner, { target: { files: [img] } });
    fireEvent.change(inputFoto, { target: { files: [img] } });
    expect(onBanner).toHaveBeenCalledWith(img);
    expect(onFoto).toHaveBeenCalledWith(img);
  });

  it('mientras sube, la cámara se desactiva', () => {
    render(<CabeceraArtistaDJ {...base} onCambiarBanner={() => {}} onCambiarFoto={() => {}} subiendo="foto" />);
    expect((screen.getByLabelText('Cambiar la foto de perfil') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Cambiar el fondo del banner') as HTMLButtonElement).disabled).toBe(false);
  });
});
