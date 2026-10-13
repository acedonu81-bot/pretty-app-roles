import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FechasEvento, { hoyLocalISO } from './FechasEvento';

// El campo de fecha del formulario "Publicar solicitud" era un <input type=date>
// con value="" fijo: en iPhone se colgaba y añadía el día de hoy solo (13 oct
// 2026). Ahora es un calendario siempre visible en el que se tocan los días.
describe('FechasEvento (calendario)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 13, 12, 0, 0)); // martes 13 oct 2026
  });
  afterEach(() => vi.useRealTimers());

  const dia = (n: string) => screen.getByRole('gridcell', { name: n }) as HTMLButtonElement;

  it('tocar un día lo añade', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={[]} onChange={onChange} />);
    fireEvent.click(dia('16'));
    expect(onChange).toHaveBeenCalledWith(['2026-10-16']);
  });

  it('se pueden tocar varios días y quedan ordenados', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2026-10-20']} onChange={onChange} />);
    fireEvent.click(dia('16'));
    expect(onChange).toHaveBeenCalledWith(['2026-10-16', '2026-10-20']);
  });

  it('tocar un día ya elegido lo quita', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2026-10-16', '2026-10-17']} onChange={onChange} />);
    fireEvent.click(dia('16'));
    expect(onChange).toHaveBeenCalledWith(['2026-10-17']);
  });

  it('los días pasados no se pueden elegir, pero hoy sí', () => {
    render(<FechasEvento fechas={[]} onChange={() => {}} />);
    expect(dia('12').disabled).toBe(true);
    expect(dia('13').disabled).toBe(false);
  });

  it('los días elegidos se resumen en texto, con botón para quitarlos', () => {
    const onChange = vi.fn();
    render(<FechasEvento fechas={['2026-10-16', '2026-10-17']} onChange={onChange} />);
    expect(screen.getByText('2 días elegidos')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar 2026-10-16' }));
    expect(onChange).toHaveBeenCalledWith(['2026-10-17']);
  });

  it('sin fechas, explica qué hacer', () => {
    render(<FechasEvento fechas={[]} onChange={() => {}} />);
    expect(screen.getByText(/Toca los días del evento/)).toBeTruthy();
  });

  it('hoyLocalISO devuelve el día local, no el UTC', () => {
    expect(hoyLocalISO()).toBe('2026-10-13');
  });
});
