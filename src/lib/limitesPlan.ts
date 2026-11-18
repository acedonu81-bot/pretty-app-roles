// Límites de sets y portafolio según el plan (18 nov 2026). Los calcula la BD
// (limites_plan: plan, fundadores y lanzamiento) y aquí se reparte lo visible.
// Lo que pasa del límite NO se borra: se oculta en la ficha y vuelve al subir de plan.

export type Limites = { sets: number; portafolio: number }; // Infinity = ilimitado

export function limitesDesdeBD(fila: { sets: number | null; portafolio: number | null } | null | undefined): Limites | null {
  if (!fila) return null;
  return {
    sets: fila.sets == null ? Infinity : fila.sets,
    portafolio: fila.portafolio == null ? Infinity : fila.portafolio,
  };
}

export function setsVisibles<T>(sets: T[], lim: Limites | null, siNoHayLimite = Infinity): T[] {
  const n = lim ? lim.sets : siNoHayLimite;
  return Number.isFinite(n) ? sets.slice(0, n) : sets;
}

// Fotos y vídeos comparten el límite del portafolio: primero las fotos, luego los vídeos.
export function portafolioVisible(fotos: string[], videos: string[], lim: Limites | null): { fotos: string[]; videos: string[] } {
  if (!lim || !Number.isFinite(lim.portafolio)) return { fotos, videos };
  const f = fotos.slice(0, lim.portafolio);
  const v = videos.slice(0, Math.max(0, lim.portafolio - f.length));
  return { fotos: f, videos: v };
}
