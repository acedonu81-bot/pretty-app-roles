import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Valladolid: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Valladolid. Precios reales 2026, bodegas, palacios y fincas de Castilla y cómo contratar el mejor DJ.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-valladolid' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Valladolid?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Valladolid cuesta entre 500€ y 1.400€ para el servicio completo. La provincia tiene precios similares a la media castellana, más económicos que Madrid o Barcelona. Para bodas en bodegas de la Ribera del Duero el rango puede subir hasta 1.800€ por venues de mayor exclusividad.' } },
  { '@type': 'Question', name: '¿Cuándo es la temporada alta de bodas en Valladolid?', acceptedAnswer: { '@type': 'Answer', text: 'Junio, septiembre y octubre son los meses más demandados. El invierno en Valladolid es frío y los veranos son calurosos pero secos, lo que hace que la primavera tardía y el otoño sean ideales. Las bodegas de Ribera del Duero tienen una demanda especial en época de vendimia (septiembre-octubre).' } },
  { '@type': 'Question', name: '¿Las bodegas de Ribera del Duero organizan bodas con DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Muchas bodegas de la Ribera del Duero (Pesquera, Vega Sicilia, Pago de Carraovejas) tienen salas de eventos y organizan bodas completas. Es un venue muy demandado. Algunos tienen sus propios proveedores de DJ, pero puedes llevar el tuyo propio — confirma con la bodega sus condiciones.' } },
  { '@type': 'Question', name: '¿Hay DJs en Valladolid especializados en bodas?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Valladolid tiene una escena de DJs de boda consolidada, con profesionales especializados en la mezcla pop/variados que funciona para bodas de 150-300 personas con invitados de varias generaciones. También hay DJs jóvenes con perfil más electrónico para bodas más modernas.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Valladolid', item: 'https://xpeak.es/blog/dj-bodas-valladolid' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '280–680€' },
  { servicio: 'Cóctel + pista de baile', precio: '450–1.000€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '580–1.400€' },
  { servicio: 'Pack bodega Ribera del Duero', precio: '900–1.800€' },
];

const ZONAS = [
  { zona: 'Valladolid capital', fincas: 'Palacios, casas nobles, fincas periurbanas', nota: 'Fácil acceso, buena oferta' },
  { zona: 'Ribera del Duero', fincas: 'Bodegas en Peñafiel, Pesquera, Valbuena', nota: 'Venue único, muy demandado' },
  { zona: 'Tierra de Campos', fincas: 'Cortijos y palomares restaurados, gran capacidad', nota: 'Espacioso y económico' },
  { zona: 'Pinares de Soria', fincas: 'Fincas rodeadas de pinos, cercanas a Valladolid', nota: 'Íntimo y natural' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Valladolid', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Valladolid. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Valladolid' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-valladolid', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaValladolid() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Valladolid: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Valladolid. Precios reales 2026, bodegas Ribera del Duero, fincas castellanas y cómo contratar el mejor DJ." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-valladolid" />
        <meta property="og:title" content="DJ para bodas en Valladolid: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Valladolid. Bodegas, palacios y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-valladolid" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Valladolid · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Valladolid: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Valladolid combina palacios históricos en la capital con las bodegas de la Ribera del Duero y las fincas de la Tierra de Campos. Los precios son competitivos y la escena de DJs de boda está bien establecida. Aquí tienes la guía completa para 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Valladolid (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos 2026. Sin IVA. Bodegas de la Ribera del Duero pueden añadir tasas de venue o restricciones de proveedor.</p>
            </section>
            <BlogInlineCTA role="dj" variant="upgrade" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Valladolid</h2>
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
                  { href: '/blog/dj-bodas-madrid', cat: 'SEO Local', title: 'DJ para bodas en Madrid: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Valladolid?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK conecta organizadores con DJs verificados en toda Castilla y León. Contrato digital automático incluido.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Valladolid →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-valladolid" />
</main>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_valladolid" />
      </div>
    </>
  );
}
