import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un speaker o presentador de eventos en España (2026)',
  description: 'Precios reales de speakers, ponentes y presentadores de eventos en España: keynote speakers, MCs bilingües y presentadores de gala.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/cuanto-cobra-un-speaker-de-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cobra un presentador de eventos corporativos?', acceptedAnswer: { '@type': 'Answer', text: 'Un presentador o MC para un evento corporativo cobra desde 300€ para eventos pequeños hasta 1.500€-2.000€ para galas grandes con producción, según su experiencia y el tamaño del evento.' } },
    { '@type': 'Question', name: '¿Qué es un keynote speaker y cuánto cobra?', acceptedAnswer: { '@type': 'Answer', text: 'Un keynote speaker da una ponencia principal sobre un tema concreto (liderazgo, innovación, motivación). Los precios van desde 800€-1.500€ para ponentes nacionales hasta varios miles de euros para speakers internacionales reconocidos.' } },
    { '@type': 'Question', name: '¿Cuánto cuesta un presentador bilingüe?', acceptedAnswer: { '@type': 'Answer', text: 'Un presentador que trabaje en español e inglés suele cobrar un 20-40% más que uno monolingüe, por la doble preparación de guión y la mayor demanda en eventos con público internacional.' } },
    { '@type': 'Question', name: '¿El precio incluye la preparación previa del evento?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del profesional. Muchos speakers incluyen una llamada de briefing previa en su tarifa; presentaciones muy personalizadas (con guión a medida sobre la empresa) pueden tener un coste adicional.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuánto cobra un speaker de eventos', item: 'https://xpeak.es/blog/cuanto-cobra-un-speaker-de-eventos' },
  ],
};

const PRECIOS = [
  { concepto: 'Presentador / MC evento pequeño', precio: '300€ – 600€' },
  { concepto: 'Presentador / MC gala grande', precio: '800€ – 2.000€' },
  { concepto: 'Keynote speaker nacional', precio: '800€ – 1.500€' },
  { concepto: 'Speaker internacional reconocido', precio: '3.000€ +' },
  { concepto: 'Suplemento por bilingüe', precio: '+20% – 40%' },
];

export default function BlogCuantoCobraSpeakerEventos() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un speaker o presentador de eventos (2026) | XPEAK</title>
        <meta name="description" content="Precios reales de speakers, ponentes y presentadores de eventos en España: keynote speakers, MCs bilingües y presentadores de gala." />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-speaker-de-eventos" />
        <meta property="og:title" content="Cuánto cobra un speaker de eventos — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de speakers y presentadores de eventos en España." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-speaker-de-eventos" />
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
            <a href="/auth?mode=register&role=speaker" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Speaker · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cuánto cobra un speaker o presentador de eventos</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Desde un MC para una cena de empresa hasta un keynote speaker internacional: así varían los precios según el tipo de evento y el perfil del profesional.
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
              <p className="text-sm font-black mb-2">¿Buscas speaker o presentador para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/speaker" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de speakers →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/cuanto-cobra-un-speaker-de-eventos' tag='Speaker' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_speaker_precio" />
      </div>
    </>
  );
}
