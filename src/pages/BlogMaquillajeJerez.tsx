import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Jerez de la Frontera: guía 2026', description: 'Cuánto cobra una maquilladora para bodas en bodegas y la Feria de Jerez. Tarifas por servicio 2026.', datePublished: '2026-05-15', dateModified: '2026-07-27', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-jerez' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Jerez de la Frontera?', acceptedAnswer: { '@type': 'Answer', text: 'En Jerez de la Frontera una maquilladora para novia cobra entre 95€ y 220€, en línea o algo por debajo de la media nacional, como corresponde a una plaza comercial de interior de Cádiz. Para la Feria de Jerez, muchas mujeres contratan maquillaje flamenco, con precios entre 40€ y 75€ por sesión.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'Las bodegas de jerez (sherry) son un escenario habitual de bodas, generando demanda de maquillaje de novia durante todo el año. La Feria de Jerez en mayo dispara la demanda de maquillaje flamenco para las casetas. Los eventos ligados a la Real Escuela Andaluza del Arte Ecuestre también generan actividad puntual.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'En temporada alta de bodas (mayo-septiembre), reserva con 2-3 meses de antelación. Para la Feria de Jerez en mayo, con la altísima demanda de maquillaje flamenco, conviene reservar con 4-6 semanas.' } },
  { '@type': 'Question', name: '¿Es más caro el maquillaje de novia que el de invitada en Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. El maquillaje de novia incluye prueba previa y una sesión más larga, por lo que cuesta entre 95€ y 220€. El de madrina o invitada especial (incluido el maquillaje flamenco de Feria) es más rápido y ronda los 40€-90€ en Jerez.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Jerez', item: 'https://xpeak.es/blog/maquillaje-eventos-jerez' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '95–220€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '190–400€', nota: 'Servicio integral más demandado' },
  { perfil: 'Madrina / invitada especial', tarifa: '55–110€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Maquillaje flamenco Feria de Jerez', tarifa: '40–75€', nota: 'Mayo, alta demanda puntual' },
  { perfil: 'Pack boda en bodega (novia + 3 personas)', tarifa: '340–650€', nota: 'Desplazamiento incluido' },
  { perfil: 'Evento corporativo / azafata', tarifa: '30–60€/persona', nota: 'Maquillaje fast-track profesional' },
];

export default function BlogMaquillajeJerez() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Jerez 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas en bodegas y la Feria de Jerez. Tarifas por servicio 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-jerez" />
        <meta property="og:title" content="Precio maquilladora eventos Jerez 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas en bodegas y Feria de Jerez." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-jerez" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Maquillaje · Jerez de la Frontera · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Jerez de la Frontera: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Jerez de la Frontera combina bodas en bodegas de sherry con el gran pico de demanda de maquillaje flamenco de la Feria de Jerez en mayo. Sus tarifas están en línea o algo por debajo de la media nacional.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Jerez?"
              answer="Una maquilladora de novia en Jerez de la Frontera cobra entre 95€ y 220€, incluyendo prueba previa. Para la Feria de Jerez, el maquillaje flamenco ronda los 40€-75€ por sesión. Para eventos corporativos, el precio por persona está entre 30€ y 60€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Jerez</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Jerez 2026. En Feria de Jerez (mayo) la demanda de maquillaje flamenco sube notablemente.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Jerez</h2>
              <div className="space-y-2">{['Bodegas de jerez (sherry): bodas y celebraciones durante todo el año','Feria de Jerez (mayo): pico de demanda de maquillaje flamenco para casetas','Real Escuela Andaluza del Arte Ecuestre: eventos y espectáculos puntuales','Zona comercial del centro: eventos corporativos y celebraciones'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquilladora-para-eventos-precio', cat: 'Nacional', title: 'Maquilladora para eventos: precios en España 2026' },
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Bodas', title: 'Maquillaje nupcial: precios y guía 2026' },
                  { href: '/blog/maquillaje-eventos-malaga', cat: 'Andalucía', title: 'Precio maquilladora para eventos en Málaga: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Jerez?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Jerez de la Frontera. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/jerez" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver maquilladoras en Jerez →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-jerez" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-jerez' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_jerez" />
      </div>
    </>
  );
}
