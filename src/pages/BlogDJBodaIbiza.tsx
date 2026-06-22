import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Ibiza: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Ibiza. Precios reales 2026, Capital mundial de la música electrónica y el mercado de bodas de lujo internacional más exclusivo.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-ibiza' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Ibiza cuesta entre 1.200€ y 6.000€ dependiendo del perfil y tipo de boda. Ibiza tiene el mercado de bodas de lujo más caro de España después de Marbella. Las bodas internacionales de alto standing pueden pagar 3.000-6.000€ por un DJ con experiencia en el mercado luxury. Para bodas de presupuesto medio, hay DJs desde 1.200€.' } },
  { '@type': 'Question', name: '¿Cuáles son las mejores zonas para bodas en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más exclusivas para bodas en Ibiza son: el norte (Santa Eulalia, San Carlos, Sant Joan — las villas más exclusivas), el centro (Santa Gertrudis, Sant Miquel), el oeste (Sant Antoni — más turístico, menos bodas), y Formentera para bodas de playa muy íntimas. El norte concentra las villas de lujo más demandadas.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'La temporada de bodas en Ibiza es mayo-octubre, con el pico en junio, julio y septiembre. Julio y agosto son los más solicitados pese al calor porque coinciden con el pico turístico. Reserva con 12-18 meses para bodas en verano. Los DJs ibicencos con experiencia en bodas (no en clubs) se reservan con mucha antelación.' } },
  { '@type': 'Question', name: '¿Qué tener en cuenta al contratar DJ en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza hay miles de DJs — pero muy pocos especializados en bodas. La habilidad de leer el ambiente de una boda (timing, dinamismo, MC) es completamente diferente a pinchar en un club. Asegúrate de contratar un DJ con experiencia específica en bodas, no solo en clubbing. Pide referencias de bodas anteriores, no de noches de club.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Ibiza', item: 'https://xpeak.es/blog/dj-bodas-ibiza' }] };
const PRECIOS = [{ servicio: 'Solo pista de baile (4-5h)', precio: '700–1.500€' }, { servicio: 'Cóctel + pista', precio: '1.000–2.000€' }, { servicio: 'Servicio completo', precio: '1.500–3.500€' }, { servicio: 'Pack premium bodas de lujo', precio: '2.500–6.000€' }];
const ZONAS = [{ zona: 'Norte de Ibiza', fincas: 'Santa Eulalia, San Carlos, Sant Joan', nota: 'Las villas más exclusivas de Europa' }, { zona: 'Centro', fincas: 'Santa Gertrudis, Sant Miquel', nota: 'Fincas con encanto, más íntimas' }, { zona: 'Sur', fincas: 'Es Caló, Ses Salines', nota: 'Bodas de playa únicas' }, { zona: 'Formentera', fincas: 'La Savina, Es Pujols', nota: 'Para bodas muy íntimas e íntimas' }];
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Ibiza', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Ibiza. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Ibiza' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-ibiza', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaIbiza() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Ibiza: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Ibiza. Precios reales 2026, Capital mundial de la música electrónica y el mercado de bodas de lujo internacional más exclusivo." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-ibiza" />
        <meta property="og:title" content="DJ para bodas en Ibiza: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales DJs boda Ibiza. Zonas y cómo elegir." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-ibiza" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Ibiza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Ibiza: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Ibiza es única: la capital mundial de la música electrónica es también uno de los destinos de bodas de lujo más demandados de Europa. Los presupuestos son muy altos, la clientela mayoritariamente internacional y la temporada muy concentrada (mayo-octubre). Un DJ para boda en Ibiza no es lo mismo que un DJ de club — las bodas aquí requieren versatilidad y experiencia con clientes internacionales.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Ibiza (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Ibiza 2026. Sin IVA.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Ibiza</h2>
              <div className="space-y-3">
                {ZONAS.map((z, i) => (
                  <div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{z.zona}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#3d3d4e' }}>{z.fincas}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/dj-bodas-mallorca', cat: 'SEO Local', title: 'DJ para bodas en Mallorca: precio 2026' },
                  { href: '/blog/dj-bodas-malaga', cat: 'SEO Local', title: 'DJ para bodas en Málaga (Costa del Sol) 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Ibiza?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Ibiza y alrededores. Perfiles verificados y contrato digital automático.</p>
              <a href="/contratar-dj/ibiza" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Ibiza →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-ibiza" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
