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

/**
 * Lista de ciudades para selectores y validacion de parametros de URL.
 *
 * Vivia duplicada a mano en Landing, DirectorioPublico (solo 7 ciudades),
 * MapaView, OnboardingWizard y brand.ts, y cada copia se quedaba corta por su
 * lado: el 2 sep 2026 una profesional de Benidorm no era ni seleccionable en
 * el directorio publico. Se centraliza aqui para que ampliarla llegue a todos
 * los sitios a la vez.
 *
 * No es la fuente de verdad de que existe: eso son los perfiles reales. Quien
 * viva en un pueblo fuera de esta lista lo escribe igualmente y la BD le deriva
 * region y city_ref (ver migraciones 20260902*).
 */
export const ALL_CITIES: string[] = [
  // Grandes capitales y destinos de ocio
  'Madrid','Barcelona','Valencia','Sevilla','Bilbao','Málaga','Ibiza',
  'Palma de Mallorca','Zaragoza','Murcia','Alicante','Granada','Córdoba',
  'San Sebastián','Santander','Valladolid','Santiago de Compostela','Pamplona',
  'Vitoria-Gasteiz','Logroño',
  // Galicia
  'Vigo','A Coruña','Ourense','Lugo','Pontevedra','Ferrol',
  // Asturias y Cantabria
  'Oviedo','Gijón','Avilés',
  // Canarias
  'Tenerife','Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Lanzarote','Fuerteventura','La Palma',
  // Extremadura
  'Badajoz','Cáceres','Mérida','Plasencia','Don Benito',
  // Castilla y León
  'Salamanca','Burgos','León','Segovia','Ávila','Zamora','Palencia','Soria','Ponferrada',
  // Castilla-La Mancha
  'Toledo','Ciudad Real','Albacete','Cuenca','Guadalajara','Talavera de la Reina','Puertollano',
  // Andalucía (resto)
  'Huelva','Jaén','Almería','Cádiz','Jerez de la Frontera','Marbella','Algeciras',
  'Fuengirola','Torremolinos','Benalmádena','Ronda','Linares','Úbeda','Baeza','El Puerto de Santa María',
  // Aragón (resto)
  'Huesca','Teruel',
  // Cataluña (resto)
  'Tarragona','Lleida','Girona','Badalona','Hospitalet de Llobregat','Sabadell','Terrassa','Mataró','Reus','Sitges',
  // C. Valenciana (resto)
  'Castellón de la Plana','Elche','Torrevieja','Benidorm','Gandia','Dénia',
  // Murcia (resto)
  'Cartagena','Lorca',
  // Baleares
  'Menorca','Formentera',
  // Madrid área
  'Alcalá de Henares','Alcobendas','Getafe','Leganés','Móstoles','Torrejón de Ardoz',
  // Ciudades autónomas
  'Ceuta','Melilla',
];
