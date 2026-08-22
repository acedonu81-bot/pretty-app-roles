import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Manresa: guía 2026', description: 'Cuánto cobran las azafatas para eventos corporativos y bodas en Manresa, capital de la Catalunya Central. Tarifas 2026.', datePublished: '2026-05-31', dateModified: '2026-07-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-manresa' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'En Manresa, una azafata de eventos cobra entre 12€ y 17€/hora bruto, algo por debajo de la media del área metropolitana de Barcelona por ser un mercado más interior y de menor volumen. Las agencias facturan al cliente entre 115€ y 165€/día por perfil.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Como capital de la Catalunya Central, Manresa concentra actos institucionales de la comarca del Bages y ferias comerciales locales. Las fincas rurales del entorno del Bages son el escenario habitual de bodas, con una demanda de azafatas de recepción constante en temporada alta.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en fincas del Bages en temporada alta (mayo-septiembre), reserva con 4-6 semanas de antelación. Al ser un mercado más pequeño que Barcelona, la disponibilidad de perfiles es limitada en fines de semana de alta demanda.' } },
  { '@type': 'Question', name: '¿Por qué son más económicas las azafatas en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Al ser un mercado interior con menos presión de ferias internacionales que Barcelona, los costes operativos de las agencias son menores y esto se traslada a tarifas más ajustadas, manteniendo el mismo nivel de profesionalidad.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Manresa', item: 'https://xpeak.es/blog/precio-azafatas-manresa' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '115–160€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '140–210€/día', nota: 'Eventos institucionales y de empresa' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '150–195€/día', nota: 'Demanda puntual en actos con proveedores' },
  { perfil: 'Azafata para boda (recepción)', tarifa: '110–170€/día', nota: 'Fincas del Bages' },
  { perfil: 'Coordinadora de azafatas', tarifa: '155–230€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–115€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasManresa() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Manresa 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos y bodas en Manresa, Catalunya Central. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-manresa" />
        <meta property="og:title" content="Precio azafatas eventos Manresa 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos y bodas en Manresa." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-manresa" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Manresa · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Manresa: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Manresa, capital de la Catalunya Central, tiene un mercado de eventos más pequeño e interior que el área metropolitana de Barcelona. Las bodas en fincas del Bages y los actos institucionales de la comarca marcan la demanda, con tarifas más ajustadas.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Manresa?"
              answer="Una azafata de eventos en Manresa cobra entre 12€ y 17€/hora bruto, y las agencias facturan entre 115€ y 165€/día por el servicio completo. Son tarifas más ajustadas que en el área metropolitana de Barcelona por ser un mercado interior de menor volumen."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Manresa</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Manresa 2026. Sin IVA. Desplazamiento a fincas rurales del Bages puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Manresa</h2>
              <div className="space-y-2">{['Fincas rurales del Bages: bodas en temporada alta, mayo a septiembre','Centro de Manresa y entorno de la Seu: actos institucionales de la comarca','Ferias comerciales locales: muestras y actos de entidades del territorio','Empresas del polígono industrial: presentaciones y eventos corporativos puntuales'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-terrassa', cat: 'Vallès', title: 'Precio azafatas para eventos en Terrassa: guía 2026' },
                  { href: '/blog/precio-azafatas-barcelona', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Barcelona: guía 2026' },
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Manresa?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Manresa. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/manresa" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Manresa →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-manresa" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-manresa' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_manresa" />
      </div>
    </>
  );
}
