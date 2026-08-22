import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Jerez de la Frontera: guía 2026', description: 'Cuánto cobran las azafatas para catas de bodega, la Feria de Jerez y eventos ecuestres. Tarifas por perfil 2026.', datePublished: '2026-05-12', dateModified: '2026-06-22', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-jerez' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Jerez de la Frontera?', acceptedAnswer: { '@type': 'Answer', text: 'En Jerez de la Frontera, una azafata de eventos cobra entre 12€ y 18€/hora bruto, en línea con la media nacional o algo por debajo, como corresponde a una plaza comercial de interior de Cádiz. Las agencias facturan al cliente entre 120€ y 190€/día por perfil. En la Feria de Jerez (mayo) la demanda sube notablemente.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'Las bodegas de jerez (sherry), uno de los grandes diferenciadores de la ciudad, generan demanda constante de azafatas para catas y visitas guiadas de grupo. La Feria de Jerez en mayo y los eventos ligados a la tradición ecuestre, con la Real Escuela Andaluza del Arte Ecuestre como referencia, también concentran actividad relevante.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para la Feria de Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'Para la Feria de Jerez en mayo, uno de los momentos de mayor demanda del año, conviene reservar con 4-6 semanas de antelación. Para catas de bodega y eventos corporativos puntuales, 1-2 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Jerez?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata para catas y visitas de bodega es muy característico de Jerez, a menudo con conocimientos básicos del proceso del sherry. También hay demanda de azafatas bilingües por el turismo internacional que atraen las bodegas y la Real Escuela Andaluza del Arte Ecuestre.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Jerez', item: 'https://xpeak.es/blog/precio-azafatas-jerez' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '120–165€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de cata / bodega', tarifa: '130–180€/día', nota: 'Catas de sherry y visitas de grupo' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '150–200€/día', nota: 'Turismo internacional de bodegas' },
  { perfil: 'Azafata de imagen', tarifa: '140–195€/día', nota: 'Eventos corporativos y de marca' },
  { perfil: 'Coordinadora de azafatas', tarifa: '160–220€/día', nota: 'Feria de Jerez y eventos grandes' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '75–120€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasJerez() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Jerez 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para catas de bodega, Feria de Jerez y eventos ecuestres. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-jerez" />
        <meta property="og:title" content="Precio azafatas eventos Jerez 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para catas de bodega, Feria de Jerez y eventos ecuestres." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-jerez" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#059669' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Jerez de la Frontera · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Jerez de la Frontera: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Jerez de la Frontera es una plaza comercial de interior con un sector vitivinícola propio —las bodegas de jerez— y una fuerte tradición ecuestre. Sus tarifas de azafatas están en línea con la media nacional, con picos de demanda en la Feria de Jerez de mayo.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Jerez?"
              answer="Una azafata de eventos en Jerez de la Frontera cobra entre 12€ y 18€/hora bruto, y las agencias facturan entre 120€ y 190€/día por el servicio completo. Es una tarifa en línea con la media nacional, aunque sube en fechas de la Feria de Jerez en mayo."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Jerez</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Jerez 2026. Sin IVA. En Feria de Jerez (mayo) la tarifa puede subir un 10-15%.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Jerez</h2>
              <div className="space-y-2">{['Bodegas de jerez (sherry): catas y visitas de grupo durante todo el año','Feria de Jerez (mayo): pico de demanda de azafatas para casetas y eventos','Real Escuela Andaluza del Arte Ecuestre: eventos y espectáculos ligados a la tradición ecuestre','Zona comercial del centro: eventos corporativos y presentaciones de producto'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                  { href: '/blog/precio-azafatas-malaga', cat: 'Andalucía', title: 'Precio azafatas para eventos en Málaga: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Jerez?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Jerez de la Frontera. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/jerez" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Jerez →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-jerez" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-jerez' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_jerez" />
      </div>
    </>
  );
}
