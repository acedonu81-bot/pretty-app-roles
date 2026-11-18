// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { accesoEstadisticas, csvEstadisticas, inicioMesMadrid, ETIQUETA_FUENTE } from './estadisticasPlan';

describe('accesoEstadisticas', () => {
  it('Esencial no ve estadísticas', () => {
    expect(accesoEstadisticas('free')).toEqual({ basicas: false, avanzadas: false });
  });
  it('Profesional y fundadores ven las básicas', () => {
    expect(accesoEstadisticas('starter')).toEqual({ basicas: true, avanzadas: false });
  });
  it('Premium y antes del lanzamiento lo ven todo', () => {
    expect(accesoEstadisticas('business')).toEqual({ basicas: true, avanzadas: true });
    expect(accesoEstadisticas('pre')).toEqual({ basicas: true, avanzadas: true });
  });
  it('mientras carga no enseña lo avanzado', () => {
    expect(accesoEstadisticas(null)).toEqual({ basicas: true, avanzadas: false });
  });
});

describe('csvEstadisticas', () => {
  const base = {
    generado: '18/11/2026', anio: 2026,
    visitasDia: [{ dia: '2026-11-17', visitas: 3 }, { dia: '2026-11-18', visitas: 0 }],
    origen: [{ fuente: 'buscador', visitas: 5 }, { fuente: 'raro', visitas: 1 }],
    mensajesMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0], conversacionesMes: Array(12).fill(1),
    totales: { visitas: 10, mensajes: 6, solicitudes: 1, conversaciones: 12 },
  };

  it('usa ; y etiquetas legibles', () => {
    const csv = csvEstadisticas(base);
    expect(csv).toContain('Visitas al perfil;10');
    expect(csv).toContain('2026-11-17;3');
    expect(csv).toContain(`${ETIQUETA_FUENTE.buscador};5`);
    expect(csv).toContain('raro;1');
    expect(csv).toContain('Noviembre;4;1');
  });

  it('un texto que empieza por = no se ejecuta como fórmula en Excel', () => {
    const csv = csvEstadisticas({ ...base, origen: [{ fuente: '=HYPERLINK("http://x")', visitas: 1 }] });
    expect(csv).not.toMatch(/(^|;)=HYPERLINK/m);
    expect(csv).toContain("'=HYPERLINK");
  });
});

describe('inicioMesMadrid', () => {
  it('en invierno (UTC+1) el mes empieza a las 23:00 UTC del día anterior', () => {
    expect(inicioMesMadrid(new Date('2026-11-18T10:00:00Z'))).toBe('2026-10-31T23:00:00.000Z');
    expect(inicioMesMadrid(new Date('2026-01-31T23:30:00Z'))).toBe('2026-01-31T23:00:00.000Z'); // ya es 1 feb en Madrid
  });
  it('en verano (UTC+2) a las 22:00 UTC', () => {
    expect(inicioMesMadrid(new Date('2026-07-15T10:00:00Z'))).toBe('2026-06-30T22:00:00.000Z');
  });
  it('el mes que cambia de hora usa el desfase del día 1', () => {
    expect(inicioMesMadrid(new Date('2026-10-28T10:00:00Z'))).toBe('2026-09-30T22:00:00.000Z'); // octubre empieza en horario de verano
    expect(inicioMesMadrid(new Date('2026-03-30T10:00:00Z'))).toBe('2026-02-28T23:00:00.000Z'); // marzo empieza en horario de invierno
  });
});
