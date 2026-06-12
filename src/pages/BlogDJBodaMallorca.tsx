import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Mallorca: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Mallorca. Precios reales 2026, fincas de lujo, bodas internacionales y cómo contratar el mejor DJ en las Islas Baleares.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-mallorca' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Mallorca?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Mallorca cuesta entre 900€ y 3.000€ para el servicio completo. Mallorca tiene uno de los mercados de bodas de lujo más activos de Europa, con muchas bodas de parejas alemanas, británicas y escandinavas con presupuestos muy altos. Para bodas locales o nacionales el rango es 800-1.800€; para bodas internacionales de lujo puede superar los 3.000€.' } },
  { '@type': 'Question', name: '¿Cuándo es la temporada de bodas en Mallorca?', acceptedAnswer: { '@type': 'Answer', text: 'La temporada alta de bodas en Mallorca es de mayo a octubre. El mes más popular es septiembre por el calor más suave y la luz dorada del atardecer. Julio y agosto tienen bodas pero el calor puede ser extremo en el interior — las fincas con piscina son las más demandadas en esos meses. El mercado de bodas internacionales funciona incluso en primavera temprana y otoño tardío.' } },
  { '@type': 'Question', name: '¿El DJ necesita hablar inglés o alemán para bodas en Mallorca?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas internacionales en Mallorca, sí es muy recomendable. Más del 60% de las bodas en Mallorca son de parejas extranjeras (alemanas, británicas, escandinavas). Un DJ con inglés fluido y repertorio internacional puede cobrar un 30-50% más que uno sin esas capacidades. Si tu boda tiene invitados de múltiples países, el DJ necesita gestionar el MC de forma inclusiva.' } },
  { '@type': 'Question', name: '¿Cómo llega el DJ a las fincas más remotas de Mallorca?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de DJs de Mallorca incluyen el desplazamiento dentro de la isla en su precio. Las fincas del interior (Serra de Tramuntana, Randa, Manacor) están a 30-60 minutos de Palma. Para fincas muy remotas en la sierra, algunos DJs añaden suplemento de transporte de equipo de 50-100€ por el acceso complicado a carreteras estrechas.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Mallorca', item: 'https://xpeak.es/blog/dj-bodas-mallorca' }] };
const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '500–1.000€' },
  { servicio: 'Cóctel + pista de baile', precio: '800–1.500€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '1.000–2.200€' },
  { servicio: 'Pack premium bodas internacionales de lujo', precio: '1.500–3.500€' },
];
const ZONAS = [
  { zona: 'Serra de Tramuntana', fincas: 'Valldemossa, Deià, Sóller', nota: 'UNESCO, máxima exclusividad' },
  { zona: 'Interior / Es Pla', fincas: 'Randa, Algaida, Sineu', nota: 'Fincas rústicas, muy fotogénicas' },
  { zona: 'Levante', fincas: 'Manacor, Felanitx, Porto Cristo', nota: 'Fincas grandes con piscina' },
  { zona: 'Palma y alrededores', fincas: 'Palma, Génova, Son Vida', nota: 'Palacios y hoteles de lujo' },
];
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Mallorca', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Mallorca. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Mallorca' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-mallorca', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaMallorca() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Mallorca: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Mallorca. Precios reales 2026, fincas de lujo, bodas internacionales y temporada alta en Baleares." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-mallorca" />
        <meta property="og:title" content="DJ para bodas en Mallorca: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios DJs boda Mallorca. Fincas de lujo, bodas internacionales y cómo elegir DJ en Baleares." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-mallorca" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Mallorca · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Mallorca: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Mallorca es el destino de bodas de lujo más internacional de España. Fincas centenarias en la Serra de Tramuntana, atardeceres sobre el Mediterráneo y un mercado con presupuestos muy superiores a la media nacional.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Mallorca (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios Mallorca 2026. Sin IVA. El mercado internacional de bodas de lujo puede duplicar estos rangos.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en Mallorca</h2>
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
                  { href: '/blog/dj-bodas-malaga', cat: 'SEO Local', title: 'DJ para bodas en Málaga (Costa del Sol) 2026' },
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Mallorca?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene DJs con experiencia en bodas de lujo en Mallorca, incluyendo bodas internacionales en inglés y alemán. Perfiles verificados y contrato digital.</p>
              <a href="/contratar-dj/palma-de-mallorca" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Mallorca →</a>
            </div>
          </div>
                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-mallorca" />
</main>
        <BlogAuthor />
        <FooterPublic />
      </div>
    </>
  );
}
