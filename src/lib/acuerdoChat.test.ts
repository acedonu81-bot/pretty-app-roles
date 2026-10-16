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

import { estadoAcepto, mensajeAcepto } from './acuerdoChat';
describe('Acepto en el chat', () => {
  const m = (id: string, sender_id: string, content: string) => ({ id, sender_id, content });
  it('cierra cuando aceptan los dos y abre otro después', () => {
    const r = estadoAcepto([m('1', 'a', mensajeAcepto()), m('2', 'b', 'vale'), m('3', 'b', mensajeAcepto()), m('4', 'a', mensajeAcepto())]);
    expect([...r.cierres]).toEqual(['3']);
    expect([...r.pendientes]).toEqual(['a']);
  });
  it('aceptar dos veces la misma persona no cierra', () => {
    const r = estadoAcepto([m('1', 'a', mensajeAcepto()), m('2', 'a', mensajeAcepto())]);
    expect(r.cierres.size).toBe(0);
  });
  it('vista previa', () => { expect(vistaPrevia(mensajeAcepto())).toBe('Acepto el acuerdo'); });
});
