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

const slug = 'dj-bodas-vitoria';
const ciudad = 'Vitoria';
const PRECIOS = [
  { servicio: 'Solo pista de baile (4-5h)', precio: '350–800€' },
  { servicio: 'Cóctel + pista de baile', precio: '550–1.200€' },
  { servicio: 'Servicio completo', precio: '700–1.800€' },
  { servicio: 'Pack caserío o palacio premium', precio: '1.000–2.200€' },
];
const ZONAS = [
  { zona: 'Vitoria capital', fincas: 'Palacios medievales, hoteles históricos, casas señoriales', nota: 'Ciudad bien conservada, venues únicos' },
  { zona: 'Álava interior', fincas: 'Caseríos vascos, fincas entre viñedos', nota: 'Ambiente rural, muy auténtico' },
  { zona: 'Rioja Alavesa', fincas: 'Bodegas de Laguardia, viñedos espectaculares', nota: 'Bodas entre viñedos, muy demandado' },
  { zona: 'Montaña alavesa', fincas: 'Fincas de montaña con vistas al Cantábrico', nota: 'Íntimo y natural' },
];
const faq = [
  { q: `¿Cuánto cuesta un DJ para una boda en ${ciudad}?`, a: `Un DJ para boda en ${ciudad} cuesta entre 500€ y 1.800€. Vitoria tiene precios similares al resto del País Vasco. Las bodas en bodegas de la Rioja Alavesa tienen precios algo más altos por la exclusividad del venue.` },
  { q: `¿Cuándo es la temporada alta de bodas en ${ciudad}?`, a: `Junio, julio y septiembre son los meses más demandados. El otoño en la Rioja Alavesa es especialmente bonito por los colores de los viñedos. El invierno vitoriano es frío y con nieve en algunos años, por lo que las bodas de interior son la opción más segura.` },
  { q: `¿Hay bodegas en Álava que permitan celebrar bodas con DJ?`, a: `Sí. La Rioja Alavesa tiene algunas de las bodegas más espectaculares de España (Bodegas Ysios, Marqués de Riscal, El Ciego). La mayoría tiene salas de eventos y permiten celebrar bodas completas con DJ externo, aunque suelen tener lista de proveedores recomendados.` },
];
const faqPageSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };


const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: `DJs para bodas en Vitoria`, description: `Encuentra y contrata DJs verificados para bodas y eventos en Vitoria. Presupuestos gratuitos, contratos digitales y 0% comisión.`, serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: 'Vitoria' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: `https://xpeak.es/blog/dj-bodas-vitoria`, offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };
export default function BlogDJBodaVitoria() {
  return (
    <>
      <Helmet>
        <title>DJ para bodas en Vitoria: precio 2026 | XPEAK</title>
        <meta name="description" content={`Cuánto cuesta un DJ para una boda en ${ciudad}. Precios reales 2026, caseríos, bodegas Rioja Alavesa y cómo contratar el mejor DJ.`} />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content={`DJ para bodas en ${ciudad}: precio 2026 — XPEAK Blog`} />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `DJ para bodas en ${ciudad}: precio y cómo contratar en 2026`, datePublished: '2026-06-04', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' } })}</script>
      <script type="application/ld+json">{JSON.stringify(faqPageSchema)}</script></Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · {ciudad} · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para bodas en {ciudad}: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>{ciudad} es la capital del País Vasco y ofrece una mezcla única de palacios medievales en la ciudad y bodegas espectaculares en la Rioja Alavesa. Guía completa de precios para bodas en 2026.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 junio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda en Vitoria?"
              answer="Un DJ para el servicio completo de una boda en Vitoria (ceremonia, cóctel, cena y pista de baile) cuesta entre 700 y 1.800€ en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para boda en {ciudad} (2026)</h2>
              <div className="space-y-2">{PRECIOS.map((row, i) => (<div key={row.servicio} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}><p className="text-xs font-medium">{row.servicio}</p><span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span></div>))}</div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos 2026. Sin IVA.</p>
            </section>
            <BlogInlineCTA role="dj" variant="upgrade" />
            <section>
              <h2 className="text-lg font-black mb-4">Zonas de boda en {ciudad}</h2>
              <div className="space-y-3">{ZONAS.map((z, i) => (<div key={z.zona} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}><div className="flex items-start justify-between mb-1"><p className="text-xs font-bold">{z.zona}</p><span className="text-[0.6rem] font-bold px-2 py-0.5 rounded ml-3 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{z.nota}</span></div><p className="text-xs" style={{ color: '#3d3d4e' }}>{z.fincas}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faq.map(f => (<div key={f.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.q}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.a}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">{[{ href: '/blog/dj-bodas-bilbao', cat: 'SEO Local', title: 'DJ para bodas en Bilbao: precio 2026' },{ href: '/blog/dj-bodas-san-sebastian', cat: 'SEO Local', title: 'DJ para bodas en San Sebastián: precio 2026' },{ href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' }].map(link => (<a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}><span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span><span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span></a>))}</div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda en {ciudad}?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con DJs verificados en el País Vasco y Álava. Contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en {ciudad} →</a>
            </div>
          </div>
                  <DJResourcesAffiliate role="dj" />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-bodas-vitoria" />
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-bodas-vitoria' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey={`xpeak_scrollcta_${slug}`} />
      </div>
    </>
  );
}
