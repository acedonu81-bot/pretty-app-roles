import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CiudadBuscador, { sugerirCiudades } from '@/components/CiudadBuscador';

describe('sugerirCiudades', () => {
  it('sin tildes y primero las que empiezan por lo escrito', () => {
    expect(sugerirCiudades('toled')[0]).toBe('Toledo');
    expect(sugerirCiudades('malaga')[0]).toBe('Málaga');
    expect(sugerirCiudades('cor')[0]).toBe('Córdoba');
    // "Santiago" contiene "iago" pero no empieza por ello: va detrás o se cuela igual.
    expect(sugerirCiudades('iago')).toContain('Santiago de Compostela');
  });

  it('sin texto propone las grandes capitales y nunca más de 6', () => {
    expect(sugerirCiudades('')[0]).toBe('Madrid');
    expect(sugerirCiudades('a').length).toBeLessThanOrEqual(6);
  });

  it('sin coincidencias devuelve vacío', () => {
    expect(sugerirCiudades('zzzz')).toEqual([]);
  });
});

describe('CiudadBuscador', () => {
  it('al tocar una sugerencia la elige', () => {
    const onChange = vi.fn();
    render(<CiudadBuscador value="" onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'tole' } });
    fireEvent.pointerDown(screen.getByRole('option', { name: 'Toledo' }));
    expect(onChange).toHaveBeenLastCalledWith('Toledo');
    expect((input as HTMLInputElement).value).toBe('Toledo');
  });

  it('si lo escrito ya es una ciudad (sin tildes) queda elegida; si no, vacía', () => {
    const onChange = vi.fn();
    render(<CiudadBuscador value="" onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'cadiz' } });
    expect(onChange).toHaveBeenLastCalledWith('Cádiz');
    fireEvent.change(input, { target: { value: 'pueblito' } });
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('Enter elige la primera sugerencia sin enviar el formulario', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn(e => e.preventDefault());
    render(<form onSubmit={onSubmit}><CiudadBuscador value="" onChange={onChange} /></form>);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'sevi' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('Sevilla');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
