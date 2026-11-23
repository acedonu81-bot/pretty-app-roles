/** Fechas de una oferta Flash, ocupadas del profesional y precio al apuntarse. */

export const PRECIO_MAX = 100000;

/** event_dates si tiene elementos; si no, event_date; si no, []. */
export function fechasDeOferta(req: { event_dates: string[] | null; event_date: string | null }): string[] {
  if (req.event_dates && req.event_dates.length > 0) return req.event_dates;
  return req.event_date ? [req.event_date] : [];
}

/** Fechas de la oferta que el profesional tiene marcadas como ocupadas, ordenadas. */
export function fechasOcupadasEnOferta(fechasOferta: string[], ocupadas: Iterable<string>): string[] {
  const set = new Set(ocupadas);
  return fechasOferta.filter(f => set.has(f)).sort();
}

/**
 * Precio escrito por el profesional. Acepta "150", "150,5" y "150.50".
 * null si está vacío, no es un número, es <= 0 o supera PRECIO_MAX.
 */
export function parsePrecio(entrada: string): number | null {
  const limpio = entrada.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(limpio)) return null;
  const n = Math.round(Number(limpio) * 100) / 100;
  if (!(n > 0) || n > PRECIO_MAX) return null;
  return n;
}
