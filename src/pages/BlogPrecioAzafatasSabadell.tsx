import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Sabadell: guía 2026', description: 'Cuánto cobran las azafatas para eventos corporativos y ferias en Sabadell. Tarifas por perfil 2026.', datePublished: '2026-05-31', dateModified: '2026-07-03', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-sabadell' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Sabadell?', acceptedAnswer: { '@type': 'Answer', text: 'En Sabadell, una azafata de eventos cobra entre 13€ y 19€/hora bruto, algo por debajo de Barcelona capital. Las agencias facturan al cliente entre 130€ y 190€/día por perfil. El mercado es de tamaño medio, con eventos corporativos ligados a la tradición empresarial de la ciudad.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Sabadell?', acceptedAnswer: { '@type': 'Answer', text: 'La Fira Sabadell y los espacios de convenciones del centro concentran actos institucionales y ferias comerciales. La herencia textil e industrial de la ciudad también genera eventos corporativos boutique en naves reconvertidas y sedes de empresas familiares con larga trayectoria.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Sabadell?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos corporativos en Sabadell, 2-3 semanas de antelación suele ser suficiente. Al tratarse de un mercado de tamaño medio con menos competencia por los perfiles que Barcelona, es más fácil encontrar disponibilidad de última hora.' } },
  { '@type': 'Question', name: '¿Qué tipo de azafatas se piden más en Sabadell?', acceptedAnswer: { '@type': 'Answer', text: 'Predomina la demanda de azafatas de imagen y recepción para presentaciones de empresas industriales y actos institucionales del ayuntamiento. El perfil bilingüe se pide en eventos con proveedores o clientes internacionales.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Sabadell', item: 'https://xpeak.es/blog/precio-azafatas-sabadell' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '130–180€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '155–235€/día', nota: 'Eventos de empresa y actos institucionales' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '165–215€/día', nota: 'Eventos con clientes internacionales' },
  { perfil: 'Azafata trilingüe', tarifa: '195–280€/día', nota: 'Presentaciones de proveedores internacionales' },
  { perfil: 'Coordinadora de azafatas', tarifa: '175–260€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '80–125€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasSabadell() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Sabadell 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos corporativos y ferias en Sabadell. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-sabadell" />
        <meta property="og:title" content="Precio azafatas eventos Sabadell 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos corporativos en Sabadell." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-sabadell" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Sabadell · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Sabadell: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Sabadell mantiene una fuerte tradición empresarial e industrial que genera un flujo constante de eventos corporativos boutique. El mercado de azafatas es de tamaño medio, con tarifas algo más moderadas que en Barcelona capital.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Sabadell?"
              answer="Una azafata de eventos en Sabadell cobra entre 13€ y 19€/hora bruto, y las agencias facturan entre 130€ y 190€/día por el servicio completo. Al ser un mercado boutique de tamaño medio, suele haber más disponibilidad que en Barcelona capital."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Sabadell</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Sabadell 2026. Sin IVA.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Sabadell</h2>
              <div className="space-y-2">{['Fira Sabadell y espacios de convenciones del centro: ferias comerciales y actos institucionales','Naves industriales reconvertidas: eventos corporativos boutique ligados a la tradición textil','Sedes de empresas familiares: presentaciones y celebraciones de aniversario empresarial','Ayuntamiento y entorno de la Plaça Sant Roc: actos institucionales y culturales'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-barcelona', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Barcelona: guía 2026' },
                  { href: '/blog/precio-azafatas-terrassa', cat: 'Vallès', title: 'Precio azafatas para eventos en Terrassa: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Sabadell?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Sabadell. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/sabadell" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Sabadell →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-sabadell" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-sabadell' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_sabadell" />
      </div>
    </>
  );
}
