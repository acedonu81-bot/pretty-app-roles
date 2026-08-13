import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Granada: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Granada. Precios reales 2026, La Alhambra, la Vega y la Sierra Nevada como backdrop único en España.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-granada' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Granada cuesta entre 550€ y 1.500€ para el servicio completo. Granada es uno de los mercados de bodas más económicos de España entre ciudades de su tamaño — hasta un 25% más barato que Sevilla o Málaga. El equilibrio entre calidad y precio es muy bueno.' } },
  { '@type': 'Question', name: '¿Cuáles son las mejores zonas para bodas en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'Las zonas más populares para bodas en Granada son: los cortijos de la Vega granadina (La Zubia, Ogíjares, Dílar), las haciendas del Valle de Lecrín (sur de Granada), las fincas del Altiplano (Guadix, Baza) y los hoteles históricos del centro (Palacio de los Córdoba). La Vega concentra el 60% de las bodas.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'Granada tiene temporada alta en primavera (abril-junio) y otoño (septiembre-octubre). El verano granadino en el interior es muy caluroso. Para bodas en sábados de mayo o junio, reserva con 8-10 meses. La Semana Santa granadina es muy especial pero ocupa muchos DJs — evita las semanas de procesiones si quieres opciones.' } },
  { '@type': 'Question', name: '¿Qué tener en cuenta al contratar DJ en Granada?', acceptedAnswer: { '@type': 'Answer', text: 'La Universidad de Granada genera una escena musical activa — hay muchos DJs jóvenes de mucho nivel a precios muy competitivos. Para bodas de alto standing cerca de la Alhambra, busca DJs con experiencia en espacios históricos con restricciones de ruido y horario. Los jardines de los hoteles del Albaicín cierran a la 1:00.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Granada', item: 'https://xpeak.es/blog/dj-bodas-granada' }] };
const PRECIOS = [{ servicio: 'Solo pista de baile (4-5h)', precio: '300–700€' }, { servicio: 'Cóctel + pista', precio: '500–1.000€' }, { servicio: 'Servicio completo', precio: '650–1.500€' }, { servicio: 'Pack premium', precio: '900–1.900€' }];
const ZONAS = [{ zona: 'Vega granadina', fincas: 'La Zubia, Ogíjares, Dílar, Armilla', nota: 'Cortijos con jardín, los más demandados' }, { zona: 'Valle de Lecrín', fincas: 'Vélez de Benaudalla, Padul', nota: 'Fincas entre naranjos y olivos' }, { zona: 'Sierra Nevada / Alpujarras', fincas: 'Capileira, Trevélez, Órgiva', nota: 'Para bodas íntimas en entorno único' }, { zona: 'Granada capital', fincas: 'Alhambra, hoteles históricos', nota: 'Máxima exclusividad, restricciones horario' }];
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Granada', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Granada. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Granada' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-granada', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaGranada() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Granada: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Granada. Precios reales 2026, La Alhambra, la Vega y la Sierra Nevada como backdrop único en España." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-granada" />
        <meta property="og:title" content="DJ para bodas en Granada: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales DJs boda Granada. Zonas y cómo elegir." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-granada" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Granada · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Granada: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Granada tiene uno de los mercados de bodas más especiales de España: la proximidad de la Alhambra, los cortijos de la Vega granadina y el parque natural de Sierra Nevada crean una oferta única. Los precios son más económicos que las grandes ciudades — ideal para parejas que quieren una boda espectacular sin el presupuesto de Madrid o Marbella.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Granada?"
              answer="Un DJ para el servicio completo de una boda en Granada (ceremonia, cóctel, cena y pista de baile) cuesta entre 650 y 1.500€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Granada (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Granada 2026. Sin IVA.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Granada</h2>
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
                  { href: '/blog/dj-bodas-malaga', cat: 'SEO Local', title: 'DJ para bodas en Málaga: precio 2026' },
                  { href: '/blog/dj-bodas-sevilla', cat: 'SEO Local', title: 'DJ para bodas en Sevilla: precio 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Granada?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Granada y alrededores. Perfiles verificados y contrato digital automático.</p>
              <a href="/contratar-dj/granada" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Granada →</a>
            </div>
          </div>
                  <DJResourcesAffiliate />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-granada" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-granada' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_granada" />
      </div>
    </>
  );
}
