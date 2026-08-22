import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo elegir presentador para un evento de empresa',
  description: 'MC, keynote speaker o presentador bilingüe: cómo elegir el perfil correcto según el tipo de evento corporativo y qué preguntar antes de contratar.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/como-elegir-presentador-evento-empresa',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Necesito un MC o un keynote speaker?', acceptedAnswer: { '@type': 'Answer', text: 'Un MC conduce el evento, presenta a los ponentes y dinamiza la audiencia entre actos. Un keynote speaker da una ponencia de contenido propio sobre un tema concreto. Muchos eventos necesitan ambos roles, a veces en la misma persona.' } },
    { '@type': 'Question', name: '¿Qué información necesita el presentador antes del evento?', acceptedAnswer: { '@type': 'Answer', text: 'El guión o escaleta del evento, los nombres y cargos de los ponentes, el tono deseado (formal o distendido) y cualquier detalle sensible de la empresa que deba mencionar o evitar.' } },
    { '@type': 'Question', name: '¿Cuánto tiempo antes hay que contratar al presentador?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos grandes con briefing y preparación de guión, 3-4 semanas de antelación es razonable. Para presentaciones sencillas, 1-2 semanas suele ser suficiente si el profesional tiene disponibilidad.' } },
    { '@type': 'Question', name: '¿Se puede pedir una prueba o vídeo del presentador antes de contratar?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Es buena práctica pedir vídeos de actuaciones anteriores para valorar el tono, la dicción y el manejo del público antes de confirmar la contratación.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo elegir presentador para un evento de empresa', item: 'https://xpeak.es/blog/como-elegir-presentador-evento-empresa' },
  ],
};

const PERFILES = [
  { perfil: 'MC / Presentador de gala', detalle: 'Conduce el evento de principio a fin: da la bienvenida, presenta a los ponentes y dinamiza los tiempos muertos entre actos.' },
  { perfil: 'Keynote speaker', detalle: 'Da una ponencia con contenido propio sobre un tema concreto (liderazgo, innovación, motivación). No conduce el resto del evento.' },
  { perfil: 'Presentador bilingüe', detalle: 'Trabaja en dos idiomas para eventos con público internacional o ponentes extranjeros.' },
  { perfil: 'Moderador de mesa redonda', detalle: 'Dirige el debate entre varios ponentes, controla los tiempos y formula las preguntas del público.' },
];

export default function BlogComoElegirPresentadorEventoEmpresa() {
  return (
    <>
      <Helmet>
        <title>Cómo elegir presentador para un evento de empresa (2026) | XPEAK</title>
        <meta name="description" content="MC, keynote speaker o presentador bilingüe: cómo elegir el perfil correcto según el tipo de evento corporativo." />
        <link rel="canonical" href="https://xpeak.es/blog/como-elegir-presentador-evento-empresa" />
        <meta property="og:title" content="Cómo elegir presentador para un evento de empresa — XPEAK Blog" />
        <meta property="og:description" content="Qué perfil de presentador elegir según el tipo de evento corporativo." />
        <meta property="og:url" content="https://xpeak.es/blog/como-elegir-presentador-evento-empresa" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#2563EB' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>Speaker · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo elegir presentador para un evento de empresa</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              MC, keynote speaker, presentador bilingüe o moderador de mesa redonda: cada formato cumple una función distinta en el evento.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Perfiles y cuándo elegir cada uno</h2>
              <div className="space-y-3">
                {PERFILES.map((p, i) => (
                  <div key={p.perfil} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#2563EB' }}>{p.perfil}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas presentador para tu evento de empresa?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/speaker" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>
                Ver directorio de speakers →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/como-elegir-presentador-evento-empresa' tag='Speaker' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_elegir_presentador" />
      </div>
    </>
  );
}
