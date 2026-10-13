import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FechasEvento, { hoyLocalISO } from './FechasEvento';

// El campo de fecha del formulario "Publicar solicitud" tenía value="" fijo y
// añadía la fecha en cada onChange. En iPhone el selector emite cambios al
// girar la rueda: cada uno añadía un día (aparecía el de hoy sin pedirlo) y
// reiniciaba el campo, y la pantalla se quedaba clavada hasta refrescar
// (13 oct 2026). Ahora la fecha elegida se queda en el campo y solo se añade
// al pulsar "Añadir día".
describe('FechasEvento', () => {
  const campo = () => screen.getByLabelText('Elegir día') as HTMLInputElement;

  it('elegir una fecha en el selector NO la añade por sí sola', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={[]} onChange={onChange} />);
    fireEvent.change(campo(), { target: { value: '2099-10-16' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(campo().value).toBe('2099-10-16');
  });

  it('"Añadir día" añade la fecha elegida, la ordena y vacía el campo', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2099-10-20']} onChange={onChange} />);
    fireEvent.change(campo(), { target: { value: '2099-10-16' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir día' }));
    expect(onChange).toHaveBeenCalledWith(['2099-10-16', '2099-10-20']);
    expect(campo().value).toBe('');
  });

  it('al cerrar el selector (pierde el foco) con una fecha elegida, la añade', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={[]} onChange={onChange} />);
    fireEvent.change(campo(), { target: { value: '2099-10-16' } });
    fireEvent.blur(campo());
    expect(onChange).toHaveBeenCalledWith(['2099-10-16']);
  });

  it('perder el foco sin fecha elegida no añade nada', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={[]} onChange={onChange} />);
    fireEvent.blur(campo());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('no repite una fecha ya añadida', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2099-10-16']} onChange={onChange} />);
    fireEvent.change(campo(), { target: { value: '2099-10-16' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir día' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('"Añadir día" está desactivado mientras no haya fecha elegida', () => {
    render(<FechasEvento fechas={[]} onChange={() => {}} />);
    expect((screen.getByRole('button', { name: 'Añadir día' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('el selector no deja elegir días pasados (min = hoy)', () => {
    render(<FechasEvento fechas={[]} onChange={() => {}} />);
    expect(campo().min).toBe(hoyLocalISO());
  });

  it('quitar una fecha la saca de la lista', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2099-10-16', '2099-10-17']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar 2099-10-16' }));
    expect(onChange).toHaveBeenCalledWith(['2099-10-17']);
  });
});
