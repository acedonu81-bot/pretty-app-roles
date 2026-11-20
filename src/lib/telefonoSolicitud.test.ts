import { describe, expect, it } from 'vitest';
import { normalizarTelefono } from './telefonoSolicitud';

describe('normalizarTelefono', () => {
  it('acepta móviles y fijos españoles con formatos habituales', () => {
    expect(normalizarTelefono('600 000 000')).toBe('+34600000000');
    expect(normalizarTelefono('+34 612-345-678')).toBe('+34612345678');
    expect(normalizarTelefono('0034 91 234 56 78')).toBe('+34912345678');
  });
  it('acepta un internacional con prefijo', () => {
    expect(normalizarTelefono('+44 7700 900123')).toBe('+447700900123');
  });
  it('rechaza lo que no es un teléfono', () => {
    expect(normalizarTelefono('')).toBeNull();
    expect(normalizarTelefono('123')).toBeNull();
    expect(normalizarTelefono('500000000')).toBeNull();
    expect(normalizarTelefono('abc123456789')).toBeNull();
    expect(normalizarTelefono('600000000000')).toBeNull();
  });
});
