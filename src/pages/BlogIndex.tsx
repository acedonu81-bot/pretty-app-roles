import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAuthor from '@/components/BlogAuthor';

const POSTS = [
  { slug: '/blog/dj-bodas-bilbao', title: 'DJ para bodas en Bilbao: precio y cómo contratar en 2026', desc: 'Precios DJs boda Bilbao. Caseríos vascos, costa del Cantábrico y bodegas de Rioja Alavesa.', date: '3 jun 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-bodas-mallorca', title: 'DJ para bodas en Mallorca: precio y cómo contratar en 2026', desc: 'Precios DJs boda Mallorca. Fincas de lujo, bodas internacionales y temporada mayo-octubre.', date: '3 jun 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/fotografo-boda-valencia', title: 'Fotógrafo para bodas en Valencia: precio y guía 2026', desc: 'Precios fotógrafos boda Valencia. Estilo mediterráneo, L\'Albufera y cuándo reservar.', date: '3 jun 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/fotografo-boda-sevilla', title: 'Fotógrafo para bodas en Sevilla: precio y guía 2026', desc: 'Precios fotógrafos boda Sevilla. Haciendas, patios y la luz dorada andaluza única en España.', date: '3 jun 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/fotografo-boda-madrid', title: 'Fotógrafo para bodas en Madrid: precio y guía 2026', desc: 'Precios reales de fotógrafos de boda en Madrid. Zonas, estilos y con cuánta antelación reservar.', date: '2 jun 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/fotografo-boda-barcelona', title: 'Fotógrafo para bodas en Barcelona: precio y guía 2026', desc: 'Precios y estilos de fotógrafos de boda en Barcelona. Documental, editorial y cuándo reservar.', date: '2 jun 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/dj-bodas-sevilla', title: 'DJ para bodas en Sevilla: precio y cómo contratar en 2026', desc: 'Precios reales de DJs de boda en Sevilla. Haciendas, campiña andaluza y zonas más demandadas.', date: '2 jun 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-bodas-malaga', title: 'DJ para bodas en Málaga: precio y cómo contratar en 2026', desc: 'Precios de DJs de boda en Málaga. Costa del Sol, Serranía de Ronda y temporada alta.', date: '2 jun 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/como-ser-promotor-eventos', title: 'Cómo ser promotor de eventos en España: guía completa 2026', desc: 'Qué hace un promotor, cuánto cobra, modelos de comisión y cómo conseguir los primeros contratos con salas.', date: '2 jun 2026', tag: 'Staff', min: 5 },
  { slug: '/blog/maquilladora-conseguir-clientes', title: 'Cómo conseguir trabajo de maquilladora en España 2026', desc: '6 estrategias para maquilladoras freelance. Portfolio, Instagram, colaboraciones y cómo fijar el precio.', date: '2 jun 2026', tag: 'Maquillaje', min: 4 },
  { slug: '/blog/como-trabajar-de-rrpp-discoteca', title: 'Cómo trabajar de RRPP en discoteca en España: guía 2026', desc: 'Qué hace un RRPP, cuánto cobra por comisión y cómo conseguir contratos con discotecas y clubs nocturnos.', date: '2 jun 2026', tag: 'Staff', min: 4 },
  { slug: '/blog/como-conseguir-bolos-dj', title: 'Cómo conseguir bolos como DJ en España: 8 estrategias 2026', desc: 'Guía práctica para DJs freelance. Plataformas, redes, precios y cómo diferenciarte en el mercado de bodas y eventos.', date: '2 jun 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/como-trabajar-de-camarero-eventos', title: 'Cómo trabajar de camarero en eventos en España: guía 2026', desc: 'Requisitos, cuánto cobras por jornada y cómo buscar trabajo de camarero en bodas, comuniones y eventos corporativos.', date: '2 jun 2026', tag: 'Staff', min: 5 },
  { slug: '/blog/fotografo-como-conseguir-clientes', title: 'Cómo conseguir clientes como fotógrafo de eventos 2026', desc: '7 estrategias para fotógrafos freelance de bodas y comuniones. Portfolio, Instagram, plataformas y precios.', date: '2 jun 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/fotografo-comunion-madrid', title: 'Fotógrafo para comunión en Madrid: precio y guía 2026', desc: 'Cuánto cuesta un fotógrafo de comunión en Madrid. Paquetes, momentos clave y cuándo reservar para mayo o junio.', date: '28 may 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/dj-bodas-barcelona', title: 'DJ para bodas en Barcelona: precio y cómo contratar en 2026', desc: 'Precios reales de DJs de boda en Barcelona. Maresme, Penedès, Costa Daurada y cómo elegir el perfil correcto.', date: '28 may 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/dj-bodas-valencia', title: 'DJ para bodas en Valencia: precio y cómo contratar en 2026', desc: 'Precios reales de DJs de boda en Valencia. L\'Albufera, Marina Alta y cómo contratar en la Comunitat Valenciana.', date: '28 may 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/dj-bodas-madrid', title: 'DJ para bodas en Madrid: precio y cómo contratar en 2026', desc: 'Cuánto cuesta un DJ para una boda en Madrid. Precios reales, zonas de celebración y cómo elegir el mejor DJ en la Comunidad de Madrid.', date: '28 may 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/contrato-dj-que-debe-incluir', title: 'Contrato DJ: qué debe incluir y cómo redactarlo (2026)', desc: 'Checklist legal completo para contratos de DJ. Cláusulas obligatorias, errores frecuentes y cómo protegerte antes de firmar.', date: '27 may 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/fotografo-para-comunion-precio', title: 'Fotógrafo para comunión: precio y qué incluye en España (2026)', desc: 'Cuánto cuesta un fotógrafo para una comunión. Precios por paquetes, qué incluye el reportaje y cuándo reservar.', date: '27 may 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/dj-para-comunion-precio', title: 'DJ para comunión: precio y qué incluye el servicio en España (2026)', desc: 'Cuánto cuesta un DJ para una comunión. Precios por horas, diferencias con la disco móvil y qué música poner.', date: '27 may 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-para-fiesta-privada-precio', title: 'DJ para fiesta privada: precios y qué incluye en España (2026)', desc: 'Cuánto cuesta contratar un DJ para una fiesta privada. Precios según el número de invitados, horas y equipo incluido.', date: '23 may 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/cuanto-cuesta-una-comunion-en-espana', title: '¿Cuánto cuesta una comunión en España? Presupuesto completo 2026', desc: 'Desglose real del coste de una comunión: catering, DJ, fotógrafo, animación y decoración. Precios por partida para 80–100 invitados.', date: '23 may 2026', tag: 'Eventos', min: 5 },
  { slug: '/blog/cantante-para-bodas-precio', title: 'Cantante para bodas: precio y cómo contratar en España (2026)', desc: 'Cuánto cuesta un cantante para una boda. Precios por formato: solista, dúo acústico, trío jazz o banda completa.', date: '23 may 2026', tag: 'Bodas', min: 5 },
  { slug: '/blog/dj-para-eventos-corporativos-precio', title: 'DJ para eventos corporativos: precio y qué pedir en España (2026)', desc: 'Cuánto cuesta un DJ para un evento corporativo. Precios para afterworks, galas, fiestas de empresa y presentaciones.', date: '23 may 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/maquilladora-para-eventos-precio', title: 'Maquilladora para eventos: precios y qué incluye en España (2026)', desc: 'Cuánto cobra una maquilladora para bodas, eventos corporativos y sesiones de foto. Precios por servicio y duración.', date: '23 may 2026', tag: 'Maquillaje', min: 4 },
  { slug: '/blog/saxofonista-para-bodas-precio', title: 'Saxofonista para bodas: precio y repertorio en España (2026)', desc: 'Cuánto cuesta un saxofonista para una boda. Precios por ceremonia, cóctel y pista. Saxo solo vs saxo + DJ.', date: '23 may 2026', tag: 'Bodas', min: 4 },
  { slug: '/blog/tecnico-de-sonido-para-eventos', title: 'Técnico de sonido para eventos: funciones y precios en España (2026)', desc: 'Cuánto cuesta un técnico de sonido para bodas, conciertos y eventos corporativos. Diferencias FOH vs monitor.', date: '23 may 2026', tag: 'Eventos', min: 4 },
  { slug: '/blog/personal-de-imagen-ferias-y-congresos', title: 'Personal de imagen para ferias y congresos: precios en España (2026)', desc: 'Cuánto cuestan azafatas, promotoras y modelos para ferias y congresos. Precios por perfil y jornada.', date: '23 may 2026', tag: 'Staff', min: 4 },
  { slug: '/blog/maestro-de-ceremonias-boda-precio-guia', title: 'Maestro de Ceremonias para Bodas: precio y guía completa 2026', desc: 'Cuánto cuesta un maestro de ceremonias para una boda en España. Precios reales, funciones, diferencias con animador y cómo contratar.', date: '16 may 2026', tag: 'Bodas', min: 6 },
  { slug: '/blog/musica-en-vivo-para-bodas', title: 'Música en Vivo para Bodas: grupos, solistas y cuartetos — guía 2026', desc: 'Guía completa de música en vivo para bodas. Precios por formato (solista, trío jazz, banda pop, cuarteto de cuerda) y cuándo combinarla con DJ.', date: '16 may 2026', tag: 'Bodas', min: 7 },
  { slug: '/blog/fotografia-eventos-nocturnos', title: 'Fotografía en eventos nocturnos: precios y cómo contratar en España (2026)', desc: 'Cuánto cobra un fotógrafo de discoteca o eventos nocturnos. Precios por tipo de evento, equipo y cómo elegir el perfil correcto.', date: '3 may 2026', tag: 'Fotografía', min: 4 },
  { slug: '/blog/musica-para-bodas-guia', title: 'Música para bodas: DJ, banda en directo o lista de reproducción — guía 2026', desc: 'Comparativa DJ vs banda en directo vs música grabada. Precios, ventajas y cuándo elegir cada opción para tu boda.', date: '3 may 2026', tag: 'Bodas', min: 5 },
  { slug: '/blog/como-organizar-evento-corporativo', title: 'Cómo organizar un evento corporativo paso a paso: guía completa 2026', desc: 'Presupuesto, proveedores, timeline y checklist completo para organizar eventos de empresa en España.', date: '3 may 2026', tag: 'Eventos', min: 6 },
  { slug: '/blog/dj-para-cumpleanos-precio', title: 'DJ para cumpleaños: precios y qué incluye el servicio en España (2026)', desc: 'Cuánto cuesta contratar un DJ para un cumpleaños. Precios por horas, equipo incluido y cómo elegir el DJ correcto.', date: '3 may 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/maquillaje-nupcial-precio-guia', title: 'Maquillaje nupcial: precios y cómo elegir tu maquilladora en España (2026)', desc: 'Guía de precios de maquillaje para novias. Cuánto cuesta, qué incluye el servicio y cómo no equivocarte en la elección.', date: '3 may 2026', tag: 'Maquillaje', min: 4 },
  { slug: '/blog/precio-azafatas-eventos-espana', title: 'Precio de azafatas para eventos en España: guía completa 2026', desc: 'Tarifas reales de azafatas para ferias, congresos y eventos corporativos. Perfiles, precios por jornada y qué incluye.', date: '4 may 2026', tag: 'Staff', min: 3 },
  { slug: '/blog/contratar-barman-evento-privado', title: 'Contratar barman para evento privado: precios y qué incluye en España (2026)', desc: 'Cuánto cuesta un barman para una boda, fiesta o evento. Paquetes, diferencias con camarero de barra y cuántos necesitas.', date: '4 may 2026', tag: 'Camareros', min: 4 },
  { slug: '/blog/dj-boda-civil-precio-canciones', title: 'DJ para boda civil: precio y qué canciones poner en cada momento (2026)', desc: 'Cuánto cuesta el DJ para una boda civil y qué música poner en la entrada, firma, cóctel y pista de baile.', date: '4 may 2026', tag: 'Bodas', min: 4 },
  { slug: '/blog/cuanto-cobra-un-dj-en-espana', title: '¿Cuánto cobra un DJ en España? Tarifas y precios 2026', desc: 'Guía completa con precios de DJs en España por experiencia, ciudad y tipo de evento. IVA, IRPF y equipo incluido.', date: '28 abr 2026', tag: 'DJ', min: 6 },
  { slug: '/blog/cuanto-cobra-un-camarero-de-eventos', title: 'Cuánto cobra un camarero de eventos por horas en España (2026)', desc: 'Precios reales de camareros para bodas, eventos de empresa y fiestas privadas. Cuántos necesitas y cómo contratarlos.', date: '29 abr 2026', tag: 'Camareros', min: 5 },
  { slug: '/blog/cuantos-camareros-necesito-para-mi-boda', title: 'Cuántos camareros necesito para mi boda: guía definitiva 2026', desc: 'Tabla de ratios por número de invitados y formato de servicio. Todo lo que necesitas saber antes de contratar personal de sala.', date: '29 abr 2026', tag: 'Bodas', min: 4 },
  { slug: '/blog/dj-para-bodas-vs-discoteca', title: 'DJ para bodas vs DJ para discoteca: diferencias y precios 2026', desc: '¿Son lo mismo? Diferencias en habilidades, equipamiento y precios. Cómo elegir el perfil correcto para tu evento.', date: '29 abr 2026', tag: 'DJ', min: 4 },
  { slug: '/blog/cuanto-cuesta-una-boda-en-espana', title: '¿Cuánto cuesta una boda en España en 2026? Presupuesto completo', desc: 'Desglose por partidas: catering, DJ, fotógrafo, camareros, flores y más. Precio según número de invitados y ciudad.', date: '2 may 2026', tag: 'Bodas', min: 7 },
  { slug: '/blog/contratar-fotografo-de-bodas', title: 'Cómo contratar un fotógrafo de bodas en España: guía de precios 2026', desc: 'Precios reales por ciudad y tipo de servicio. Qué incluye y cómo elegir el fotógrafo perfecto para tu boda.', date: '3 may 2026', tag: 'Fotografía', min: 5 },
  { slug: '/blog/staff-de-discoteca-funciones-y-salario', title: 'Staff de discoteca: funciones, sueldos y cómo contratar (2026)', desc: 'Guía completa del personal de sala: hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil.', date: '3 may 2026', tag: 'Staff', min: 4 },
  { slug: '/blog/catering-para-eventos-de-empresa', title: 'Catering para eventos de empresa en España: tipos y precios 2026', desc: 'Coffee breaks, cócteles, cenas de gala y food trucks. Precios por persona y cómo elegir el formato correcto.', date: '3 may 2026', tag: 'Catering', min: 4 },
  { slug: '/blog/disco-movil-para-comuniones', title: 'Disco móvil para comuniones: precios y qué incluye en 2026', desc: 'Paquetes, qué incluye el servicio y cómo elegir el DJ correcto para tu comunión en España.', date: '3 may 2026', tag: 'DJ', min: 3 },
  { slug: '/blog/promotores-de-eventos-que-hacen', title: 'Promotores de eventos: qué hacen y cuánto cobran en España (2026)', desc: 'Tipos de promotores, funciones reales, tarifas y cómo estructurar el contrato con métricas medibles.', date: '3 may 2026', tag: 'Staff', min: 4 },
  { slug: '/blog/catering-boda-precio-por-persona', title: 'Catering de boda: precio por persona en España (2026)', desc: 'Cuánto cuesta el catering de una boda. Precios por formato, qué incluye cada paquete y cómo no llevarte sorpresas el día del evento.', date: '4 may 2026', tag: 'Catering', min: 4 },
  { slug: '/blog/videografo-bodas-precio', title: 'Videógrafo para bodas: precio y qué incluye el vídeo en España (2026)', desc: 'Cuánto cuesta contratar un videógrafo para tu boda. Precios por paquete, ciudad y diferencias con el fotógrafo.', date: '4 may 2026', tag: 'Bodas', min: 4 },
  { slug: '/blog/tendencias-bodas-2026', title: 'Tendencias en bodas 2026 en España: decoración, música y experiencias', desc: 'Lo que piden los novios en 2026: bodas íntimas, fincas rurales, catering experiencial y fórmulas mixtas de música.', date: '4 may 2026', tag: 'Bodas', min: 4 },
  { slug: '/blog/animadores-infantiles-comuniones-cumpleanos', title: 'Animadores infantiles para comuniones y cumpleaños: precios 2026', desc: 'Cuánto cuestan los animadores para comuniones y cumpleaños. Tipos de animación, ratios y qué preguntar antes de contratar.', date: '4 may 2026', tag: 'Staff', min: 3 },
  { slug: '/blog/como-organizar-fiesta-empresa', title: 'Cómo organizar una fiesta de empresa: checklist y proveedores (2026)', desc: 'Checklist por fases, presupuesto por partidas y proveedores para la fiesta de empresa perfecta.', date: '4 may 2026', tag: 'Eventos', min: 5 },
  { slug: '/blog/wedding-planner-precio-espana', title: 'Wedding Planner: precio y qué hace en España (2026)', desc: 'Cuánto cobra un wedding planner en España. Precios por paquete, coordinador del día vs planificación integral, y checklist completo.', date: '7 may 2026', tag: 'Bodas', min: 6 },
  { slug: '/blog/como-contratar-personal-para-un-evento', title: 'Cómo contratar personal para un evento en España: guía completa 2026', desc: 'Tipos de personal para eventos, ratios por número de invitados, precios y checklist completo para contratar staff en España.', date: '7 may 2026', tag: 'Staff', min: 5 },
  { slug: '/blog/dj-residente-discoteca-precio', title: 'DJ residente de discoteca: precio y contrato en España (2026)', desc: 'Cuánto cobra un DJ residente en una discoteca. Tarifas por ciudad y aforo, diferencias con DJ invitado y qué incluye el contrato.', date: '7 may 2026', tag: 'DJ', min: 5 },
  { slug: '/blog/catering-comuniones-precio-persona', title: 'Catering para comuniones: precio por persona en España (2026)', desc: 'Cuánto cuesta el catering de una comunión en España. Precios por formato (aperitivo, banquete, todo incluido) y consejos para ahorrar.', date: '7 may 2026', tag: 'Catering', min: 5 },
];

const TAG_COLORS: Record<string, string> = {
  DJ: 'rgba(212,175,55,0.15)',
  Bodas: 'rgba(236,72,153,0.15)',
  Fotografía: 'rgba(99,102,241,0.15)',
  Staff: 'rgba(16,185,129,0.15)',
  Camareros: 'rgba(59,130,246,0.15)',
  Catering: 'rgba(245,158,11,0.15)',
  Maquillaje: 'rgba(236,72,153,0.15)',
  Eventos: 'rgba(139,92,246,0.15)',
};
const TAG_TEXT: Record<string, string> = {
  DJ: '#D4AF37', Bodas: '#f472b6', Fotografía: '#818cf8',
  Staff: '#34d399', Camareros: '#60a5fa', Catering: '#fbbf24',
  Maquillaje: '#f472b6', Eventos: '#a78bfa',
};

const ALL_TAGS = ['Todos', ...Array.from(new Set(POSTS.map(p => p.tag)))];

const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }] };
const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Blog XPEAK — Guías para eventos en España', url: 'https://xpeak.es/blog', numberOfItems: POSTS.length, itemListElement: POSTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://xpeak.es${p.slug}`, name: p.title })) };

export default function BlogIndex() {
  const [activeTag, setActiveTag] = useState('Todos');
  const filtered = activeTag === 'Todos' ? POSTS : POSTS.filter(p => p.tag === activeTag);

  return (
    <>
      <Helmet>
        <title>Blog XPEAK — Guías para contratar profesionales de eventos en España</title>
        <meta name="description" content="Guías y consejos para contratar DJs, camareros, fotógrafos y staff para eventos en España. Precios, ratios y todo lo que necesitas saber." />
        <link rel="canonical" href="https://xpeak.es/blog" />
        <meta property="og:title" content="Blog XPEAK — Guías para eventos en España" />
        <meta property="og:description" content="Guías y consejos para contratar profesionales de eventos en España. Precios y ratios." />
        <meta property="og:url" content="https://xpeak.es/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>Precios</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Blog · XPEAK</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Guías para eventos en España</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>
              Precios reales, ratios y consejos prácticos para contratar DJs, camareros, fotógrafos y staff. <span style={{ color: 'rgba(255,255,255,0.4)' }}>{POSTS.length} artículos</span>
            </p>
          </div>

          {/* Guías por categoría */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Guías completas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { href: '/blog/dj-para-eventos', label: 'DJ', desc: '10 guías' },
                { href: '/blog/profesionales-bodas', label: 'Bodas', desc: '16 guías' },
                { href: '/blog/fotografos-eventos', label: 'Fotografía', desc: '4 guías' },
                { href: '/blog/comuniones-guia-completa', label: 'Comuniones', desc: '6 guías' },
                { href: '/blog/staff-para-eventos', label: 'Staff', desc: '9 guías' },
              ].map(hub => (
                <a key={hub.href} href={hub.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', textDecoration: 'none' }}>
                  <div>
                    <p className="text-xs font-black" style={{ color: '#D4AF37' }}>{hub.label}</p>
                    <p className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>{hub.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="flex flex-wrap gap-2 mb-8">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={activeTag === tag
                  ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-3">
            {filtered.map(post => (
              <a key={post.slug} href={post.slug}
                className="group block p-5 rounded-xl transition-all hover:scale-[1.005]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: TAG_COLORS[post.tag] || 'rgba(255,255,255,0.08)', color: TAG_TEXT[post.tag] || '#8E8EA0' }}>
                    {post.tag}
                  </span>
                  <div className="flex items-center gap-2">
                    <time className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.date}</time>
                    <span className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                    <span className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.min} min</span>
                  </div>
                </div>
                <h2 className="text-sm font-bold mb-1.5 leading-snug transition-colors group-hover:text-white" style={{ color: 'rgba(255,255,255,0.9)' }}>{post.title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{post.desc}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-center" style={{ color: '#8E8EA0' }}>
              ¿Buscas profesionales verificados?{' '}
              <a href="/auth" className="underline font-bold" style={{ color: '#D4AF37' }}>Únete gratis a XPEAK</a>
            </p>
          </div>

                  <BlogEmailCapture variant="presupuestos" intent="general" articlePath="" />
</main>

        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
