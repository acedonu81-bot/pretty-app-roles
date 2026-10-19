import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NightlifeSelect from '../NightlifeSelect';

const opciones = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Madrid', label: 'Madrid' },
  { value: 'Andalucía', label: 'Andalucía' },
];

const montar = (onChange = vi.fn()) => {
  // Contenedor que recorta, como la barra de filtros del directorio (overflow-x-auto).
  const r = render(
    <div data-testid="recorta" style={{ overflow: 'hidden' }}>
      <NightlifeSelect value="Todas" onChange={onChange} options={opciones} />
    </div>,
  );
  return { ...r, onChange };
};

describe('NightlifeSelect', () => {
  it('el menú se pinta fuera del contenedor que recorta (document.body), no dentro', () => {
    montar();
    fireEvent.click(screen.getByRole('button', { name: /Todas/ }));
    const opcion = screen.getByRole('option', { name: 'Madrid' });
    expect(screen.getByTestId('recorta').contains(opcion)).toBe(false);
    expect(document.body.contains(opcion)).toBe(true);
  });

  it('elegir una opción llama a onChange y cierra el menú', () => {
    const { onChange } = montar();
    fireEvent.click(screen.getByRole('button', { name: /Todas/ }));
    fireEvent.click(screen.getByRole('option', { name: 'Madrid' }));
    expect(onChange).toHaveBeenCalledWith('Madrid');
    expect(screen.queryByRole('option', { name: 'Madrid' })).toBeNull();
  });

  it('se cierra con Escape y al pulsar fuera, pero no al pulsar dentro del menú', () => {
    montar();
    const abrir = () => fireEvent.click(screen.getByRole('button', { name: /Todas/ }));
    abrir();
    fireEvent.mouseDown(screen.getByRole('listbox'));
    expect(screen.queryByRole('listbox')).not.toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    abrir();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
