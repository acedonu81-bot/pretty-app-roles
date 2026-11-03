/** 25N, Día Internacional contra la Violencia de Género (hora de Madrid): del 18
 *  al 25 nov, se apaga solo el 26. Tono serio (morado, mensaje y teléfono 016),
 *  sin vender ni humor. Movember se apaga el 18 y no vuelve. Única fuente de
 *  fechas. GUARDAR para el año que viene: basta con cambiar las fechas. */
export const ABRE_25N = new Date('2026-11-18T00:00:00+01:00');
export const CIERRA_25N = new Date('2026-11-26T00:00:00+01:00');

export function dia25nActivo(ahora: Date = new Date()): boolean {
  return ahora >= ABRE_25N && ahora < CIERRA_25N;
}
