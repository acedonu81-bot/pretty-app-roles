import { describe, it, expect } from 'vitest';
import { textoBasura, fechaValida, hoyMadrid, faltanDatos, mensajeFaltan, contactoValido, elegirProfesionales, MAX_PROFESIONALES_POR_SOLICITUD, detalleSolicitud, horarioValido } from './solicitudCompleta';

const manana = (() => { const d = new Date(`${hoyMadrid()}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); })();
const ayer = (() => { const d = new Date(`${hoyMadrid()}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })();

describe('textoBasura', () => {
  it('caza lo que ha colado en producción', () => {
    for (const t of ['r', 'hjajajjaja', 'jajaja', 'asdf', 'aaaa', 'Prueba', 'test', 'xxxx', 'bcdfg']) expect(textoBasura(t)).toBe(true);
  });
  it('deja pasar nombres y lugares reales', () => {
    for (const t of ['Alejandro', 'Ana Gómez', 'Villablanca', 'Madrid', 'Seseña', 'Pinto', 'Bar Los Sauces', 'Calzada de Valdunciel']) expect(textoBasura(t)).toBe(false);
  });
});

describe('fechaValida', () => {
  it('acepta hoy y el futuro', () => { expect(fechaValida(hoyMadrid())).toBe(true); expect(fechaValida(manana)).toBe(true); });
  it('rechaza pasado, vacío, "Por confirmar" y fechas imposibles', () => {
    for (const f of [ayer, '', 'Por confirmar', '2026-02-30', '23/10/2026']) expect(fechaValida(f)).toBe(false);
  });
});

describe('faltanDatos', () => {
  it('solicitud completa: no falta nada', () => {
    expect(faltanDatos({ name: 'Alejandro', contact: 'a@b.es', date: manana, location: 'Villablanca', eventType: 'Boda' }, { pideTipo: true })).toEqual([]);
  });
  it('lista todo lo que falta', () => {
    const f = faltanDatos({ name: 'r', contact: 'x', date: 'Por confirmar', location: '' });
    expect(f).toEqual(['tu nombre', 'un email o teléfono válido', 'la fecha del evento', 'la ciudad o el lugar']);
    expect(mensajeFaltan(f)).toBe('Falta tu nombre, un email o teléfono válido, la fecha del evento y la ciudad o el lugar.');
  });
  it('contacto: email o teléfono de 9+ dígitos', () => {
    expect(contactoValido('600 123 456')).toBe(true);
    expect(contactoValido('+34 600123456')).toBe(true);
    expect(contactoValido('12345')).toBe(false);
  });
  it('pide el tipo de evento solo si se indica', () => {
    expect(faltanDatos({ name: 'Ana', contact: 'a@b.es', date: manana, location: 'Madrid' })).toEqual([]);
    expect(faltanDatos({ name: 'Ana', contact: 'a@b.es', date: manana, location: 'Madrid' }, { pideTipo: true })).toEqual(['el tipo de evento']);
  });
});

describe('personas, horario y tope de profesionales', () => {
  const base = { name: 'Ana', contact: 'a@b.es', date: manana, location: 'Madrid' };
  it('pide personas y horario cuando se indica', () => {
    expect(faltanDatos(base, { pideDetalle: true })).toEqual(['el número aproximado de personas', 'el horario']);
    expect(faltanDatos({ ...base, personas: '30 a 80', horario: 'De 22:00 a 03:00' }, { pideDetalle: true })).toEqual([]);
    expect(faltanDatos({ ...base, personas: '30 a 80', horario: 'tarde' }, { pideDetalle: true })).toEqual(['el horario']);
  });
  it('horario necesita alguna cifra', () => {
    expect(horarioValido('De 22:00 a 03:00')).toBe(true);
    expect(horarioValido('noche')).toBe(false);
  });
  it('el bloque de detalle lleva ambos datos y no deja corchetes sueltos', () => {
    expect(detalleSolicitud('30 a 80', 'De 22:00 a 03:00')).toBe('[Personas: 30 a 80] [Horario: De 22:00 a 03:00]');
    expect(detalleSolicitud('x', '[22:00]')).toBe('[Personas: x] [Horario: 22:00]');
  });
  it('como mucho 5 profesionales, sin repetir', () => {
    const r = elegirProfesionales(Array.from({ length: 40 }, (_, i) => i));
    expect(r).toHaveLength(MAX_PROFESIONALES_POR_SOLICITUD);
    expect(new Set(r).size).toBe(5);
    expect(elegirProfesionales([1, 2])).toHaveLength(2);
  });
});
