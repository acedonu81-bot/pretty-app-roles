// Badge "Nuevo en XPEAK" para grupos musicales (16 sep 2026). A diferencia
// de DJs Emergentes (directorio separado, autodeclarado, con ascenso admin),
// aquí no hay categoría aparte: el mercado de bodas es reputacional y un
// directorio aislado de "bandas sin experiencia" tendría poca oferta y
// ninguna demanda real (ver análisis: Bodas.net, Zankyou, Eventzone, La
// Factoría del Show — ninguno separa "nuevos" de "establecidos").
//
// NO es automático solo por fecha de alta: un grupo consolidado con años de
// trayectoria que se da de alta hoy en XPEAK sería técnicamente "nuevo en la
// plataforma" pero llamarlo así (con la connotación de "está empezando en el
// sector") sería engañoso — mismo tipo de error de etiquetado que ya pasó
// con 'rookie'/Sairo (ver migración 20260907140000). Por eso es opt-in: la
// fecha solo decide ELEGIBILIDAD (quién puede activarlo), y el propio grupo
// decide si lo activa, en Ajustes. Deja de ser elegible (y el badge deja de
// mostrarse, aunque siga marcado) pasados 180 días.
const NEW_ON_PLATFORM_DAYS = 180;

export interface NewOnPlatformCheck {
  role?: string | null;
  roles?: string[] | null;
  created_at?: string | null;
  show_new_badge?: boolean | null;
}

export function isEligibleForNewBadge(p: Pick<NewOnPlatformCheck, 'role' | 'roles' | 'created_at'>): boolean {
  const isGrupoMusical = p.role === 'grupo-musical' || (p.roles ?? []).includes('grupo-musical');
  if (!isGrupoMusical || !p.created_at) return false;
  const ageDays = (Date.now() - new Date(p.created_at).getTime()) / (24 * 60 * 60 * 1000);
  return ageDays >= 0 && ageDays < NEW_ON_PLATFORM_DAYS;
}

export function isNewOnPlatform(p: NewOnPlatformCheck): boolean {
  return !!p.show_new_badge && isEligibleForNewBadge(p);
}
