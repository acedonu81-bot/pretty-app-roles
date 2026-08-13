import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Qué hace exactamente un promotor de eventos y discotecas',
  description: 'Funciones reales de un promotor o RRPP en clubs y eventos: gestión de listas VIP, captación de público, coordinación de puerta y diferencias con el RRPP de marca.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/que-hace-un-promotor-de-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuál es la diferencia entre promotor y RRPP?', acceptedAnswer: { '@type': 'Answer', text: 'En la práctica se usan casi como sinónimos, pero el "promotor" suele centrarse en captar y traer público (venta de entradas, difusión del evento), mientras que el "RRPP" (relaciones públicas) pone más énfasis en la gestión de listas VIP, la relación directa con clientes habituales y la imagen de la sala.' } },
    { '@type': 'Question', name: '¿Un promotor trabaja para una sola sala o para varias?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del acuerdo. Algunos promotores trabajan en exclusiva para una discoteca o marca de eventos; otros colaboran con varias salas a la vez y reparten su red de contactos según la noche y el tipo de evento.' } },
    { '@type': 'Question', name: '¿Qué necesita saber un promotor para hacer bien su trabajo?', acceptedAnswer: { '@type': 'Answer', text: 'Conocer bien el público objetivo de la sala, tener una red de contactos activa (no solo seguidores en redes), saber gestionar listas y aforo, y coordinar bien con la puerta y el equipo de seguridad la noche del evento.' } },
    { '@type': 'Question', name: '¿Se necesita experiencia previa para trabajar como promotor?', acceptedAnswer: { '@type': 'Answer', text: 'No es imprescindible, pero ayuda mucho tener ya una red de contactos o experiencia en organización de grupos. Muchas salas prueban con promotores nuevos en noches de menor exigencia antes de darles fechas clave.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Qué hace un promotor de eventos', item: 'https://xpeak.es/blog/que-hace-un-promotor-de-eventos' },
  ],
};

const FUNCIONES = [
  { funcion: 'Captación de público', detalle: 'Difunde el evento en su red de contactos y redes sociales para atraer asistentes objetivo de la sala.' },
  { funcion: 'Gestión de listas VIP', detalle: 'Organiza quién entra gratis, quién con descuento y quién con consumición, coordinando con la puerta la noche del evento.' },
  { funcion: 'Coordinación de puerta', detalle: 'Está presente o en contacto directo con el equipo de acceso para resolver incidencias de lista en tiempo real.' },
  { funcion: 'Relación con clientes habituales', detalle: 'Mantiene el contacto con grupos y clientes recurrentes entre eventos, no solo el día de la fiesta.' },
  { funcion: 'Difusión en redes (opcional)', detalle: 'Algunos perfiles incluyen creación de contenido y stories para promocionar el evento, como servicio adicional.' },
];

export default function BlogQueHacePromotorEventos() {
  return (
    <>
      <Helmet>
        <title>Qué hace exactamente un promotor de eventos (2026) | XPEAK</title>
        <meta name="description" content="Funciones reales de un promotor o RRPP: captación de público, gestión de listas VIP, coordinación de puerta y diferencias con el RRPP de marca." />
        <link rel="canonical" href="https://xpeak.es/blog/que-hace-un-promotor-de-eventos" />
        <meta property="og:title" content="Qué hace un promotor de eventos — XPEAK Blog" />
        <meta property="og:description" content="Funciones reales de un promotor o RRPP en clubs y eventos." />
        <meta property="og:url" content="https://xpeak.es/blog/que-hace-un-promotor-de-eventos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=promotor" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Promotores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Qué hace exactamente un promotor de eventos</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Más allá de "traer gente a la discoteca": así se reparten en la práctica las funciones de un promotor o RRPP en clubs y eventos.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Funciones principales</h2>
              <div className="space-y-3">
                {FUNCIONES.map((f, i) => (
                  <div key={f.funcion} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black mb-1">{f.funcion}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas promotores para tu sala o evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados de promotores y RRPP en tu ciudad. Gratis, sin comisión.
              </p>
              <a href="/directorio/promotores" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de promotores →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/que-hace-un-promotor-de-eventos' tag='Promotores' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_que_hace_promotor" />
      </div>
    </>
  );
}
