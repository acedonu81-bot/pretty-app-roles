// Estilos que elige la clienta al pedir un DJ (31 oct 2026) y con qué géneros del
// perfil del DJ encajan. La lista de etiquetas se repite en
// src/lib/musicaSolicitud.ts (el navegador no puede importar de aquí).
export const VARIADA = 'Variada, que elija el DJ';

const ESTILOS: Record<string, string[]> = {
  'Comercial y éxitos actuales': ['comercial', 'hits', 'hit del momento', 'top 40', 'pop'],
  'Reggaetón y urbano': ['reggaet', 'dembow', 'urban', 'trap', 'hip hop', 'dancehall'],
  'Remember, disco y pachanga': ['remember', 'disco', 'pachanga'],
  'Latino (salsa, bachata, merengue)': ['salsa', 'bachata', 'merengue', 'latin'],
  'House y tech house': ['house'],
  'Techno, trance y electrónica': ['techno', 'trance', 'edm', 'electro', 'hardstyle', 'hardcore'],
  [VARIADA]: [],
};

export const ESTILOS_VALIDOS = Object.keys(ESTILOS);

/** Normaliza lo que llega del navegador a estilos conocidos (máx. 3). */
export const leerEstilos = (crudo: unknown): string[] =>
  [...new Set(String(crudo ?? '').split('|').map(s => s.trim()).filter(s => s in ESTILOS))].slice(0, 3);

/** ¿Encaja un DJ con los estilos pedidos? "Variada" encaja con todos. */
export function encajaConEstilos(generos: string[] | null | undefined, estilos: string[]): boolean {
  if (estilos.includes(VARIADA)) return true;
  const g = (generos ?? []).map(x => x.toLowerCase());
  return estilos.some(e => ESTILOS[e].some(k => g.some(x => x.includes(k))));
}
