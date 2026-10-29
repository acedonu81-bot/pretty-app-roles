// Slug de página /contratar-<slug> → roles de profiles que aparecen en ella.
// Lo usan las páginas de ciudad (CityLanding) y las de oficio (CategoryLanding).
export const ROLE_MAP: Record<string, string[]> = {
  dj: ['dj'], camareros: ['camarero', 'staff'], fotografo: ['media'], staff: ['staff', 'promotor'],
  catering: ['catering'], maquillaje: ['makeup'], peluqueria: ['peluqueria'], promotores: ['promotor'],
  'disco-movil': ['disco-movil', 'dj'], vestuario: ['vestuario', 'staff'], azafata: ['azafata'],
  // Categorías que antes caían al fallback ['dj'] y por eso nunca encontraban
  // a nadie, pese a existir esos roles en la BD (bailarin, grupo-musical…).
  bailarin: ['bailarin'], 'grupo-musical': ['grupo-musical'],
  humorista: ['humorista'], monologo: ['humorista'], monologos: ['humorista'],
  mago: ['mago'], animador: ['animador'], animadores: ['animador'],
  payaso: ['payaso'], payasos: ['payaso'], speaker: ['speaker'],
  'photo-booth': ['photo-booth'], 'food-truck': ['food-truck'],
  'tecnico-sonido': ['tecnico'], 'alquiler-equipos': ['alquiler'], limpieza: ['limpieza'],
  'locales-eventos': ['local_eventos'],
};
