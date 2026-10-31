import { describe, it, expect } from 'vitest';
import { alternarEstilo, VARIADA, ESTILOS_MUSICA } from './musicaSolicitud';

describe('alternarEstilo', () => {
  it('añade, quita y limita a 3', () => {
    let e: string[] = [];
    e = alternarEstilo(e, ESTILOS_MUSICA[0]);
    e = alternarEstilo(e, ESTILOS_MUSICA[1]);
    e = alternarEstilo(e, ESTILOS_MUSICA[2]);
    e = alternarEstilo(e, ESTILOS_MUSICA[3]);
    expect(e).toHaveLength(3);
    expect(alternarEstilo(e, ESTILOS_MUSICA[0])).toHaveLength(2);
  });
  it('"variada" va sola y elegir otro estilo la quita', () => {
    expect(alternarEstilo([ESTILOS_MUSICA[0]], VARIADA)).toEqual([VARIADA]);
    expect(alternarEstilo([VARIADA], ESTILOS_MUSICA[1])).toEqual([ESTILOS_MUSICA[1]]);
  });
});
