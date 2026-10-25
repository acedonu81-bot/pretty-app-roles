import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import CalculadoraPrecioDJ, { TARIFAS } from '@/components/CalculadoraPrecioDJ';

const slug = 'calculadora-tarifa-dj';

export default function BlogCalculadoraTarifaDJ() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Calculadora de tarifa DJ 2026: precio estimado para tu evento",
    description: "Calcula cuánto cuesta un DJ para tu evento. Elige el tipo de evento y las horas y verás el precio con las tarifas reales de los DJs de XPEAK.",
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-10-24',
    url: "https://xpeak.es/blog/calculadora-tarifa-dj",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/calculadora-tarifa-dj" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "Calculadora de tarifa DJ 2026: precio estimado para tu evento", item: "https://xpeak.es/blog/calculadora-tarifa-dj" },
    ],
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en España?', acceptedAnswer: { '@type': 'Answer', text: `Con las tarifas de los DJs de XPEAK (${TARIFAS.fecha}), una boda de 6 horas sale entre ${6 * TARIFAS.p25}€ y ${6 * TARIFAS.p75}€, y lo más habitual son unos ${6 * TARIFAS.mediana}€. El desplazamiento, el IVA y las luces extra van aparte.` } },
      { '@type': 'Question', name: '¿De qué depende el precio de un DJ?', acceptedAnswer: { '@type': 'Answer', text: `Sobre todo de las horas de música y de la tarifa por hora del DJ. La mitad de los DJs de XPEAK cobra entre ${TARIFAS.p25}€ y ${TARIFAS.p75}€ la hora. Luego suman el desplazamiento y el equipo extra, como luces o un segundo equipo de sonido.` } },
      { '@type': 'Question', name: '¿La calculadora da un precio real?', acceptedAnswer: { '@type': 'Answer', text: `Es una estimación con las tarifas por hora que han puesto ${TARIFAS.djs} DJs de XPEAK (${TARIFAS.fecha}). Para un precio cerrado, pide DJ gratis desde la calculadora y te contestan DJs de tu zona con su presupuesto.` } },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de tarifa DJ 2026: precio estimado para tu evento | XPEAK</title>
        <meta name="description" content="Calcula cuánto cuesta un DJ para tu evento. Elige el tipo de evento y las horas y verás el precio con las tarifas reales de los DJs de XPEAK." />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content="Calculadora tarifa DJ 2026 | XPEAK" />
        <meta property="og:description" content="Calcula el precio de un DJ para tu boda, empresa o fiesta privada. Estimación real 2026." />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse</a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8B6A00' }}>DJ · Herramienta · XPEAK</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Calculadora de tarifa DJ 2026: ¿cuánto cuesta tu evento?</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Elige tu evento y las horas de música y verás cuánto cuesta el DJ, con las tarifas reales de los DJs de XPEAK.</p>
          </div>

          <CalculadoraPrecioDJ articlePath={`/blog/${slug}`} />

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />

          <div className="space-y-6 mt-6">
            <section>
              <h2 className="text-base font-black mb-3">¿Cómo consigo presupuestos reales?</h2>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                La calculadora da una estimación. Para un presupuesto cerrado, pide DJ gratis desde el botón de arriba: sin registrarte, sin comisión, y te contestan DJs de tu zona.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-contratar-un-dj', cat: 'Guía', title: 'Cómo contratar un DJ: guía completa' },
                  { href: '/plantilla-contrato-dj', cat: 'Recurso', title: 'Plantilla contrato DJ: Word y PDF' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#8B6A00', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
        <BlogAuthor />
        <BlogShare />
        <DJResourcesAffiliate role="dj" />
        <BlogRelatedPosts currentSlug='/blog/calculadora-tarifa-dj' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_calculadora_dj" articlePath="/blog/calculadora-tarifa-dj" />
      </div>
    </>
  );
}
