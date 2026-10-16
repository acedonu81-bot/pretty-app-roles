import { describe, it, expect } from 'vitest';
import { leerAcuerdo, mensajePropuesta, mensajeAceptado, vistaPrevia } from './acuerdoChat';
import { sanitizeInput } from './contentFilter';

describe('acuerdoChat', () => {
  it('ida y vuelta de una propuesta', () => {
    const m = mensajePropuesta('XPEAK-AB12CD', ['Boda Ana', '12/12/2026', '500 €']);
    expect(leerAcuerdo(m)).toEqual({ estado: 'propuesto', ref: 'XPEAK-AB12CD', resumen: 'Boda Ana · 12/12/2026 · 500 €' });
    expect(sanitizeInput(m).clean).toBe(true);
  });
  it('aceptado', () => {
    expect(leerAcuerdo(mensajeAceptado('XPEAK-AB12CD'))?.estado).toBe('aceptado');
    expect(vistaPrevia(mensajeAceptado('XPEAK-AB12CD'))).toBe('Contrato XPEAK-AB12CD aceptado');
  });
  it('un texto normal no es un acuerdo', () => {
    expect(leerAcuerdo('hola, ¿cerramos?')).toBeNull();
    expect(vistaPrevia('hola')).toBe('hola');
  });
  it('quita los caracteres que romperían el formato', () => {
    expect(leerAcuerdo(mensajePropuesta('XPEAK-X1', ['Fiesta [VIP] | sala']))?.resumen).toBe('Fiesta  VIP    sala');
  });
});
