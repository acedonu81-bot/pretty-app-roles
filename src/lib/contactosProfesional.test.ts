import { describe, it, expect } from 'vitest';
import { resumenContactos, type FilaContactos } from './contactosProfesional';

const fila = (contactos: number | string): FilaContactos => ({ user_id: 'u', nombre: 'x', rol: 'dj', plan: null, conversaciones: 0, solicitudes: 0, contactos, ultimo: null });

describe('resumenContactos', () => {
  it('cuenta profesionales con 1 o más y 2 o más, y la media', () => {
    const r = resumenContactos([fila(0), fila(0), fila(1), fila(2), fila(4)]);
    expect(r).toMatchObject({ total: 5, con1: 3, con2: 2, pct1: 60, pct2: 40 });
    expect(r.media).toBeCloseTo(1.4);
  });
  it('acepta cifras como texto (bigint de Postgres)', () => {
    expect(resumenContactos([fila('3'), fila('0')]).con2).toBe(1);
  });
  it('sin profesionales no divide por cero', () => {
    expect(resumenContactos([])).toMatchObject({ total: 0, con1: 0, pct1: 0, media: 0 });
  });
});
