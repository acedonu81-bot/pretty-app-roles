import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight, MapPin } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

type CityInfo = {
  ciudad: string;
  slug: string;
  venues: string[];
  precioMin: string;
  precioMax: string;
  seasonal?: {
    badge: string;
    months: string;
    highlight: string;
    keywords: string[];
  };
};

const CITIES: Record<string, CityInfo> = {
  madrid:    { ciudad: 'Madrid',    slug: 'madrid',    venues: ['Fabrik', 'Mondo Disko', 'Teatro Barceló', 'Opium Madrid', 'Charada'],         precioMin: '60€',  precioMax: '300€' },
  barcelona: { ciudad: 'Barcelona', slug: 'barcelona', venues: ['Apolo', 'Razzmatazz', 'Sala Nitsa', 'Input', 'Pacha Barcelona'],              precioMin: '80€',  precioMax: '400€' },
  valencia:  { ciudad: 'Valencia',  slug: 'valencia',  venues: ['Lolita Valencia', 'Radio City', 'Akuarela', 'Sala Wah Wah', 'Garaje Beat'],   precioMin: '50€',  precioMax: '250€' },
  sevilla:   { ciudad: 'Sevilla',   slug: 'sevilla',   venues: ['Boss Club', 'Joy Eslava Sevilla', 'Sala Malandar', 'Antique Theatre', 'Cats'], precioMin: '40€',  precioMax: '200€' },
  malaga:    { ciudad: 'Málaga',    slug: 'malaga',    venues: ['Teatro Cervantes', 'Sala Velvet', 'Liceo', 'Sojo Club', 'Theatro Club'],        precioMin: '40€',  precioMax: '180€',
    seasonal: {
      badge: '☀️ Costa del Sol',
      months: 'Abril – Octubre',
      highlight: 'Málaga y la Costa del Sol concentran una alta demanda de profesionales para bodas en finca, terrazas de hotel y eventos privados en verano.',
      keywords: ['DJ Málaga verano', 'DJ bodas Costa del Sol', 'camareros eventos Málaga', 'DJ terraza Málaga', 'personal extra hostelería Málaga'],
    },
  },
  bilbao:    { ciudad: 'Bilbao',    slug: 'bilbao',    venues: ['Kafe Antzokia', 'Sala Bilborock', 'Cotton Club', 'La Noche', 'Fever'],         precioMin: '50€',  precioMax: '220€' },
  zaragoza:  { ciudad: 'Zaragoza',  slug: 'zaragoza',  venues: ['Sala Oasis', 'El Plata', 'Sala López', 'Casa del Loco', 'Amnesia'],           precioMin: '35€',  precioMax: '160€' },
  murcia:    { ciudad: 'Murcia',    slug: 'murcia',    venues: ['Garaje Club', 'B12', 'La Puerta Falsa', 'Sala Rambla', 'Hangar'],             precioMin: '30€',  precioMax: '150€' },
  palma:     { ciudad: 'Palma',     slug: 'palma',     venues: ['Pacha Mallorca', 'Tito\'s', 'Nikki Beach', 'Bésame', 'Es Gremi'],            precioMin: '60€',  precioMax: '350€',
    seasonal: {
      badge: '🌴 Temporada Alta',
      months: 'Mayo – Octubre',
      highlight: 'Mallorca concentra cientos de eventos privados en fincas, villas y yates de junio a septiembre. La demanda de DJs y camareros se multiplica x3 en verano.',
      keywords: ['DJ Mallorca verano', 'DJ villa Mallorca', 'camareros temporada Palma', 'DJ pool party Mallorca', 'personal extra hostelería Mallorca'],
    },
  },
  ibiza:     { ciudad: 'Ibiza',     slug: 'ibiza',     venues: ['Amnesia', 'Pacha', 'DC-10', 'Hi Ibiza', 'Ushuaïa'],                           precioMin: '150€', precioMax: '2000€',
    seasonal: {
      badge: '🎉 Temporada Ibiza',
      months: 'Mayo – Septiembre',
      highlight: 'Ibiza es el epicentro mundial de eventos privados en villa, pool parties y yates de mayo a octubre. Los mejores profesionales se agotan con semanas de antelación.',
      keywords: ['DJ villa Ibiza', 'DJ fiesta privada Ibiza', 'DJ pool party Ibiza', 'DJ eventos Ibiza', 'camareros temporada Ibiza', 'personal extra hostelería Ibiza'],
    },
  },
  alicante:      { ciudad: 'Alicante',           slug: 'alicante',      venues: ['Sala Stereo', 'Oz Club', 'Arena Discoteca', 'Chocolat Club', 'Sala Oz'],          precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '☀️ Costa Blanca', months: 'Abril – Octubre', highlight: 'Alicante y la Costa Blanca concentran bodas en finca, fiestas en villa y eventos de playa con alta demanda en verano.', keywords: ['DJ Alicante verano', 'DJ bodas Costa Blanca', 'camareros eventos Alicante'] },
  },
  granada:       { ciudad: 'Granada',            slug: 'granada',       venues: ['Sala Industrial Copera', 'El Camborio', 'Clandestino', 'Suite Granada', 'Planta Baja'], precioMin: '35€', precioMax: '180€' },
  cordoba:       { ciudad: 'Córdoba',            slug: 'cordoba',       venues: ['Teatro Cómico', 'Sala Zero', 'Week Club', 'El Tablón', 'Sala Noches'],              precioMin: '30€', precioMax: '160€' },
  valladolid:    { ciudad: 'Valladolid',         slug: 'valladolid',    venues: ['Sala Cuatro', 'Tótem Club', 'Malandar Valladolid', 'Planta Baja', 'Le Club'],       precioMin: '30€', precioMax: '150€' },
  sansebastian:  { ciudad: 'San Sebastián',      slug: 'sansebastian',  venues: ['Bataplan', 'Ku Discoteca', 'Etxekalte', 'Sala Dabadaba', 'Mau Mau'],               precioMin: '60€', precioMax: '280€' },
  santander:     { ciudad: 'Santander',          slug: 'santander',     venues: ['Sala El Tren', 'Pub Wenceslao', 'Suite Santander', 'Nuit Club', 'La Parka'],        precioMin: '35€', precioMax: '160€',
    seasonal: { badge: '🌊 Verano Cantábrico', months: 'Junio – Septiembre', highlight: 'Santander activa su temporada de eventos en verano: bodas en finca, terrazas de hotel y fiestas privadas junto al mar.', keywords: ['DJ Santander verano', 'DJ eventos Cantabria', 'camareros bodas Santander'] },
  },
  coruna:        { ciudad: 'A Coruña',           slug: 'coruna',        venues: ['Mardi Gras', 'Plastic', 'Discoteca Playa Club', 'Suite Coruña', 'Metrópolis'],      precioMin: '35€', precioMax: '170€' },
  tenerife:      { ciudad: 'Tenerife',           slug: 'tenerife',      venues: ['Papagayo Beach Club', 'Monkey Beach Club', 'Café Latino', 'Tramps Tenerife', 'Prisma'], precioMin: '50€', precioMax: '300€',
    seasonal: { badge: '🌴 Canarias Todo el Año', months: 'Todo el año', highlight: 'Tenerife tiene temporada activa los 12 meses. Sur de Tenerife concentra hoteles de lujo, bodas internacionales y eventos en villa con alta demanda constante.', keywords: ['DJ Tenerife eventos', 'DJ bodas Tenerife', 'camareros temporada Tenerife', 'DJ sur Tenerife'] },
  },
  laspalmas:     { ciudad: 'Las Palmas',         slug: 'laspalmas',     venues: ['Café Olivo', 'Discoteca Flower Power', 'Suite Las Palmas', 'La Cueva', 'Pacha Gran Canaria'], precioMin: '40€', precioMax: '250€',
    seasonal: { badge: '🌴 Gran Canaria', months: 'Todo el año', highlight: 'Las Palmas y Gran Canaria tienen demanda constante de DJs y personal de eventos todo el año, con picos en Carnaval y verano.', keywords: ['DJ Las Palmas eventos', 'DJ Gran Canaria', 'camareros eventos Las Palmas'] },
  },
  lapalma:       { ciudad: 'La Palma',           slug: 'lapalma',       venues: ['Sala El Tiempo', 'Discoteca Folías', 'Club Náutico La Palma', 'Terraza Parador', 'La Bodeguita'], precioMin: '35€', precioMax: '180€',
    seasonal: { badge: '🌋 Isla Bonita', months: 'Todo el año', highlight: 'La Palma crece en turismo de lujo y bodas en entorno natural único. La isla sufre escasez crónica de profesionales — XPEAK cubre esa demanda.', keywords: ['DJ La Palma Canarias', 'DJ bodas La Palma', 'camareros eventos La Palma', 'personal eventos isla La Palma'] },
  },
  lanzarote:     { ciudad: 'Lanzarote',          slug: 'lanzarote',     venues: ['Jameos del Agua', 'La Cueva del Diablo', 'Papagayo Lanzarote', 'Suite Lanzarote', 'Costa Teguise Club'], precioMin: '50€', precioMax: '280€',
    seasonal: { badge: '🌋 Lanzarote', months: 'Todo el año', highlight: 'Lanzarote combina turismo internacional todo el año con bodas en entornos volcánicos únicos. Alta demanda de DJs y personal para hoteles y eventos privados.', keywords: ['DJ Lanzarote eventos', 'DJ bodas Lanzarote', 'camareros hoteles Lanzarote'] },
  },
  fuerteventura: { ciudad: 'Fuerteventura',      slug: 'fuerteventura', venues: ['Waikiki Beach Club', 'Suite Fuerteventura', 'Oasis Park', 'Sands Beach Club', 'La Pared Club'],  precioMin: '40€', precioMax: '250€',
    seasonal: { badge: '🏄 Fuerteventura', months: 'Todo el año', highlight: 'Fuerteventura concentra resorts internacionales, kite surf y bodas en playa. Demanda constante de DJs y personal para eventos en hotel y fiestas privadas.', keywords: ['DJ Fuerteventura bodas', 'DJ eventos Fuerteventura', 'camareros resorts Fuerteventura'] },
  },
  menorca:       { ciudad: 'Menorca',            slug: 'menorca',       venues: ['Cova d\'en Xoroi', 'Es Cau', 'Suite Mahón', 'Casino San Clemente', 'Cafe Balear'],   precioMin: '60€', precioMax: '320€',
    seasonal: { badge: '🌿 Menorca', months: 'Mayo – Octubre', highlight: 'Menorca es destino de lujo y bodas exclusivas. Cova den Xoroi es uno de los clubs más icónicos de España. Alta demanda de profesionales para eventos privados y bodas en finca.', keywords: ['DJ Menorca bodas', 'DJ Menorca eventos', 'camareros bodas Menorca', 'DJ Cova den Xoroi'] },
  },
  formentera:    { ciudad: 'Formentera',         slug: 'formentera',    venues: ['Beso Beach', 'Juan y Andrea', 'Hostal La Savina', 'Es Pujols Club', 'Fonda Pepe'],   precioMin: '120€', precioMax: '1500€',
    seasonal: { badge: '🏝️ Formentera', months: 'Junio – Septiembre', highlight: 'Formentera es el destino más exclusivo del Mediterráneo. Fiestas privadas en villa, yates y beach clubs de lujo con DJs de primer nivel. Demanda altísima y oferta casi inexistente.', keywords: ['DJ Formentera villa', 'DJ fiesta privada Formentera', 'DJ Formentera verano', 'camareros Formentera'] },
  },
};

type CategoryInfo = {
  label: string;
  keyword: string;
  unidad: string;
  desc: (ciudad: string) => string;
  intro: (ciudad: string, venues: string[]) => string;
  faqs: (ciudad: string, precio: string) => { q: string; a: string }[];
};

const CATEGORIES: Record<string, CategoryInfo> = {
  dj: {
    label: 'DJ',
    keyword: 'DJ',
    unidad: '/hora',
    desc: (c) => {
      if (c === 'Ibiza') return 'DJ villa Ibiza, DJ fiesta privada Ibiza, DJ pool party Ibiza. DJs verificados disponibles en temporada. Flash Booking en menos de 1h. Contratos digitales. Sin comisión.';
      if (c === 'Palma') return 'DJ villa Mallorca, DJ pool party Palma, DJ fiestas privadas Mallorca. Temporada mayo-octubre. Flash Booking en menos de 1h. Sin comisión.';
      return `DJs verificados en ${c}: Tech House, Techno, Comercial y más. Flash Booking en menos de 1h. Contratos automáticos. Sin comisión.`;
    },
    intro: (c, venues) => {
      if (c === 'Ibiza') return 'Ibiza es el destino número uno para DJs y eventos privados en Europa. Villas, yates, pool parties y clubs de clase mundial como Amnesia, Pacha o DC-10. XPEAK conecta organizadores con DJs verificados disponibles en Ibiza para fiestas privadas, eventos en villa y clubs. Temporada activa de mayo a octubre.';
      if (c === 'Palma') return 'Mallorca concentra cientos de eventos privados en finca, villa y yate de mayo a octubre. XPEAK conecta organizadores con DJs verificados en Palma y toda Mallorca: desde pool parties en villas hasta bodas en finca y eventos corporativos en hotel resort.';
      return `${c} concentra una de las escenas de ocio nocturno más activas de España. Desde clubs como ${venues.slice(0,2).join(' y ')} hasta eventos privados, XPEAK conecta salas, promotoras y organizadores con DJs verificados disponibles ahora mismo.`;
    },
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un DJ en ${c}?`, a: c === 'Ibiza'
        ? `El precio de un DJ en Ibiza varía entre ${precio}/hora según el nombre del artista y el tipo de evento. Un DJ para villa privada cuesta orientativamente 300€–800€ por noche. DJs residentes de clubs reconocidos pueden superar los 2.000€. En XPEAK todos los perfiles muestran su tarifa pública.`
        : `El precio de un DJ en ${c} varía entre ${precio}/hora según experiencia y equipo. En XPEAK todos los perfiles muestran su tarifa pública antes de contactar.` },
      { q: c === 'Ibiza' ? '¿Puedo contratar DJ para una fiesta en villa de Ibiza?' : `¿Cómo funciona el Flash Booking en ${c}?`,
        a: c === 'Ibiza'
          ? 'Sí. XPEAK tiene DJs especializados en eventos privados en villa: conocen la normativa de ruido de Ibiza, trabajan con equipo silencioso o indoor y tienen experiencia con grupos internacionales. Puedes publicar tu oferta de villa y recibir candidaturas en menos de 1 hora.'
          : `Publica una oferta urgente y recibe respuestas de DJs disponibles en ${c} en menos de 60 minutos. Ideal para sustituciones de última hora.` },
      { q: '¿XPEAK cobra comisión?', a: 'No. XPEAK es completamente gratuito para salas y promotoras. El contrato se cierra directamente entre tú y el profesional.' },
      ...(c === 'Ibiza' ? [{ q: '¿Con cuánta antelación hay que contratar DJ en Ibiza en temporada?', a: 'En temporada alta (junio–septiembre) los mejores DJs de Ibiza se agotan con 2–4 semanas de antelación. Si tu evento es en julio o agosto, reserva con al menos 1 mes. Para urgencias, el Flash Booking de XPEAK puede encontrar disponibilidad en menos de 1 hora.' }] : []),
    ],
  },
  camareros: {
    label: 'Camareros',
    keyword: 'Camareros',
    unidad: '/hora',
    desc: (c) => {
      if (c === 'Ibiza') return 'Camareros temporada Ibiza: personal extra hostelería Ibiza para villas, yates y pool parties. Contratación por horas, por noches o por temporada. Flash Booking en <1h.';
      if (c === 'Palma') return 'Camareros temporada Mallorca: personal extra para villas, fincas y resorts. Por horas o por temporada. Flash Booking disponible. 0% comisión.';
      return `Camareros profesionales en ${c} para bodas, eventos de empresa y fiestas privadas. Flash Booking en menos de 1h. Contrato digital automático. Gratis para organizadores.`;
    },
    intro: (c) => {
      if (c === 'Ibiza') return 'Ibiza necesita cientos de camareros extra cada temporada (mayo–septiembre). XPEAK conecta villas, clubs, restaurantes y organizadores de eventos con camareros y bartenders verificados disponibles en Ibiza: por horas, por noches o para toda la temporada. Personal extra hostelería disponible en menos de 1 hora con Flash Booking.';
      if (c === 'Palma') return 'Mallorca concentra una alta demanda de camareros extra en temporada estival. XPEAK conecta hoteles, fincas y organizadores de eventos en Palma con personal de sala verificado disponible para bodas, pool parties y eventos corporativos. Contratación por horas o por temporada.';
      return `Encuentra camareros y personal de sala en ${c} para cualquier tipo de evento: bodas, cenas corporativas, fiestas privadas y catering. XPEAK conecta organizadores con profesionales verificados con experiencia demostrable, disponibles para acuerdos puntuales o de temporada.`;
    },
    faqs: (c, precio) => [
      { q: `¿Cuánto cobran los camareros en ${c}?`, a: c === 'Ibiza'
        ? `Los camareros en Ibiza cobran entre ${precio}/hora en temporada, con suplemento nocturno habitual de 2–4€/hora. Para eventos de villa o yate el precio puede ser superior al incluir desplazamiento y posible alojamiento. En XPEAK todos los perfiles muestran su tarifa pública.`
        : `Los camareros profesionales en ${c} cobran entre ${precio}/hora. Para eventos de boda o corporativos con servicio completo el precio suele incluir desplazamiento y uniforme.` },
      { q: `¿Cuántos camareros necesito para mi evento en ${c}?`, a: 'La regla estándar es 1 camarero por cada 15-20 personas en formato cóctel, y 1 por cada 8-10 en cena sentada con servicio completo.' },
      { q: c === 'Ibiza' ? '¿Puedo contratar camareros por temporada en Ibiza?' : '¿Puedo contratar camareros para una sola noche?',
        a: c === 'Ibiza'
          ? 'Sí. XPEAK permite acuerdos de temporada completa (mayo–octubre) con contrato digital automático. También contrataciones puntuales para una sola noche o evento. El Flash Booking cubre urgencias en menos de 1 hora.'
          : `Sí. XPEAK permite contrataciones puntuales en ${c}. El Flash Booking notifica a los profesionales disponibles en tu zona al instante.` },
    ],
  },
  staff: {
    label: 'Staff de Eventos',
    keyword: 'Staff',
    unidad: '/hora',
    desc: (c) => `Staff profesional en ${c} para eventos, discotecas y festivales: hostesses, RRPP, promotores y coordinadores. Flash Booking en menos de 1h. Sin comisión.`,
    intro: (c) => `XPEAK conecta salas, festivales y organizadores con staff profesional verificado en ${c}: hostesses, relaciones públicas, coordinadores de sala, promotores y personal de producción. Contrato digital en minutos, sin intermediarios.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta el staff de eventos en ${c}?`, a: `El precio del staff profesional en ${c} varía entre ${precio}/hora según el perfil: hostesses desde 15€, coordinadores desde 25€, RRPP con lista propia desde 100€/noche.` },
      { q: `¿Puedo contratar staff para un festival en ${c}?`, a: `Sí. XPEAK tiene perfiles con experiencia en festivales de música en ${c} y alrededores. Puedes contratar desde 1 persona hasta equipos completos de producción.` },
      { q: '¿El staff tiene experiencia en eventos nocturnos?', a: 'Todos los perfiles en XPEAK incluyen historial de venues y referencias verificadas de eventos anteriores.' },
    ],
  },
  fotografo: {
    label: 'Fotógrafo',
    keyword: 'Fotógrafo',
    unidad: '/evento',
    desc: (c) => `Fotógrafos profesionales en ${c} para bodas, eventos nocturnos y celebraciones. Perfiles verificados, entrega rápida. Flash Booking disponible. Sin comisión.`,
    intro: (c) => `Encuentra fotógrafos y videógrafos especializados en eventos en ${c}: bodas, clubs, festivales y eventos corporativos. XPEAK conecta organizadores con profesionales verificados, con portfolio real y disponibilidad confirmada.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un fotógrafo de eventos en ${c}?`, a: `Un fotógrafo profesional de eventos en ${c} cobra entre ${precio} por evento completo. Las bodas suelen incluir ceremonia, cóctel y banquete. Eventos de una noche desde 300€.` },
      { q: `¿Puedo contratar fotógrafo y videógrafo juntos en ${c}?`, a: `Sí. Muchos perfiles en XPEAK ofrecen pack foto + vídeo con descuento. Contratar ambos con el mismo profesional suele ser un 20% más económico.` },
      { q: '¿En cuánto tiempo recibo las fotos?', a: 'La mayoría de fotógrafos en XPEAK entregan una selección de fotos editadas en 2–5 días y el reportaje completo en 2–4 semanas. Los plazos están especificados en cada perfil.' },
    ],
  },
  catering: {
    label: 'Catering',
    keyword: 'Catering',
    unidad: '/persona',
    desc: (c) => `Catering profesional en ${c} para bodas, eventos corporativos y celebraciones privadas. Menús personalizados, servicio completo, contratos automáticos. Sin comisión.`,
    intro: (c) => `Encuentra proveedores de catering para cualquier tipo de evento en ${c}: banquetes de boda, coffee breaks corporativos, cenas de gala y fiestas privadas. XPEAK te conecta directamente con el proveedor, sin intermediarios ni comisiones.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta el catering para una boda en ${c}?`, a: `El catering para bodas en ${c} cuesta entre ${precio} por comensal según el menú y el servicio. Banquete sentado completo con vinos: 70€–120€/persona. Bufé: 50€–80€/persona.` },
      { q: `¿Qué incluye un servicio de catering completo en ${c}?`, a: 'Un catering completo incluye aperitivo, cóctel, banquete, barra libre, montaje, personal de sala y limpieza. En XPEAK cada proveedor detalla exactamente qué está incluido.' },
      { q: '¿Con cuánta antelación debo contratar el catering?', a: 'Para bodas, mínimo 3–6 meses. Para eventos corporativos de menos de 50 personas el Flash Booking puede conseguirte disponibilidad en menos de una semana.' },
    ],
  },
  'disco-movil': {
    label: 'Disco Móvil',
    keyword: 'Disco Móvil',
    unidad: '/evento',
    desc: (c) => `Contratar disco móvil en ${c}: DJs con equipo completo (sonido, luces, humo) para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.`,
    intro: (c) => `Una disco móvil en ${c} incluye DJ profesional + equipo completo de sonido, iluminación y efectos. Ideal para bodas, comuniones, cumpleaños y fiestas privadas donde el local no tiene instalación propia. XPEAK conecta organizadores con DJs que llevan su propio setup listo para actuar.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta una disco móvil en ${c}?`, a: `Una disco móvil completa en ${c} cuesta entre ${precio} por evento, incluyendo DJ, equipo de sonido, luces y efectos. El precio varía según la duración y el nivel del equipo.` },
      { q: '¿Qué diferencia hay entre un DJ y una disco móvil?', a: 'Un DJ de disco móvil trae su propio equipo completo: altavoces, mesa de mezclas, luces de colores, máquina de humo y cañón de confeti. No necesitas contratar técnico de sonido ni alquilar equipo aparte.' },
      { q: '¿La disco móvil sirve para bodas?', a: 'Sí, es la opción más popular para bodas en fincas rurales y locales sin equipo propio. El DJ llega con todo el material, lo monta antes del evento y lo recoge al terminar.' },
    ],
  },
};

export default function CityLanding() {
  const { ciudad } = useParams<{ ciudad: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const cityData = ciudad ? CITIES[ciudad.toLowerCase()] : null;
  if (!cityData) { navigate('/'); return null; }

  // Detect category from pathname: /contratar-dj/madrid → 'dj'
  const categorySlug = pathname.split('/')[1]?.replace('contratar-', '') ?? 'dj';
  const catData = CATEGORIES[categorySlug] ?? CATEGORIES['dj'];

  const precio = `${cityData.precioMin}–${cityData.precioMax}`;
  const canonicalBase = `/contratar-${categorySlug}/${cityData.slug}`;
  const h1 = `Contratar ${catData.keyword} en ${cityData.ciudad}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: h1,
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'City', name: cityData.ciudad },
    description: catData.desc(cityData.ciudad),
    url: `https://xpeak.es${canonicalBase}`,
    serviceType: `Contratación de ${catData.keyword}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Registro gratuito para salas y promotoras' },
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: catData.faqs(cityData.ciudad, precio).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: `Contratar ${catData.keyword}`, item: `https://xpeak.es/contratar-${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: cityData.ciudad, item: `https://xpeak.es${canonicalBase}` },
    ],
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `XPEAK — ${catData.keyword} en ${cityData.ciudad}`,
    description: catData.desc(cityData.ciudad),
    url: `https://xpeak.es${canonicalBase}`,
    image: 'https://xpeak.es/og-image.jpg',
    telephone: '',
    email: 'hola@xpeak.es',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityData.ciudad,
      addressCountry: 'ES',
    },
    areaServed: { '@type': 'City', name: cityData.ciudad },
    priceRange: `${cityData.precioMin} – ${cityData.precioMax}`,
    openingHours: 'Mo-Su 00:00-24:00',
    sameAs: ['https://www.instagram.com/xpeak.es'],
  };

  return (
    <>
      <Helmet>
        <title>{h1} — XPEAK | Directorio Profesional de Eventos</title>
        <meta name="description" content={catData.desc(cityData.ciudad)} />
        <link rel="canonical" href={`https://xpeak.es${canonicalBase}`} />
        <meta property="og:title" content={`${h1} — XPEAK`} />
        <meta property="og:description" content={catData.desc(cityData.ciudad)} />
        <meta property="og:url" content={`https://xpeak.es${canonicalBase}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessData)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>Precios</a>
            <a href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              {cityData.ciudad} · España
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{h1}</h1>
          <p className="text-sm sm:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {catData.intro(cityData.ciudad, cityData.venues)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/auth"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Publicar oferta gratis
            </a>
            <a href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver directorio <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Seasonal banner — only for cities with seasonal data */}
        {cityData.seasonal && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
            <div className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-black px-2.5 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {cityData.seasonal.badge}
                </span>
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{cityData.seasonal.months}</span>
              </div>
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {cityData.seasonal.highlight}
              </p>
            </div>
            {/* Seasonal keyword chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {cityData.seasonal.keywords.map(k => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ background: 'rgba(212,175,55,0.06)', color: 'rgba(212,175,55,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: `Precio ${catData.keyword} en ${cityData.ciudad}`, value: `${precio}${catData.unidad}`, icon: <Star size={16} /> },
              { label: 'Flash Booking', value: 'En menos de 1h', icon: <Zap size={16} /> },
              { label: 'Comisión XPEAK', value: '0% para salas', icon: <Shield size={16} /> },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {cityData.venues.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Espacios y venues en {cityData.ciudad}</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Profesionales con experiencia en los principales espacios de la ciudad.
            </p>
            <div className="flex flex-wrap gap-2">
              {cityData.venues.map(v => (
                <span key={v} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                  {v}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Cómo contratar {catData.keyword} en {cityData.ciudad} con XPEAK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Crea tu cuenta gratis', body: `Regístrate como sala, promotora u organizador en menos de 2 minutos. Sin tarjeta.` },
              { step: '02', title: 'Publica tu oferta', body: `Describe el evento en ${cityData.ciudad}, fecha, horario y presupuesto. Flash Booking lo distribuye al instante.` },
              { step: '03', title: 'Cierra el contrato', body: `Elige al profesional, firma el contrato digital con un clic. PDF listo para facturación.` },
            ].map(s => (
              <div key={s.step} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black mb-3" style={{ color: 'rgba(212,175,55,0.25)' }}>{s.step}</p>
                <p className="text-sm font-bold mb-1.5">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes — {catData.keyword} en {cityData.ciudad}</h2>
          <div className="space-y-4">
            {catData.faqs(cityData.ciudad, precio).map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Buscas {catData.keyword} en {cityData.ciudad}?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Únete gratis — sin comisión, contratos automáticos, Flash Booking en menos de 1h.
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Empezar gratis en {cityData.ciudad}
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
