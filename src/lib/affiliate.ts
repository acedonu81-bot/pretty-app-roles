import {
  Headphones, Disc3, Music, Wine, Camera, Aperture, Laptop, Cable, Lightbulb,
  Palette, Sparkles, UtensilsCrossed, Mic2, Speaker, Shirt, Wand2, Backpack,
  Briefcase, Scissors, Wrench, Watch, BatteryCharging, type LucideIcon,
} from 'lucide-react';

/**
 * Catálogo ÚNICO de equipo recomendado con enlaces de afiliado, específico por
 * rol.
 *
 * Vive aquí y no dentro de un componente porque lo consumen DOS pantallas muy
 * distintas: el bloque del blog público (DJResourcesAffiliate) y el panel de
 * Recursos del dashboard (ResourcesView). Duplicar el catálogo es exactamente
 * el patrón que ya nos ha mordido tres veces en este repo (cada pantalla
 * escribiendo su propia versión de los mismos datos) — un ASIN corregido en un
 * sitio y no en el otro pasa desapercibido y deja enlaces muertos cobrando 0.
 *
 * P() = enlace a PRODUCTO concreto (/dp/ASIN) — el único que Amazon permite y
 * que genera comisión. A() = búsqueda específica (fallback donde aún no hay
 * ASIN; sustituir por P('ASIN') cuando lo saques de SiteStripe).
 *
 * REGLA DE CONTENIDO: solo se escriben valoraciones (4.5★, +3.000 reseñas) en
 * los items cuyo ASIN se verificó a mano en Amazon.es. Los items con A() van
 * SIN cifras — inventar reseñas es mentirle al profesional y además es
 * exactamente lo que hace que Amazon cierre una cuenta de afiliado.
 */

export type AffiliateResource = { icon: LucideIcon; title: string; desc: string; href: string };
export type AffiliateCatalogEntry = {
  label: string;
  /** Singular en minúscula para frases: "trabajar de {singular}". Sin él, el
   *  hero decía "trabajar de djs" / "trabajar de camareros". */
  singular: string;
  /** Preposición del hero. Por defecto 'de' ("trabajar de camarero"); 'en'
   *  para los colectivos que no son un oficio en singular ("trabajar en
   *  catering", no "trabajar de catering"). */
  prep?: 'de' | 'en';
  icon: LucideIcon;
  accent: string;
  items: AffiliateResource[];
};

const P = (asin: string) => `https://www.amazon.es/dp/${asin}?tag=xpeak-21`;
const A = (q: string) => `https://www.amazon.es/s?k=${encodeURIComponent(q)}&tag=xpeak-21`;

export const AFFILIATE_CATALOG: Record<string, AffiliateCatalogEntry> = {
  dj: {
    label: 'DJs', singular: 'DJ', icon: Disc3, accent: '#D4AF37',
    items: [
      { icon: Headphones, title: 'Pioneer DJ HDJ-X5', desc: 'Los auriculares DJ más vendidos: monitorización limpia a alto volumen.', href: P('B0759FLG32') },
      { icon: Disc3, title: 'Pioneer DDJ-FLX4', desc: 'La controladora de entrada más popular para practicar y bolos.', href: P('B0BLSJZC94') },
      { icon: Speaker, title: 'Monitor KRK Rokit RP5 G5', desc: 'El monitor de estudio referencia de 5" para producir y mezclar tus sets.', href: P('B0CW3TLKDK') },
      { icon: Cable, title: 'Cable XLR dual a RCA', desc: 'El fallo nº1 en cabina es un cable. Llevar repuesto propio te salva el bolo.', href: P('B077GWTBF4') },
      { icon: Backpack, title: 'Mochila acolchada para controladora', desc: 'Transporte protegido de la controladora y el portátil al bolo.', href: A('mochila controladora DJ acolchada') },
      { icon: Lightbulb, title: 'Set de iluminación LED para cabina', desc: 'Efectos básicos para verbenas y fiestas privadas sin técnico de luces.', href: A('iluminacion LED DJ fiesta') },
      { icon: Laptop, title: 'Soporte de portátil de aluminio', desc: 'Eleva el portátil a la altura de la mesa y libera espacio de trabajo.', href: P('B086V28W64') },
      { icon: Mic2, title: 'Sistema inalámbrico UHF (2 micros)', desc: 'Presentar y animar sin depender del equipo del local; el segundo micro, para el cliente.', href: P('B08N112VY2') },
      // Denon DJ — la otra gran marca de cabina junto a Pioneer, y la que
      // domina el "todo en uno" sin portátil (bodas, verbenas, bolos donde
      // montas tú). No tiene programa de afiliados propio en España, así que
      // va por Amazon, la afiliación ya activa.
      //
      // Van con búsqueda A() y NO con ASIN fijo a propósito: la Prime 4+ G2 es
      // de lanzamiento reciente y su ASIN todavía se mueve (reediciones,
      // packs, importadores). Un ASIN muerto no cobra comisión y no avisa;
      // la búsqueda siempre lleva al listado vivo. Sustituir por P('ASIN')
      // cuando el modelo lleve meses estable en Amazon.es.
      { icon: Disc3, title: 'Denon DJ Prime 4+ G2', desc: 'La nueva generación del todo en uno: pantalla de 10", 4 canales y sin portátil.', href: A('Denon DJ Prime 4 G2') },
      { icon: Disc3, title: 'Denon DJ SC Live 4', desc: 'Todo en uno con altavoces integrados: para el bolo donde el sonido lo pones tú.', href: A('Denon DJ SC Live 4') },
      { icon: Headphones, title: 'Auriculares Denon DJ HP1100', desc: 'Monitorización cerrada para cabina ruidosa, por debajo del precio de los Pioneer.', href: A('Denon DJ HP1100 auriculares') },
    ],
  },
  camareros: {
    label: 'Camareros', singular: 'camarero', icon: Wine, accent: '#2563EB',
    items: [
      { icon: Wine, title: 'Coctelera de acero inoxidable', desc: 'Kit profesional para servicio en eventos (4.5★, +3.000 valoraciones).', href: P('B01MEHUA4I') },
      { icon: Sparkles, title: 'Pack de 3 delantales negros con bolsillos', desc: 'Imagen impecable para bodas y eventos (4.5★, +370 valoraciones).', href: P('B0C2HRJRVM') },
      { icon: UtensilsCrossed, title: 'Bandeja redonda antideslizante', desc: 'Servicio seguro en salón y barra (4.3★, +1.000 valoraciones).', href: P('B09CV5FHT8') },
      { icon: Wrench, title: 'Kit de herramientas de camarero', desc: 'Funda con sacacorchos, abridor y descorchador siempre encima (4.6★, +160 valoraciones).', href: P('B0BB8KPBC6') },
      { icon: Watch, title: 'Calzado de trabajo antideslizante', desc: 'Suela para suelo mojado en cocina y barra durante turnos largos.', href: P('B0D3HDJDPF') },
      { icon: Briefcase, title: 'Camisa negra de servicio', desc: 'El uniforme que piden la mayoría de salas y caterings.', href: A('camisa negra camarero manga larga') },
      { icon: Wine, title: 'Jigger medidor doble', desc: 'Cócteles consistentes cuando sirves cientos de copas seguidas.', href: A('jigger medidor coctel acero') },
      { icon: Sparkles, title: 'Talonarios de comanda Dohe (10 uds)', desc: 'El consumible que siempre se acaba a mitad de servicio.', href: P('B0CLVQ4CFX') },
    ],
  },
  staff: {
    label: 'Staff y montaje', singular: 'staff de eventos', prep: 'en', icon: Sparkles, accent: '#059669',
    items: [
      { icon: Sparkles, title: 'Zapatillas de seguridad antideslizantes', desc: 'Comodidad para jornadas largas de evento (4.6★, +500 valoraciones).', href: P('B0FSXQQL7L') },
      { icon: Mic2, title: 'Walkie-talkie manos libres', desc: 'Comunicación entre equipo en eventos grandes (4.7★, pack de 4).', href: P('B07XY79RL4') },
      { icon: Wine, title: 'Kit de herramientas de camarero', desc: 'Funda profesional con 20 herramientas de bar (4.6★, +160 valoraciones).', href: P('B0BB8KPBC6') },
      { icon: BatteryCharging, title: 'Powerbank de alta capacidad', desc: 'Turnos de 12 h sin un enchufe cerca: el móvil es tu herramienta de trabajo.', href: A('powerbank 20000mah carga rapida') },
      { icon: Lightbulb, title: 'Linterna frontal recargable', desc: 'Montaje y desmontaje a oscuras con las manos libres.', href: A('linterna frontal recargable trabajo') },
      { icon: Wrench, title: 'Guantes de montaje antivibración', desc: 'Carga y montaje de estructuras sin destrozarte las manos.', href: A('guantes trabajo montaje antideslizante') },
      { icon: Backpack, title: 'Riñonera de trabajo', desc: 'Bridas, cinta y móvil siempre encima durante el montaje.', href: A('rinonera trabajo herramientas') },
      { icon: Cable, title: 'Cinta americana y bridas', desc: 'El consumible universal de cualquier montaje de evento.', href: A('cinta americana negra bridas pack') },
    ],
  },
  fotografo: {
    label: 'Fotógrafos', singular: 'fotógrafo', icon: Camera, accent: '#4F46E5',
    items: [
      { icon: Aperture, title: 'Canon EF 50mm f/1.8 STM', desc: 'El objetivo más vendido de la historia (4.8★). Retrato de evento con poca luz.', href: P('B00X8MRBCW') },
      { icon: Camera, title: 'Godox TT600 flash speedlite', desc: 'El flash más vendido para iluminar bodas y salones.', href: P('B078TGPDLR') },
      { icon: Sparkles, title: 'SanDisk Extreme Pro SD 128GB', desc: 'La tarjeta best-seller: ráfagas y vídeo 4K sin cortes.', href: P('B07H9DVLBB') },
      { icon: Backpack, title: 'Mochila fotográfica con acceso lateral', desc: 'Cambiar de objetivo sin dejar la mochila en el suelo del salón.', href: A('mochila fotografica acceso lateral') },
      { icon: Lightbulb, title: 'Difusor y softbox para flash', desc: 'Luz suave en interiores: la diferencia entre foto de evento y foto de carné.', href: A('softbox difusor flash speedlite') },
      { icon: BatteryCharging, title: 'Pack de pilas recargables + cargador', desc: 'Una boda se come varios juegos de pilas de flash.', href: A('pilas recargables AA flash cargador') },
      { icon: Camera, title: 'Correa de doble cámara', desc: 'Dos cuerpos encima (gran angular + tele) sin cambiar de objetivo.', href: A('correa doble camara fotografo') },
      { icon: Wrench, title: 'Trípode de viaje con rótula de bola', desc: 'Ceremonias, grupos y larga exposición del baile.', href: A('tripode viaje rotula bola fotografia') },
    ],
  },
  media: {
    label: 'Fotógrafos y vídeo', singular: 'fotógrafo o videógrafo', icon: Camera, accent: '#4F46E5',
    items: [
      { icon: Aperture, title: 'Canon EF 50mm f/1.8 STM', desc: 'Retrato y ambiente con poca luz en eventos (4.7★, +12.000 valoraciones).', href: P('B00XKSBMQA') },
      { icon: Camera, title: 'DJI Osmo Mobile 6 (gimbal)', desc: 'Estabilizador para aftermovies y vídeo fluido de evento.', href: P('B0B7XD7R43') },
      { icon: Sparkles, title: 'SanDisk Extreme Pro SD 128GB', desc: 'Ráfagas y vídeo 4K sin cortes (4.7★, +89.000 valoraciones).', href: P('B09X7FXHVJ') },
      { icon: Mic2, title: 'Micrófono de solapa inalámbrico', desc: 'Audio limpio en votos y discursos, donde la cámara no llega.', href: A('microfono solapa inalambrico camara') },
      { icon: Lightbulb, title: 'Panel LED de vídeo con batería', desc: 'Relleno de luz para entrevistas y planos nocturnos.', href: A('panel LED video bateria bicolor') },
      { icon: Laptop, title: 'Disco SSD externo 1TB', desc: 'Descarga y copia de seguridad del material antes de salir del evento.', href: A('SSD externo 1TB portatil') },
      { icon: Backpack, title: 'Mochila de vídeo con compartimentos', desc: 'Cámara, gimbal, micros y baterías organizados.', href: A('mochila video camara compartimentos') },
      { icon: BatteryCharging, title: 'Baterías de repuesto para cámara', desc: 'Una boda entera no la aguanta una sola batería.', href: A('bateria repuesto camara sin espejo') },
    ],
  },
  maquillaje: {
    label: 'Maquillaje y peluquería', singular: 'maquilladora o peluquera', icon: Palette, accent: '#DB2777',
    items: [
      { icon: Palette, title: 'Set de brochas y esponja profesional', desc: 'Acabado impecable para novias y eventos (4.7★, +54.000 valoraciones).', href: P('B07FTXBNVL') },
      { icon: Sparkles, title: 'Neewer aro de luz 18"', desc: 'Luz uniforme para maquillaje profesional en cualquier sitio.', href: P('B01LXDNNBW') },
      { icon: Camera, title: 'Maletín de maquillaje con ruedas', desc: 'Transporta tu material con orden a cada bolo (4.6★, +2.500 valoraciones).', href: P('B07KBX8LL6') },
      { icon: Scissors, title: 'Plancha y tenacilla profesional', desc: 'Peinado de novia e invitadas a domicilio.', href: A('plancha pelo profesional peluqueria') },
      { icon: Sparkles, title: 'Espejo de tocador portátil con luz', desc: 'Trabajar con luz correcta en habitaciones de hotel sin ventanas.', href: A('espejo tocador portatil luz LED') },
      { icon: Wrench, title: 'Limpiador y secador de brochas', desc: 'Higiene entre clientas el mismo día: obligatorio si encadenas servicios.', href: A('limpiador brochas maquillaje') },
      { icon: Briefcase, title: 'Cinturón organizador de herramientas', desc: 'Tijeras, peines y clips a mano mientras peinas.', href: A('cinturon peluqueria organizador herramientas') },
      { icon: Palette, title: 'Paleta de correctores profesional', desc: 'Cobertura para fotografía y vídeo de boda, que perdona menos.', href: A('paleta correctores maquillaje profesional') },
    ],
  },
  'grupo-musical': {
    label: 'Grupos y músicos', singular: 'músico', icon: Music, accent: '#DB2777',
    items: [
      { icon: Mic2, title: 'Micrófono Shure SM58', desc: 'El micro vocal estándar del directo para bodas y eventos.', href: P('B000CZ0R42') },
      { icon: Speaker, title: 'JBL IRX112BT (PA portátil)', desc: 'Altavoz PA con batería para cóctel y ceremonia.', href: P('B081TNPGZV') },
      { icon: Music, title: 'Atril metálico portátil', desc: 'Comodidad para actuaciones largas (4.7★, +5.600 valoraciones).', href: P('B0BJZVXPD1') },
      { icon: Cable, title: 'Pack de cables XLR de escenario', desc: 'Repuesto propio: no dependes del cableado del local.', href: A('cable XLR microfono escenario pack') },
      { icon: Headphones, title: 'Sistema de monitorización in-ear', desc: 'Escucharte en escenarios ruidosos sin monitor de suelo.', href: A('in ear monitor musico directo') },
      { icon: Wrench, title: 'Soporte de altavoz con trípode', desc: 'Elevar el PA por encima del público en banquetes.', href: A('tripode soporte altavoz PA') },
      { icon: Backpack, title: 'Funda acolchada para instrumento', desc: 'Transporte seguro entre bolos.', href: A('funda acolchada instrumento musical') },
      { icon: Laptop, title: 'Interfaz de audio portátil', desc: 'Grabar el directo o lanzar pistas desde el portátil.', href: A('interfaz audio USB portatil') },
    ],
  },
  catering: {
    label: 'Catering y chef', singular: 'catering', prep: 'en', icon: UtensilsCrossed, accent: '#B45309',
    items: [
      { icon: UtensilsCrossed, title: 'Chafing dish acero inox', desc: 'Mantiene la comida a temperatura durante todo el evento.', href: P('B0C7T33F8J') },
      { icon: Sparkles, title: 'Chaqueta de chef unisex', desc: 'Imagen y seguridad para el equipo (4.4★, +5.000 valoraciones).', href: P('B00GAXT37W') },
      { icon: Wine, title: 'Menaje y cristalería', desc: 'Presentación cuidada para banquetes.', href: A('menaje catering profesional') },
      { icon: Scissors, title: 'Maletín de cuchillos profesional', desc: 'Tu juego propio, transportado con seguridad al evento.', href: A('maletin cuchillos chef profesional') },
      { icon: Watch, title: 'Termómetro de sonda digital', desc: 'Control de temperatura: exigencia sanitaria en servicio de comidas.', href: A('termometro sonda cocina digital') },
      { icon: Briefcase, title: 'Contenedor isotérmico de transporte', desc: 'Llevar la producción del obrador al evento sin romper la cadena de frío.', href: A('contenedor isotermico transporte comida') },
      { icon: UtensilsCrossed, title: 'Bandejas GN de acero inoxidable', desc: 'El estándar de cualquier montaje de buffet.', href: A('bandeja gastronorm acero inoxidable') },
      { icon: Wrench, title: 'Guantes y film de uso alimentario', desc: 'Consumible que se agota siempre a mitad de servicio.', href: A('guantes nitrilo alimentario caja') },
    ],
  },
  azafata: {
    label: 'Azafatas y hostess', singular: 'azafata', icon: Sparkles, accent: '#2563EB',
    items: [
      { icon: Sparkles, title: 'Zapato de tacón bajo cómodo', desc: 'Aguanta turnos largos de congreso o evento sin sacrificar imagen (4.5★, +2.100 valoraciones).', href: P('B0CH3C5KWV') },
      { icon: Mic2, title: 'Powerbank slim con linterna', desc: 'Batería de bolsillo para turnos largos sin enchufe cerca (4.5★, +71.000 valoraciones).', href: P('B07PNL5STG') },
      { icon: UtensilsCrossed, title: 'Organizador de bolso para trabajo', desc: 'Lleva credencial, bolígrafo y básicos siempre a mano en stands y recepciones (4.0★).', href: P('B09X37Q92G') },
      { icon: Briefcase, title: 'Portadocumentos con clip', desc: 'Listados de acreditación y firmas en la entrada del evento.', href: A('portadocumentos clip carpeta A4') },
      { icon: Watch, title: 'Plantillas de gel para tacón', desc: 'Lo que hace la diferencia en una feria de tres días de pie.', href: A('plantillas gel tacon comodidad') },
      { icon: Sparkles, title: 'Kit de costura y quitamanchas de bolsillo', desc: 'Imagen impecable durante toda la jornada.', href: A('quitamanchas bolsillo ropa viaje') },
      { icon: Mic2, title: 'Petaca de micrófono para presentación', desc: 'Hacer llamamientos en sala sin gritar.', href: A('microfono petaca presentacion') },
      { icon: Backpack, title: 'Bolso estructurado negro de trabajo', desc: 'Uniforme neutro que encaja en cualquier marca cliente.', href: A('bolso negro estructurado trabajo mujer') },
    ],
  },
  bailarin: {
    label: 'Bailarines e instructores', singular: 'bailarín o instructor', icon: Music, accent: '#DB2777',
    items: [
      { icon: Music, title: 'Zapatillas Bloch Essential Jazz', desc: 'Suela dividida para giros y flexibilidad en actuaciones de evento (marca especializada, 4.2★).', href: P('B00DVFVLG8') },
      { icon: Sparkles, title: 'Maillot clásico de ballet', desc: 'Movilidad completa para ensayo y coreografía (4.4★, +790 valoraciones).', href: P('B07434LBP4') },
      { icon: Wine, title: 'Rodillera de protección para danza', desc: 'Protección para suelos duros en salas de evento no acondicionadas (4.4★, +840 valoraciones).', href: P('B0C5GR2CLR') },
      { icon: Speaker, title: 'Altavoz Bluetooth portátil con batería', desc: 'Dar clase o ensayar donde no hay equipo de sonido.', href: A('altavoz bluetooth portatil potente bateria') },
      { icon: Mic2, title: 'Micrófono de diadema para instructor', desc: 'Dar clase sin quedarte afónico en salas con música alta.', href: A('microfono diadema instructor fitness') },
      { icon: Backpack, title: 'Bolsa de danza con compartimento de calzado', desc: 'Separar zapatillas sudadas del vestuario de actuación.', href: A('bolsa danza compartimento zapatillas') },
      { icon: Wrench, title: 'Rodillo y banda elástica de calentamiento', desc: 'Calentar y recuperar entre actuaciones.', href: A('rodillo masaje banda elastica estiramiento') },
      { icon: Shirt, title: 'Ropa técnica de ensayo', desc: 'Tejido transpirable para sesiones largas.', href: A('ropa tecnica danza ensayo transpirable') },
    ],
  },
  mago: {
    label: 'Magos e ilusionistas', singular: 'mago', icon: Wand2, accent: '#7C3AED',
    items: [
      { icon: Wand2, title: 'Maletín rígido con espuma troquelada', desc: 'Espuma recortable a medida: cada efecto protegido en su hueco.', href: P('B08K3K3VBG') },
      { icon: Mic2, title: 'Micrófono de diadema inalámbrico (2 uds)', desc: 'Manos libres para magia de escenario; el segundo micro, para el espectador que sube.', href: P('B0B4JQQ2JR') },
      { icon: Sparkles, title: 'Mesa plegable de catering 180 cm', desc: 'Superficie estable y transportable para close-up en salón o cóctel.', href: P('B0CLDB55HT') },
      { icon: Briefcase, title: 'Barajas Bicycle (pack de 2)', desc: 'El consumible del mago de close-up: se gastan bolo tras bolo.', href: P('B00001QHVP') },
      { icon: Speaker, title: 'Soundcore Boom 2 (80 W, 24 h)', desc: 'Sonorizar tu propio número en salones sin equipo, con batería para toda la tarde.', href: P('B0CQ53RVTW') },
      { icon: Lightbulb, title: 'Foco LED portátil de escenario', desc: 'Dirigir la atención del público en salas mal iluminadas.', href: A('foco LED portatil escenario') },
      { icon: Shirt, title: 'Chaleco de vestir para actuación', desc: 'Imagen de escena con bolsillos útiles para el número.', href: P('B07T8Z3FNY') },
      { icon: Backpack, title: 'Organizador de 17 compartimentos', desc: 'Divisores extraíbles: cada efecto en su sitio, montar y recoger rápido.', href: P('B07TKYW48Y') },
    ],
  },
  vestuario: {
    label: 'Estilistas y vestuario', singular: 'estilista', icon: Shirt, accent: '#DB2777',
    items: [
      { icon: Shirt, title: 'Vaporizador de ropa portátil', desc: 'Arregla arrugas de última hora en el propio evento.', href: A('vaporizador ropa portatil profesional') },
      { icon: Sparkles, title: 'Kit de costura de 184 piezas', desc: 'El imprescindible para incidencias de vestuario en directo.', href: P('B08M3SL3DT') },
      { icon: Camera, title: 'Burro de ropa extensible con ruedas', desc: 'Transporta y organiza el vestuario del evento.', href: P('B073B8SBC7') },
      { icon: Scissors, title: 'Tijeras de sastre 3 Claveles 20 cm', desc: 'Marca española de referencia en corte y confección. Arreglos y ajustes en el sitio.', href: P('B00NNMU5M0') },
      { icon: Briefcase, title: 'Fundas transparentes para trajes', desc: 'Ves lo que hay dentro sin abrirlas: transporte sin arrugas ni manchas.', href: P('B07WDSW3XQ') },
      { icon: Sparkles, title: 'Quitapelusas eléctrico Philips', desc: 'Tres tamaños de malla: prendas impecables antes de que salga a cámara.', href: P('B07M8J529S') },
      { icon: Wrench, title: 'Cinta de doble cara para tejidos (100 uds)', desc: 'Escotes y dobladillos que no se mueven durante toda la boda.', href: P('B087CB8NSQ') },
      { icon: Watch, title: 'Imperdibles surtidos (50 uds, 4 tamaños)', desc: 'Ajustar tallas al vuelo en pruebas y montajes.', href: P('B06XW5JMB5') },
    ],
  },
};

// Alias de roles hacia el catálogo (los slugs del blog y los dbRole varían).
export const AFFILIATE_ROLE_ALIAS: Record<string, string> = {
  camarero: 'camareros', foto: 'fotografo', 'disco-movil': 'dj',
  peluqueria: 'maquillaje', makeup: 'maquillaje', estilista: 'vestuario',
  banda: 'grupo-musical', design: 'media', 'photo-booth': 'media',
  promotor: 'staff', event_manager: 'azafata', speaker: 'grupo-musical',
  ambassador: 'staff', humorista: 'grupo-musical', monologo: 'grupo-musical',
  animador: 'bailarin',
  // 'rookie' NO se mapea a 'dj': es un perfil sin oficio definido todavía, y
  // enseñarle auriculares y controladora daba por hecho que era DJ. Sin alias,
  // resolveAffiliateKey devuelve null y no se le muestra equipo de nadie.

};

/** Devuelve la clave de catálogo para un rol, o null si no hay equipo relevante. */
export function resolveAffiliateKey(role: string): string | null {
  if (AFFILIATE_CATALOG[role]) return role;
  const alias = AFFILIATE_ROLE_ALIAS[role];
  if (alias && AFFILIATE_CATALOG[alias]) return alias;
  return null;
}

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * PARTNERS de afiliación distintos de Amazon (comisión mayor, pero exigen alta
 * previa y un ID propio de la red — TradeTracker, Hotmart, Awin…).
 *
 * `url: null` significa "el alta todavía no está aprobada": la tarjeta NO se
 * renderiza. Enlazar sin el ID de afiliado sería regalarles tráfico sin cobrar
 * comisión, así que preferimos no mostrar nada hasta tener el enlace real.
 * Para activar uno: pega aquí la URL de tracking que te da la red y listo.
 */
export type AffiliatePartner = {
  name: string;
  desc: string;
  roles: string[];
  url: string | null;
  network: string;
  /** 'formacion' = cursos/academias, 'tienda' = producto. Se agrupan por separado. */
  kind: 'formacion' | 'tienda';
};

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    name: 'Profesional DJ — tienda',
    desc: 'Controladoras, altavoces, cascos e iluminación de cabina. Una de las tiendas de referencia en España.',
    roles: ['dj', 'grupo-musical'],
    url: null,
    network: 'TradeTracker',
    kind: 'tienda',
  },
  // Cursos de PRODJ Academy (Profesional DJ), vendidos vía Hotmart. Son el
  // MISMO temario sobre equipos distintos, así que se ofrecen los dos: quien
  // pincha en Pioneer no quiere aprender en Denon ni al revés, y comprar el
  // curso del equipo equivocado es dinero tirado.
  //
  // Los enlaces go.hotmart.com son las URL rastreables de la cuenta de
  // afiliado: enlazar al curso de cualquier otra forma NO genera comisión.
  {
    name: 'PRODJ Academy — Curso DJ con equipos Pioneer',
    desc: 'Formación completa sobre cabina Pioneer: mezcla, estructura de sets y manejo de equipo. 100% online, acceso inmediato.',
    roles: ['dj'],
    url: 'https://go.hotmart.com/T107497976C?ap=bf9f',
    network: 'Profesional DJ',
    kind: 'formacion',
  },
  {
    name: 'PRODJ Academy — Curso DJ con equipos Denon',
    desc: 'El mismo temario sobre cabina Denon (Prime, SC Live): para quien pincha con Engine DJ y no con Rekordbox.',
    roles: ['dj'],
    url: 'https://go.hotmart.com/J107498033J',
    network: 'Profesional DJ',
    kind: 'formacion',
  },
  {
    name: 'Thomann',
    desc: 'La mayor tienda de instrumentos y sonido de Europa: PA, micrófonos, cableado y backline.',
    roles: ['dj', 'grupo-musical'],
    url: null,
    network: 'Awin',
    kind: 'tienda',
  },
  {
    name: 'Domestika',
    desc: 'Cursos de fotografía, vídeo, maquillaje y diseño impartidos por profesionales en activo.',
    roles: ['media', 'fotografo', 'maquillaje', 'vestuario'],
    url: null,
    network: 'Awin',
    kind: 'formacion',
  },
  {
    name: 'Formación en hostelería y manipulador de alimentos',
    desc: 'Certificados obligatorios para trabajar en barra, sala y catering.',
    roles: ['camareros', 'staff', 'catering'],
    url: null,
    network: 'Por definir',
    kind: 'formacion',
  },
];

export function partnersForRole(role: string, kind?: 'formacion' | 'tienda'): AffiliatePartner[] {
  const key = resolveAffiliateKey(role) ?? role;
  return AFFILIATE_PARTNERS.filter(p =>
    p.url &&
    (kind ? p.kind === kind : true) &&
    (p.roles.includes(key) || p.roles.includes(role))
  );
}
