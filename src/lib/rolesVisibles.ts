/**
 * ¿Aparece este perfil en la página pública de un oficio? (20 oct 2026)
 * Por su rol principal, siempre. Por un rol adicional solo si no ha marcado más de
 * MAX_ROLES_CON_ADICIONALES en total: "Olé hop animaciones" tenía 5 (animador, mago,
 * orador, encargada de eventos y maquillaje) y salía como maquilladora en
 * /contratar-maquillaje/madrid aunque solo pinta caras en fiestas infantiles.
 * Dos oficios sí valen (staff + azafata, DJ + disco móvil): fue el motivo de mirar
 * `roles` además de `role` (caso Aitana, 4 sep 2026).
 */
export const MAX_ROLES_CON_ADICIONALES = 2;

export function apareceEnRol(
  p: { role?: string | null; roles?: string[] | null },
  rolesBuscados: readonly string[],
): boolean {
  if (p.role && rolesBuscados.includes(p.role)) return true;
  const roles = p.roles ?? [];
  if (roles.length > MAX_ROLES_CON_ADICIONALES) return false;
  return roles.some(r => rolesBuscados.includes(r));
}
