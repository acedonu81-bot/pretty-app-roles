import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '10 ideas para eventos de empresa originales en España 2026',
  description: '10 ideas originales para eventos de empresa en España. Team building gastronómico, escape room, magia, DJ privado, flamenco y más. Precios y cuándo es ideal cada opción.',
  datePublished: '2026-06-14',
  dateModified: '2026-06-14',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/ideas-eventos-empresa-originales',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Ideas eventos empresa originales', item: 'https://xpeak.es/blog/ideas-eventos-empresa-originales' },
  ],
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un DJ para un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ set privado con equipo propio cuesta entre 300€ y 800€ por 3-4 horas. A diferencia de una playlist de Spotify, el DJ lee la energía del grupo y adapta la música en tiempo real, y muchos DJs especializados en eventos corporativos saben gestionar el paso de la cena al afterwork sin cortar la velada.' } },
    { '@type': 'Question', name: '¿Qué actividad de team building es más económica?', acceptedAnswer: { '@type': 'Answer', text: 'Entre las opciones por persona, las más económicas son el escape room privado (25-50€) y la yincana urbana (30-60€), seguidas del taller de coctelería (40-80€) y el team building gastronómico (50-90€). El precio por persona depende del tamaño del grupo.' } },
    { '@type': 'Question', name: '¿Qué idea funciona mejor con equipos internacionales?', acceptedAnswer: { '@type': 'Answer', text: 'El taller de flamenco, con un bailaor o bailaora profesional y guitarrista en directo (400€-900€), es especialmente impactante con equipos internacionales o eventos con visitantes extranjeros. La actuación de magia close-up también funciona en grupos de cualquier tamaño y genera mucha conversación después del evento.' } },
  ],
};

const IDEAS = [
  {
    num: '01',
    titulo: 'Team building gastronómico',
    desc: 'Los equipos compiten cocinando platos bajo la guia de un chef profesional. Ideal para grupos de hasta 40 personas. Las variantes mas populares son la paella, los pintxos vascos o la cocina mediterránea. Combina trabajo en equipo, creatividad y una cena al final.',
    precio: '50–90€ por persona',
    ideal: 'Cenas de empresa de fin de año o bienvenida a nuevos equipos.',
  },
  {
    num: '02',
    titulo: 'Escape room privado',
    desc: 'Una sala de escape reservada en exclusiva para el equipo. Muchos proveedores ofrecen modalidad en vuestras propias instalaciones con material montado al momento. La presión del tiempo y la resolución de puzzles en equipo generan conversaciones que el trabajo diario no facilita.',
    precio: '25–50€ por persona',
    ideal: 'Grupos de 10 a 30 personas. Onboarding o cierres de proyecto.',
  },
  {
    num: '03',
    titulo: 'Taller de coctelería',
    desc: 'Un bartender profesional enseña a preparar cócteles clásicos y versiones sin alcohol. Cada persona prepara sus propias bebidas. La actividad es muy social, no requiere habilidad previa y el resultado es la cena o aperitivo del mismo evento.',
    precio: '40–80€ por persona',
    ideal: 'Afterworks, presentaciones de producto o celebraciones de hitos.',
  },
  {
    num: '04',
    titulo: 'Actuación de magia close-up',
    desc: 'Un mago profesional circula entre las mesas o grupos haciendo trucos a pocos centimetros de los asistentes. No necesita escenario ni preparacion especial del espacio. Es uno de los formatos que mas conversacion genera despues del evento.',
    precio: '250–600€ por actuacion (1-2h)',
    ideal: 'Cokteles, recepciones y cenas de gala. Grupos de cualquier tamaño.',
  },
  {
    num: '05',
    titulo: 'Photobooth 360',
    desc: 'Una plataforma giratoria con cámara que graba vídeos cortos al estilo de las redes sociales. Los empleados suben al plato, el sistema genera el clip con música y efectos, y pueden descargarlo al instante. Genera contenido que la gente comparte voluntariamente.',
    precio: '400–800€ (3-4h de servicio)',
    ideal: 'Fiestas de empresa, presentaciones de marca o lanzamientos de producto.',
  },
  {
    num: '06',
    titulo: 'Cuarteto de jazz en vivo',
    desc: 'Un cuarteto de jazz crea una atmosfera completamente distinta a cualquier playlist. La musica en directo hace que las conversaciones fluyan de forma diferente. Funciona especialmente bien en cenas de empresa con invitados externos o clientes.',
    precio: '500–1.200€ (2-3h)',
    ideal: 'Cenas de gala, presentaciones a clientes, eventos de marca.',
  },
  {
    num: '07',
    titulo: 'DJ set privado',
    desc: 'Un DJ profesional con equipo propio convierte cualquier sala en una experiencia de fiesta. A diferencia del playlist en Spotify, el DJ lee la energia del grupo y adapta la musica en tiempo real. Muchos DJs especializados en eventos corporativos saben gestionar el paso de cena a afterwork sin cortar la velada.',
    precio: '300–800€ (3-4h con equipo)',
    ideal: 'Fiestas de empresa, premios anuales, apertura de oficinas.',
  },
  {
    num: '08',
    titulo: 'Taller de flamenco',
    desc: 'Un bailaor o bailaora profesional con guitarrista en directo enseña los elementos basicos del flamenco. No hace falta experiencia. La combinacion de ritmo, palmas y movimiento genera un ambiente muy festivo. Especialmente impactante con equipos internacionales o en eventos con visitantes extranjeros.',
    precio: '400–900€ (1.5-2h con musico incluido)',
    ideal: 'Eventos con asistentes internacionales, team days culturales.',
  },
  {
    num: '09',
    titulo: 'Quiz night corporativo',
    desc: 'Un presentador profesional conduce una noche de preguntas y respuestas por equipos con categorias personalizadas para la empresa: historia de la compañia, trivia del sector, cultura general. Muy competitivo, muy divertido y no necesita espacio especial.',
    precio: '300–600€ (2h de actividad)',
    ideal: 'Afterwork en sala privada de bar o restaurante. Grupos de 20-100 personas.',
  },
  {
    num: '10',
    titulo: 'Yincana urbana',
    desc: 'Los equipos compiten resolviendo retos y pistas por el centro de la ciudad o por las instalaciones de la empresa. Hay versiones digitales con app y versiones clasicas con sobre y mapa. La yincana genera conversacion espontanea y competitividad sana entre departamentos.',
    precio: '30–60€ por persona',
    ideal: 'Team days, bienvenidas a nuevos empleados, integración de equipos remotos.',
  },
];

export default function BlogEventoEmpresaIdeas() {
  return (
    <>
      <Helmet>
        <title>10 ideas para eventos de empresa originales en España 2026 | XPEAK</title>
        <meta name="description" content="10 ideas originales para eventos de empresa en España: team building gastronómico, escape room, DJ privado, magia, flamenco y más. Precios y cuándo es ideal cada opción." />
        <link rel="canonical" href="https://xpeak.es/blog/ideas-eventos-empresa-originales" />
        <meta property="og:title" content="10 ideas para eventos de empresa originales 2026 — XPEAK Blog" />
        <meta property="og:description" content="Ideas originales para eventos de empresa en España. Precios orientativos y cuándo usar cada formato." />
        <meta property="og:url" content="https://xpeak.es/blog/ideas-eventos-empresa-originales" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Eventos de empresa · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">10 ideas para eventos de empresa originales en España (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Los eventos de empresa bien ejecutados mejoran la cohesion del equipo, la retención del talento y la percepcion de la marca. Estas son las 10 ideas mas contratadas en España este año, con precio orientativo y cuándo funciona mejor cada una.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>14 junio 2026</time>
          </div>
          <div className="space-y-8">
            {IDEAS.map(idea => (
              <section key={idea.num} className="p-5 sm:p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-3xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.25)' }}>{idea.num}</span>
                  <h2 className="text-lg font-black leading-tight pt-0.5">{idea.titulo}</h2>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{idea.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Precio orientativo</p>
                    <p className="text-sm font-black" style={{ color: '#D4AF37' }}>{idea.precio}</p>
                  </div>
                  <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Ideal para</p>
                    <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>{idea.ideal}</p>
                  </div>
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-base font-black mb-2">Organiza tu evento de empresa con XPEAK</p>
              <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>DJs, magos, grupos musicales, bartenders y animadores. Perfiles verificados, precio publico y contratos digitales. Sin comision.</p>
              <a href="/directorio/dj"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver profesionales para eventos
              </a>
            </section>
          </div>
        </main>
        <BlogRelatedPosts currentSlug='/blog/ideas-eventos-empresa-originales' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_evento_empresa_ideas" />
      </div>
    </>
  );
}
