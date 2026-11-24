// Nivel base: una oferta Flash al mes (24 nov 2026, decisión de Daniel). El tope lo
// pone la BD (trigger limitar_ofertas_mes_nivel_base); aquí solo se decide qué texto
// ver. limite null = sin tope (Profesional, Premium, fundadores).

export type OfertasMes = { limite: number | null; usadas: number };

export function ofertasMesDesdeBD(fila: { limite: number | null; usadas: number | null } | null | undefined): OfertasMes | null {
  if (!fila) return null;
  return { limite: fila.limite ?? null, usadas: fila.usadas ?? 0 };
}

export const sinOfertasEsteMes = (o: OfertasMes | null): boolean =>
  !!o && o.limite !== null && o.usadas >= o.limite;

// null = no hay nada que avisar (sin tope o sin datos).
export function avisoOfertasMes(o: OfertasMes | null): string | null {
  if (!o || o.limite === null) return null;
  if (sinOfertasEsteMes(o)) return 'Ya has usado tu oferta de este mes. Con Profesional te apuntas a todas las que quieras.';
  return 'En el nivel base puedes apuntarte a 1 oferta al mes. Con Profesional, a todas las que quieras.';
}
