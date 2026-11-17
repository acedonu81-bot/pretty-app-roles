// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { ciudadInicial } from './ciudadAsistente';

const LISTA = ['Madrid', 'Barcelona', 'Sevilla', 'Otra ciudad'];

describe('ciudadInicial', () => {
  it('una ciudad de la lista se elige tal cual', () => {
    expect(ciudadInicial('Madrid', LISTA)).toEqual({ city: 'Madrid', customCity: '' });
  });
  it('ignora mayúsculas y espacios, y devuelve el nombre de la lista', () => {
    expect(ciudadInicial('  sevilla ', LISTA)).toEqual({ city: 'Sevilla', customCity: '' });
  });
  it('una ciudad que no está en la lista va como "Otra ciudad" con su texto', () => {
    expect(ciudadInicial('Pueblo de Prueba', LISTA)).toEqual({ city: 'Otra ciudad', customCity: 'Pueblo de Prueba' });
  });
  it('sin ciudad real (vacío, null o "España") no precarga nada', () => {
    expect(ciudadInicial('', LISTA)).toEqual({ city: '', customCity: '' });
    expect(ciudadInicial(null, LISTA)).toEqual({ city: '', customCity: '' });
    expect(ciudadInicial('España', LISTA)).toEqual({ city: '', customCity: '' });
  });
  it('un zone que dijera "Otra ciudad" no se toma como ciudad', () => {
    expect(ciudadInicial('Otra ciudad', LISTA)).toEqual({ city: '', customCity: '' });
  });
});
