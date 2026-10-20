/** Minúsculas y sin tildes: "Flamenco Fusión" y "flamenco fusion" son lo mismo al buscar. */
export const normalizaTexto = (t: string): string =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/**
 * ¿Encajan TODAS las palabras de la búsqueda en alguno de los campos?
 * Sin importar el orden ni la tilde: "house flamenco" encuentra a un DJ con el
 * estilo "Flamenco House", y "techno flamenco madrid" lo encuentra aunque el
 * estilo esté en un campo y la ciudad en otro. Antes se buscaba la frase
 * entera dentro de un solo campo y los estilos (genres) ni se miraban (20 oct 2026).
 */
export function coincideBusqueda(
  campos: Array<string | string[] | null | undefined>,
  consulta: string,
): boolean {
  const palabras = normalizaTexto(consulta).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return true;
  const pajar = normalizaTexto(
    campos.flatMap(c => (Array.isArray(c) ? c : [c])).filter((c): c is string => typeof c === 'string').join(' \n '),
  );
  return palabras.every(p => pajar.includes(p));
}
