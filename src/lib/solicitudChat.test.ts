import { describe, it, expect } from 'vitest';
import { leerSolicitud, fechaLegible } from './solicitudChat';

describe('leerSolicitud', () => {
  it('lee la solicitud de Patricia (cumpleaños, Alcalá)', () => {
    const s = leerSolicitud({
      event_date: '2026-11-20', event_location: 'Alcalá de Henares',
      event_description: '[Personas: 20] [Horario: de 17 a 22] [Particular] [Cumpleaños] Cliente particular que busca música.',
    });
    expect(s).toEqual({ fecha: '2026-11-20', lugar: 'Alcalá de Henares', personas: '20', horario: 'de 17 a 22', tipo: 'Cumpleaños' });
  });
  it('lee la de Cristina (tipo en el texto, sin etiqueta)', () => {
    const s = leerSolicitud({
      event_date: '2026-12-14', event_location: 'Madrid',
      event_description: '[Personas: 30 a 80] [Horario: De 22:30 a 01:30] Cliente particular que busca dj para un evento de tipo Fiesta privada.',
    });
    expect(s.tipo).toBe('Fiesta privada');
    expect(s.personas).toBe('30 a 80');
  });
  it('fecha o lugar por confirmar quedan vacíos', () => {
    const s = leerSolicitud({ event_date: 'Por confirmar', event_location: 'Por confirmar', event_description: null });
    expect(s).toEqual({ fecha: '', lugar: '', personas: '', horario: '', tipo: '' });
  });
  it('fechaLegible pasa a dd/mm/aaaa', () => {
    expect(fechaLegible('2026-12-14')).toBe('14/12/2026');
  });
});
