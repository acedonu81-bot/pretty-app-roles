import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Logroño: guía 2026', description: 'Cuánto cobran las azafatas para catas de vino, eventos en bodegas y bodas en La Rioja. Tarifas por perfil en Logroño 2026.', datePublished: '2026-03-17', dateModified: '2026-06-07', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-logrono' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Logroño?', acceptedAnswer: { '@type': 'Answer', text: 'En Logroño, una azafata de eventos cobra entre 11€ y 17€/hora bruto, algo por debajo de la media nacional al ser un mercado de eventos más boutique que las grandes capitales. Las agencias facturan al cliente entre 115€ y 165€/día por perfil. Las catas y eventos en bodegas suelen requerir un perfil con conocimiento del sector vitivinícola.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Logroño?', acceptedAnswer: { '@type': 'Answer', text: 'El sector vitivinícola es el gran diferenciador de La Rioja: catas, presentaciones de cosecha y eventos corporativos en bodegas de la ciudad y el entorno concentran buena parte de la demanda. También hay bodas en fincas y bodegas riojanas, y eventos institucionales en el centro de Logroño como capital de La Rioja.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para un evento en Logroño?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos en bodegas y catas, especialmente en época de vendimia (septiembre-octubre), reserva con 3-4 semanas de antelación. Para bodas en fincas riojanas en temporada alta, 2-3 meses es lo recomendable dado el tamaño más reducido del mercado local.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Logroño?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata para catas y eventos de bodega, con conocimiento básico del mundo del vino, es el más solicitado en La Rioja. También hay demanda de azafatas de imagen para bodas en fincas y bodegas del entorno.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Logroño', item: 'https://xpeak.es/blog/precio-azafatas-logrono' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '115–160€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de catas y bodega', tarifa: '130–190€/día', nota: 'Conocimiento del sector vitivinícola valorado' },
  { perfil: 'Azafata de imagen', tarifa: '135–200€/día', nota: 'Bodas en fincas y bodegas riojanas' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '145–195€/día', nota: 'Turismo enológico internacional' },
  { perfil: 'Coordinadora de azafatas', tarifa: '160–230€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–115€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasLogrono() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Logroño 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para catas de vino, eventos en bodegas y bodas en Logroño. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-logrono" />
        <meta property="og:title" content="Precio azafatas eventos Logroño 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para catas, bodegas y bodas en Logroño y La Rioja." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-logrono" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Logroño · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Logroño: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Logroño tiene un mercado de eventos más boutique que las grandes capitales, con el sector vitivinícola como gran diferenciador: catas, presentaciones de cosecha y eventos en bodegas marcan buena parte de la demanda de personal.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Logroño?"
              answer="Una azafata de eventos en Logroño cobra entre 11€ y 17€/hora bruto, algo por debajo de la media nacional, y las agencias facturan entre 115€ y 165€/día por el servicio completo. Las catas y eventos en bodegas suelen pagar algo más por requerir un perfil con conocimiento del sector vitivinícola."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Logroño</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Logroño 2026. Sin IVA. Desplazamiento a bodegas fuera del área urbana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Logroño</h2>
              <div className="space-y-2">{['Bodegas de Logroño y el entorno riojano: catas, presentaciones de cosecha y eventos corporativos','Fincas y bodegas riojanas: bodas con el viñedo como escenario','Centro de Logroño: eventos institucionales de la capital de La Rioja','Época de vendimia (septiembre-octubre): pico de eventos ligados al sector vitivinícola'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                  { href: '/blog/dj-bodas-logrono', cat: 'DJ Bodas', title: 'DJ para bodas en Logroño: precio 2026' },
                  { href: '/blog/precio-azafatas-pamplona', cat: 'Norte', title: 'Precio azafatas para eventos en Pamplona 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Logroño?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Logroño. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/logrono" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Logroño →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-logrono" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-logrono' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_logrono" />
      </div>
    </>
  );
}
