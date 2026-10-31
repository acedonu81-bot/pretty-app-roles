import { describe, it, expect } from 'vitest';
import { clasificar, quienHabla } from '../AdminSolicitudesSemaforo';

// 17 oct 2026: Magic Dreams / Mar~Iña cerraron el trato en el chat (400 €) y el
// semáforo lo enseñó primero en amarillo ("no hablan") y luego en verde
// "Hablando, todo bien". El estado lo calcula la base de datos mirando el trato;
// estas pruebas fijan cómo se traduce a color para que no vuelva a pasar.
describe('semáforo de solicitudes', () => {
  it('un trato cerrado es verde, no parpadea y no dice que hablen', () => {
    const s = clasificar('cerrado');
    expect(s.color).toBe('#16a34a');
    expect(s.parpadea).toBe(false);
    expect(s.etiqueta).toBe('Trato cerrado');
    expect(s.etiqueta.toLowerCase()).not.toContain('hablando');
  });

  it('hablar sin haber cerrado el trato NO es verde', () => {
    const s = clasificar('hablando');
    expect(s.color).not.toBe('#16a34a');
    expect(s.etiqueta).toContain('falta cerrar');
  });

  it('rojo y amarillo sin hablar parpadean; lo resuelto no', () => {
    expect(clasificar('sin_respuesta').parpadea).toBe(true);
    expect(clasificar('aceptada_sin_hablar').parpadea).toBe(true);
    expect(clasificar('hablando').parpadea).toBe(false);
    expect(clasificar('cerrado').parpadea).toBe(false);
    expect(clasificar('no').parpadea).toBe(false);
  });

  it('lo que pide acción sale antes que lo resuelto', () => {
    const orden = (['sin_respuesta', 'aceptada_sin_hablar', 'hablando', 'cerrado', 'no'] as const).map(e => clasificar(e).orden);
    expect(orden).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('quienHabla (hablando: quién ha escrito)', () => {
  it('los dos: hablando los dos, casi cerrado, sin parpadeo', () => {
    const s = quienHabla(2, 3, 'Cristina', 'Dj GuimoX')!;
    expect(s.etiqueta).toBe('Hablando los dos, casi cerrado');
    expect(s.parpadea).toBe(false);
  });
  it('solo el profesional: avisa de que el cliente no contesta y parpadea', () => {
    const s = quienHabla(0, 2, 'Cristina', 'Dj GuimoX')!;
    expect(s.etiqueta).toBe('Solo escribe Dj GuimoX');
    expect(s.accion).toContain('Cristina aún no ha contestado');
    expect(s.parpadea).toBe(true);
  });
  it('solo el cliente: avisa de que el profesional no contesta', () => {
    const s = quienHabla(1, 0, 'Cristina', 'Dj GuimoX')!;
    expect(s.etiqueta).toBe('Solo escribe Cristina');
    expect(s.accion).toContain('Dj GuimoX aún no ha contestado');
  });
  it('sin datos devuelve null y el semáforo queda como antes', () => {
    expect(quienHabla(undefined, undefined, 'a', 'b')).toBeNull();
  });
});
