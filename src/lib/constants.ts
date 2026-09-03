/** Zonas geográficas disponibles en la plataforma (España) */
export const ZONES = [
  'Todas',
  'Madrid Centro', 'Malasaña', 'Salamanca', 'Chueca', 'Chamberí', 'Lavapiés', 'La Latina',
  'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Ibiza', 'Palma de Mallorca',
  'Zaragoza', 'Murcia', 'Alicante', 'Granada',
];

/** Traducciones de roles internos al español para mostrar al usuario */
// Etiquetas INTERNAS (dashboard y panel admin). No se usan en páginas
// públicas ni en el SEO: ahí se dice "camareros" a propósito, porque es lo que
// la gente escribe en Google ("camareros para boda Madrid") y lo que usan los
// competidores. Dentro se nombra el oficio como se llama en el sector — sala y
// barra — que es lo que reconoce un profesional formado.
export const ROLE_ES: Record<string, string> = {
  dj:            'DJ / Artista / Música en Vivo',
  staff:         'Sala & Barra',
  azafata:       'Azafata',
  event_manager: 'Encargada de Eventos',
  promotor:      'Promotor & Maestro de Ceremonias',
  camarero:      'Sala & Barra',
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

/**
 * Etiquetas (especialidades, estilos, repertorio) que puede elegir cada rol.
 *
 * Vivia dentro de ProfileView, asi que el buscador de organizadores ofrecia
 * DJ_GENRES a todo el mundo: quien buscaba musica en vivo solo veia generos de
 * cabina y no encontraba a una cantante por "acustico" o "voz y guitarra".
 * Se comparte aqui para que el perfil y el buscador usen las mismas.
 */
export const ROLE_TAGS: Record<string, { label: string; tags: string[] }> = {
    dj:        { label: 'Géneros musicales',    tags: DJ_GENRES },
    // Musica en vivo: repertorio y formato, NO los generos de cabina de un DJ.
    // Una cantante que se registro con el rol equivocado acabo etiquetada como
    // "Remember, Comercial, Chillout" porque era lo unico que le encajaba
    // minimamente de la lista de DJ (caso Aurora, 2 sep 2026).
    'grupo-musical': { label: 'Repertorio y formato', tags: ['Pop español','Pop internacional','Rock','Versiones','Acústico','Voz y guitarra','Jazz','Bossa nova','Soul','Funk en vivo','Flamenco','Rumba','Copla','Boleros','Baladas','Música clásica','Góspel','Country','Indie','Cantautor','Ceremonia','Cóctel','Banda completa','Dúo','Trío'] },
    azafata:    { label: 'Especialidades', tags: ['Azafata de congresos','Azafata de imagen','Ferias y stands','Protocolo','Acreditaciones','Recepción','Bienvenida','Sala VIP','Promoción','Azafata de eventos deportivos','Traducción / idiomas','Reparto de merchandising'] },
    catering:   { label: 'Especialidades', tags: ['Catering de bodas','Cóctel','Banquete','Show cooking','Finger food','Barbacoa / brasa','Paellas','Cocina mediterránea','Cocina internacional','Menú vegano','Sin gluten','Food truck','Servicio de barra','Postres y repostería'] },
    humorista:  { label: 'Estilos', tags: ['Monólogo','Stand-up','Humor blanco','Humor negro','Improvisación','Humor musical','Parodia','Presentación de eventos','Humor corporativo','Bodas','Despedidas','Clubs de comedia'] },
    mago:       { label: 'Especialidades', tags: ['Magia de cerca','Magia de escenario','Mentalismo','Magia infantil','Magia cómica','Ilusionismo','Cartomagia','Magia de bodas','Walking magic','Grandes ilusiones'] },
    animador:   { label: 'Especialidades', tags: ['Animación infantil','Fiestas de cumpleaños','Hinchables','Pintacaras','Globoflexia','Talleres','Juegos','Espectáculo infantil','Bodas','Comuniones','Parques','Hoteles'] },
    payaso:     { label: 'Especialidades', tags: ['Payaso clásico','Clown','Circo','Malabares','Zancos','Espectáculo infantil','Cumpleaños','Comuniones','Ferias','Teatro de calle'] },
    speaker:    { label: 'Especialidades', tags: ['Presentador de eventos','Maestro de ceremonias','Locución','Speaker corporativo','Conferencias','Galas','Bodas','Deportivo','Voz en off','Presentación en inglés'] },
    vestuario:  { label: 'Servicios', tags: ['Estilismo','Vestuario de escena','Asesoría de imagen','Personal shopper','Alquiler de vestuario','Caracterización','Sastrería','Vestuario de novia','Producción de moda','Pasarela'] },
    // Especialidades reales por las que un cliente pregunta al contratar. Un
    // camarero que solo pone "camarero" compite por precio; uno que declara
    // "sumiller" o "coctelería de autor" compite por perfil. Ordenadas de lo
    // general a lo especialista, que es como las busca quien contrata.
    camarero:   { label: 'Especialidades', tags: ['Camarero/a de sala','Barra','Coctelería','Bartender','Coctelería de autor','Flair','Sumiller','Vinos','Barista','Café de especialidad','Servicio de bodas','Banquetes','Protocolo y servicio de gala','Emplatado','Show cooking','Catering','Bottle service','Terraza','Barra libre','Ayudante de cocina','Office','Carnet de manipulador','Idiomas: EN/FR'] },
    'photo-booth': { label: 'Servicios', tags: ['Photocall','Cabina de fotos','Espejo mágico','360 booth','Impresión al momento','Atrezzo','GIFs','Libro de firmas','Bodas','Eventos corporativos'] },
    // staff recoge perfiles muy distintos (azafatas, RRPP y camareros), así que
    // lleva también las especialidades de barra y sala: la mayoría de camareros
    // se dan de alta con este rol, no con 'camarero', y sin estas etiquetas no
    // podían declarar en qué son buenos.
    staff:         { label: 'Especialidades',         tags: ['Camarero/a de sala','Barra','Coctelería','Bartender','Sumiller','Barista','Servicio de bodas','Banquetes','Protocolo y servicio de gala','Azafata','RRPP','Promotor','Relaciones Públicas','Animación','Hostess','Sala VIP','Control de acceso','Taquilla','Chill-out','Bottle service','Coordinación','Carnet de manipulador','Idiomas: EN/FR'] },
    event_manager: { label: 'Áreas de coordinación', tags: ['Coordinación general','Producción de eventos','Montaje y decoración','Catering','Staff externo','Protocolo','Gestión de artistas','Logística','Presupuestos','Eventos corporativos','Bodas','Festivales','Clubbing','Outdoor'] },
    makeup:    { label: 'Servicios',             tags: ['Maquillaje nupcial','Caracterización','Maquillaje artístico','Estilismo','Nail art','Aerógrafo','Efectos especiales','Maquillaje masculino','Novias','Pasarela','Producción'] },
    peluqueria:{ label: 'Servicios',             tags: ['Peluquería a domicilio','Peinado de novia','Recogidos','Corte','Color','Extensiones','Alisado','Tratamientos capilares','Peluquería infantil','Eventos','Día a día'] },
    media:     { label: 'Especialidades',        tags: ['Fotografía de eventos','Vídeo','Reels & Contenido','Fotografía de DJ','Drone','Cobertura en directo','Fotografía de sala','Retrato','Edición de vídeo','Color grading','Motion graphics','Podcast'] },
    design:    { label: 'Especialidades',        tags: ['Diseño gráfico','VJing','Mapping','LED wall','Visuales en vivo','Cartelería','Branding','Redes sociales','Ilustración','3D','Motion design'] },
    promotor:  { label: 'Especialidades',        tags: ['Festivales','Clubs nocturnos','Eventos privados','Bodas','Corporativo','After','Terraza','Sala pequeña','Sala grande','Residencias','Giras'] },
    bailarin:  { label: 'Estilos de baile',       tags: ['Salsa','Salsa cubana','Salsa en línea','Bachata','Bachata sensual','Kizomba','Zouk','Merengue','Cha cha cha','Cumbia','Coreografía primer baile','Baile de exhibición','Danza urbana','Reguetón/Perreo intenso','Danza contemporánea'] },
  }
