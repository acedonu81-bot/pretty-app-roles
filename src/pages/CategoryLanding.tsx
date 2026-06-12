import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight, Music, Users, Camera, MapPin, Scissors, Megaphone, UtensilsCrossed, Shirt } from 'lucide-react';
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
  promotores: [
    { href: '/blog/promotores-de-eventos-que-hacen', emoji: '📣', title: 'Promotores de eventos: qué hacen y cuánto cobran', desc: 'Tipos, funciones y cómo estructurar el contrato con métricas.' },
  ],
  'disco-movil': [
    { href: '/blog/disco-movil-para-comuniones', emoji: '🎵', title: 'Disco móvil para comuniones: precios 2026', desc: 'Paquetes, qué incluye y cómo elegir el DJ para tu comunión.' },
    { href: '/blog/dj-para-bodas-vs-discoteca', emoji: '🆚', title: 'DJ para bodas vs DJ de discoteca', desc: 'Diferencias, equipos y cómo elegir el perfil correcto.' },
  ],
};

const CATEGORY_DATA: Record<string, {
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
      { title: 'Crea tu cuenta gratis', body: 'Regístrate como sala, promotora u organizador en menos de 2 minutos. Sin tarjeta de crédito.' },
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
      { title: 'Crea tu cuenta gratis', body: 'Regístrate como sala, promotora u organizador. Sin tarjeta de crédito. En menos de 2 minutos.' },
      { title: 'Describe tu necesidad', body: 'Especifica el tipo de staff, número de personas, fecha y presupuesto. Flash Booking gestiona la distribución automáticamente.' },
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
      { title: 'Crea tu cuenta gratis', body: 'Regístrate en menos de 2 minutos. Sin tarjeta. El perfil empresario te da acceso al directorio completo.' },
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
      { title: 'Crea tu cuenta gratis', body: 'Regístrate como organizador o empresa en menos de 2 minutos. Sin tarjeta de crédito.' },
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
      { title: 'Crea tu cuenta gratis', body: 'Regístrate como organizador o empresa. Sin tarjeta. En menos de 2 minutos tienes acceso al directorio completo.' },
      { title: 'Describe tu evento', body: 'Indica número de asistentes, tipo de servicio, fecha y presupuesto aproximado. Los proveedores de tu zona reciben la solicitud al instante.' },
      { title: 'Elige y firma', body: 'Compara propuestas, elige el catering que mejor se adapta y firma el contrato digital. Todo en la plataforma, sin llamadas ni correos.' },
    ],
  },
  maquillaje: {
    slug: 'maquillaje',
    emoji: '💄',
    h1: 'Contratar Maquillador para Eventos',
    tagline: 'Maquilladores y estilistas profesionales para bodas, eventos y producción audiovisual',
    desc: 'Contrata maquilladores profesionales para bodas, eventos de moda y producción audiovisual en España. Artistas verificados, portafolio real, contrato digital en minutos.',
    intro: 'XPEAK conecta novias, agencias de moda y productoras con maquilladores y estilistas profesionales en toda España. Desde el maquillaje de novia hasta la caracterización para producciones audiovisuales, con perfiles verificados y portafolios reales.',
    keyword: 'Maquillador/a',
    keywords: 'contratar maquillador boda España, maquilladora profesional eventos, maquillaje nupcial Madrid Barcelona, maquillador caracterización producción, estilista eventos España',
    precio: 'desde 80€/sesión',
    cities: [
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Barcelona', slug: 'barcelona' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Sevilla', slug: 'sevilla' },
      { name: 'Málaga', slug: 'malaga' },
      { name: 'Palma', slug: 'palma' },
    ],
    roles: ['Maquillaje nupcial', 'Maquillaje editorial', 'Caracterización', 'Airbrush', 'Maquillaje artístico', 'Peinado y recogidos', 'Maquillaje de pasarela', 'Maquillaje para foto y vídeo', 'Peluquería', 'Estilismo integral'],
    faqs: [
      { q: '¿Cuánto cuesta un maquillador profesional para una boda?', a: 'El precio de un maquillador de boda en España varía entre 150€ y 500€ para la novia, más 80€-150€ por cada persona adicional del séquito. Incluye prueba previa y el día del evento.' },
      { q: '¿Puedo contratar maquillador para producción audiovisual?', a: 'Sí. XPEAK incluye artistas especializados en maquillaje para cine, televisión, videoclips y fotografía publicitaria, con experiencia en sets de rodaje y entregas ajustadas a tiempos de producción.' },
      { q: '¿Los maquilladores trabajan a domicilio?', a: 'La mayoría de los profesionales en XPEAK ofrecen servicio a domicilio o en el venue del evento. Puedes especificarlo en tu solicitud.' },
      { q: '¿Qué incluye una prueba de maquillaje?', a: 'La prueba de maquillaje previa al evento incluye la sesión de test del look completo (1-2 horas) y suele tener un coste entre 60€ y 120€ que normalmente se descuenta del precio total.' },
    ],
    steps: [
      { title: 'Crea tu perfil gratis', body: 'Regístrate como organizador o empresa. Sin tarjeta. Acceso inmediato al directorio de artistas.' },
      { title: 'Busca o publica oferta', body: 'Filtra por especialidad, zona y disponibilidad, o usa Flash Booking para recibir candidaturas urgentes.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital. Incluye fecha, servicios acordados y condiciones de cancelación.' },
    ],
  },
  promotores: {
    slug: 'promotores',
    emoji: '📣',
    h1: 'Contratar Promotores de Eventos',
    tagline: 'Promotores y RRPP profesionales para discotecas, festivales y eventos nocturnos',
    desc: 'Contrata promotores y relaciones públicas profesionales para discotecas, festivales y eventos en España. Perfiles verificados, resultados medibles, contratos automáticos. Sin comisión.',
    intro: 'XPEAK reúne los mejores promotores y relaciones públicas del sector del ocio nocturno y los eventos en España. Profesionales con cartera de clientes activa, experiencia en clubs y festivales, disponibles para acuerdos puntuales o de temporada con contratos digitales en minutos.',
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
    ],
    roles: ['Promotor de sala', 'Relaciones Públicas', 'Community manager presencial', 'Captador/a de público', 'Promotor de festival', 'Influencer de evento', 'Coordinador de lista de invitados', 'Brand ambassador', 'Promotor digital', 'Equipo de RRPP'],
    faqs: [
      { q: '¿Cuánto cobra un promotor de discoteca en España?', a: 'Los promotores profesionales en España cobran entre 100€ y 400€ por noche según su cartera de clientes y la sala. Los RRPP con lista propia de calidad cobran más, pero generan mayor retorno en taquilla.' },
      { q: '¿Qué diferencia hay entre un promotor y un relaciones públicas?', a: 'El promotor trabaja captando público en calle, redes y grupos. El RRPP gestiona listas de invitados, reservas de mesa VIP y relaciones con clientes premium. En XPEAK puedes encontrar ambos perfiles o profesionales que combinan las dos funciones.' },
      { q: '¿Puedo contratar promotores para un evento de una sola noche?', a: 'Sí. XPEAK permite contrataciones puntuales para una noche, fines de semana o temporadas completas. El Flash Booking encuentra promotores disponibles en tu zona en menos de 1 hora.' },
      { q: '¿Cómo mido el rendimiento de un promotor?', a: 'Los contratos de XPEAK incluyen métricas acordadas: número de asistentes traídos, ventas de reservas o taquilla atribuida. Puedes añadir cláusulas de incentivo por objetivos directamente en el contrato digital.' },
    ],
    steps: [
      { title: 'Crea tu cuenta gratis', body: 'Regístrate como sala, festival o promotora. Sin tarjeta. Acceso inmediato a todos los perfiles.' },
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
      { title: 'Crea tu perfil gratis', body: 'Regístrate como organizador, productora o empresa. Sin tarjeta. En menos de 2 minutos.' },
      { title: 'Busca o publica tu oferta', body: 'Filtra por especialidad y zona, o usa Flash Booking. Detalla el tipo de evento y el número de personas a estilizar.' },
      { title: 'Contrato y confirmación', body: 'Firma el contrato digital con un clic. Incluye horarios, servicios pactados y condiciones de cancelación.' },
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

const ICON: Record<string, React.ReactNode> = {
  dj: <Music size={20} />,
  staff: <Users size={20} />,
  fotografo: <Camera size={20} />,
  camareros: <UtensilsCrossed size={20} />,
  catering: <UtensilsCrossed size={20} />,
  maquillaje: <Scissors size={20} />,
  promotores: <Megaphone size={20} />,
  vestuario: <Shirt size={20} />,
  'disco-movil': <Music size={20} />,
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
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav mínima */}
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
            <a href="/auth"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Publicar oferta gratis
            </a>
            <a href={`/directorio/${['dj','fotografo','staff','maquillaje','promotores'].includes(data.slug) ? data.slug : data.slug === 'camareros' ? 'staff' : 'dj'}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver directorio <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              { label: `Precio medio ${data.keyword}`, value: data.precio, icon: <Star size={16} /> },
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

        {/* Especialidades */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Especialidades disponibles</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
        {data.cities.length > 0 && ['dj','camareros','staff','fotografo','catering','disco-movil'].includes(data.slug) && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Contratar {data.keyword} por ciudad</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.body}</p>
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
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{post.desc}</p>
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
              Únete gratis — sin comisión, contratos automáticos, Flash Booking en menos de 1h.
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Empezar gratis
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
