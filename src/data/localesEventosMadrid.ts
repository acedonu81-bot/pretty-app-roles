/**
 * Locales de Madrid investigados y verificados manualmente para la guía de
 * "Locales para eventos" — fuente única compartida entre el blog
 * (BlogLocalesEventosMadrid.tsx) y el listado "no ficha" del directorio del
 * rol local_eventos (LocalEventosView.tsx).
 *
 * Excluidos permanentemente a petición propia (no promocionar): Casa Vieja
 * Bar, Trastevere, Terminal 55, B12 Madrid, Black Star.
 */
export interface LocalInvestigado {
  nombre: string;
  zona: string;
  tipo: string;
  web?: string;
  foto: string;
  fotoReal: boolean;
  categoria: 'emblematico' | 'sala' | 'bar' | 'terraza' | 'huertas-latina' | 'finca';
}

const IMG = '/img/locales-madrid/';
const G_DISCO = [IMG + 'generico-discoteca-1.jpg', IMG + 'generico-discoteca-2.jpg', IMG + 'generico-discoteca-3.jpg'];
const G_BAR = [IMG + 'generico-bar-1.jpg', IMG + 'generico-bar-2.jpg'];
const G_ROOFTOP = [IMG + 'generico-rooftop-1.jpg', IMG + 'generico-rooftop-2.jpg'];
const G_FINCA = [IMG + 'generico-finca-1.jpg', IMG + 'generico-finca-2.jpg'];

export const EMBLEMATICOS: LocalInvestigado[] = [
  { nombre: 'Teatro Barceló', zona: 'Centro', tipo: 'Discoteca histórica, hasta 1.200 personas', web: 'https://teatrobarcelo.com', foto: G_DISCO[0], fotoReal: false, categoria: 'emblematico' },
  { nombre: 'Teatro Kapital', zona: 'Atocha', tipo: 'Discoteca de 7 plantas', web: 'https://teatrokapital.com', foto: G_DISCO[1], fotoReal: false, categoria: 'emblematico' },
  { nombre: 'Sala El Sol', zona: 'Gran Vía', tipo: 'Sala de conciertos desde 1979, cuna de la Movida', web: 'https://salaelsol.com', foto: G_DISCO[2], fotoReal: false, categoria: 'emblematico' },
  { nombre: 'Teatro Eslava', zona: 'Sol', tipo: 'Discoteca histórica junto a Puerta del Sol', web: 'https://teatroeslava.com', foto: G_DISCO[1], fotoReal: false, categoria: 'emblematico' },
  { nombre: 'Serrano 41', zona: 'Salamanca', tipo: 'Discoteca con terraza de verano', web: 'https://madridlux.com/es/discoteca/serrano41-madrid', foto: G_DISCO[0], fotoReal: false, categoria: 'emblematico' },
];

export const SALAS: LocalInvestigado[] = [
  { nombre: 'Sala BaoBao', zona: 'Chamberí', tipo: 'Discoteca, aforo 380', web: 'https://baobaomadrid.com', foto: G_DISCO[2], fotoReal: false, categoria: 'sala' },
  { nombre: 'Privados Madrid', zona: 'Leganés', tipo: '15 salas privadas', web: 'https://privadosmadrid.com', foto: G_DISCO[0], fotoReal: false, categoria: 'sala' },
  { nombre: 'Bodeguita de Enmedio', zona: 'Centro / La Latina', tipo: 'Sala de eventos', web: 'https://bodeguitadeenmedio.es', foto: G_DISCO[1], fotoReal: false, categoria: 'sala' },
  { nombre: 'Copérnico The Club', zona: 'Moncloa', tipo: 'Sala / discoteca', web: 'https://salacopernico.es', foto: G_DISCO[2], fotoReal: false, categoria: 'sala' },
  { nombre: 'NEXT Clubbing', zona: 'Cuzco', tipo: 'Club de música electrónica', web: 'https://nextclubbing.com', foto: G_DISCO[0], fotoReal: false, categoria: 'sala' },
  { nombre: 'Cristo Social Club', zona: 'Salamanca', tipo: 'Espacio elegante para eventos', web: 'https://xceed.me/es/madrid/venue/cristo-social-club', foto: G_DISCO[1], fotoReal: false, categoria: 'sala' },
  { nombre: 'Calle 365', zona: 'Las Letras', tipo: 'Speakeasy inmersivo', web: 'https://www.instagram.com/calle_365', foto: G_DISCO[2], fotoReal: false, categoria: 'sala' },
  { nombre: 'Costa Breve', zona: 'Las Letras', tipo: 'Eventos privados', web: 'https://grupocostabreve.com', foto: G_DISCO[0], fotoReal: false, categoria: 'sala' },
  { nombre: 'Malavita Night Bar', zona: 'Chamberí', tipo: 'Cumpleaños y fiestas privadas', web: 'https://malavitanightbar.com', foto: G_DISCO[1], fotoReal: false, categoria: 'sala' },
  { nombre: 'Sala Kubik', zona: 'Puerta de Toledo', tipo: 'Espacio multifuncional, aforo 120', web: 'https://www.instagram.com/salakubikmadrid', foto: G_DISCO[2], fotoReal: false, categoria: 'sala' },
];

export const BARES: LocalInvestigado[] = [
  { nombre: 'Pizpireta Bar', zona: 'Centro', tipo: 'Bar de dos plantas', web: 'https://pizpiretabar.com', foto: G_BAR[0], fotoReal: false, categoria: 'bar' },
  { nombre: 'Folie', zona: 'Hortaleza', tipo: 'Café espectáculo', web: 'https://foliebar.es', foto: G_BAR[1], fotoReal: false, categoria: 'bar' },
  { nombre: 'Marvelous Bar', zona: 'Chamberí', tipo: 'Bar para fiestas privadas', web: 'https://www.marvelousbar.es', foto: G_BAR[0], fotoReal: false, categoria: 'bar' },
  { nombre: 'Bar Daily', zona: 'Chamberí', tipo: 'Bar para fiestas y cumpleaños', web: 'https://bardaily.com', foto: G_BAR[1], fotoReal: false, categoria: 'bar' },
  { nombre: 'GramaBar', zona: 'Centro', tipo: 'Bar / restaurante con eventos', web: 'https://gramabar.com', foto: G_BAR[0], fotoReal: false, categoria: 'bar' },
];

export const TERRAZAS: LocalInvestigado[] = [
  { nombre: 'La Catorce Sky Bar', zona: 'Gran Vía', tipo: 'Rooftop con vistas al centro', web: 'https://lacatorcemadrid.es', foto: G_ROOFTOP[0], fotoReal: false, categoria: 'terraza' },
  { nombre: 'Doñaluz — The Madrid Rooftop', zona: 'Centro / Montera', tipo: 'Rooftop', web: 'https://donaluzmadrid.com', foto: G_ROOFTOP[1], fotoReal: false, categoria: 'terraza' },
  { nombre: 'Ella Sky Bar', zona: 'Gran Vía', tipo: 'Rooftop con vistas a Callao', web: 'https://ellaskybar.es', foto: G_ROOFTOP[0], fotoReal: false, categoria: 'terraza' },
  { nombre: 'Irreverente Madrid', zona: 'Chamberí', tipo: 'Club + rooftop', web: 'https://irreverentemadrid.es', foto: G_ROOFTOP[1], fotoReal: false, categoria: 'terraza' },
  { nombre: 'La Azotea Caribú', zona: 'Salamanca', tipo: 'Rooftop de 460m²', foto: G_ROOFTOP[0], fotoReal: false, categoria: 'terraza' },
  { nombre: 'La Guarida Creativa', zona: 'Móstoles / zona sur', tipo: 'Terraza chill-out', web: 'https://laguaridacreativa.es', foto: G_ROOFTOP[1], fotoReal: false, categoria: 'terraza' },
  { nombre: 'Areia Chill Out', zona: 'Chueca', tipo: 'Bar chill-out', web: 'https://www.areiachillout.com', foto: G_ROOFTOP[0], fotoReal: false, categoria: 'terraza' },
  { nombre: 'Lobsterie', zona: 'Chueca', tipo: 'Bar con eventos privados', web: 'https://lobsterie.com', foto: G_ROOFTOP[1], fotoReal: false, categoria: 'terraza' },
];

export const HUERTAS_LATINA: LocalInvestigado[] = [
  { nombre: 'Café Central', zona: 'Huertas', tipo: 'Sala de conciertos y jazz histórica', web: 'https://www.cafecentralmadrid.com', foto: G_BAR[1], fotoReal: false, categoria: 'huertas-latina' },
  { nombre: 'Tablao Flamenco 1911', zona: 'Huertas / Plaza Santa Ana', tipo: 'Tablao flamenco desde 1911', web: 'https://tablaoflamenco1911.com', foto: G_BAR[0], fotoReal: false, categoria: 'huertas-latina' },
  { nombre: 'ContraClub', zona: 'La Latina', tipo: 'Sala de conciertos y eventos', web: 'https://contraclub.es', foto: G_DISCO[2], fotoReal: false, categoria: 'huertas-latina' },
];

export const FINCAS: LocalInvestigado[] = [
  { nombre: 'Finca Valaurea', zona: 'Colmenar de Oreja (Madrid)', tipo: 'Finca para bodas y celebraciones', web: 'https://fincavalaurea.es', foto: G_FINCA[0], fotoReal: false, categoria: 'finca' },
  { nombre: 'Finca El Destino', zona: 'El Berrueco (Madrid)', tipo: 'Finca con piscina, sierra norte', web: 'https://fincaeldestino.com', foto: G_FINCA[1], fotoReal: false, categoria: 'finca' },
  { nombre: 'Antigua Fábrica de Harinas', zona: 'Torremocha de Jarama (Madrid)', tipo: 'Finca para eventos al aire libre', web: 'https://antiguafabricadeharinas.com', foto: G_FINCA[0], fotoReal: false, categoria: 'finca' },
  { nombre: 'Finca Los Tablares', zona: 'Colmenar de Oreja (Madrid)', tipo: 'Finca de 2 hectáreas', web: 'https://fincalostablares.com', foto: G_FINCA[1], fotoReal: false, categoria: 'finca' },
  { nombre: 'Poblado Medieval', zona: 'Puente del Congosto (a 1h de Madrid)', tipo: 'Complejo para despedidas con alojamiento', web: 'https://www.pobladomedieval.es', foto: G_FINCA[0], fotoReal: false, categoria: 'finca' },
];

export const TODOS_LOS_LOCALES_INVESTIGADOS: LocalInvestigado[] = [
  ...EMBLEMATICOS, ...SALAS, ...BARES, ...TERRAZAS, ...HUERTAS_LATINA, ...FINCAS,
];
