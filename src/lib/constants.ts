/** Zonas geográficas disponibles en la plataforma (España) */
export const ZONES = [
  'Todas',
  'Madrid Centro', 'Malasaña', 'Salamanca', 'Chueca', 'Chamberí', 'Lavapiés', 'La Latina',
  'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Ibiza', 'Palma de Mallorca',
  'Zaragoza', 'Murcia', 'Alicante', 'Granada',
];

/** Traducciones de roles internos al español para mostrar al usuario */
export const ROLE_ES: Record<string, string> = {
  dj:            'DJ / Artista / Música en Vivo',
  staff:         'Camarero',
  azafata:       'Azafata',
  event_manager: 'Encargada de Eventos',
  promotor:      'Promotor & Maestro de Ceremonias',
  camarero:      'Camarero / Barra',
  catering:      'Catering / Cocina',
  makeup:        'Maquillaje / Estilismo',
  peluqueria:    'Peluquería a Domicilio',
  media:         'Media / Fotografía',
};

/**
 * Roles de BD que son el mismo rol de cara al usuario.
 *
 * 'camarero' es legacy (opción retirada de los selectores) y equivale a
 * 'staff'; 'makeup' y 'peluqueria' son roles distintos en BD por SEO/registro
 * pero comparten un único directorio. El mapa estaba duplicado a mano en el
 * directorio, el prerender y el panel de empresario, cada uno con su criterio,
 * así que un perfil podía salir en una vista y desaparecer en otra. Fuente
 * única: expandRole() para consultar, canonicalRole() para agrupar.
 */
export const ROLE_ALIASES: Record<string, string[]> = {
  staff: ['staff', 'camarero'],
  makeup: ['makeup', 'peluqueria'],
};

/** dbRole -> todos los roles de BD que debe traer una consulta de ese rol. */
export const expandRole = (dbRole: string): string[] => ROLE_ALIASES[dbRole] ?? [dbRole];

/** rol de BD de un perfil -> rol canónico bajo el que se agrupa y se muestra. */
export const canonicalRole = (role: string | null | undefined): string | null => {
  if (!role) return null;
  for (const [canon, variants] of Object.entries(ROLE_ALIASES)) {
    if (variants.includes(role)) return canon;
  }
  return role;
};

/** Zona por defecto cuando el usuario no ha configurado su ciudad */
export const DEFAULT_ZONE = 'Madrid Centro';

/** Estilos musicales de DJ — mismo catálogo que el selector de género en ProfileView (rol 'dj') */
export const DJ_GENRES = ['Tech House','Deep House','House','Afro House','Organic House','Funky House','Tribal House','Progressive House','Latin House','Techno','Melodic Techno','Minimal','Hard Techno','Industrial','Dub Techno','Trance','Progressive Trance','Psytrance','Drum & Bass','Dubstep','Jungle','UK Garage','Breakbeat','Reggaetón','Dembow','Moombahton','Dancehall','R&B','Hip Hop','Trap','Afrobeats','Amapiano','Comercial','Top 40','Hits actuales','Remember','Pachanga','Disco','Nu-Disco','Funk','Electro','Synthwave','Ambient','Downtempo','Chillout','Hardstyle','Hardcore','EDM'];
