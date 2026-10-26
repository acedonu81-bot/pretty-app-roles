/** Movember (hora de Madrid): todo noviembre, desde que cierra Halloween. Nivel
 *  MEDIA del calendario de campañas (poca presencia en España), así que solo un
 *  bigote en el logo y una frase que explique qué es. Única fuente de fechas. */
export const ABRE_MOVEMBER = new Date('2026-11-02T00:00:00+01:00');
export const CIERRA_MOVEMBER = new Date('2026-12-01T00:00:00+01:00');

export function movemberActivo(ahora: Date = new Date()): boolean {
  return ahora >= ABRE_MOVEMBER && ahora < CIERRA_MOVEMBER;
}
