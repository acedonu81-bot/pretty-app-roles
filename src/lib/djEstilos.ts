// Familias de estilo para filtrar DJs (11 nov 2026). Cada DJ escribe sus
// estilos a mano (genres) y hay ~60 grafías distintas ("Hits actuales",
// "Top 40", "BACHATA"...): un selector con todas sería ilegible. Se agrupan
// en familias y un DJ sale en cada familia con la que comparta un estilo.
// La comparación ignora mayúsculas y tildes.

export interface FamiliaEstilo { label: string; estilos: string[] }

export const FAMILIAS_ESTILO: FamiliaEstilo[] = [
  { label: 'Comercial', estilos: ['Comercial', 'Hits actuales', 'Top 40', 'Pop Dance', 'Hit del momento', 'Todo tipo de música', 'Pop Rock'] },
  { label: 'Remember', estilos: ['Remember'] },
  { label: 'House', estilos: ['House', 'Tech House', 'Deep House', 'Afro House', 'Organic House', 'Funky House', 'Tribal House', 'Progressive House', 'Progressive', 'Latin House', 'Flamenco House'] },
  { label: 'Techno', estilos: ['Techno', 'Hard Techno', 'Melodic Techno', 'Techno Flamenco', 'Minimal', 'Industrial', 'Dub Techno'] },
  { label: 'Reggaetón y latino', estilos: ['Reggaetón', 'Dembow', 'Dancehall', 'Moombahton', 'Urban', 'Trap', 'Hip Hop', 'R&B', 'Afrobeats', 'Amapiano', 'Salsa', 'Bachata', 'Merengue'] },
  { label: 'Pachanga y verbenas', estilos: ['Pachanga', 'Fiestas de pueblo', 'Verbenas'] },
  { label: 'Trance', estilos: ['Trance', 'Progressive Trance', 'Psytrance'] },
  { label: 'EDM y electro', estilos: ['EDM', 'Electro', 'Synthwave', 'Breakbeat', 'Drum & Bass', 'Dubstep', 'Jungle', 'UK Garage'] },
  { label: 'Hardstyle y hardcore', estilos: ['Hardstyle', 'Hardcore'] },
  { label: 'Disco y funk', estilos: ['Disco', 'Nu-Disco', 'Funk'] },
  { label: 'Chill e indie', estilos: ['Chillout', 'Ambient', 'Downtempo', 'Indie'] },
];

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function familiaPorLabel(label: string | null | undefined): FamiliaEstilo | undefined {
  if (!label) return undefined;
  const k = norm(label);
  return FAMILIAS_ESTILO.find(f => norm(f.label) === k);
}

/** true si alguno de los estilos del DJ cae en la familia. */
export function encajaEnFamilia(genres: string[] | null | undefined, familia: FamiliaEstilo): boolean {
  if (!genres?.length) return false;
  const claves = new Set(familia.estilos.map(norm));
  return genres.some(g => claves.has(norm(g)));
}

/** Grafías a pedir a la BD (overlaps es exacto): original, MAYÚSCULAS y
 *  minúsculas, con y sin tildes ("Reggaeton" y "Reggaetón"). */
export function grafiasFamilia(familia: FamiliaEstilo): string[] {
  const sinTilde = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return Array.from(new Set(familia.estilos.flatMap(e => [e, sinTilde(e)]).flatMap(e => [e, e.toUpperCase(), e.toLowerCase()])));
}
