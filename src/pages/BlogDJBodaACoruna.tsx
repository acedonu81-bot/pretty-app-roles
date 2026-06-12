import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en A Coruña: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en A Coruña. Precios reales 2026, pazos, fincas gallegas y cómo contratar el mejor DJ en Galicia.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-a-coruna' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en A Coruña?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en A Coruña cuesta entre 500€ y 1.400€ para el servicio completo. Galicia tiene un nivel de precios similar a la media española. Las bodas en pazos (casas nobles gallegas) suelen tener presupuestos más altos por la exclusividad del venue, con DJs cobrando entre 800€ y 1.600€.' } },
  { '@type': 'Question', name: '¿Cuándo es la mejor época para casarse en A Coruña?', acceptedAnswer: { '@type': 'Answer', text: 'Junio, julio y agosto son los meses preferidos por mejor clima. Galicia tiene lluvia frecuente en otoño e invierno, así que para bodas al exterior los meses de verano son los más seguros. Septiembre puede ser bueno si el tiempo acompaña. Las bodas de interior en pazos o salones funcionan todo el año.' } },
  { '@type': 'Question', name: '¿Qué son los pazos y son buenos para bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Los pazos son casas nobiliarias gallegas, muchas del siglo XVII-XVIII, con jardines, capilla y gran capacidad. Son los venues de boda más demandados en Galicia. Algunos son hoteles rurales o tienen servicio de catering propio. Suelen pedir una lista de proveedores aprobados — comprueba que tu DJ puede trabajar allí.' } },
  { '@type': 'Question', name: '¿Los DJs gallegos conocen la música tradicional para la gaita en bodas?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de bodas gallegas incluyen gaita en la ceremonia o el cóctel, con un gaiteiro (músico de gaita), no con el DJ. El DJ toma el relevo en la cena y pista. Algunos DJs locales saben integrar música celta o fusión gallega en sus sesiones si el cliente lo pide.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas A Coruña', item: 'https://xpeak.es/blog/dj-bodas-a-coruna' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '300–700€' },
  { servicio: 'Cóctel + pista de baile', precio: '480–1.050€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '600–1.400€' },
  { servicio: 'Pack pazo gallego premium', precio: '900–1.800€' },
];

const ZONAS = [
  { zona: 'A Coruña capital', fincas: 'Casas de indianos, fincas en el entorno urbano', nota: 'Buen acceso, variedad de venues' },
  { zona: 'Rías Altas', fincas: 'Pazos en Betanzos, Ferrol, Pontedeume', nota: 'Entorno verde e histórico' },
  { zona: 'Costa da Morte', fincas: 'Fincas con vistas al Atlántico', nota: 'Íntimo y espectacular' },
  { zona: 'Interior — Terra de Soneira', fincas: 'Casas rurales y fincas agropecuarias', nota: 'Muy económico, mucho espacio' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en A Coruña', description: 'Encuentra y contrata DJs verificados para bodas y eventos en A Coruña. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'A Coruña' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-a-coruna', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaACoruna() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en A Coruña: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en A Coruña. Precios reales 2026, pazos gallegos, fincas y cómo contratar el mejor DJ en Galicia." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-a-coruna" />
        <meta property="og:title" content="DJ para bodas en A Coruña: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en A Coruña. Pazos gallegos y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-a-coruna" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · A Coruña · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en A Coruña: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Galicia tiene una tradición de bodas muy arraigada con los pazos como venue estrella. A Coruña combina venues históricos, fincas atlánticas y una escena de DJs activa. Esta es la guía de precios y claves para contratar en 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en A Coruña (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos 2026. Sin IVA. Algunos pazos tienen lista de proveedores aprobados — verifica antes de contratar.</p>
            </section>
            <BlogInlineCTA role="dj" variant="upgrade" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en A Coruña</h2>
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
                  { href: '/blog/dj-bodas-bilbao', cat: 'SEO Local', title: 'DJ para bodas en Bilbao: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en A Coruña?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK conecta organizadores con DJs verificados en toda Galicia. Contrato digital automático incluido.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en A Coruña →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-a-coruna" />
</main>
        <BlogAuthor />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_acoruna" />
      </div>
    </>
  );
}
