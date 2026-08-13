import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Murcia: guía 2026', description: 'Cuánto cobran las azafatas para eventos, ferias y bodas en fincas de la huerta en Murcia. Tarifas por perfil 2026.', datePublished: '2026-06-03', dateModified: '2026-08-08', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-murcia' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'En Murcia, una azafata de eventos cobra entre 10€ y 15€/hora bruto, por debajo de la media nacional gracias a un mercado con plazas más económicas. Las agencias facturan al cliente entre 95€ y 150€/día por perfil. El clima cálido permite eventos al aire libre en más meses del año que en otras ciudades.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'Las fincas de bodas en la huerta murciana concentran gran parte de la demanda en primavera y otoño. El centro de la ciudad y los hoteles de negocios generan eventos corporativos moderados durante todo el año, y el clima suave permite celebraciones al aire libre incluso en meses fuera de temporada alta en otras zonas de España.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para una boda en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en fincas de la huerta murciana en temporada alta (abril-junio y septiembre-octubre) reserva con 2-3 meses de antelación. Para eventos corporativos puntuales en la capital, 2 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Murcia?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil generalista para bodas y eventos corporativos moderados es el más habitual. También hay demanda de azafatas de protocolo para celebraciones en fincas de la huerta, especialmente en los meses de clima suave que alargan la temporada de bodas al aire libre.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Murcia', item: 'https://xpeak.es/blog/precio-azafatas-murcia' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '95–140€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '115–175€/día', nota: 'Eventos de marca y presentaciones' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '130–175€/día', nota: 'Congresos y eventos corporativos' },
  { perfil: 'Azafata de protocolo', tarifa: '130–190€/día', nota: 'Bodas en fincas de la huerta' },
  { perfil: 'Coordinadora de azafatas', tarifa: '140–210€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '60–100€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasMurcia() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Murcia 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, ferias y bodas en fincas de la huerta en Murcia. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-murcia" />
        <meta property="og:title" content="Precio azafatas eventos Murcia 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para bodas en la huerta murciana y eventos corporativos en Murcia." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-murcia" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Murcia · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Murcia: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Murcia combina un calendario activo de bodas en fincas de la huerta con eventos corporativos moderados en la capital. El clima cálido casi todo el año alarga la temporada de eventos al aire libre, y las tarifas quedan algo por debajo de la media nacional.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Murcia?"
              answer="Una azafata de eventos en Murcia cobra entre 10€ y 15€/hora bruto, y las agencias facturan entre 95€ y 150€/día por el servicio completo. El clima suave de la región permite programar eventos al aire libre en más meses del año que en otras zonas de España, lo que reparte la demanda de forma más constante."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Murcia</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Murcia 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Murcia</h2>
              <div className="space-y-2">{['Fincas de bodas en la huerta murciana: temporada alta en primavera y otoño','Centro de la ciudad y hoteles de negocios: eventos corporativos moderados todo el año','Clima cálido: permite eventos al aire libre en más meses que en otras regiones','Espacios de eventos privados en el área metropolitana: celebraciones y presentaciones'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
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
                  { href: '/blog/personal-de-imagen-ferias-y-congresos', cat: 'Staff', title: 'Personal de imagen para ferias y congresos' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Murcia?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Murcia. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/murcia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Murcia →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-murcia" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-murcia' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_murcia" />
      </div>
    </>
  );
}
