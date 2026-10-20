import { describe, it, expect } from 'vitest';
import { textoBasura, fechaValida, hoyMadrid, faltanDatos, mensajeFaltan, contactoValido } from './solicitudCompleta';

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
