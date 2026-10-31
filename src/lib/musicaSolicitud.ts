// Espejo de supabase/functions/_shared/musicaSolicitud.ts (etiquetas que elige la
// clienta al pedir un DJ). Si se cambia una, cambiar la otra.
export const VARIADA = 'Variada, que elija el DJ';
export const ESTILOS_MUSICA = [
  'Comercial y éxitos actuales',
  'Reggaetón y urbano',
  'Remember, disco y pachanga',
  'Latino (salsa, bachata, merengue)',
  'House y tech house',
  'Techno, trance y electrónica',
  VARIADA,
] as const;

/** Estilos que piden música: el DJ (31 oct 2026). */
export const PIDE_MUSICA = (service: string) => service === 'DJ';

/** Quita lo que no se puede combinar: "variada" sola, y máximo 3. */
export const alternarEstilo = (elegidos: string[], estilo: string): string[] => {
  if (elegidos.includes(estilo)) return elegidos.filter(e => e !== estilo);
  if (estilo === VARIADA) return [VARIADA];
  return [...elegidos.filter(e => e !== VARIADA), estilo].slice(0, 3);
};
