import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un estilista o profesional de vestuario en España (2026)',
  description: 'Precios reales de estilistas para bodas, producciones audiovisuales y personal shopper de eventos en España.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/cuanto-cobra-un-estilista-de-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta un estilista integral para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Un estilista integral que asesora a novia, novio y séquito suele cobrar entre 300€ y 1.500€ según el alcance del servicio (número de personas, si incluye compra de ropa o solo asesoramiento).' } },
    { '@type': 'Question', name: '¿Cuánto cobra un coordinador de vestuario en un rodaje?', acceptedAnswer: { '@type': 'Answer', text: 'La tarifa por jornada de un coordinador de vestuario en producciones audiovisuales varía según el tipo de proyecto (videoclip, anuncio, cortometraje) y suele calcularse por día de rodaje, no por hora.' } },
    { '@type': 'Question', name: '¿Qué es un personal shopper de eventos y cuánto cuesta?', acceptedAnswer: { '@type': 'Answer', text: 'Un personal shopper ayuda a elegir el outfit adecuado para un evento concreto (gala, boda, presentación). La tarifa habitual es de 80€ a 200€ por sesión de 2-3 horas.' } },
    { '@type': 'Question', name: '¿El estilista se desplaza al domicilio el día del evento?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del servicio contratado. Muchos estilistas ofrecen ajustes de última hora a domicilio el mismo día del evento como servicio adicional; conviene confirmarlo al contratar.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuánto cobra un estilista de eventos', item: 'https://xpeak.es/blog/cuanto-cobra-un-estilista-de-eventos' },
  ],
};

const PRECIOS = [
  { concepto: 'Estilista integral boda (novia + novio + séquito)', precio: '300€ – 1.500€' },
  { concepto: 'Asesoramiento de imagen individual', precio: '80€ – 200€ / sesión' },
  { concepto: 'Coordinación de vestuario en rodaje', precio: 'Por jornada, según producción' },
  { concepto: 'Personal shopper para evento puntual', precio: '80€ – 200€' },
];

export default function BlogCuantoCobraEstilistaEventos() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un estilista de eventos (2026) | XPEAK</title>
        <meta name="description" content="Precios reales de estilistas para bodas, producciones audiovisuales y personal shopper de eventos en España." />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-estilista-de-eventos" />
        <meta property="og:title" content="Cuánto cobra un estilista de eventos — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de estilistas y profesionales de vestuario para eventos." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-estilista-de-eventos" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#BE185D' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=vestuario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#BE185D,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#BE185D' }}>Vestuario · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cuánto cobra un estilista de eventos</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Estilismo de boda, coordinación de vestuario en rodajes o personal shopper para un evento puntual: así varían los precios según el servicio.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios orientativos</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.concepto} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-medium">{row.concepto}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#BE185D' }}>{row.precio}</span>
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

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(190,24,93,0.04)', border: '1px solid rgba(190,24,93,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas estilista para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/vestuario" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#BE185D,#B8941E)', color: '#000' }}>
                Ver directorio de estilistas →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/cuanto-cobra-un-estilista-de-eventos' tag='Vestuario' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_estilista_precio" />
      </div>
    </>
  );
}
