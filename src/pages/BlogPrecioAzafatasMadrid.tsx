import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Madrid: guía 2026', description: 'Cuánto cobran las azafatas para eventos, ferias (IFEMA) y congresos en Madrid. Tarifas por perfil y zona.', datePublished: '2026-04-11', dateModified: '2026-07-11', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-madrid' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'En Madrid, una azafata de eventos cobra entre 13€ y 20€/hora bruto, algo por encima de la media nacional por el volumen de ferias en IFEMA. Las agencias facturan al cliente entre 130€ y 200€/día por perfil. Ferias grandes como FITUR o el Salón del Automóvil suben la demanda y la tarifa un 15-20%.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos y ferias en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'IFEMA (Feria de Madrid) es el gran polo ferial: FITUR, ARCO, Salón del Automóvil, MWC (algunos años). También hay mucha demanda corporativa en el eje Castellana-AZCA para presentaciones de producto y eventos de empresa, y en el Palacio de Congresos para congresos médicos y profesionales.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para una feria en IFEMA?', acceptedAnswer: { '@type': 'Answer', text: 'Para ferias grandes de IFEMA (FITUR, ARCO) reserva con 6-10 semanas de antelación — los perfiles bilingües y con experiencia en el sector se agotan primero. Para eventos corporativos puntuales en Madrid capital, 2-3 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil bilingüe (inglés) es el más demandado por el volumen de ferias internacionales en IFEMA. También hay demanda alta de azafatas de imagen para eventos de marcas de lujo y presentaciones corporativas en el eje Castellana.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Madrid', item: 'https://xpeak.es/blog/precio-azafatas-madrid' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria IFEMA', tarifa: '130–190€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '160–260€/día', nota: 'Eventos de marca y protocolo' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '170–230€/día', nota: 'Muy demandada en ferias IFEMA' },
  { perfil: 'Azafata trilingüe', tarifa: '210–310€/día', nota: 'Ferias internacionales (MWC, FITUR)' },
  { perfil: 'Coordinadora de azafatas', tarifa: '190–290€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '85–140€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasMadrid() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Madrid 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, ferias IFEMA y congresos en Madrid. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-madrid" />
        <meta property="og:title" content="Precio azafatas eventos Madrid 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para ferias IFEMA y eventos corporativos en Madrid." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-madrid" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Madrid · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Madrid: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Madrid concentra el mayor volumen de ferias y congresos de España gracias a IFEMA. Esto significa más oferta de azafatas profesionales, pero también más competencia por los perfiles bilingües en fechas de feria grande.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Madrid?"
              answer="Una azafata de eventos en Madrid cobra entre 13€ y 20€/hora bruto, y las agencias facturan entre 130€ y 200€/día por el servicio completo. En fechas de ferias grandes de IFEMA (FITUR, ARCO, MWC) la tarifa sube un 15-20% por la alta demanda de perfiles bilingües."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Madrid</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Madrid 2026. Sin IVA. Desplazamiento fuera de la M-30 puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Madrid</h2>
              <div className="space-y-2">{['IFEMA (Feria de Madrid): FITUR, ARCO, Salón del Automóvil, congresos médicos','Eje Castellana-AZCA: presentaciones de producto y eventos de marcas de lujo','Palacio Municipal de Congresos: congresos profesionales y médicos','Centros de convenciones de hoteles (Barajas, zona financiera): eventos corporativos'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
                  { href: '/blog/personal-de-imagen-ferias-y-congresos', cat: 'Staff', title: 'Personal de imagen para ferias y congresos' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Madrid?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Madrid. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/madrid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Madrid →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-madrid" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-madrid' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_madrid" />
      </div>
    </>
  );
}
