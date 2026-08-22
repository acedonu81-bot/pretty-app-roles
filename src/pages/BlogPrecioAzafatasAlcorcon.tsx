import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Alcorcón: guía 2026', description: 'Cuánto cobran las azafatas para eventos comerciales y corporativos en Alcorcón. Tarifas por perfil 2026.', datePublished: '2026-04-26', dateModified: '2026-07-01', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-alcorcon' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Alcorcón?', acceptedAnswer: { '@type': 'Answer', text: 'En Alcorcón, una azafata de eventos cobra entre 12€ y 17€/hora bruto, en línea con el resto del área sur de Madrid. Las agencias facturan al cliente entre 110€ y 170€/día por perfil, con picos de demanda ligados a aperturas comerciales y campañas de marca en los grandes centros comerciales de la ciudad.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Alcorcón?', acceptedAnswer: { '@type': 'Answer', text: 'Las grandes zonas comerciales y de ocio de Alcorcón concentran buena parte de la demanda de azafatas: promociones de marca, campañas de temporada y aperturas de tienda. También hay eventos corporativos puntuales en polígonos empresariales y actos institucionales del ayuntamiento.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Alcorcón?', acceptedAnswer: { '@type': 'Answer', text: 'Para campañas comerciales en centros comerciales, reserva con 2-3 semanas de antelación, sobre todo en Navidad y rebajas. Para eventos corporativos puntuales, 1-2 semanas suele bastar.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Alcorcón?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil de azafata comercial y de promoción es el más solicitado por el peso de las campañas en centros comerciales. También hay demanda de azafatas de imagen para eventos de marca puntuales en la ciudad.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Alcorcón', item: 'https://xpeak.es/blog/precio-azafatas-alcorcon' }] };

const PRECIOS = [
  { perfil: 'Azafata comercial / promoción', tarifa: '110–155€/día', nota: 'Centros comerciales y campañas de marca' },
  { perfil: 'Azafata de imagen', tarifa: '130–185€/día', nota: 'Eventos de marca y aperturas' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '145–195€/día', nota: 'Eventos corporativos con marcas internacionales' },
  { perfil: 'Azafata de protocolo institucional', tarifa: '135–190€/día', nota: 'Actos del ayuntamiento' },
  { perfil: 'Coordinadora de azafatas', tarifa: '155–225€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '70–105€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasAlcorcon() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Alcorcón 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos comerciales y corporativos en Alcorcón. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-alcorcon" />
        <meta property="og:title" content="Precio azafatas eventos Alcorcón 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos comerciales y corporativos en Alcorcón." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-alcorcon" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Alcorcón · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Alcorcón: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Alcorcón es una de las ciudades con mayor concentración de comercio y ocio del área sur de Madrid. Esto genera una demanda constante de azafatas para campañas comerciales y eventos de marca, con tarifas algo por debajo de Madrid capital.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Alcorcón?"
              answer="Una azafata de eventos en Alcorcón cobra entre 12€ y 17€/hora bruto, y las agencias facturan entre 110€ y 170€/día por el servicio completo. Las campañas comerciales en los grandes centros comerciales de la ciudad son las que más demanda generan."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Alcorcón</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Alcorcón 2026. Sin IVA. Desplazamiento fuera del municipio puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Alcorcón</h2>
              <div className="space-y-2">{['Grandes centros comerciales y de ocio: campañas de marca y promociones','Polígonos empresariales: eventos corporativos y presentaciones','Ayuntamiento y organismos públicos: actos de protocolo institucional','Espacios feriales y de convenciones locales: jornadas puntuales'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-madrid', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Madrid: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Alcorcón?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Alcorcón. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/alcorcon" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Alcorcón →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-alcorcon" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-alcorcon' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_alcorcon" />
      </div>
    </>
  );
}
