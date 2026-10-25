/** Modo Halloween de la portada (hora de Madrid). Única fuente de las fechas:
 *  la decoración del hero, el banner del concurso y el logo se apagan a la
 *  vez. El 1 nov sigue puesto (fiestas de la noche del 31 que acaban tarde). */
export const ABRE_HALLOWEEN = new Date('2026-10-25T00:00:00+02:00');
export const CIERRA_HALLOWEEN = new Date('2026-11-02T00:00:00+01:00');

export function halloweenActivo(ahora: Date = new Date()): boolean {
  return ahora >= ABRE_HALLOWEEN && ahora < CIERRA_HALLOWEEN;
}
