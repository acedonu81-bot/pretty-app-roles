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

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para bodas en Bilbao: precio y cómo contratar en 2026', description: 'Cuánto cuesta un DJ para una boda en Bilbao. Precios reales, zonas del País Vasco y cómo contratar el mejor DJ en Euskadi.', datePublished: '2026-06-03', dateModified: '2026-06-03', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-bodas-bilbao' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda en Bilbao cuesta entre 700€ y 2.000€ para el servicio completo. Los precios en el País Vasco son similares a Barcelona — entre un 15-25% por encima de la media nacional, por la alta demanda y el elevado coste de vida. Para bodas solo con pista de baile (4-5h), el rango es 400-900€.' } },
  { '@type': 'Question', name: '¿Cuándo es temporada alta de bodas en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'Bilbao y el País Vasco tienen bodas durante todo el año gracias al clima templado y lluvioso que evita el calor extremo de verano. Los meses más demandados son junio, septiembre y octubre. Diciembre también tiene bodas en caseríos con ambiente muy especial. Para sábados de junio y septiembre, reserva con 10-12 meses de antelación.' } },
  { '@type': 'Question', name: '¿Qué tipo de venues hay para bodas en Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'Bilbao tiene una mezcla única de venues: caseríos vascos (caserío = granja tradicional con mucho encanto), palacios históricos en el casco viejo, hoteles de lujo (Gran Hotel Domine, López de Haro) y fincas en la costa (Getxo, Algorta, Sopelana con vistas al Cantábrico). Los caseríos son el venue más auténtico y demandado en Euskadi.' } },
  { '@type': 'Question', name: '¿El DJ cobra desplazamiento para bodas fuera de Bilbao?', acceptedAnswer: { '@type': 'Answer', text: 'La mayoría de DJs de Bilbao cubren gratis la provincia de Bizkaia. Para bodas en Gipuzkoa (San Sebastián) o Álava (Vitoria), suelen cobrar un suplemento de 50-100€. Para bodas en Cantabria, La Rioja o Navarra limítrofes, el suplemento puede llegar a 100-200€.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ bodas Bilbao', item: 'https://xpeak.es/blog/dj-bodas-bilbao' }] };
const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '400–900€' },
  { servicio: 'Cóctel + pista de baile', precio: '600–1.200€' },
  { servicio: 'Servicio completo (ceremonia + cóctel + cena + pista)', precio: '800–1.800€' },
  { servicio: 'Pack premium con equipo profesional', precio: '1.100–2.200€' },
];
const ZONAS = [
  { zona: 'Gran Bilbao', fincas: 'Getxo, Algorta, Sopelana', nota: 'Vistas al Cantábrico' },
  { zona: 'Interior Bizkaia', fincas: 'Durango, Amorebieta, Gernika', nota: 'Caseríos tradicionales' },
  { zona: 'Gipuzkoa', fincas: 'San Sebastián, Zarautz, Tolosa', nota: 'Bodas de alto standing' },
  { zona: 'Álava / Rioja Alavesa', fincas: 'Vitoria, Laguardia, Elciego', nota: 'Bodegas con encanto' },
];
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en Bilbao', description: 'Encuentra y contrata DJs verificados para bodas y eventos en Bilbao. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Bilbao' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/dj-bodas-bilbao', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };

export default function BlogDJBodaBilbao() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Bilbao: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una boda en Bilbao. Precios reales 2026, caseríos vascos, costa y bodegas de Rioja Alavesa. Cómo contratar en Euskadi." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-bodas-bilbao" />
        <meta property="og:title" content="DJ para bodas en Bilbao: precio 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precios reales DJs boda Bilbao. Caseríos, costa y bodegas. Cómo elegir en Euskadi." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-bodas-bilbao" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Bilbao · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en Bilbao: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>El País Vasco tiene uno de los mercados de bodas más activos y exigentes de España. Caseríos centenarios, palacios urbanos y bodegas de la Rioja Alavesa — te contamos cuánto cuesta el DJ y cómo elegir bien en Euskadi.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>3 junio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Bilbao?"
              answer="Un DJ para el servicio completo de una boda en Bilbao (ceremonia, cóctel, cena y pista de baile) cuesta entre 800 y 1.800€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en Bilbao (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.servicio}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios País Vasco 2026. Sin IVA. Un 15-25% por encima de la media nacional.</p>
            </section>
            <BlogInlineCTA role="dj" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en el País Vasco</h2>
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
              <h2 className="text-lg font-black mb-3">Qué diferencia a un DJ de bodas en Bilbao</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>Las bodas en el País Vasco tienen una duración media mayor que en el resto de España — es habitual que empiecen al mediodía y terminen de madrugada. El DJ debe gestionar bien el arco musical de muchas horas: aperitivo, cena larga con vino txakoli y sobremesa, y pista de baile intensa al final.</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>Los caseríos suelen tener acústica complicada — madera, piedra y espacios de techos bajos. Los DJs con experiencia en el País Vasco conocen cómo configurar el sonido para que no haya rebotes ni distorsión en estos espacios tan particulares.</p>
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
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en Bilbao?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en Bilbao, caseríos vascos y todo el País Vasco. Perfiles verificados y contrato digital automático.</p>
              <a href="/contratar-dj/bilbao" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en Bilbao →</a>
            </div>
          </div>
                  <DJResourcesAffiliate role="dj" />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-bilbao" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-bilbao' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_bilbao" />
      </div>
    </>
  );
}
