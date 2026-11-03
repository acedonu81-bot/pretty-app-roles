/** Movember (hora de Madrid): del 2 al 17 nov. Se apaga el 18 nov para dejar paso
 *  al 25N (violencia de género) y NO vuelve: después viene Navidad (decisión del
 *  usuario, 3 nov 2026). Desde que cierra Halloween. Nivel
 *  MEDIA del calendario de campañas (poca presencia en España), así que solo un
 *  bigote en el logo y una frase que explique qué es. Única fuente de fechas. */
export const ABRE_MOVEMBER = new Date('2026-11-02T00:00:00+01:00');
export const CIERRA_MOVEMBER = new Date('2026-11-18T00:00:00+01:00');

export function movemberActivo(ahora: Date = new Date()): boolean {
  return ahora >= ABRE_MOVEMBER && ahora < CIERRA_MOVEMBER;
}
