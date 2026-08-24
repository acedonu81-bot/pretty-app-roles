// Las 17 comunidades autónomas, cada una con las ciudades por las que un
// perfil real puede tener zone= (columna profiles.zone, texto libre de
// ciudad, no de comunidad). El filtro por comunidad hace ilike OR contra
// todas las ciudades de la lista — por eso cada comunidad necesita listar
// sus ciudades reales, no basta con el nombre de la comunidad.
export const REGIONS: { label: string; cities: string[] }[] = [
  { label: 'Andalucía', cities: ['Sevilla', 'Málaga', 'Granada', 'Córdoba', 'Cádiz', 'Almería', 'Jaén', 'Huelva'] },
  { label: 'Aragón', cities: ['Zaragoza', 'Huesca', 'Teruel'] },
  { label: 'Asturias', cities: ['Gijón', 'Oviedo', 'Avilés'] },
  { label: 'Islas Baleares', cities: ['Palma de Mallorca', 'Ibiza', 'Menorca'] },
  { label: 'Canarias', cities: ['Tenerife', 'Las Palmas de Gran Canaria'] },
  { label: 'Cantabria', cities: ['Santander'] },
  { label: 'Castilla-La Mancha', cities: ['Toledo', 'Albacete', 'Ciudad Real', 'Guadalajara', 'Cuenca'] },
  { label: 'Castilla y León', cities: ['Valladolid', 'Salamanca', 'Burgos', 'León'] },
  { label: 'Cataluña', cities: ['Barcelona', 'Girona', 'Tarragona', 'Lleida'] },
  { label: 'Extremadura', cities: ['Badajoz', 'Cáceres'] },
  { label: 'Galicia', cities: ['A Coruña', 'Vigo', 'Santiago de Compostela'] },
  { label: 'Madrid', cities: ['Madrid'] },
  { label: 'Murcia', cities: ['Murcia'] },
  { label: 'Navarra', cities: ['Pamplona'] },
  { label: 'País Vasco', cities: ['Bilbao', 'San Sebastián', 'Vitoria'] },
  { label: 'La Rioja', cities: ['Logroño'] },
  { label: 'Comunidad Valenciana', cities: ['Valencia', 'Alicante', 'Castellón'] },
];

export const ALL_REGIONS_LABEL = 'Todas';

const PRESET_REGION_KEY = 'xpeak_preset_region';

export function getPresetRegion(): string {
  try { return localStorage.getItem(PRESET_REGION_KEY) || ALL_REGIONS_LABEL; } catch { return ALL_REGIONS_LABEL; }
}

export function setPresetRegion(region: string) {
  try { localStorage.setItem(PRESET_REGION_KEY, region); } catch { /* noop */ }
}

export function citiesForRegion(region: string): string[] {
  return REGIONS.find(r => r.label === region)?.cities ?? [];
}
