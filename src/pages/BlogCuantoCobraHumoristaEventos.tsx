import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un humorista para cenas de empresa y bodas (2026)',
  description: 'Precios reales de humoristas y monologuistas para eventos en España: cenas de empresa, bodas y shows de stand-up.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/cuanto-cobra-un-humorista-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un humorista para una cena de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Un show de 20-30 minutos para una cena de empresa cuesta entre 300€ y 600€. Actuaciones más largas de stand-up (45-60 min) suelen costar entre 500€ y 1.000€.' } },
    { '@type': 'Question', name: '¿El humorista personaliza el monólogo para mi empresa?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de humoristas profesionales ofrecen guion personalizado con referencias al sector, la empresa o los asistentes, siempre que se les facilite la información con antelación.' } },
    { '@type': 'Question', name: '¿Cuánto cuesta un humorista para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'El precio es similar al de una cena de empresa, aunque suele incluir anécdotas personalizadas sobre la pareja y los invitados, lo que puede requerir una breve entrevista previa con los novios.' } },
    { '@type': 'Question', name: '¿Qué diferencia hay entre un show de impro y un monólogo?', acceptedAnswer: { '@type': 'Answer', text: 'El monólogo tiene guión preparado de antemano. La improvisación (impro) se construye en directo a partir de propuestas del público, y suele requerir más de un actor.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuánto cobra un humorista para eventos', item: 'https://xpeak.es/blog/cuanto-cobra-un-humorista-eventos' },
  ],
};

const PRECIOS = [
  { concepto: 'Show 20-30 min (cena de empresa)', precio: '300€ – 600€' },
  { concepto: 'Stand-up 45-60 min', precio: '500€ – 1.000€' },
  { concepto: 'Monólogo personalizado para boda', precio: '400€ – 800€' },
  { concepto: 'Show de impro (varios actores)', precio: '600€ – 1.200€' },
];

export default function BlogCuantoCobraHumoristaEventos() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un humorista para eventos (2026) | XPEAK</title>
        <meta name="description" content="Precios reales de humoristas y monologuistas para eventos en España: cenas de empresa, bodas y shows de stand-up." />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-humorista-eventos" />
        <meta property="og:title" content="Cuánto cobra un humorista para eventos — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de humoristas para cenas de empresa y bodas." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-humorista-eventos" />
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
            <a href="/auth?mode=register&role=humorista" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Humorista · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cuánto cobra un humorista para eventos</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Cenas de empresa, bodas o shows de stand-up: así varían los precios de un humorista profesional según el formato y la duración.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios orientativos</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.concepto} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.concepto}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
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
              <p className="text-sm font-black mb-2">¿Buscas humorista para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/humorista" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de humoristas →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/cuanto-cobra-un-humorista-eventos' tag='Humorista' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_humorista_precio" />
      </div>
    </>
  );
}
