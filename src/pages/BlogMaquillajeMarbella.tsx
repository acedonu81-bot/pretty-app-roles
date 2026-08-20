import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Marbella: guía 2026', description: 'Cuánto cobra una maquilladora para bodas de lujo en villas y hoteles 5* de Marbella. Tarifas 2026.', datePublished: '2026-04-26', dateModified: '2026-06-07', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-marbella' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'En Marbella una maquilladora para novia cobra entre 160€ y 380€, muy por encima de la media nacional por el peso del turismo de lujo internacional. Para eventos corporativos y de marca en Puerto Banús, el precio por persona ronda 55€-110€. El desplazamiento a villas de la Milla de Oro suele facturarse aparte.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'Las villas privadas de la Milla de Oro y los hoteles 5 estrellas concentran gran parte de las bodas de alto presupuesto, especialmente en verano. Puerto Banús también genera demanda de maquillaje para eventos de marca dirigidos a clientela internacional durante toda la temporada.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'En Marbella, temporada alta de bodas (junio-septiembre), reserva con 3-4 meses de antelación, especialmente si quieres prueba de maquillaje previa. Las maquilladoras con experiencia en bodas de lujo internacionales se agotan primero.' } },
  { '@type': 'Question', name: '¿Por qué el maquillaje cuesta más en Marbella que en Málaga?', acceptedAnswer: { '@type': 'Answer', text: 'La combinación de clientela internacional de alto poder adquisitivo, bodas en villas de lujo y una exigencia de acabado muy alta sitúa las tarifas de Marbella entre un 30% y un 50% por encima de Málaga o Madrid, con maquilladoras especializadas en HD y larga duración especialmente valoradas.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Marbella', item: 'https://xpeak.es/blog/maquillaje-eventos-marbella' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '160–380€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '320–650€', nota: 'Servicio integral en villas y hoteles 5*' },
  { perfil: 'Madrina / invitada especial', tarifa: '90–180€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Pack boda (novia + 3 personas)', tarifa: '550–1.050€', nota: 'Desplazamiento a villa de la Milla de Oro incluido' },
  { perfil: 'Evento Puerto Banús / marca', tarifa: '55–110€/persona', nota: 'Maquillaje fast-track para clientela internacional' },
  { perfil: 'Sesión foto / vídeo', tarifa: '130–280€', nota: 'HD premium, flash-friendly, retoque incluido' },
];

export default function BlogMaquillajeMarbella() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Marbella 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas de lujo en villas y hoteles 5* de Marbella. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-marbella" />
        <meta property="og:title" content="Precio maquilladora eventos Marbella 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas de lujo en Marbella." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-marbella" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Maquillaje · Marbella · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Marbella: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Marbella tiene uno de los mercados de maquillaje de novia más exclusivos de España, con bodas en villas de la Milla de Oro y hoteles 5 estrellas para clientela internacional de alto poder adquisitivo.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Marbella?"
              answer="Una maquilladora de novia en Marbella cobra entre 160€ y 380€, incluyendo prueba previa. El pack boda completo (novia + 3 personas) ronda los 550€-1.050€. Para eventos de marca en Puerto Banús, el precio por persona está entre 55€ y 110€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Marbella</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Marbella 2026, temporada alta. Desplazamiento a villas de la Milla de Oro puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Marbella</h2>
              <div className="space-y-2">{['Villas privadas de la Milla de Oro: maquillaje de novia para bodas de alto presupuesto','Hoteles 5 estrellas del entorno: bodas y eventos de lujo con clientela internacional','Puerto Banús: maquillaje para eventos de marca y presentaciones exclusivas','Temporada alta (junio-septiembre): pico de demanda con la máxima afluencia turística'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-marbella', cat: 'Marbella', title: 'Precio azafatas para eventos en Marbella: guía 2026' },
                  { href: '/blog/maquillaje-eventos-malaga', cat: 'Costa del Sol', title: 'Precio maquilladora para eventos en Málaga: guía 2026' },
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Bodas', title: 'Maquillaje nupcial: precios y guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Marbella?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Marbella. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/marbella" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver maquilladoras en Marbella →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-marbella" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-marbella' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_marbella" />
      </div>
    </>
  );
}
