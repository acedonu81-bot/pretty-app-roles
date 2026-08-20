import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo elegir mago para tu evento: tipos de magia y qué preguntar',
  description: 'Guía para elegir mago de eventos: diferencias entre magia de cerca, de escenario e infantil, y qué preguntar antes de contratar.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/como-elegir-mago-para-tu-evento',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué diferencia hay entre magia de cerca y magia de escenario?', acceptedAnswer: { '@type': 'Answer', text: 'La magia de cerca (close-up) se hace mesa por mesa o en pequeños grupos, ideal para cócteles y bodas. La magia de escenario es un show para todo el público a la vez, con más producción y necesita un espacio y sonido adecuados.' } },
    { '@type': 'Question', name: '¿Qué debo preguntar antes de contratar un mago?', acceptedAnswer: { '@type': 'Answer', text: 'Cuánto dura el show, si incluye desplazamiento, si necesita equipo de sonido propio o del local, y si tiene experiencia con el tipo de público de tu evento (infantil, adulto, corporativo).' } },
    { '@type': 'Question', name: '¿Es lo mismo un mago para niños que para adultos?', acceptedAnswer: { '@type': 'Answer', text: 'No necesariamente. La magia infantil suele incluir participación de los niños, humor sencillo y globoflexia. La magia para adultos (bodas, eventos corporativos) suele ser más sutil, con mentalismo o magia de cerca sofisticada.' } },
    { '@type': 'Question', name: '¿Cuánto dura un show de magia típico?', acceptedAnswer: { '@type': 'Answer', text: 'Un show de escenario suele durar entre 30 y 60 minutos. La magia de cerca en formato de mesas puede extenderse durante todo un cóctel, rotando entre grupos.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo elegir mago para tu evento', item: 'https://xpeak.es/blog/como-elegir-mago-para-tu-evento' },
  ],
};

const TIPOS = [
  { tipo: 'Magia de cerca (close-up)', detalle: 'Mesa por mesa o en pequeños grupos. Ideal para cócteles, bodas y recepciones donde el público está sentado o de pie en grupos.' },
  { tipo: 'Magia de escenario', detalle: 'Show completo para todo el público a la vez. Necesita espacio, a veces micrófono, y suele durar entre 30-60 minutos.' },
  { tipo: 'Mentalismo', detalle: 'Enfocado en lectura de pensamiento y predicciones. Muy demandado en eventos corporativos y bodas con público adulto.' },
  { tipo: 'Magia infantil', detalle: 'Combina trucos sencillos con participación de los niños, humor y a veces globoflexia. Formato habitual en cumpleaños y comuniones.' },
];

export default function BlogComoElegirMagoEventos() {
  return (
    <>
      <Helmet>
        <title>Cómo elegir mago para tu evento (2026) | XPEAK</title>
        <meta name="description" content="Guía para elegir mago de eventos: diferencias entre magia de cerca, de escenario e infantil, y qué preguntar antes de contratar." />
        <link rel="canonical" href="https://xpeak.es/blog/como-elegir-mago-para-tu-evento" />
        <meta property="og:title" content="Cómo elegir mago para tu evento — XPEAK Blog" />
        <meta property="og:description" content="Tipos de magia y qué preguntar antes de contratar un mago para tu evento." />
        <meta property="og:url" content="https://xpeak.es/blog/como-elegir-mago-para-tu-evento" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#7C3AED' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=mago" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#7C3AED,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>Mago · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo elegir mago para tu evento</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Magia de cerca, de escenario, mentalismo o show infantil: cada formato encaja con un tipo de evento distinto. Así se elige bien.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tipos de magia según el evento</h2>
              <div className="space-y-3">
                {TIPOS.map((t, i) => (
                  <div key={t.tipo} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#7C3AED' }}>{t.tipo}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{t.detalle}</p>
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

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas mago para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/mago" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#7C3AED,#B8941E)', color: '#000' }}>
                Ver directorio de magos →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/como-elegir-mago-para-tu-evento' tag='Mago' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_elegir_mago" />
      </div>
    </>
  );
}
