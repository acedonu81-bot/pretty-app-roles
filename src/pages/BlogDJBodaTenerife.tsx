import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Tenerife: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Tenerife. Precios reales 2026, bodas en el sur y norte de la isla, venues y cómo contratar el mejor DJ.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-tenerife' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Tenerife?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Tenerife cuesta entre 600€ y 1.800€ para el servicio completo. El sur de la isla (Adeje, Costa Adeje, Los Cristianos) tiene precios más altos por la concentración de bodas de destino internacionales, llegando a 2.500€ para servicios premium. El norte (La Laguna, Puerto de la Cruz) tiene precios más ajustados.' } },
  { '@type': 'Question', name: '¿Tenerife es un buen destino para bodas de destino?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, es uno de los destinos de bodas más populares de España para parejas internacionales. El sur tiene resorts de 5 estrellas con servicios de boda completos (Ritz-Carlton, Hard Rock, Bahía del Duque). El clima es excelente todo el año — más de 300 días de sol — lo que facilita planificar bodas al exterior sin riesgo de lluvia.' } },
  { '@type': 'Question', name: '¿Los DJs de Tenerife actúan en inglés?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de DJs del sur de la isla con experiencia en bodas internacionales actúan perfectamente en inglés o bilingüe. Es un requisito habitual para bodas con invitados de Reino Unido, Alemania o Países Bajos, que son los mercados principales de bodas de destino en Tenerife.' } },
  { '@type': 'Question', name: '¿Hay que pagar desplazamiento al DJ si la boda es en el sur y vive en el norte?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, normalmente se paga el desplazamiento si el DJ tiene que cruzar la isla (de norte a sur o viceversa son 1-1,5h de viaje). Suma entre 50-100€ y, si la boda acaba tarde, puede ser necesario alojamiento. Pregunta siempre qué incluye el presupuesto.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Tenerife', item: 'https://xpeak.es/blog/dj-bodas-tenerife' }] };

const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '350–850€' },
  { servicio: 'Cóctel + pista de baile', precio: '550–1.200€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '700–1.800€' },
  { servicio: 'Pack resort 5★ / boda de destino premium', precio: '1.200–2.500€' },
];

const ZONAS = [
  { zona: 'Costa Adeje / Sur', fincas: 'Ritz-Carlton, Bahía del Duque, Hard Rock Hotel', nota: 'Bodas de destino internacionales' },
  { zona: 'Santa Cruz / La Laguna', fincas: 'Casas coloniales, espacios urbanos', nota: 'Bodas locales, buen precio' },
  { zona: 'Puerto de la Cruz / Norte', fincas: 'Haciendas entre plataneras, villas coloniales', nota: 'Clima más fresco, más verde' },
  { zona: 'Teide / interior', fincas: 'Fincas volcánicas con vistas únicas al Teide', nota: 'Espectacular, muy exclusivo' },
];

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Tenerife', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Tenerife. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Tenerife' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-tenerife', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaTenerife() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Tenerife: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Tenerife. Precios reales 2026, Costa Adeje, bodas de destino internacionales y cómo contratar el mejor DJ." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-tenerife" />
        <meta property="og:title" content="DJ para bodas en Tenerife: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales de DJs de boda en Tenerife. Costa Adeje, resorts 5 estrellas y cómo elegir el perfil correcto." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-tenerife" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Tenerife · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Tenerife: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Tenerife es uno de los destinos de boda más demandados de España, con bodas locales en el norte y bodas de destino internacionales en los grandes resorts del sur. Clima perfecto 365 días al año. Guía completa de precios para 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Tenerife?"
              answer="Un DJ para el servicio completo de una boda en Tenerife (ceremonia, cóctel, cena y pista de baile) cuesta entre 700 y 1.800€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Tenerife (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos 2026. Sin IVA. Los resorts del sur suelen tener lista de proveedores aprobados — confirma con el venue antes.</p>
            </section>
            <BlogInlineCTA role="dj" variant="upgrade" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Tenerife</h2>
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
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
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
                  { href: '/blog/dj-bodas-ibiza', cat: 'SEO Local', title: 'DJ para bodas en Ibiza: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Tenerife?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Tenerife y Canarias, incluyendo servicios bilingües para bodas internacionales. Contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Tenerife →</a>
            </div>
          </div>
                  <DJResourcesAffiliate />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-tenerife" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-tenerife' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_tenerife" />
      </div>
    </>
  );
}
