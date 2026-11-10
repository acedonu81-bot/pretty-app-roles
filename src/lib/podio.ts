// Podio de los sets más escuchados en el directorio (10 nov 2026): el DJ con
// un set en el podio sube arriba del listado, por su mejor puesto, y su
// tarjeta lleva la medalla. El resto conserva el orden de compararDirectorio.

export type Puesto = 1 | 2 | 3;

/** Mejor puesto de cada DJ (un DJ puede tener dos sets en el podio). */
export function puestosPorDj(podio: { dj_user_id: string; puesto: Puesto }[]): Map<string, Puesto> {
  const m = new Map<string, Puesto>();
  for (const p of podio) {
    const prev = m.get(p.dj_user_id);
    if (!prev || p.puesto < prev) m.set(p.dj_user_id, p.puesto);
  }
  return m;
}

/** Sube a los del podio (1, 2, 3) sin tocar el orden relativo del resto. */
export function subirPodio<T>(lista: T[], idDe: (x: T) => string | null | undefined, puestos: Map<string, Puesto>): T[] {
  if (!puestos.size) return lista;
  const puesto = (x: T) => { const id = idDe(x); return (id && puestos.get(id)) || 4; };
  return lista
    .map((x, i) => ({ x, i, p: puesto(x) }))
    .sort((a, b) => a.p - b.p || a.i - b.i)
    .map(e => e.x);
}
