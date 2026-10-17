import { describe, it, expect } from 'vitest';
import { esCuentaNueva, mayorRacha, resumir, type Voto } from '../AdminConcursoVotantes';

const voto = (dj: string, hora: string, minutos: number): Voto => ({
  dj, votante: 'X', rol: 'pending', cuenta_creada: hora, voto: hora,
  minutos_hasta_voto: minutos, via: 'google', consentimiento_marketing: false, con_foto: false,
});

describe('quién vota en el concurso', () => {
  it('una cuenta es nueva si vota dentro de la hora siguiente a crearla', () => {
    expect(esCuentaNueva({ minutos_hasta_voto: 0.2 })).toBe(true);
    expect(esCuentaNueva({ minutos_hasta_voto: 60 })).toBe(true);
    expect(esCuentaNueva({ minutos_hasta_voto: 61 })).toBe(false);
    expect(esCuentaNueva({ minutos_hasta_voto: '3000.5' })).toBe(false);
  });

  it('la racha es el máximo de votos en una ventana de 10 minutos', () => {
    expect(mayorRacha([])).toBe(0);
    expect(mayorRacha(['2026-10-17T14:43:00Z', '2026-10-17T14:53:00Z', '2026-10-17T14:54:00Z', '2026-10-17T14:55:00Z'])).toBe(4 - 1);
    expect(mayorRacha(['2026-10-17T12:00:00Z', '2026-10-17T13:00:00Z'])).toBe(1);
  });

  it('el resumen cuenta votos, cuentas nuevas y últimas 3 h por DJ, ordenado por votos', () => {
    const ahora = new Date('2026-10-17T16:00:00Z').getTime();
    const r = resumir([
      voto('Vizard', '2026-10-17T15:50:00Z', 0.2),
      voto('Vizard', '2026-10-17T15:45:00Z', 3),
      voto('Vizard', '2026-10-17T10:00:00Z', 5000),
      voto('Borja', '2026-10-13T19:00:00Z', 9000),
    ], ahora);
    expect(r[0]).toMatchObject({ dj: 'Vizard', votos: 3, nuevas: 2, ultimas3h: 2 });
    expect(r[1]).toMatchObject({ dj: 'Borja', votos: 1, nuevas: 0, ultimas3h: 0 });
  });
});
