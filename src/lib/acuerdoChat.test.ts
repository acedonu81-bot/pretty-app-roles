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

import { codificarCondiciones, leerCondiciones, textoCondiciones, fechaIso } from './acuerdoChat';
describe('condiciones del acuerdo', () => {
  const c = { fecha: '2026-12-12', ciudad: 'Madrid', precio: '500', evento: 'Boda Ana' };
  it('ida y vuelta, con fecha en barras y sin bloquear el filtro', () => {
    const m = mensajeAcepto(c);
    expect(m).toBe('[[acuerdo:aceptado|ACUERDO|f=12/12/2026;c=Madrid;p=500;e=Boda Ana]]');
    expect(leerCondiciones(leerAcuerdo(m)!.resumen)).toEqual({ ...c, fecha: '12/12/2026' });
    expect(textoCondiciones(leerCondiciones(leerAcuerdo(m)!.resumen))).toBe('Boda Ana · 12/12/2026 · Madrid · 500 €');
    expect(sanitizeInput(m).clean).toBe(true);
    expect(fechaIso('3/1/2027')).toBe('2027-01-03');
  });
  it('una contrapropuesta con otras condiciones no cierra', () => {
    const otra = { ...c, precio: '600' };
    const r = estadoAcepto([
      { id: '1', sender_id: 'a', content: mensajeAcepto(c) },
      { id: '2', sender_id: 'b', content: mensajeAcepto(otra) },
    ]);
    expect(r.cierres.size).toBe(0);
    expect([...r.pendientes]).toEqual(['b']);
    expect(r.condiciones).toBe(codificarCondiciones(otra));
  });
  it('aceptar las mismas condiciones cierra', () => {
    const r = estadoAcepto([
      { id: '1', sender_id: 'a', content: mensajeAcepto(c) },
      { id: '2', sender_id: 'b', content: mensajeAcepto(c) },
    ]);
    expect([...r.cierres]).toEqual(['2']);
  });
});

describe('condiciones mal formadas (revisión de seguridad)', () => {
  it('rechaza claves repetidas, desconocidas o metidas dentro de otro campo', () => {
    expect(leerCondiciones('f=12/12/2026;c=Madrid;p=500;c=Barcelona')).toBeNull();
    expect(leerCondiciones('f=12/12/2026;c=Madrid;p=500;x=1')).toBeNull();
    expect(leerCondiciones('f=12/12/2026;c=Madrid;p=500;e=xc=Barcelona')).toBeNull();
    expect(leerCondiciones('f=2026-12-12;c=Madrid;p=500')).toBeNull();
    expect(leerCondiciones('f=12/12/2026;c=Madrid;p=500')).not.toBeNull();
  });
});
