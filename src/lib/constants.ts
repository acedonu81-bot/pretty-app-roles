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
  media:         'Media / Fotografía',
};

/** Zona por defecto cuando el usuario no ha configurado su ciudad */
export const DEFAULT_ZONE = 'Madrid Centro';
