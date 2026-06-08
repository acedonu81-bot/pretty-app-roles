import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Murcia: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Murcia. Precios reales 2026, zonas de celebración y cómo contratar el mejor DJ en la Región de Murcia.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-murcia' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Murcia cuesta entre 500€ y 1.500€ para el servicio completo. Para bodas solo de pista (4-5h) el rango es 280-700€. Los servicios en la costa (Cartagena, Mar Menor) tienen precios algo más altos que en el interior.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'En Murcia la temporada alta es abril-junio y septiembre-octubre. Los meses de julio y agosto se evitan por el calor extremo en el interior. El Mar Menor y la costa permiten bodas al aire libre también en verano si hay brisa. Los sábados de primavera se reservan con 10-12 meses de antelación.' } },
  { '@type': 'Question', name: '¿Qué zonas de Murcia tienen más bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más demandadas son: Murcia capital y su huerta (fincas entre limoneros y naranjos), Cartagena y La Manga para bodas con vistas al mar, y el Valle del Ricote con cortijos de interior. La Manga Club es el venue internacional de referencia en la región.' } },
  { '@type': 'Question', name: '¿Los DJs de Murcia tienen experiencia en bodas gitanas?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Murcia y la Región tienen una gran tradición de bodas gitanas y ceremonias con mezcla de géneros (flamenco, rumbas, sesiones de baile). Muchos DJs locales tienen experiencia en este formato y saben gestionar la transición entre estilos durante la misma noche.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Murcia', item: 'https://xpeak.es/blog/dj-bodas-murcia' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '280–700€' },
  { servicio: 'Cóctel + pista de baile', precio: '450–1.000€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '600–1.500€' },
  { servicio: 'Pack La Manga / Costa Cálida premium', precio: '900–2.000€' },
];

const ZONAS = [
  { zona: 'Murcia capital y Huerta', fincas: 'Fincas entre cítricos, cortijos tradicionales', nota: 'Ambiente auténtico murciano' },
  { zona: 'Cartagena y Mar Menor', fincas: 'La Manga Club, resorts de costa', nota: 'Bodas con vistas al mar' },
  { zona: 'Valle del Ricote', fincas: 'Cortijos de sierra, paisaje volcánico', nota: 'Intimidad y naturaleza' },
  { zona: 'Lorca y comarca', fincas: 'Haciendas con historia, fincas amplias', nota: 'Bodas grandes, buen precio' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Murcia', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Murcia. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Murcia' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-murcia', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaMurcia() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Murcia: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Murcia. Precios reales 2026, Cartagena, Mar Menor y cómo contratar el mejor DJ en la Región de Murcia." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-murcia" />
        <meta property="og:title" content="DJ para bodas en Murcia: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Murcia. Costa Cálida, Huerta y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-murcia" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Murcia · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Murcia: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Murcia tiene una de las temporadas de bodas más activas del sureste español, con fincas en la huerta, haciendas en Lorca y resorts en la Costa Cálida. Te explicamos precios por zona y qué buscar en un DJ para boda en la Región.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Murcia (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos 2026. Sin IVA. La Manga y resorts de costa tienen precios un 20-30% más altos.</p>
            </section>
            <BlogInlineCTA role="dj" variant="upgrade" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Murcia</h2>
              <div className="space-y-3">
                {ZONAS.map((z, i) => (
                  <div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-bold">{z.zona}</p>
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#8E8EA0' }}>{z.fincas}</p>
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
                  { href: '/blog/dj-bodas-sevilla', cat: 'SEO Local', title: 'DJ para bodas en Sevilla: precio 2026' },
                  { href: '/blog/dj-bodas-malaga', cat: 'SEO Local', title: 'DJ para bodas en Málaga: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Murcia?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene DJs especializados en bodas en Murcia y la Costa Cálida. Perfiles verificados, contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Murcia →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-murcia" />
</main>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_murcia" />
      </div>
    </>
  );
}
