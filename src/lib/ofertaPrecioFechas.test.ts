import { describe, it, expect } from 'vitest';
import { fechasDeOferta, fechasOcupadasEnOferta, parsePrecio } from './ofertaPrecioFechas';

describe('fechasDeOferta', () => {
  it('usa event_dates si tiene elementos', () => {
    expect(fechasDeOferta({ event_dates: ['2030-01-10', '2030-01-11'], event_date: '2030-01-10' }))
      .toEqual(['2030-01-10', '2030-01-11']);
  });
  it('cae a event_date si event_dates está vacío o es nulo', () => {
    expect(fechasDeOferta({ event_dates: [], event_date: '2030-01-10' })).toEqual(['2030-01-10']);
    expect(fechasDeOferta({ event_dates: null, event_date: '2030-01-10' })).toEqual(['2030-01-10']);
  });
  it('devuelve [] sin ninguna fecha', () => {
    expect(fechasDeOferta({ event_dates: null, event_date: null })).toEqual([]);
  });
});

describe('fechasOcupadasEnOferta', () => {
  it('devuelve solo las fechas de la oferta que están ocupadas', () => {
    expect(fechasOcupadasEnOferta(['2030-01-10', '2030-01-11'], ['2030-01-11', '2030-02-01']))
      .toEqual(['2030-01-11']);
  });
  it('acepta un Set y devuelve ordenado', () => {
    expect(fechasOcupadasEnOferta(['2030-01-12', '2030-01-10'], new Set(['2030-01-12', '2030-01-10'])))
      .toEqual(['2030-01-10', '2030-01-12']);
  });
  it('devuelve [] si no hay choque', () => {
    expect(fechasOcupadasEnOferta(['2030-01-10'], ['2030-02-01'])).toEqual([]);
  });
});

describe('parsePrecio', () => {
  it('acepta enteros, coma y punto decimal', () => {
    expect(parsePrecio('150')).toBe(150);
    expect(parsePrecio('150,5')).toBe(150.5);
    expect(parsePrecio('150.50')).toBe(150.5);
    expect(parsePrecio(' 99,999 ')).toBe(100);
  });
  it('devuelve null si vacío, no numérico, <= 0 o > 100000', () => {
    for (const malo of ['', '  ', '0', '-3', 'abc', '100001', '12abc']) {
      expect(parsePrecio(malo)).toBeNull();
    }
    expect(parsePrecio('100000')).toBe(100000);
  });
});
