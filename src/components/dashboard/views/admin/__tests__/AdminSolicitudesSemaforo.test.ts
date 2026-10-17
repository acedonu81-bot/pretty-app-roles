import { describe, it, expect } from 'vitest';
import { clasificar } from '../AdminSolicitudesSemaforo';

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
