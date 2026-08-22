import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight, Music, Users, Camera, MapPin, Scissors, Sparkles, Megaphone, UtensilsCrossed, Shirt } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

const BLOG_LINKS: Record<string, { href: string; emoji: string; title: string; desc: string }[]> = {
  dj: [
    { href: '/blog/cuanto-cobra-un-dj-en-espana', emoji: '💰', title: '¿Cuánto cobra un DJ en España? Precios 2026', desc: 'Tarifas reales por tipo de evento, duración y ciudad.' },
    { href: '/blog/dj-para-bodas-vs-discoteca', emoji: '🆚', title: 'DJ de boda vs DJ de discoteca', desc: 'Diferencias clave, habilidades y cómo elegir el perfil correcto para tu evento.' },
  ],
  camareros: [
    { href: '/blog/cuanto-cobra-un-camarero-de-eventos', emoji: '💰', title: '¿Cuánto cobra un camarero de eventos?', desc: 'Precios por hora, por evento y ratios boda vs corporativo.' },
    { href: '/blog/cuantos-camareros-necesito-para-mi-boda', emoji: '💒', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y tipo de servicio.' },
  ],
  catering: [
    { href: '/blog/catering-para-eventos-de-empresa', emoji: '🏢', title: 'Catering para eventos de empresa 2026', desc: 'Formatos, precios por persona y cómo elegir el servicio correcto.' },
    { href: '/blog/cuanto-cuesta-una-boda-en-espana', emoji: '💒', title: '¿Cuánto cuesta una boda en España?', desc: 'Desglose por partidas: catering, DJ, personal y más.' },
  ],
  fotografo: [
    { href: '/blog/contratar-fotografo-de-bodas', emoji: '📸', title: 'Cómo contratar un fotógrafo de bodas 2026', desc: 'Precios por ciudad, qué incluye y cómo elegir el profesional.' },
    { href: '/blog/cuanto-cuesta-una-boda-en-espana', emoji: '💒', title: '¿Cuánto cuesta una boda en España?', desc: 'Guía completa de presupuesto por partidas incluyendo fotografía.' },
  ],
  staff: [
    { href: '/blog/staff-de-discoteca-funciones-y-salario', emoji: '🎪', title: 'Staff de discoteca: funciones y sueldos 2026', desc: 'Hostesses, RRPPs, camareros y coordinadores. Tarifas reales.' },
    { href: '/blog/cuanto-cobra-un-camarero-de-eventos', emoji: '💰', title: '¿Cuánto cobra un camarero de eventos?', desc: 'Precios por hora y por evento en toda España.' },
  ],
  azafata: [
    { href: '/blog/precio-azafatas-eventos-espana', emoji: '💰', title: 'Precio de azafatas para eventos: guía 2026', desc: 'Tarifas reales por tipo de evento, ferias y congresos.' },
    { href: '/blog/staff-de-discoteca-funciones-y-salario', emoji: '🎪', title: 'Staff de discoteca: funciones y sueldos 2026', desc: 'Diferencias entre hostess, azafata y RRPP.' },
  ],
  promotores: [
    { href: '/blog/promotores-de-eventos-que-hacen', emoji: '📣', title: 'Promotores de eventos: qué hacen y cuánto cobran', desc: 'Tipos, funciones y cómo estructurar el contrato con métricas.' },
  ],
  'disco-movil': [
    { href: '/blog/disco-movil-para-comuniones', emoji: '🎵', title: 'Disco móvil para comuniones: precios 2026', desc: 'Paquetes, qué incluye y cómo elegir el DJ para tu comunión.' },
    { href: '/blog/dj-para-bodas-vs-discoteca', emoji: '🆚', title: 'DJ para bodas vs DJ de discoteca', desc: 'Diferencias, equipos y cómo elegir el perfil correcto.' },
  ],
  'photo-booth': [
    { href: '/blog/photobooth-precio-boda-evento', emoji: '📸', title: 'Cuánto cuesta un photo booth para boda 2026', desc: 'Precios según tipo: clásico, 360 y espejo glamour.' },
    { href: '/presupuesto-boda', emoji: '💒', title: 'Calculadora de presupuesto de boda', desc: 'Calcula el coste total de tu boda incluyendo el photo booth.' },
  ],
  'grupo-musical': [
    { href: '/blog/cuarteto-cuerda-boda-precio', emoji: '🎻', title: 'Cuarteto de cuerda para boda: precios 2026', desc: 'Cuánto cuesta y cuándo reservarlo.' },
    { href: '/blog/grupo-musical-para-boda-precio', emoji: '🎵', title: 'Grupo musical para boda: guía completa', desc: 'Tipos, precios y cómo elegir.' },
  ],
};

export const CATEGORY_DATA: Record<string, {
  slug: string;
  emoji: string;
  h1: string;
  tagline: string;
  desc: string;
  intro: string;
  keyword: string;
  keywords: string;
  precio: string;
  cities: { name: string; slug: string }[];
  roles: string[];
  faqs: { q: string; a: string }[];
  steps: { title: string; body: string }[];
}> = {
  dj: {
    slug: 'dj',
    emoji: '🎧',
    h1: 'Contratar DJ para Boda y Eventos en España',
    tagline: 'DJs profesionales verificados para bodas, fiestas y eventos en toda España',
    desc: 'Contrata DJ para boda, fiesta privada o evento en España. Precio DJ desde 40€/hora. DJ para bodas Madrid, Barcelona e Ibiza. Flash Booking en menos de 1h. Sin comisión.',
    intro: 'XPEAK es la plataforma de referencia para contratar DJ en Madrid, Barcelona, Ibiza, Valencia, Sevilla y toda España. DJ para bodas, fiestas privadas y eventos corporativos. Perfiles verificados, precio público y contratos digitales en minutos. 0% comisión para organizadores.',
    keyword: 'DJ',
    keywords: 'contratar dj madrid, contratar dj barcelona, contratar dj ibiza, contratar dj para boda, dj para fiestas madrid, precio dj madrid, dj eventos madrid, dj fiestas privadas barcelona, DJ boda España, contratar DJ profesional',
    precio: 'desde 40€/hora',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Tech House', 'Techno', 'Hard Techno', 'Comercial', 'House', 'Afro House', 'Melodic Techno', 'Deep House', 'Reggaeton', 'Flamenco Fusión'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un DJ en España?', a: 'Los precios varían entre 40€/hora para DJs emergentes y más de 400€/hora para residentes de clubs reconocidos. En XPEAK todos los perfiles muestran su tarifa pública antes de contactar.' },
      { q: '¿Qué es el Flash Booking?', a: 'Flash Booking es el sistema de ofertas urgentes de XPEAK. Publicas una oferta con fecha, zona y presupuesto, y los DJs disponibles en tu ciudad responden en menos de 60 minutos. Ideal para sustituciones de última hora.' },
      { q: '¿XPEAK cobra comisión?', a: 'No. XPEAK es completamente gratuito para salas, promotoras y organizadores. El contrato se cierra directamente entre las partes. Sin intermediarios ni porcentajes sobre el caché.' },
      { q: '¿Los DJs están verificados?', a: 'Sí. Los perfiles en XPEAK son verificados manualmente. Incluyen experiencia, géneros, equipos, mezclas de muestra y referencias de venues.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad, precio y disponibilidad. Sin registro ni tarjeta de crédito.' },
      { title: 'Publica tu oferta', body: 'Describe el evento, fecha, ciudad y presupuesto. Flash Booking lo distribuye al instante a los DJs disponibles.' },
      { title: 'Firma y listo', body: 'Elige tu DJ, firma el contrato digital con un clic. PDF listo para facturación con datos fiscales.' },
    ],
  },
  staff: {
    slug: 'staff',
    emoji: '🎪',
    h1: 'Contratar Staff de Eventos',
    tagline: 'Hostesses, RR.PP. y promotores verificados en España',
    desc: 'Contrata staff profesional para tus eventos: hostesses, relaciones públicas, promotores y personal de sala. Flash Booking disponible. Sin comisión.',
    intro: 'Encuentra el personal de eventos que necesitas para tu sala, festival o evento corporativo. XPEAK conecta promotoras y organizadores con staff profesional verificado en toda España, con contratos digitales listos en minutos.',
    keyword: 'Staff de Eventos',
    keywords: 'contratar staff eventos España, hostesses España, relaciones públicas eventos, promotores de sala, personal eventos España',
    precio: 'desde 15€/hora',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
    ],
    roles: ['Hostess', 'Relaciones Públicas', 'Promotor/a', 'Camarero/a', 'Seguridad', 'Coordinador de Sala', 'Recepcionista', 'Personal de Producción'],
    faqs: [
      { q: '¿Cuánto cuesta contratar staff para un evento?', a: 'El precio varía según el perfil: hostesses desde 15€/hora, relaciones públicas desde 20€/hora, coordinadores de sala desde 25€/hora. En XPEAK todos los perfiles muestran sus tarifas públicas.' },
      { q: '¿Puedo contratar staff para un evento de un solo día?', a: 'Sí. XPEAK permite contrataciones puntuales para un evento o noches concretas, así como acuerdos de temporada con contratos recurrentes automáticos.' },
      { q: '¿Cómo funciona el Flash Booking para staff?', a: 'Publica tu necesidad de personal con fecha, ubicación y número de personas. El sistema notifica al instante a todos los perfiles disponibles en tu zona. Respuesta garantizada en menos de 1 hora.' },
      { q: '¿El staff de XPEAK tiene experiencia en eventos nocturnos?', a: 'Sí. Los perfiles en XPEAK son profesionales con experiencia demostrable en clubs, festivales y eventos privados. Cada perfil incluye historial de venues y referencias.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad, precio y disponibilidad. Sin registro ni tarjeta.' },
      { title: 'Describe tu necesidad', body: 'Especifica el tipo de staff, número de personas, fecha y presupuesto. Flash Booking gestiona la distribución automáticamente.' },
      { title: 'Contrato digital listo', body: 'Acepta las candidaturas, firma el contrato con un clic. Incluye datos fiscales para facturación correcta.' },
    ],
  },
  azafata: {
    slug: 'azafata',
    emoji: '🎀',
    h1: 'Contratar Azafatas para Eventos',
    tagline: 'Azafatas verificadas para ferias, congresos y eventos corporativos en España',
    desc: 'Contrata azafatas profesionales para ferias, congresos, eventos corporativos y presentaciones. Perfiles verificados, contrato digital automático. Flash Booking disponible. Sin comisión.',
    intro: 'XPEAK conecta empresas, agencias y organizadores con azafatas profesionales verificadas en toda España. Desde recepción de congresos hasta stands feriales y presentaciones de producto, con contratos digitales listos en minutos.',
    keyword: 'Azafatas de Eventos',
    keywords: 'contratar azafatas eventos España, azafatas ferias, azafatas congresos, azafatas para stands, personal azafatas España',
    precio: 'desde 15€/hora',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
    ],
    roles: ['Azafata de congresos', 'Azafata de feria', 'Azafata de stand', 'Azafata de imagen', 'Azafata de protocolo', 'Azafata de recepción', 'Azafata de eventos corporativos', 'Azafata de presentación de producto'],
    faqs: [
      { q: '¿Cuánto cuesta contratar azafatas para un evento?', a: 'El precio varía según el perfil: azafatas de recepción desde 15€/hora, azafatas de stand desde 18€/hora, azafatas de imagen o protocolo desde 22€/hora. En XPEAK todos los perfiles muestran sus tarifas públicas.' },
      { q: '¿Puedo contratar azafatas para un solo día de feria?', a: 'Sí. XPEAK permite contrataciones puntuales para una jornada, un evento o varios días consecutivos de feria o congreso, con contrato digital automático.' },
      { q: '¿Cómo funciona el Flash Booking para azafatas?', a: 'Publica tu necesidad con fecha, ubicación y número de azafatas. El sistema notifica al instante a los perfiles disponibles en tu zona, útil para necesidades urgentes — aunque la disponibilidad depende de cada ciudad.' },
      { q: '¿Qué diferencia hay entre azafata y hostess?', a: 'Una azafata suele trabajar en ferias, congresos y eventos corporativos con funciones de protocolo, información y apoyo comercial. Una hostess trabaja principalmente en eventos privados y de ocio nocturno. Ambos perfiles están disponibles en XPEAK.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad, precio y disponibilidad. Sin registro ni tarjeta.' },
      { title: 'Describe tu necesidad', body: 'Especifica el tipo de azafata, número de personas, fecha y presupuesto. Flash Booking gestiona la distribución automáticamente.' },
      { title: 'Contrato digital listo', body: 'Acepta las candidaturas, firma el contrato con un clic. Incluye datos fiscales para facturación correcta.' },
    ],
  },
  fotografo: {
    slug: 'fotografo',
    emoji: '📸',
    h1: 'Contratar Fotógrafo de Eventos',
    tagline: 'Fotógrafos y videógrafos profesionales para eventos en España',
    desc: 'Contrata fotógrafos y videógrafos especializados en eventos nocturnos, festivales y celebraciones. Perfiles verificados, entrega rápida. Sin comisión.',
    intro: 'XPEAK conecta salas, promotoras y organizadores con fotógrafos y videógrafos profesionales especializados en el sector de los eventos. Desde cobertura de clubs hasta producción audiovisual para festivales, con contratos digitales en minutos.',
    keyword: 'Fotógrafo de Eventos',
    keywords: 'contratar fotógrafo eventos España, fotógrafo club nocturno, videógrafo eventos, fotógrafo festival España, fotografía nocturna eventos',
    precio: 'desde 80€/sesión',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Fotografía de Club', 'Fotografía de Festival', 'Videografía', 'Reels / Contenido RRSS', 'Fotografía de Boda', 'Fotografía Corporativa', 'Fotografía de Artista', 'Livestream'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un fotógrafo para un evento?', a: 'Los precios varían según la duración y el tipo de entrega: sesiones de 3h desde 80€, cobertura completa de club desde 150€, producción de vídeo desde 300€. Todos los perfiles muestran tarifas públicas en XPEAK.' },
      { q: '¿Puedo contratar un fotógrafo para contenido de redes sociales?', a: 'Sí. XPEAK incluye perfiles especializados en contenido para Instagram, TikTok y redes sociales de clubs y festivales, con entrega en 24-48h.' },
      { q: '¿Cómo garantiza XPEAK la calidad de los fotógrafos?', a: 'Cada perfil incluye portafolio verificado con trabajos reales en venues y eventos. Los clientes pueden valorar a los profesionales tras cada contratación.' },
      { q: '¿Puedo contratar fotógrafo y DJ a la vez?', a: 'Sí. Con XPEAK puedes gestionar varias contrataciones en paralelo — DJ, fotógrafo y staff — todo desde el mismo panel, con contratos digitales independientes.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública y portfolio. Sin registro.' },
      { title: 'Busca o publica oferta', body: 'Filtra fotógrafos por especialidad y zona, o usa Flash Booking para recibir candidaturas urgentes al instante.' },
      { title: 'Contrato y entrega', body: 'Cierra el acuerdo con contrato digital. Incluye plazos de entrega, derechos de imagen y condiciones de uso.' },
    ],
  },
  camareros: {
    slug: 'camareros',
    emoji: '🍽️',
    h1: 'Contratar Camareros para Eventos y Bodas',
    tagline: 'Camareros por horas, personal extra y servicio completo para bodas, hostelería y eventos de empresa',
    desc: 'Contrata camareros profesionales para bodas, eventos corporativos y fiestas privadas en España. Perfiles verificados, contrato digital automático, Flash Booking en menos de 1h. Gratis para organizadores.',
    intro: 'XPEAK conecta organizadores de bodas, agencias de eventos y empresas con camareros profesionales verificados en toda España. Desde servicios de barra para bodas hasta personal de sala para cenas corporativas de 500 personas, encuentra el personal que necesitas con contrato digital en minutos.',
    keyword: 'Camareros',
    keywords: 'contratar camareros madrid, camareros para eventos madrid, camareros por horas madrid, camareros extra madrid, contratar camareros barcelona, personal de sala barcelona, camareros temporada ibiza, personal extra hostelería, camareros para bodas, catering personal sala',
    precio: 'desde 12€/hora',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Camarero/a de sala', 'Barman / Bartender', 'Sumiller', 'Camarero/a de boda', 'Personal de cocina', 'Jefe de sala', 'Azafata de eventos', 'Maitre', 'Servicio de cócteles', 'Personal de barra'],
    faqs: [
      { q: '¿Cuánto cuesta contratar camareros para una boda?', a: 'El precio de un camarero profesional para bodas en España varía entre 12€ y 22€/hora según experiencia y zona. Para una boda de 100 personas suelen necesitarse 4-6 camareros durante 6-8 horas. En XPEAK todos los perfiles muestran su tarifa pública antes de contactar.' },
      { q: '¿Cuántos camareros necesito para mi evento?', a: 'La regla general es 1 camarero por cada 15-20 invitados en una boda o evento tipo cóctel, y 1 por cada 10 en una cena sentada con servicio completo. Para eventos corporativos con barra libre, 1 bartender por cada 30-40 personas.' },
      { q: '¿Puedo contratar camareros para un solo día?', a: 'Sí. XPEAK permite contrataciones puntuales para una sola noche, un evento o varios días. El Flash Booking notifica a los profesionales disponibles en tu zona en tiempo real.' },
      { q: '¿Los camareros tienen experiencia en bodas y eventos privados?', a: 'Sí. Cada perfil en XPEAK detalla su experiencia en bodas, eventos corporativos, catering y hostelería. Puedes ver historial de eventos y referencias de otros organizadores.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad, precio y disponibilidad. Sin registro.' },
      { title: 'Publica tu necesidad', body: 'Especifica número de camareros, tipo de evento, fecha y presupuesto. Flash Booking los encuentra en tu zona al instante.' },
      { title: 'Contrato digital listo', body: 'Elige los perfiles, firma el contrato con un clic. Incluye cláusulas legales y datos fiscales para facturación.' },
    ],
  },
  catering: {
    slug: 'catering',
    emoji: '🍾',
    h1: 'Contratar Catering para Eventos',
    tagline: 'Servicios de catering profesional para bodas, eventos corporativos y celebraciones',
    desc: 'Catering para eventos Madrid y Barcelona: bodas, cenas corporativas y fiestas privadas desde 25€/persona. Menús personalizados, servicio completo. Flash Booking disponible. Sin comisión para organizadores.',
    intro: 'XPEAK incluye proveedores de catering especializados en eventos en toda España. Desde banquetes de boda hasta coffee breaks corporativos, catas de vino y cenas de gala. Compara perfiles, solicita menús y cierra contratos digitales en minutos sin intermediarios.',
    keyword: 'Catering',
    keywords: 'catering para eventos madrid, contratar catering madrid, catering empresas madrid, catering bodas madrid, catering para eventos barcelona, catering empresas barcelona, catering bodas barcelona, catering por persona España, catering cena empresa, catering boda precio',
    precio: 'desde 25€/persona',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Catering de boda', 'Catering corporativo', 'Cóctel y finger food', 'Banquete sentado', 'Servicio de barra libre', 'Food trucks', 'Cata de vinos', 'Coffee break', 'Cena de gala', 'Buffet libre'],
    faqs: [
      { q: '¿Cuánto cuesta el catering para una boda en España?', a: 'El precio del catering para bodas varía entre 50€ y 150€ por persona según el menú, el servicio y la ciudad. Un banquete sentado completo con vinos incluidos suele estar entre 70€ y 120€/persona. En XPEAK puedes comparar precios reales de diferentes proveedores.' },
      { q: '¿Qué incluye un servicio de catering completo?', a: 'Un servicio de catering completo incluye: aperitivo, cóctel, banquete o buffet, barra libre, montaje y desmontaje, personal de sala y limpieza. Los proveedores en XPEAK detallan exactamente qué incluye cada propuesta.' },
      { q: '¿Puedo pedir un menú personalizado?', a: 'Sí. Los proveedores de XPEAK ofrecen menús personalizados adaptados a dietas especiales (vegetariana, vegana, sin gluten, alergia a frutos secos). Puedes especificarlo en tu solicitud de Flash Booking.' },
      { q: '¿Con cuánta antelación debo contratar el catering?', a: 'Para bodas y eventos grandes, recomendamos al menos 3-6 meses de antelación. Para eventos corporativos de hasta 50 personas, el Flash Booking puede conseguirte catering disponible en menos de 1 semana.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Describe tu evento', body: 'Indica número de asistentes, tipo de servicio, fecha y presupuesto aproximado. Los proveedores de tu zona reciben la solicitud al instante.' },
      { title: 'Elige y firma', body: 'Compara propuestas, elige el catering que mejor se adapta y firma el contrato digital. Todo en la plataforma, sin llamadas ni correos.' },
    ],
  },
  maquillaje: {
    slug: 'maquillaje',
    emoji: '💄',
    h1: 'Contratar Maquillador para Eventos',
    tagline: 'Maquilladores profesionales para bodas, eventos y producción audiovisual',
    desc: 'Contrata maquilladores profesionales para bodas, eventos de moda y producción audiovisual en España. Artistas verificados, portafolio real, contrato digital en minutos.',
    intro: 'XPEAK conecta novias, agencias de moda y productoras con maquilladores profesionales en toda España. Desde el maquillaje de novia hasta la caracterización para producciones audiovisuales, con perfiles verificados y portafolios reales.',
    keyword: 'Maquillador/a',
    keywords: 'contratar maquillador boda España, maquilladora profesional eventos, maquillaje nupcial Madrid Barcelona, maquillador caracterización producción, maquillaje eventos España',
    precio: 'desde 80€/sesión',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Maquillaje nupcial', 'Maquillaje editorial', 'Caracterización', 'Airbrush', 'Maquillaje artístico', 'Maquillaje de pasarela', 'Maquillaje para foto y vídeo', 'Nail art', 'Maquillaje masculino', 'Efectos especiales'],
    faqs: [
      { q: '¿Cuánto cuesta un maquillador profesional para una boda?', a: 'El precio de un maquillador de boda en España varía entre 150€ y 500€ para la novia, más 80€-150€ por cada persona adicional del séquito. Incluye prueba previa y el día del evento.' },
      { q: '¿Puedo contratar maquillador para producción audiovisual?', a: 'Sí. XPEAK incluye artistas especializados en maquillaje para cine, televisión, videoclips y fotografía publicitaria, con experiencia en sets de rodaje y entregas ajustadas a tiempos de producción.' },
      { q: '¿Los maquilladores trabajan a domicilio?', a: 'La mayoría de los profesionales en XPEAK ofrecen servicio a domicilio o en el venue del evento. Puedes especificarlo en tu solicitud.' },
      { q: '¿Qué incluye una prueba de maquillaje?', a: 'La prueba de maquillaje previa al evento incluye la sesión de test del look completo (1-2 horas) y suele tener un coste entre 60€ y 120€ que normalmente se descuenta del precio total.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles de artistas con tarifa pública. Sin registro.' },
      { title: 'Busca o publica oferta', body: 'Filtra por especialidad, zona y disponibilidad, o usa Flash Booking para recibir candidaturas urgentes.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye fecha, servicios acordados y condiciones de cancelación.' },
    ],
  },
  peluqueria: {
    slug: 'peluqueria',
    emoji: '✂️',
    h1: 'Peluquería a Domicilio',
    tagline: 'Peluqueras y peluqueros a domicilio para tu evento o para el día a día',
    desc: 'Encuentra peluquera a domicilio cerca de ti en España. Corte, color, peinados de novia y recogidos para eventos o para el día a día. Perfiles verificados, contrato digital en minutos.',
    intro: 'XPEAK conecta a clientas y clientes con peluqueras y peluqueros a domicilio en toda España. Ya sea para el peinado de una boda, un evento puntual o un servicio recurrente en casa, encuentra profesionales verificados cerca de ti, con portafolio real y contacto directo sin comisión.',
    keyword: 'Peluquera/o a domicilio',
    keywords: 'peluquera a domicilio, peluquería a domicilio cerca de mí, peluqueras a domicilio cerca de mí, peluquera y maquilladora a domicilio, peluquería novia, peluquería novias, peluquera a domicilio Madrid Barcelona',
    precio: 'desde 35€/servicio',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Peluquería a domicilio', 'Peinado de novia', 'Recogidos', 'Corte', 'Color', 'Extensiones', 'Alisado', 'Tratamientos capilares', 'Peluquería infantil', 'Peluquería de eventos'],
    faqs: [
      { q: '¿Cuánto cuesta una peluquera a domicilio?', a: 'El precio de una peluquera a domicilio en España varía entre 25€ y 60€ para servicios básicos (corte, peinado), y entre 80€ y 200€ para peinados de novia con prueba previa incluida.' },
      { q: '¿La peluquería a domicilio es solo para bodas y eventos?', a: 'No. Aunque los peinados de novia y eventos son un caso de uso frecuente, la mayoría de profesionales de XPEAK también ofrecen servicio a domicilio para el día a día: cortes, color y tratamientos capilares sin necesidad de desplazarte al salón.' },
      { q: '¿Cómo encuentro una peluquera a domicilio cerca de mí?', a: 'Filtra por tu ciudad o zona en el directorio de XPEAK y contacta directamente con las profesionales disponibles. También puedes usar Flash Booking para necesidades urgentes, aunque la disponibilidad depende de cada zona.' },
      { q: '¿Qué incluye un peinado de novia a domicilio?', a: 'Habitualmente incluye una prueba previa (recogido de test, 1-2 horas) y el servicio el día del evento en el domicilio o lugar de la celebración. El material lo aporta la profesional.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad, zona y disponibilidad. Sin registro.' },
      { title: 'Contacta o publica oferta', body: 'Contacta directamente o usa Flash Booking para necesidades urgentes cerca de ti.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye fecha, servicios acordados y condiciones de cancelación.' },
    ],
  },
  promotores: {
    slug: 'promotores',
    emoji: '📣',
    h1: 'Contratar Promotores de Eventos',
    tagline: 'Promotores y RRPP profesionales para discotecas, festivales y eventos nocturnos',
    desc: 'Contrata promotores y relaciones públicas profesionales para discotecas, festivales y eventos en España. Perfiles verificados, resultados medibles, contratos automáticos. Sin comisión.',
    intro: 'XPEAK reúne los mejores promotores y relaciones públicas del sector del eventos y entretenimiento y los eventos en España. Profesionales con cartera de clientes activa, experiencia en clubs y festivales, disponibles para acuerdos puntuales o de temporada con contratos digitales en minutos.',
    keyword: 'Promotor',
    keywords: 'contratar promotor discoteca España, relaciones públicas eventos nocturnos, promotor sala Madrid Barcelona, RRPP eventos, promotor festival España, personal RRPP discoteca',
    precio: 'desde 100€/noche',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Ibiza', slug: 'ibiza' },
      { name: 'A Coruña', slug: 'coruna' },
    ],
    roles: ['Promotor de sala', 'Relaciones Públicas', 'Community manager presencial', 'Captador/a de público', 'Promotor de festival', 'Influencer de evento', 'Coordinador de lista de invitados', 'Brand ambassador', 'Promotor digital', 'Equipo de RRPP'],
    faqs: [
      { q: '¿Cuánto cobra un promotor de discoteca en España?', a: 'Los promotores profesionales en España cobran entre 100€ y 400€ por noche según su cartera de clientes y la sala. Los RRPP con lista propia de calidad cobran más, pero generan mayor retorno en taquilla.' },
      { q: '¿Qué diferencia hay entre un promotor y un relaciones públicas?', a: 'El promotor trabaja captando público en calle, redes y grupos. El RRPP gestiona listas de invitados, reservas de mesa VIP y relaciones con clientes premium. En XPEAK puedes encontrar ambos perfiles o profesionales que combinan las dos funciones.' },
      { q: '¿Puedo contratar promotores para un evento de una sola noche?', a: 'Sí. XPEAK permite contrataciones puntuales para una noche, fines de semana o temporadas completas. El Flash Booking encuentra promotores disponibles en tu zona en menos de 1 hora.' },
      { q: '¿Cómo mido el rendimiento de un promotor?', a: 'Los contratos de XPEAK incluyen métricas acordadas: número de asistentes traídos, ventas de reservas o taquilla atribuida. Puedes añadir cláusulas de incentivo por objetivos directamente en el contrato digital.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Filtra por ciudad y disponibilidad. Sin registro ni tarjeta.' },
      { title: 'Publica tu oferta', body: 'Describe el evento, zona, fecha y expectativas de aforo. Flash Booking lo distribuye a promotores activos en tu área.' },
      { title: 'Contrato con métricas', body: 'Incluye objetivos medibles en el contrato digital. Ciérralo en un clic con datos fiscales incluidos.' },
    ],
  },
  vestuario: {
    slug: 'vestuario',
    emoji: '👗',
    h1: 'Contratar Estilista y Vestuario para Eventos',
    tagline: 'Estilistas, diseñadores y personal de vestuario profesional para eventos, producciones y bodas',
    desc: 'Contrata estilistas y profesionales del vestuario para eventos de moda, producciones audiovisuales, bodas y espectáculos en España. Perfiles verificados, portafolio real.',
    intro: 'XPEAK incluye estilistas, diseñadores de vestuario y personal de armario para eventos de toda índole en España. Desde el estilismo integral para bodas hasta la coordinación de vestuario en rodajes y espectáculos, con contratos digitales y perfiles verificados.',
    keyword: 'Estilista',
    keywords: 'contratar estilista eventos España, vestuario producciones audiovisuales, estilismo boda España, personal de vestuario espectáculos, diseñador vestuario eventos, coordinador de armario',
    precio: 'desde 120€/día',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Estilista de moda', 'Coordinador/a de vestuario', 'Personal shopper', 'Diseñador/a de trajes', 'Caracterización teatral', 'Estilista de boda', 'Armador/a de producción', 'Estilista editorial', 'Sastre/a de ajustes', 'Estilista de imagen corporativa'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un estilista para una boda?', a: 'Un estilista integral para boda (novia, novio y séquito) cobra entre 300€ y 1.500€ según el alcance del servicio. El estilismo solo del día suele estar entre 200€ y 600€, mientras que el asesoramiento completo desde la elección del traje puede superar los 1.000€.' },
      { q: '¿Puedo contratar estilistas para una producción audiovisual?', a: 'Sí. XPEAK incluye coordinadores de vestuario con experiencia en rodajes, videoclips y campañas publicitarias. Especifica el número de días de rodaje y el tipo de producción en tu oferta.' },
      { q: '¿Los estilistas trabajan con proveedores de alquiler de trajes?', a: 'Muchos estilistas en XPEAK tienen acuerdos con boutiques y almacenes de alquiler. Puedes especificar si necesitas que el estilista gestione también el vestuario o si solo necesitas el servicio de coordinación.' },
      { q: '¿Qué es un personal shopper para eventos?', a: 'Un personal shopper de eventos te ayuda a elegir el outfit correcto para cada tipo de evento: gala, boda, presentación corporativa o evento de moda. Tarifa habitual: entre 80€ y 200€ por sesión de 2-3 horas.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Busca o publica tu oferta', body: 'Filtra por especialidad y zona, o usa Flash Booking. Detalla el tipo de evento y el número de personas a estilizar.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital con un clic. Incluye horarios, servicios pactados y condiciones de cancelación.' },
    ],
  },
  humorista: {
    slug: 'humorista',
    emoji: '🎤',
    h1: 'Contratar Humorista y Monologuista para Eventos',
    tagline: 'Humoristas, monologuistas y cómicos de stand-up para bodas, cenas de empresa y eventos',
    desc: 'Contrata humoristas y monologuistas profesionales para bodas, cenas de empresa y eventos en España. Cómicos verificados, guión personalizado. Flash Booking disponible. Sin comisión.',
    intro: 'XPEAK conecta organizadores con humoristas y monologuistas profesionales en toda España. Desde el monólogo de bodas hasta el espectáculo de stand-up para cenas corporativas, con guión adaptado a tu evento y contratos digitales en minutos.',
    keyword: 'Humorista',
    keywords: 'contratar humorista boda España, monologuista eventos empresa, stand-up cena corporativa, cómico para eventos Madrid Barcelona, humor bodas España, contratar monologuista precio',
    precio: 'desde 300€/actuación',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
    ],
    roles: ['Stand-Up Comedy', 'Monólogo corporativo', 'Humor de boda', 'Maestro de ceremonias cómico', 'Improvisación', 'Sketch cómico', 'Humor familiar', 'Actuación personalizada'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un humorista para una boda?', a: 'Un monologuista para bodas en España cobra entre 300€ y 1.200€ según su trayectoria y la duración del espectáculo. Los cómicos con TV o especiales de Netflix pueden superar esa cifra. XPEAK muestra tarifas públicas de cada perfil.' },
      { q: '¿El guión se personaliza para mi evento?', a: 'Sí. La mayoría de los humoristas en XPEAK adaptan el contenido al tipo de evento, al público y a los protagonistas. Para bodas, suelen incluir anécdotas de los novios. Para cenas corporativas, referencias al sector o la empresa.' },
      { q: '¿Cuánto dura la actuación de un monologuista?', a: 'Las actuaciones varían entre 20 y 60 minutos según el contrato. Lo más habitual en bodas y cenas de empresa es un pase de 30-45 minutos. Algunos artistas ofrecen también participación durante la velada como animadores.' },
      { q: '¿Puedo contratar humorista para una cena de empresa?', a: 'Es el formato más demandado. El humor corporativo requiere un cómico con experiencia en públicos mixtos y contenido inclusivo. En XPEAK puedes filtrar por especialidad "corporativo" para encontrar el perfil adecuado.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Busca o publica oferta', body: 'Filtra por especialidad y zona, o usa Flash Booking. Detalla el tipo de evento y el tono de humor que buscas.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital con un clic. Incluye fecha, duración, guión acordado y condiciones de cancelación.' },
    ],
  },
  animador: {
    slug: 'animador',
    emoji: '🎪',
    h1: 'Contratar Animador y Payaso para Eventos',
    tagline: 'Animadores infantiles, payasos y artistas de entretenimiento para cumpleaños, bodas y eventos',
    desc: 'Contrata animadores y payasos profesionales para cumpleaños infantiles, bodas, comuniones y eventos familiares en España. Perfiles verificados, animación garantizada. Sin comisión.',
    intro: 'XPEAK conecta familias y organizadores con animadores y payasos profesionales en toda España. Desde la animación infantil para cumpleaños hasta el espectáculo de magia para bodas y comuniones, con contratos digitales en minutos y perfiles verificados.',
    keyword: 'Animador',
    keywords: 'contratar animador infantil España, payaso cumpleaños Madrid Barcelona, animación bodas, animadores comuniones, contratar payaso precio España, animación infantil profesional',
    precio: 'desde 150€/actuación',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Payaso profesional', 'Animación infantil', 'Magia infantil', 'Globoflexia', 'Pintacaras', 'Animación boda', 'Espectáculo familiar', 'Animación comunión', 'Cuenta cuentos', 'Artista de circo'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un animador infantil?', a: 'Un animador infantil en España cobra entre 150€ y 400€ por actuación de 1-2 horas según la especialidad y la ciudad. Un payaso con magia y globoflexia suele costar entre 200€ y 350€. XPEAK muestra tarifas reales de cada perfil.' },
      { q: '¿Qué incluye una animación de cumpleaños?', a: 'Una animación de cumpleaños completa suele incluir: bienvenida con globoflexia, espectáculo de magia, pintacaras y juegos organizados. La duración habitual es de 1,5 a 2 horas. Algunos animadores también ofrecen decoración y mini-discoteca.' },
      { q: '¿Los animadores trabajan en exterior?', a: 'Sí. La mayoría de los animadores en XPEAK trabajan tanto en interiores (salones de eventos, casas) como en exteriores (jardines, parques, terrazas). Indica el tipo de espacio en tu solicitud.' },
      { q: '¿Puedo contratar animadores para una boda con niños?', a: 'Absolutamente. Es uno de los servicios más demandados. El animador se encarga de los niños mientras los adultos disfrutan del banquete. Puedes contratar tanto animación durante el cóctel como durante toda la celebración.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Busca o publica oferta', body: 'Filtra por especialidad y ciudad, o usa Flash Booking. Detalla el número de niños, edades y duración del evento.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital con un clic. Incluye fecha, servicios y condiciones de cancelación.' },
    ],
  },
  speaker: {
    slug: 'speaker',
    emoji: '🎙️',
    h1: 'Contratar Speaker y Ponente para Eventos',
    tagline: 'Speakers, conferenciantes y ponentes profesionales para congresos, cenas de empresa y eventos corporativos',
    desc: 'Contrata speakers y conferenciantes profesionales para congresos, teambuilding y eventos corporativos en España. Ponentes verificados, temas especializados. Flash Booking. Sin comisión.',
    intro: 'XPEAK conecta empresas y organizadores con speakers y ponentes profesionales en toda España. Desde keynotes motivacionales hasta conferencias técnicas especializadas, con perfiles verificados y contratos digitales en minutos.',
    keyword: 'Speaker',
    keywords: 'contratar speaker congreso España, ponente eventos empresa Madrid Barcelona, conferenciante motivacional, speaker corporativo precio España, ponente evento tecnología',
    precio: 'desde 500€/ponencia',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Keynote motivacional', 'Conferenciante técnico', 'Facilitador de workshops', 'Moderador de mesa redonda', 'Speaker de innovación', 'Coach ejecutivo', 'Presentador corporativo', 'Experto en liderazgo'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un speaker para un evento?', a: 'Un speaker profesional en España cobra entre 500€ y 5.000€+ según su perfil y trayectoria. Los keynote speakers con presencia internacional pueden superar esa cifra. XPEAK muestra tarifas orientativas de cada perfil.' },
      { q: '¿Qué temas cubren los speakers de XPEAK?', a: 'Innovación, liderazgo, marketing digital, inteligencia artificial, ventas, bienestar corporativo, diversidad e inclusión, transformación digital y muchos más. Puedes filtrar por temática en el directorio.' },
      { q: '¿El ponente prepara material personalizado?', a: 'La mayoría de los speakers en XPEAK adaptan su presentación al sector y los objetivos del evento. Puedes especificar el perfil del público, la duración y los temas clave al hacer la solicitud.' },
      { q: '¿Puedo contratar un speaker para un evento online o híbrido?', a: 'Sí. Muchos speakers en XPEAK tienen experiencia en formatos online, híbridos y presenciales. Indica el formato de tu evento en la solicitud para filtrar los perfiles adecuados.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles de ponentes. Sin registro ni tarjeta.' },
      { title: 'Busca o publica oferta', body: 'Filtra por temática y zona, o usa Flash Booking. Detalla el sector, el público y la duración de la ponencia.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye fecha, temática acordada, duración y condiciones de cancelación.' },
    ],
  },
  mago: {
    slug: 'mago',
    emoji: '🎩',
    h1: 'Contratar Mago para Eventos y Bodas',
    tagline: 'Magos y ilusionistas profesionales para bodas, cenas de empresa, cumpleaños y eventos',
    desc: 'Contrata magos e ilusionistas profesionales para bodas, eventos corporativos y celebraciones en España. Actuaciones personalizadas verificadas. Flash Booking disponible. Sin comisión.',
    intro: 'XPEAK conecta organizadores con magos e ilusionistas profesionales en toda España. Magia de cerca para cócteles de boda, espectáculos de grand illusion para galas corporativas y shows infantiles para comuniones, con contratos digitales en minutos.',
    keyword: 'Mago',
    keywords: 'contratar mago boda España, ilusionista eventos empresa, mago cóctel boda Madrid Barcelona, mago para cumpleaños precio España, actuación de magia evento',
    precio: 'desde 250€/actuación',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Magia de cerca', 'Ilusionismo de escenario', 'Magia infantil', 'Magia de cóctel', 'Grand illusion', 'Mentalismo', 'Magia corporativa', 'Escapismo'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un mago para una boda?', a: 'Un mago profesional para bodas en España cobra entre 250€ y 1.500€ según la duración y el tipo de actuación. La magia de cerca para el cóctel (1h) suele costar entre 250€ y 600€. Un espectáculo de escenario completo puede superar los 1.000€.' },
      { q: '¿Qué es la magia de cerca?', a: 'La magia de cerca (closeup magic) es perfecta para cócteles y recepciones: el mago va de mesa en mesa o de grupo en grupo haciendo trucos a cm de los invitados. Es el formato más demandado en bodas por su capacidad de sorprender en momentos íntimos.' },
      { q: '¿Los magos adaptan el show al tipo de evento?', a: 'Sí. Los magos en XPEAK preparan actuaciones personalizadas según el tipo de evento, el público y la duración. Para bodas pueden incluir la alianza o los anillos en los trucos; para empresas, productos o logos de la compañía.' },
      { q: '¿Puedo contratar magia para niños?', a: 'Sí. XPEAK incluye magos especializados en público infantil con shows de 30-60 minutos con participación, humor y magia adaptada a niños de 3 a 12 años.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles de magos. Sin registro ni tarjeta.' },
      { title: 'Busca o publica oferta', body: 'Filtra por tipo de magia y ciudad, o usa Flash Booking. Detalla el tipo de evento y el público.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye tipo de actuación, duración y condiciones de cancelación.' },
    ],
  },
  bailarin: {
    slug: 'bailarin',
    emoji: '💃',
    h1: 'Contratar Bailarín, Bailarina e Instructor de Baile',
    tagline: 'Bailarines, compañías de danza e instructores de salsa, bachata y kizomba para eventos y clases',
    desc: 'Contrata bailarines y bailarinas profesionales para bodas, shows de entretenimiento y eventos corporativos en España, o encuentra instructor de salsa, bachata y kizomba para clases particulares. Perfiles verificados. Sin comisión.',
    intro: 'XPEAK conecta organizadores con bailarines y compañías de danza profesionales en toda España — desde el espectáculo flamenco para galas hasta la coreografía sorpresa de boda — y también con instructores de salsa, bachata y kizomba disponibles para clases particulares. Perfiles verificados y contratos digitales en minutos.',
    keyword: 'Bailarín',
    keywords: 'contratar bailarín boda España, compañía de danza eventos Madrid Barcelona, bailaora flamenca eventos, bailarín profesional precio España, show de baile corporativo, instructor de salsa bachata, clases particulares de baile',
    precio: 'desde 200€/actuación',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Granada', slug: 'granada' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['Flamenco', 'Danza contemporánea', 'Danza clásica / Ballet', 'Baile latino', 'Coreografía de boda', 'Show de cabaret', 'Danza urbana', 'Danza del vientre', 'Go-go dancers', 'Danza aérea'],
    faqs: [
      { q: '¿Cuánto cuesta contratar bailarines para un evento?', a: 'Un bailarín o bailarina profesional en España cobra entre 200€ y 800€ por actuación según la especialidad y la duración. Una compañía de 4-6 bailarines para un show completo puede costar entre 800€ y 3.000€. XPEAK muestra tarifas reales de cada perfil.' },
      { q: '¿Puedo contratar flamenco para una boda o evento de empresa?', a: 'Es uno de los shows más demandados para galas y eventos con invitados internacionales. XPEAK incluye bailaoras y compañías de flamenco con espectáculos de 20 a 60 minutos, con o sin cantaor y guitarra en directo.' },
      { q: '¿Qué es una coreografía sorpresa de boda?', a: 'Es un show preparado en secreto por familiares o amigos de los novios con un coreógrafo profesional. El día de la boda sorprenden a los novios con una actuación coordinada. XPEAK incluye coreógrafos especializados en este formato.' },
      { q: '¿Los bailarines trabajan con música en directo?', a: 'Muchos bailarines en XPEAK ofrecen actuaciones con música en directo (guitarra, percusión) o con pistas pregrabadas. Puedes especificarlo en tu solicitud y contratar ambos servicios desde la misma plataforma.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Busca o publica oferta', body: 'Filtra por estilo de baile y ciudad, o usa Flash Booking. Detalla el tipo de evento y el espacio disponible.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye número de bailarines, duración del show y condiciones de cancelación.' },
    ],
  },
  payaso: {
    slug: 'payaso',
    emoji: '🤡',
    h1: 'Contratar Payaso para Fiestas y Eventos',
    tagline: 'Payasos profesionales para cumpleaños infantiles, bodas, comuniones y eventos familiares',
    desc: 'Contrata payasos profesionales para cumpleaños infantiles, bodas y eventos familiares en España. Animadores verificados, espectáculo garantizado. Flash Booking disponible. Sin comisión.',
    intro: 'XPEAK conecta familias y organizadores con payasos y animadores profesionales en toda España. Magia, globoflexia, pintacaras y humor para niños de todas las edades, con contratos digitales en minutos.',
    keyword: 'Payaso',
    keywords: 'contratar payaso cumpleaños España, payaso infantil Madrid Barcelona, payaso para fiestas precio, animador payaso eventos familiares, payaso profesional boda España',
    precio: 'desde 150€/actuación',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
    ],
    roles: ['Payaso de cumpleaños', 'Payaso de boda', 'Payaso de comunión', 'Magia y payaso', 'Globoflexia', 'Pintacaras', 'Payaso para niños', 'Show familiar completo'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un payaso para un cumpleaños?', a: 'Un payaso profesional para cumpleaños infantiles en España cobra entre 150€ y 350€ por actuación de 1-1,5 horas. Los shows más completos con magia, globoflexia y pintacaras incluidos suelen costar entre 200€ y 300€.' },
      { q: '¿Qué incluye la actuación de un payaso?', a: 'Una actuación completa suele incluir: espectáculo de humor, trucos de magia, globoflexia (animales y figuras con globos), pintacaras y juegos participativos con los niños. La duración habitual es de 60 a 90 minutos.' },
      { q: '¿Los payasos trabajan en domicilios?', a: 'Sí. La mayoría de los payasos en XPEAK trabajan en domicilios, jardines, salones de cumpleaños y espacios privados. Solo necesitas espacio suficiente para que los niños se sienten y participen.' },
      { q: '¿Para qué edades es adecuado un payaso?', a: 'Los payasos en XPEAK adaptan su actuación al rango de edad del grupo. Para niños de 3-5 años, más visual y sencillo; para 6-10 años, más participativo con juegos y magia; para adolescentes y adultos, humor más elaborado.' },
    ],
    steps: [
      { title: 'Busca en el directorio', body: 'Explora perfiles con tarifa pública. Sin registro ni tarjeta.' },
      { title: 'Contacta directamente', body: 'Filtra por ciudad y especialidad. Indica edades de los niños y duración del evento.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye fecha, servicios incluidos y condiciones de cancelación.' },
    ],
  },
  'photo-booth': {
    slug: 'photo-booth',
    emoji: '📸',
    h1: 'Contratar Photo Booth para Boda y Eventos en España',
    tagline: 'Cabinas de fotos profesionales con impresión al instante y álbum digital',
    desc: 'Alquila un photo booth para tu boda, comunión o evento de empresa. Precio desde 300€. Con atrezzo, impresión al instante y álbum digital. Sin comisión.',
    intro: 'Un photo booth es uno de los elementos que más éxito tiene en bodas, comuniones y eventos de empresa. XPEAK conecta organizadores con proveedores de photo booth profesionales en toda España.',
    keyword: 'Photo Booth',
    keywords: 'alquilar photo booth boda, photo booth eventos españa, cabina fotos boda precio, photobooth comunión, photo booth 360 evento empresa',
    precio: 'desde 300€',
    cities: [{name:'Madrid',slug:'madrid'},{name:'Barcelona',slug:'barcelona'},{name:'Valencia',slug:'valencia'},{name:'Sevilla',slug:'sevilla'},{name:'Málaga',slug:'malaga'},{name:'Bilbao',slug:'bilbao'}],
    roles: ['Photo Booth Clásico', 'Photo Booth 360', 'Cabina Glamour', 'Selfie Mirror', 'GIF Booth', 'Video Booth'],
    faqs: [
      {q:'¿Cuánto cuesta un photo booth para una boda?', a:'Un photo booth para boda cuesta entre 300€ y 700€ dependiendo del tipo (clásico, 360 o espejo glamour), la duración y los extras como impresión ilimitada o libro de firmas. En XPEAK todos los precios son públicos antes de contactar.'},
      {q:'¿Qué incluye un photo booth profesional?', a:'Normalmente incluye montaje y desmontaje, atrezzo temático, impresión ilimitada al instante, álbum digital con todas las fotos y 3-4 horas de servicio. El photo booth 360 genera vídeos cortos ideales para redes sociales.'},
      {q:'¿Con cuánta antelación contratar un photo booth?', a:'Con 3-4 meses de antelación es suficiente para la mayoría de fechas. En temporada alta (mayo-septiembre) se recomienda reservar con 6 meses.'},
    ],
    steps: [
      {title:'Elige el tipo de photo booth', body:'Clásico con impresión, 360 para vídeos o espejo glamour. Depende del estilo de tu evento.'},
      {title:'Reserva con antelación', body:'Confirma fecha, ubicación y duración. El proveedor se encarga del montaje y desmontaje.'},
      {title:'Comparte los recuerdos', body:'Tus invitados se llevan fotos impresas al instante. Tú recibes el álbum digital completo.'},
    ],
  },
  'grupo-musical': {
    slug: 'grupo-musical',
    emoji: '🎵',
    h1: 'Contratar Grupo Musical para Boda y Eventos en España',
    tagline: 'Bandas, grupos de jazz, cuartetos y música en vivo para cualquier evento',
    desc: 'Contrata grupos musicales para bodas, comuniones y eventos. Jazz, flamenco, pop, rock, cuarteto de cuerda. Precio desde 350€. Sin comisión.',
    intro: 'XPEAK conecta organizadores con grupos musicales profesionales en toda España. Desde cuartetos de cuerda para ceremonias hasta bandas de pop-rock para bodas y grupos de jazz para eventos de empresa.',
    keyword: 'Grupo Musical',
    keywords: 'contratar grupo musical boda, banda musical eventos españa, cuarteto cuerda boda, música en vivo evento, grupo jazz evento empresa',
    precio: 'desde 350€',
    cities: [{name:'Madrid',slug:'madrid'},{name:'Barcelona',slug:'barcelona'},{name:'Valencia',slug:'valencia'},{name:'Sevilla',slug:'sevilla'},{name:'Málaga',slug:'malaga'},{name:'Ibiza',slug:'ibiza'}],
    roles: ['Cuarteto de Cuerda', 'Grupo de Jazz', 'Banda Pop/Rock', 'Grupo Flamenco', 'Dúo Acústico', 'Trío de Jazz', 'Saxofonista', 'Cantante Solista'],
    faqs: [
      {q:'¿Cuánto cuesta contratar un grupo musical para una boda?', a:'Los precios varían: un dúo acústico o saxofonista para ceremonia parte de 300€, un cuarteto de cuerda entre 400-800€, una banda completa de 5-6 músicos entre 1.500-3.500€. En XPEAK todos los precios son públicos.'},
      {q:'¿Cuándo debo reservar el grupo musical para mi boda?', a:'Con 6-9 meses de antelación para asegurar disponibilidad, especialmente en temporada alta (mayo-octubre). Los grupos más solicitados se agotan antes.'},
      {q:'¿Un grupo musical puede actuar en exteriores?', a:'Sí, la mayoría cuentan con equipo propio adaptado a exteriores. Es importante informar al proveedor del espacio para dimensionar correctamente el equipo de sonido.'},
    ],
    steps: [
      {title:'Elige el estilo musical', body:'Ceremonia, cóctel o cena. Cada momento tiene su música ideal: cuarteto para la ceremonia, jazz para el cóctel, banda para la cena y baile.'},
      {title:'Confirma disponibilidad', body:'Comparte fecha, hora de inicio, ubicación y duración esperada. Cuantos más detalles, mejor presupuesto recibirás.'},
      {title:'Contrato y ensayo', body:'Firma el contrato digital en XPEAK. Puedes coordinar con el grupo la lista de canciones especiales.'},
    ],
  },
  monologo: {
    slug: 'monologo',
    emoji: '🎤',
    h1: 'Contratar Monologuista para Eventos en España',
    tagline: 'Cómicos de stand-up y monologuistas con guion personalizado para cenas de empresa y bodas',
    desc: 'Contrata monologuista o cómico de stand-up para cenas de empresa, bodas y eventos en España. Guion personalizado. Sin comisión.',
    intro: 'XPEAK conecta organizadores con monologuistas y cómicos de stand-up verificados en toda España: desde shows de 20-30 minutos para cenas de empresa hasta actuaciones completas de 60 minutos para bodas y festivales de humor.',
    keyword: 'Monologuista',
    keywords: 'contratar monologuista, cómico stand up eventos, monólogo cena de empresa, humorista boda España, contratar cómico evento',
    precio: 'desde 300€',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
    ],
    roles: ['Stand-Up Comedy', 'Monólogo Personalizado', 'Impro', 'Cena de Empresa', 'Monólogo de Boda', 'Festival de Humor'],
    faqs: [
      { q: '¿Cuánto cuesta contratar un monologuista?', a: 'Un monólogo profesional cuesta entre 300€ y 1.200€ según la duración y el perfil del cómico. Actuaciones de 20-30 min para cenas de empresa: 300€-600€. Shows de stand-up de 45-60 min: 500€-1.200€.' },
      { q: '¿El monologuista puede personalizar el guion para mi empresa?', a: 'Sí. La mayoría de monologuistas en XPEAK ofrecen guion 100% personalizado con referencias a tu empresa, sector, equipo o ciudad.' },
      { q: '¿Un monólogo funciona para una boda?', a: 'Sí, es uno de los entretenimientos que más recuerdan los invitados. El cómico recoge anécdotas de la pareja y los invitados para crear un show único de 20-30 minutos.' },
    ],
    steps: [
      { title: 'Elige el formato', body: 'Monólogo corto para sobremesa, show completo de stand-up o impro con varios cómicos.' },
      { title: 'Comparte el contexto', body: 'Cuéntale al cómico el tipo de público, el tono deseado y cualquier tema a evitar.' },
      { title: 'Contrato y show', body: 'Firma el contrato digital en XPEAK y confirma horarios de llegada y duración exacta.' },
    ],
  },
  'disco-movil': {
    slug: 'disco-movil',
    emoji: '🎵',
    h1: 'Contratar Disco Móvil para Eventos',
    tagline: 'DJ con equipo completo de sonido, luces y efectos para bodas, comuniones y fiestas privadas',
    desc: 'Contrata disco móvil profesional para bodas, comuniones, cumpleaños y fiestas privadas en España. DJ + equipo completo incluido. Flash Booking. Sin comisión.',
    intro: 'Una disco móvil incluye DJ profesional y equipo completo: altavoces, mesa de mezclas, iluminación de colores, máquina de humo y efectos. Ideal para bodas en fincas, comuniones y fiestas donde el local no tiene instalación propia. XPEAK conecta organizadores con DJs de disco móvil verificados en toda España.',
    keyword: 'Disco Móvil',
    keywords: 'contratar disco móvil España, disco móvil boda, disco móvil comunión, alquiler disco móvil Madrid Barcelona, DJ con equipo boda, disco móvil precio España, disco movil fiestas privadas',
    precio: 'desde 400€/evento',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Bilbao', slug: 'bilbao' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'Murcia', slug: 'murcia' },
      { name: 'Palma', slug: 'palma' },
      { name: 'Ibiza', slug: 'ibiza' },
    ],
    roles: ['DJ con equipo completo', 'DJ para bodas', 'DJ para comuniones', 'DJ para fiestas privadas', 'DJ para eventos corporativos', 'DJ para cumpleaños', 'DJ con iluminación profesional', 'DJ con cabina completa', 'DJ para fincas y jardines', 'DJ para exterior'],
    faqs: [
      { q: '¿Cuánto cuesta una disco móvil en España?', a: 'Una disco móvil completa en España cuesta entre 400€ y 1.500€ por evento, incluyendo DJ, equipo de sonido profesional, iluminación y efectos. El precio varía según la duración (4h, 6h, 8h) y el nivel del equipo.' },
      { q: '¿Qué diferencia hay entre un DJ y una disco móvil?', a: 'Un DJ de disco móvil trae su propio equipo completo: altavoces, mesa de mezclas, luces LED de colores, máquina de humo y cañón de confeti. No necesitas contratar técnico de sonido ni alquilar equipo aparte. Es la solución completa para bodas y eventos en locales sin instalación.' },
      { q: '¿La disco móvil es adecuada para bodas?', a: 'Sí, es la opción más popular para bodas en fincas rurales y masías. El DJ llega con todo el material, lo monta antes del evento y lo recoge al terminar. Muchos incluyen música en el cóctel y la ceremonia civil.' },
      { q: '¿Cuánto tiempo antes debo contratar la disco móvil para mi boda?', a: 'Para bodas, recomendamos contratar con al menos 3–6 meses de antelación. Si necesitas disco móvil con poca antelación, el Flash Booking de XPEAK puede encontrarte disponibilidad en menos de 1 hora.' },
    ],
    steps: [
      { title: 'Busca tu DJ con equipo', body: 'Filtra por ciudad, fecha y tipo de evento. Compara portfolios, valoraciones y equipos incluidos.' },
      { title: 'Flash Booking si es urgente', body: 'Publica tu evento y recibe respuestas de DJs con disco móvil disponibles en tu zona en menos de 1 hora.' },
      { title: 'Contrato digital incluido', body: 'Cierra el trato con contrato automático: precio, horario, equipo incluido y condiciones de cancelación.' },
    ],
  },
};

// Alias plurales — App.tsx registra tanto /contratar-animador como
// /contratar-animadores (ídem payaso/payasos) apuntando al mismo componente;
// sin esta entrada CategoryLanding no encuentra el slug y hace navigate('/').
CATEGORY_DATA.animadores = CATEGORY_DATA.animador;
CATEGORY_DATA.payasos = CATEGORY_DATA.payaso;

const ICON: Record<string, React.ReactNode> = {
  dj: <Music size={20} />,
  staff: <Users size={20} />,
  azafata: <Users size={20} />,
  fotografo: <Camera size={20} />,
  camareros: <UtensilsCrossed size={20} />,
  catering: <UtensilsCrossed size={20} />,
  maquillaje: <Sparkles size={20} />,
  peluqueria: <Scissors size={20} />,
  promotores: <Megaphone size={20} />,
  vestuario: <Shirt size={20} />,
  'disco-movil': <Music size={20} />,
  humorista: <Megaphone size={20} />,
  animador: <Users size={20} />,
  animadores: <Users size={20} />,
  speaker: <Megaphone size={20} />,
  mago: <Star size={20} />,
  bailarin: <Users size={20} />,
  payaso: <Users size={20} />,
  payasos: <Users size={20} />,
  'photo-booth': <Camera size={20} />,
  'grupo-musical': <Music size={20} />,
};

export default function CategoryLanding() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // pathname is e.g. "/contratar-dj" → strip prefix "contratar-"
  const slug = pathname.replace(/^\/contratar-/, '').split('/')[0];
  const data = CATEGORY_DATA[slug] ?? null;

  if (!data) {
    navigate('/');
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.h1,
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'Country', name: 'España' },
    description: data.desc,
    url: `https://xpeak.es/contratar-${data.slug}`,
    serviceType: `Contratación de ${data.keyword}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Registro gratuito para salas y promotoras' },
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map(f => ({
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
      { '@type': 'ListItem', position: 2, name: data.h1, item: `https://xpeak.es/contratar-${data.slug}` },
    ],
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `XPEAK — ${data.h1}`,
    description: data.desc,
    url: `https://xpeak.es/contratar-${data.slug}`,
    image: 'https://xpeak.es/og-image.jpg',
    telephone: '',
    email: 'hola@xpeak.es',
    address: { '@type': 'PostalAddress', addressCountry: 'ES' },
    areaServed: { '@type': 'Country', name: 'España' },
    priceRange: data.precio,
    openingHours: 'Mo-Su 00:00-24:00',
    sameAs: ['https://www.instagram.com/xpeak.es'],
  };

  return (
    <>
      <Helmet>
        <title>{data.h1} — XPEAK | Directorio Profesional de Eventos</title>
        <meta name="description" content={data.desc} />
        <meta name="keywords" content={data.keywords} />
        <link rel="canonical" href={`https://xpeak.es/contratar-${data.slug}`} />
        <meta property="og:title" content={`${data.h1} — XPEAK`} />
        <meta property="og:description" content={data.desc} />
        <meta property="og:url" content={`https://xpeak.es/contratar-${data.slug}`} />
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

        {/* Nav mínima */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Precios</a>
            <a href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
              {ICON[data.slug]}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              España · Directorio Profesional
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            {data.h1}
          </h1>
          <p className="text-sm sm:text-lg mb-3 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {data.intro}
          </p>
          <p className="text-sm font-bold mb-8" style={{ color: 'rgba(212,175,55,0.7)' }}>{data.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`/directorio/${['dj','fotografo','staff','maquillaje','peluqueria','promotores','azafata'].includes(data.slug) ? data.slug : data.slug === 'camareros' ? 'staff' : 'dj'}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver profesionales disponibles <ArrowRight size={14} />
            </a>
            <a href="/auth?mode=register&role=profesional"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Soy profesional — crear perfil
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              { label: `Precio medio ${data.keyword}`, value: data.precio, icon: <Star size={16} /> },
              { label: 'Flash Booking', value: ['promotores', 'azafata', 'peluqueria'].includes(data.slug) ? 'Necesidades urgentes' : 'En menos de 1h', icon: <Zap size={16} /> },
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

        {/* Especialidades */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Especialidades disponibles</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Filtra por especialidad directamente en el directorio XPEAK.
          </p>
          <div className="flex flex-wrap gap-2">
            {data.roles.map(r => (
              <span key={r} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                {r}
              </span>
            ))}
          </div>
        </section>

        {/* Ciudades */}
        {data.cities.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Contratar {data.keyword} por ciudad</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Guías detalladas con precios locales, venues y preguntas frecuentes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.cities.map(c => (
                <a key={c.slug} href={`/contratar-${data.slug}/${c.slug}`}
                  className="flex items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <MapPin size={13} style={{ color: '#D4AF37' }} /> {c.name}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Cómo funciona */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Cómo contratar {data.keyword} con XPEAK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {data.steps.map((s, i) => (
              <div key={s.title} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black mb-3" style={{ color: 'rgba(212,175,55,0.25)' }}>0{i + 1}</p>
                <p className="text-sm font-bold mb-1.5">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {data.faqs.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Artículos relacionados */}
        {BLOG_LINKS[data.slug] && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Guías relacionadas</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Artículos para preparar mejor tu contratación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BLOG_LINKS[data.slug].map(post => (
                <a key={post.href} href={post.href}
                  className="flex items-start gap-4 p-5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-2xl flex-shrink-0">{post.emoji}</span>
                  <div>
                    <p className="text-sm font-black leading-snug mb-1.5">{post.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{post.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Buscas {data.keyword} para tu evento?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Contacta directamente — sin registro, sin comisión, respuesta directa del profesional.
            </p>
            <a href={`/directorio/${['dj','fotografo','staff','maquillaje','peluqueria','promotores','azafata'].includes(data.slug) ? data.slug : data.slug === 'camareros' ? 'staff' : 'dj'}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver profesionales disponibles <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
