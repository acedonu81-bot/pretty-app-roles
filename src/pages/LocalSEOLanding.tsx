import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Zap, Star, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

// ─── Ciudades ────────────────────────────────────────────────────────────────
const CITIES: Record<string, {
  nombre: string; geo: [number, number]; barrios: string[];
  venues: string[]; precioMin: string; precioMax: string; provincia: string;
}> = {
  madrid:    { nombre: 'Madrid',    geo: [40.4168, -3.7038], provincia: 'Madrid',    barrios: ['Malasaña', 'Lavapiés', 'Chueca', 'Salamanca', 'La Latina'], venues: ['Fabrik', 'Mondo Disko', 'Barceló', 'Opium', 'Charada'],     precioMin: '60€',  precioMax: '350€' },
  barcelona: { nombre: 'Barcelona', geo: [41.3851,  2.1734], provincia: 'Barcelona', barrios: ['Eixample', 'Gràcia', 'El Born', 'Poblenou', 'Raval'],       venues: ['Apolo', 'Razzmatazz', 'Nitsa', 'Input', 'Pacha'],          precioMin: '80€',  precioMax: '450€' },
  sevilla:   { nombre: 'Sevilla',   geo: [37.3891, -5.9845], provincia: 'Sevilla',   barrios: ['Triana', 'El Arenal', 'Santa Cruz', 'Nervión', 'Macarena'], venues: ['Boss Club', 'Joy Eslava', 'Malandar', 'Antique', 'Cats'],   precioMin: '40€',  precioMax: '220€' },
  valencia:  { nombre: 'Valencia',  geo: [39.4699, -0.3763], provincia: 'Valencia',  barrios: ['Ruzafa', 'El Carmen', 'Benimaclet', 'Malvarrosa', 'Cabanyal'], venues: ['Lolita', 'Radio City', 'Akuarela', 'Wah Wah', 'Garaje'], precioMin: '50€',  precioMax: '260€' },
  malaga:    { nombre: 'Málaga',    geo: [36.7213, -4.4217], provincia: 'Málaga',    barrios: ['Centro', 'La Malagueta', 'Soho', 'Pedregalejo', 'El Palo'],  venues: ['Velvet', 'Liceo', 'Sojo Club', 'Theatro', 'Cervantes'],    precioMin: '35€',  precioMax: '200€' },
  bilbao:    { nombre: 'Bilbao',    geo: [43.2630, -2.9350], provincia: 'Vizcaya',   barrios: ['Casco Viejo', 'Indautxu', 'Deusto', 'Amézola', 'Zorrotza'], venues: ['Kafe Antzokia', 'Bilborock', 'Cotton Club', 'La Noche', 'Fever'], precioMin: '50€', precioMax: '240€' },
};

// ─── Categorías ──────────────────────────────────────────────────────────────
const CATS: Record<string, {
  label: string; labelPlural: string; role: string; unidad: string;
  emoji: string;
  h1: (ciudad: string) => string;
  desc: (ciudad: string, pMin: string, pMax: string) => string;
  intro: (ciudad: string, barrios: string[], venues: string[]) => string;
  beneficios: string[];
  pasos: { t: string; d: string }[];
  faqs: (ciudad: string, pMin: string, pMax: string) => { q: string; a: string }[];
  relacionados: { href: string; label: string }[];
}> = {
  dj: {
    label: 'DJ', labelPlural: 'DJs', role: 'dj', unidad: '/hora', emoji: '🎧',
    h1: (c) => `Contratar DJ en ${c} 2026 — Bodas, Eventos y Clubs desde ${c === 'Málaga' ? '35€' : '60€'}/h`,
    desc: (c, pMin, pMax) => `DJs profesionales en ${c} para bodas, eventos privados y clubs. Tarifas desde ${pMin}/hora. Portfolio y géneros visibles. Respuesta en menos de 1h. Sin comisiones. XPEAK.`,
    intro: (c, barrios, venues) => `${c} tiene una de las escenas de eventos y entretenimiento más activas de España. Desde clubs de referencia como ${venues.slice(0,2).join(' y ')} hasta eventos privados en ${barrios.slice(0,2).join(' y ')}, la demanda de DJs profesionales es constante durante todo el año. En XPEAK encontrarás DJs verificados con residencias, festivales y bodas en su historial — con tarifa pública, géneros y disponibilidad real.`,
    beneficios: ['Perfiles verificados con historial real de eventos', 'Tarifa pública antes de contactar — sin sorpresas', 'Flash Booking: respuesta en menos de 60 minutos', 'Contrato digital automático incluido', 'DJs con equipo propio disponibles para toda la provincia', 'Géneros: Tech House, Techno, Comercial, Reggaeton, Afro House y más'],
    pasos: [
      { t: 'Publica tu oferta', d: 'Indica fecha, horario, tipo de evento y presupuesto. Sin registro previo.' },
      { t: 'Recibe propuestas', d: 'DJs disponibles en tu zona responden en menos de 60 minutos.' },
      { t: 'Firma el contrato', d: 'Contrato digital automático, sin burocracia ni intermediarios.' },
    ],
    faqs: (c, pMin, pMax) => [
      { q: `¿Cuánto cobra un DJ en ${c}?`, a: `Un DJ profesional en ${c} cobra entre ${pMin} y ${pMax}/hora. Los DJs con residencias en clubs de referencia están en la parte alta del rango. DJs emergentes o para eventos privados pueden estar desde ${pMin}/sesión completa.` },
      { q: `¿Dónde encuentro DJs disponibles hoy en ${c}?`, a: `En XPEAK puedes publicar una oferta urgente y recibir respuestas de DJs disponibles en ${c} en menos de 60 minutos. El Flash Booking está pensado exactamente para eso.` },
      { q: `¿Qué géneros de música tienen los DJs de ${c}?`, a: `Los DJs en XPEAK de ${c} cubren todos los estilos: Tech House, Techno, Deep House, Comercial, Reggaeton, Afro House, Nu Disco y más. Cada perfil especifica sus géneros principales.` },
      { q: `¿Los DJs de ${c} tienen su propio equipo?`, a: 'Muchos DJs en XPEAK incluyen equipo propio (CDJ-3000, mixer, monitores). Cada perfil indica si llevan equipo o necesitan instalación técnica del local.' },
      { q: '¿XPEAK cobra comisión por la contratación?', a: 'No. XPEAK es gratuito para salas, promotoras y organizadores. El acuerdo económico se cierra directamente entre tú y el DJ.' },
    ],
    relacionados: [
      { href: '/blog/cuanto-cobra-un-dj-en-espana', label: 'Cuánto cobra un DJ en España 2026' },
      { href: '/blog/dj-para-bodas-vs-discoteca', label: 'DJ para bodas vs discoteca' },
      { href: '/blog/disco-movil-para-comuniones', label: 'Disco móvil para comuniones' },
    ],
  },
  camareros: {
    label: 'Camarero', labelPlural: 'Camareros', role: 'staff', unidad: '/hora', emoji: '🍾',
    h1: (c) => `Camareros en ${c} para Bodas y Eventos 2026 — Desde ${c === 'Málaga' ? '35€' : '40€'}/h`,
    desc: (c, pMin, pMax) => `Camareros y barmans verificados en ${c} para bodas, eventos corporativos y fiestas privadas. Desde ${pMin}/hora. Con uniforme. Respuesta inmediata. Sin comisiones. XPEAK.`,
    intro: (c, barrios, venues) => `Encontrar camareros de confianza para un evento en ${c} puede ser complicado. En XPEAK tienes acceso a personal de sala verificado con experiencia en bodas, eventos corporativos y fiestas privadas en toda la provincia. Desde camareros de sala hasta barmans especializados en coctelería, todos con referencias y disponibilidad confirmada.`,
    beneficios: ['Personal verificado con experiencia en bodas y corporativos', 'Uniforme propio incluido en la mayoría de perfiles', 'Disponibles para contrataciones puntuales (1 noche o más)', 'Barmans con coctelería clásica y gin tonics', 'Ratio orientativo: 1 camarero / 8-10 invitados en cena', 'Contrato digital automático sin burocracia'],
    pasos: [
      { t: 'Indica cuántos necesitas', d: 'Fecha, número de invitados, tipo de servicio (sala, barra, cóctel).' },
      { t: 'Recibe disponibilidad', d: 'El sistema notifica al personal disponible en tu zona al instante.' },
      { t: 'Confirma y firma', d: 'Contrato digital con condiciones claras. Sin sorpresas el día del evento.' },
    ],
    faqs: (c, pMin, pMax) => [
      { q: `¿Cuánto cobran los camareros en ${c}?`, a: `Los camareros profesionales en ${c} cobran entre ${pMin} y ${pMax}/hora. Para eventos con desplazamiento fuera de la ciudad puede aplicarse un suplemento. Algunos perfiles ofrecen precio cerrado por jornada completa.` },
      { q: `¿Cuántos camareros necesito para mi evento en ${c}?`, a: 'El ratio estándar es 1 camarero por cada 8-10 invitados en servicio de mesa sentada, y 1 por cada 12-15 en cóctel de pie. Para una boda de 100 personas necesitarás entre 8 y 12 camareros.' },
      { q: '¿Puedo contratar camareros solo para una noche?', a: `Sí. XPEAK permite contrataciones puntuales en ${c} para un solo evento. El Flash Booking notifica al personal disponible en tu zona al instante.` },
      { q: '¿Los camareros incluyen uniforme?', a: 'La mayoría de perfiles en XPEAK especifican si incluyen uniforme propio (camisa blanca, pantalón negro, delantal). Puedes filtrar por esta característica al buscar.' },
      { q: '¿Hay barmans especializados disponibles en ${c}?', a: `Sí. En XPEAK hay perfiles de barmans en ${c} especializados en coctelería clásica, gin tonics y barra libre para bodas y eventos privados.` },
    ],
    relacionados: [
      { href: '/blog/cuanto-cobra-un-camarero-de-eventos', label: 'Cuánto cobra un camarero de eventos' },
      { href: '/blog/cuantos-camareros-necesito-para-mi-boda', label: 'Cuántos camareros necesito para mi boda' },
      { href: '/blog/contratar-barman-evento-privado', label: 'Contratar barman para evento privado' },
    ],
  },
  fotografo: {
    label: 'Fotógrafo', labelPlural: 'Fotógrafos', role: 'media', unidad: '/evento', emoji: '📷',
    h1: (c) => `Fotógrafos en ${c} para Bodas y Eventos 2026 — Desde ${c === 'Málaga' ? '35€' : '50€'}`,
    desc: (c, pMin, pMax) => `Fotógrafos verificados en ${c} con portfolio real. Bodas, eventos corporativos y nocturnos. Desde ${pMin} por evento. Respuesta en menos de 1h. Gratis para organizadores. XPEAK.`,
    intro: (c, barrios, venues) => `Encontrar un fotógrafo de confianza para tu evento en ${c} es fácil con XPEAK. Perfiles verificados con portfolio real de bodas, eventos de empresa y sesiones en clubs. Desde la ${barrios[0]} hasta ${barrios[2]}, cuentas con fotógrafos especializados en cualquier tipo de luz y formato.`,
    beneficios: ['Portfolio real visible antes de contratar', 'Fotógrafos especializados en boda, noche y corporativo', 'Entrega de selección editada en 2-5 días', 'Pack foto + vídeo disponible con descuento', 'Cobertura en toda la provincia y alrededores', 'Contrato digital con cláusulas claras de entrega'],
    pasos: [
      { t: 'Revisa el portfolio', d: 'Cada fotógrafo muestra su trabajo real antes de que tomes ninguna decisión.' },
      { t: 'Solicita disponibilidad', d: 'Flash Booking para fechas urgentes. Reserva anticipada para bodas.' },
      { t: 'Firma el contrato', d: 'Condiciones de entrega, formato de archivos y derechos de imagen incluidos.' },
    ],
    faqs: (c, pMin, pMax) => [
      { q: `¿Cuánto cuesta un fotógrafo de eventos en ${c}?`, a: `Un fotógrafo profesional en ${c} cobra entre ${pMin} y ${pMax} por evento. Bodas con ceremonia completa + banquete: desde 900€. Eventos de una noche: desde ${pMin}.` },
      { q: `¿Cuándo recibo las fotos de mi evento en ${c}?`, a: 'La mayoría de fotógrafos en XPEAK entregan una selección de fotos editadas en 2–5 días y el reportaje completo en 2–4 semanas. Los plazos están especificados en cada perfil.' },
      { q: `¿Hay fotógrafos disponibles para eventos nocturnos en ${c}?`, a: `Sí. XPEAK tiene fotógrafos especializados en fotografía nocturna y de discoteca en ${c}, con equipo preparado para condiciones de baja luz y flash de escenario.` },
      { q: '¿Puedo contratar fotógrafo y videógrafo juntos?', a: 'Muchos perfiles en XPEAK ofrecen pack foto + vídeo con un descuento del 15–25% respecto a contratar ambos por separado.' },
      { q: '¿Los fotógrafos de XPEAK tienen seguro de responsabilidad civil?', a: 'Se recomienda verificarlo directamente con el profesional. Muchos fotógrafos autónomos en España tienen seguro RC. Puedes preguntarlo antes de firmar.' },
    ],
    relacionados: [
      { href: '/blog/contratar-fotografo-de-bodas', label: 'Cómo contratar fotógrafo de bodas' },
      { href: '/blog/fotografia-eventos-nocturnos', label: 'Fotografía en eventos nocturnos' },
      { href: '/blog/videografo-bodas-precio', label: 'Videógrafo para bodas: precio' },
    ],
  },
  maquillaje: {
    label: 'Maquilladora', labelPlural: 'Maquilladoras', role: 'makeup', unidad: '/servicio', emoji: '💄',
    h1: (c) => `Maquilladoras en ${c} — Maquillaje para bodas y eventos`,
    desc: (c, pMin, pMax) => `Maquilladoras profesionales en ${c} para bodas, fotografía y eventos. Prueba nupcial incluida. Maquillaje artístico y editorial. Desde ${pMin}. XPEAK.`,
    intro: (c, barrios, venues) => `En ${c} encontrarás maquilladoras especializadas en looks nupciales, editoriales y artísticos. Desde el maquillaje de novia más natural hasta caracterizaciones para fotografía y moda, XPEAK reúne a las mejores profesionales de la ciudad con portfolio verificado y disponibilidad real.`,
    beneficios: ['Especialistas en maquillaje nupcial, artístico y editorial', 'Prueba previa incluida en la mayoría de paquetes de boda', 'Portfolio visual verificado antes de contratar', 'Disponibles para equipos completos (novia + damas + familia)', 'Productos de alta gama: MAC, Charlotte Tilbury, Armani', 'Servicio a domicilio disponible en toda la provincia'],
    pasos: [
      { t: 'Revisa el portfolio', d: 'Cada maquilladora muestra su trabajo real: nupcial, editorial, artístico.' },
      { t: 'Reserva con antelación', d: 'Las mejores profesionales se reservan con 3-6 meses para bodas en temporada alta.' },
      { t: 'Confirma el look', d: 'Prueba previa incluida para bodas. El día del evento sin sorpresas.' },
    ],
    faqs: (c, pMin, pMax) => [
      { q: `¿Cuánto cobra una maquilladora de bodas en ${c}?`, a: `Una maquilladora nupcial en ${c} cobra entre ${pMin} y ${pMax} por servicio completo (prueba + día de la boda). El precio varía según experiencia, productos utilizados y si incluye peinado.` },
      { q: `¿Con cuánta antelación reservar maquilladora en ${c}?`, a: 'Para bodas en temporada alta (mayo–octubre) se recomienda reservar con 4–6 meses de antelación. Las profesionales más solicitadas en ${c} se agotan antes.' },
      { q: '¿El servicio incluye prueba previa?', a: 'La mayoría de maquilladoras para bodas incluyen una sesión de prueba 1–2 semanas antes. Confirma siempre que está incluida en el presupuesto.' },
      { q: `¿Hay maquilladoras artísticas disponibles en ${c}?`, a: `Sí. En XPEAK hay perfiles especializados en maquillaje artístico y caracterización en ${c} para fotografía, moda, teatro y eventos especiales.` },
      { q: '¿La maquilladora viene al domicilio o hay que ir a su estudio?', a: 'Depende del perfil. Muchas maquilladoras en XPEAK ofrecen servicio a domicilio para bodas (especialmente el día del evento). El desplazamiento puede tener un suplemento.' },
    ],
    relacionados: [
      { href: '/blog/maquillaje-nupcial-precio-guia', label: 'Maquillaje nupcial: precios y guía' },
      { href: '/blog/tendencias-bodas-2026', label: 'Tendencias en bodas 2026' },
      { href: '/blog/cuanto-cuesta-una-boda-en-espana', label: 'Cuánto cuesta una boda en España' },
    ],
  },
  staff: {
    label: 'Staff', labelPlural: 'Staff de eventos', role: 'staff', unidad: '/hora', emoji: '🎪',
    h1: (c) => `Staff de eventos en ${c} — Hostesses, RRPP y coordinadores`,
    desc: (c, pMin, pMax) => `Staff profesional en ${c} para discotecas, festivales y eventos: hostesses, RRPP, promotores y coordinadores. Flash Booking. Desde ${pMin}/hora. XPEAK.`,
    intro: (c, barrios, venues) => `Gestionar el personal de un evento en ${c} requiere perfiles muy específicos: hostesses para recepción VIP, RRPP con lista propia, coordinadores de sala y promotores con red de contactos local. XPEAK tiene todos esos perfiles verificados, con historial de venues como ${venues.slice(0,2).join(' y ')} y disponibilidad para contrataciones puntuales o de temporada.`,
    beneficios: ['Hostesses con experiencia en eventos de alto nivel', 'RRPP con lista propia y red de contactos local', 'Coordinadores de sala con experiencia en festivales', 'Promotores verificados con métricas de asistencia', 'Disponibles para contrataciones puntuales o temporada completa', 'Contrato digital con cláusulas de rendimiento'],
    pasos: [
      { t: 'Define el perfil', d: 'Hostess, RRPP, coordinador, promotor — indica exactamente qué necesitas.' },
      { t: 'Recibe candidatos', d: 'Perfiles verificados con historial de eventos similares al tuyo.' },
      { t: 'Contrata y coordina', d: 'Contrato digital. El staff llega preparado y con el briefing claro.' },
    ],
    faqs: (c, pMin, pMax) => [
      { q: `¿Cuánto cuesta contratar staff de eventos en ${c}?`, a: `El precio del staff en ${c} varía entre ${pMin} y ${pMax}/hora según el perfil: hostesses desde 15€/h, coordinadores desde 25€/h, RRPP con lista propia desde 100€/noche + % sobre lista.` },
      { q: `¿Puedo contratar staff para una sola noche en ${c}?`, a: `Sí. XPEAK permite contrataciones puntuales. El Flash Booking notifica al personal disponible en ${c} al instante para coberturas urgentes.` },
      { q: '¿Qué diferencia hay entre hostess y azafata?', a: 'Una hostess trabaja en eventos privados (recepciones, VIP, protocolo). Una azafata suele trabajar en ferias, congresos y eventos corporativos. Ambos perfiles están disponibles en XPEAK.' },
      { q: `¿Los RRPP de ${c} trabajan con lista propia?`, a: `Sí. Hay perfiles de RRPP en XPEAK con lista propia consolidada en ${c} y métricas de asistencia verificables. Ideales para discotecas que quieren crecer su base de clientes.` },
      { q: '¿XPEAK cobra comisión por las contrataciones de staff?', a: 'No. XPEAK es gratuito para promotoras, discotecas y organizadores. El trato económico se cierra directamente con el profesional.' },
    ],
    relacionados: [
      { href: '/blog/staff-de-discoteca-funciones-y-salario', label: 'Staff de discoteca: funciones y salario' },
      { href: '/blog/precio-azafatas-eventos-espana', label: 'Precio de azafatas para eventos' },
      { href: '/blog/promotores-de-eventos-que-hacen', label: 'Promotores de eventos: qué hacen' },
    ],
  },
};

// ─── Mapeo slug → categoría ──────────────────────────────────────────────────
const SLUG_TO_CAT: Record<string, string> = {
  dj: 'dj',
  camareros: 'camareros',
  fotografo: 'fotografo',
  maquillaje: 'maquillaje',
  staff: 'staff',
};

export default function LocalSEOLanding() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Parse "/dj-madrid" → cat="dj", city="madrid"
  const slug = pathname.replace(/^\//, ''); // remove leading slash
  const dashIdx = slug.indexOf('-');
  const catSlug = dashIdx > -1 ? slug.slice(0, dashIdx) : slug;
  const citySlug = dashIdx > -1 ? slug.slice(dashIdx + 1) : '';

  const catKey = SLUG_TO_CAT[catSlug];
  const cityData = CITIES[citySlug];
  const catData = catKey ? CATS[catKey] : null;

  if (!catData || !cityData) { navigate('/'); return null; }

  const { nombre, geo, barrios, venues, precioMin, precioMax, provincia } = cityData;
  const precio = `${precioMin}–${precioMax}`;
  const canonical = `https://xpeak.es/${slug}`;
  const h1 = catData.h1(nombre);
  const desc = catData.desc(nombre, precioMin, precioMax);

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `XPEAK — ${catData.labelPlural} en ${nombre}`,
    description: desc,
    url: canonical,
    image: 'https://xpeak.es/og-image.jpg',
    email: 'hola@xpeak.es',
    address: { '@type': 'PostalAddress', addressLocality: nombre, addressRegion: provincia, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: geo[0], longitude: geo[1] },
    areaServed: { '@type': 'City', name: nombre },
    priceRange: precio,
    openingHours: 'Mo-Su 00:00-24:00',
    sameAs: ['https://www.instagram.com/xpeak.es'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: catData.faqs(nombre, precioMin, precioMax).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: catData.labelPlural, item: `https://xpeak.es/contratar-${catSlug}` },
      { '@type': 'ListItem', position: 3, name: nombre, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{h1} — XPEAK</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${h1} — XPEAK`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Precios</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={13} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              {nombre} · España
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">{h1}</h1>
          <p className="text-sm sm:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {catData.intro(nombre, barrios, venues)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/auth" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Publicar oferta gratis
            </a>
            <a href={`/contratar-${catSlug}/${citySlug}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver {catData.labelPlural} disponibles <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Stats bar */}
        <div className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.02)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: <Star size={15} />, label: `Precio en ${nombre}`, value: `${precio}${catData.unidad}` },
              { icon: <Zap size={15} />, label: 'Flash Booking', value: 'Respuesta en < 1h' },
              { icon: <Shield size={15} />, label: 'Comisión', value: '0% para organizadores' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficios */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl sm:text-2xl font-black mb-6">
            Por qué contratar {catData.labelPlural.toLowerCase()} en {nombre} con XPEAK
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catData.beneficios.map(b => (
              <div key={b} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Barrios */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl sm:text-2xl font-black mb-2">{catData.labelPlural} en los principales barrios de {nombre}</h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>Cobertura en toda la ciudad y alrededores.</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {barrios.map(b => (
              <span key={b} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}>
                {b}
              </span>
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-2">Venues y espacios en {nombre}</h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>Profesionales con experiencia en los principales espacios de la ciudad.</p>
          <div className="flex flex-wrap gap-2">
            {venues.map(v => (
              <span key={v} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(212,175,55,0.8)' }}>
                {v}
              </span>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl sm:text-2xl font-black mb-8">Cómo contratar {catData.labelPlural.toLowerCase()} en {nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {catData.pasos.map((p, i) => (
                <div key={p.t} className="p-5 rounded-xl relative"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-3"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-black mb-1">{p.t}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl sm:text-2xl font-black mb-6">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {catData.faqs(nombre, precioMin, precioMax).map(f => (
              <details key={f.q} className="group rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <summary className="px-5 py-4 text-sm font-bold cursor-pointer list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-xs flex-shrink-0" style={{ color: '#D4AF37' }}>+</span>
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-xs leading-relaxed" style={{ color: '#8E8EA0' }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Artículos relacionados */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-lg font-black mb-4">Guías relacionadas</h2>
          <div className="flex flex-wrap gap-3">
            {catData.relacionados.map(r => (
              <a key={r.href} href={r.href}
                className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
                {r.label} →
              </a>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="p-8 rounded-2xl text-center"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <div className="text-3xl mb-3">{catData.emoji}</div>
            <h2 className="text-xl font-black mb-2">
              ¿Eres {catData.label.toLowerCase()} en {nombre}?
            </h2>
            <p className="text-sm mb-5" style={{ color: '#8E8EA0' }}>
              Crea tu perfil en XPEAK y recibe solicitudes de eventos en toda la provincia. Es gratis.
            </p>
            <a href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Crear perfil profesional gratis
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
