import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Bailarines para eventos: cuándo contratarlos y qué tener en cuenta',
  description: 'Show de baile, animación de pista o clase exprés de salsa/bachata: qué formato de bailarín encaja mejor en cada tipo de evento.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/bailarines-para-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué diferencia hay entre un show de baile y una clase exprés en el evento?', acceptedAnswer: { '@type': 'Answer', text: 'Un show de baile es una actuación para que el público mire, con coreografía preparada. Una clase exprés (o "animación de pista") busca que los propios invitados aprendan pasos básicos y bailen, muy habitual en bodas para romper el hielo.' } },
    { '@type': 'Question', name: '¿Para qué eventos se contratan bailarines profesionales?', acceptedAnswer: { '@type': 'Answer', text: 'Bodas (primer baile coreografiado o show sorpresa), eventos corporativos con espectáculo, discotecas y clubs (go-go dancers) y fiestas privadas temáticas.' } },
    { '@type': 'Question', name: '¿Cuánto dura un show de baile típico?', acceptedAnswer: { '@type': 'Answer', text: 'Entre 5 y 15 minutos para un show de escenario. Las sesiones de animación de pista o clase exprés suelen durar entre 30 y 45 minutos.' } },
    { '@type': 'Question', name: '¿Se puede contratar un bailarín para dar clases antes del evento?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, es habitual en bodas: la pareja contrata clases previas para preparar el primer baile, y opcionalmente el mismo instructor puede animar la pista el día del evento.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Bailarines para eventos', item: 'https://xpeak.es/blog/bailarines-para-eventos' },
  ],
};

const FORMATOS = [
  { formato: 'Show de escenario', detalle: 'Coreografía preparada para que el público mire, habitual en bodas (baile sorpresa) y eventos corporativos.' },
  { formato: 'Animación de pista', detalle: 'El bailarín enseña pasos básicos a los invitados en directo, muy usado para romper el hielo en bodas y fiestas privadas.' },
  { formato: 'Clases previas al evento', detalle: 'Sesiones de preparación (por ejemplo del primer baile de boda) en las semanas previas al evento.' },
  { formato: 'Go-go / animación de club', detalle: 'Bailarines que ambientan la pista en discotecas y eventos nocturnos durante toda la noche.' },
];

export default function BlogBailarinesParaEventos() {
  return (
    <>
      <Helmet>
        <title>Bailarines para eventos: cuándo contratarlos (2026) | XPEAK</title>
        <meta name="description" content="Show de baile, animación de pista o clase exprés: qué formato de bailarín encaja mejor en cada tipo de evento." />
        <link rel="canonical" href="https://xpeak.es/blog/bailarines-para-eventos" />
        <meta property="og:title" content="Bailarines para eventos — XPEAK Blog" />
        <meta property="og:description" content="Qué formato de bailarín elegir según el tipo de evento." />
        <meta property="og:url" content="https://xpeak.es/blog/bailarines-para-eventos" />
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
            <a href="/auth?mode=register&role=bailarin" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bailarin · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Bailarines para eventos: cuándo contratarlos</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Show de escenario, animación de pista o clases previas: cada formato de bailarín profesional encaja con un momento distinto del evento.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Formatos habituales</h2>
              <div className="space-y-3">
                {FORMATOS.map((f, i) => (
                  <div key={f.formato} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D4AF37' }}>{f.formato}</p>
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
              <p className="text-sm font-black mb-2">¿Buscas bailarín para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/bailarin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de bailarines →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/bailarines-para-eventos' tag='Bailarin' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_bailarines_eventos" />
      </div>
    </>
  );
}
