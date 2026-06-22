import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Zaragoza: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Zaragoza. Precios reales 2026, Aragón, la ribera del Ebro y los palacios mudéjares de la capital aragonesa.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-zaragoza' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Zaragoza cuesta entre 600€ y 1.600€ para el servicio completo. Los precios en Zaragoza son un 10-15% más económicos que en Madrid o Barcelona, lo que la convierte en uno de los mercados de bodas con mejor relación calidad-precio de España.' } },
  { '@type': 'Question', name: '¿Cuáles son las mejores zonas para bodas en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más populares son: el entorno del Canal Imperial y la Ribera del Ebro (fincas con jardines junto al agua), las Cinco Villas (masías aragonesas en el norte), el Prepirineo (fincas rurales en Huesca limítrofe) y el casco histórico de Zaragoza (palacios y salones en La Aljafería). Las masías tienen mucha demanda en primavera.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'En Zaragoza la temporada alta es mayo-junio y septiembre-octubre. Los sábados de estos meses se reservan con 8-10 meses de antelación. Julio y agosto son menos populares por el calor extremo del Valle del Ebro. Diciembre y enero tienen menos bodas pero los venues ofrecen mejores precios.' } },
  { '@type': 'Question', name: '¿Qué tener en cuenta al contratar DJ en Zaragoza?', acceptedAnswer: { '@type': 'Answer', text: 'La gran mayoría de DJs de Zaragoza cubren el desplazamiento dentro de la provincia sin coste adicional. Para bodas en Huesca, Teruel o La Rioja, suelen cobrar un suplemento de 50-100€. Los DJs de Madrid o Barcelona también trabajan en Zaragoza con frecuencia — compara precios incluyendo desplazamiento.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Zaragoza', item: 'https://xpeak.es/blog/dj-bodas-zaragoza' }] };
const PRECIOS = [{ servicio: 'Solo pista de baile (4-5h)', precio: '350–750€' }, { servicio: 'Cóctel + pista', precio: '550–1.100€' }, { servicio: 'Servicio completo', precio: '700–1.600€' }, { servicio: 'Pack premium', precio: '1.000–2.000€' }];
const ZONAS = [{ zona: 'Valle del Ebro / Canal Imperial', fincas: 'Utebo, La Muela, Épila', nota: 'Fincas con jardines junto al agua' }, { zona: 'Cinco Villas', fincas: 'Ejea, Sos del Rey Católico', nota: 'Masías aragonesas tradicionales' }, { zona: 'Prepirineo aragonés', fincas: 'Huesca limítrofe, Monzón', nota: 'Fincas rurales espectaculares' }, { zona: 'Zaragoza capital', fincas: 'Aljafería, hoteles 5*', nota: 'Palacios históricos y modernos' }];
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Zaragoza', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Zaragoza. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Zaragoza' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-zaragoza', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaZaragoza() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Zaragoza: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Zaragoza. Precios reales 2026, Aragón, la ribera del Ebro y los palacios mudéjares de la capital aragonesa." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-zaragoza" />
        <meta property="og:title" content="DJ para bodas en Zaragoza: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales DJs boda Zaragoza. Zonas y cómo elegir." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-zaragoza" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Zaragoza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Zaragoza: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Zaragoza es una ciudad grande con mercado de bodas activo y precios muy competitivos — entre un 10-20% más económica que Madrid o Barcelona. Los venues más demandados son las masías aragonesas en los alrededores, el Canal Imperial y los palacios del casco histórico.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Zaragoza (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Zaragoza 2026. Sin IVA.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Zaragoza</h2>
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
                  { href: '/blog/dj-bodas-madrid', cat: 'SEO Local', title: 'DJ para bodas en Madrid: precio 2026' },
                  { href: '/blog/dj-bodas-barcelona', cat: 'SEO Local', title: 'DJ para bodas en Barcelona: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Zaragoza?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Zaragoza y alrededores. Perfiles verificados y contrato digital automático.</p>
              <a href="/contratar-dj/zaragoza" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Zaragoza →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-zaragoza" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
