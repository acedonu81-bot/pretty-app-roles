import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Las Palmas: guía 2026', description: 'Cuánto cobran las azafatas para eventos corporativos, ferias y turismo internacional en Las Palmas de Gran Canaria. Tarifas 2026.', datePublished: '2026-07-02', dateModified: '2026-07-14', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-laspalmas' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Las Palmas?', acceptedAnswer: { '@type': 'Answer', text: 'En Las Palmas de Gran Canaria, una azafata de eventos cobra entre 13€ y 20€/hora bruto, por encima de la media nacional por la logística de archipiélago y la actividad turística constante. Las agencias facturan al cliente entre 135€ y 205€/día por perfil.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Las Palmas?', acceptedAnswer: { '@type': 'Answer', text: 'El Puerto de La Luz es un punto de referencia para eventos corporativos ligados a la actividad marítima y logística de la ciudad. El centro de Las Palmas y las zonas hoteleras del sur de Gran Canaria concentran bodas y eventos con clientela internacional durante todo el año.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para un evento en Las Palmas?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en hoteles y fincas del sur de Gran Canaria reserva con 2-3 meses de antelación. Al no depender de una temporada estival estricta, también conviene anticipar reservas de invierno, cuando el clima sigue permitiendo eventos al aire libre.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Las Palmas?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil bilingüe es el más demandado por el volumen de turismo internacional y la actividad portuaria. Para eventos corporativos vinculados al Puerto de La Luz también hay demanda estable de azafatas de protocolo.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Las Palmas', item: 'https://xpeak.es/blog/precio-azafatas-laspalmas' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '135–190€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '160–245€/día', nota: 'Eventos de marca y hoteles' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '170–225€/día', nota: 'Muy demandada por el turismo internacional' },
  { perfil: 'Azafata de protocolo', tarifa: '170–235€/día', nota: 'Eventos corporativos y portuarios' },
  { perfil: 'Coordinadora de azafatas', tarifa: '185–275€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '85–145€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasLasPalmas() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Las Palmas 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos corporativos y turismo internacional en Las Palmas de Gran Canaria. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-laspalmas" />
        <meta property="og:title" content="Precio azafatas eventos Las Palmas 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para eventos corporativos y turismo internacional en Las Palmas." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-laspalmas" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · Las Palmas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Las Palmas: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Las Palmas de Gran Canaria combina la actividad del Puerto de La Luz con un flujo constante de turismo internacional que mantiene el mercado de eventos activo durante todo el año, con tarifas por encima de la media nacional.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Las Palmas?"
              answer="Una azafata de eventos en Las Palmas cobra entre 13€ y 20€/hora bruto, y las agencias facturan entre 135€ y 205€/día por el servicio completo. La logística de archipiélago y el turismo internacional constante mantienen las tarifas por encima de la media nacional."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Las Palmas</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Las Palmas 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Las Palmas</h2>
              <div className="space-y-2">{['Puerto de La Luz: eventos corporativos ligados a la actividad marítima y logística','Centro de Las Palmas: eventos institucionales y presentaciones de empresa','Zonas hoteleras del sur de Gran Canaria: bodas con clientela internacional','Turismo activo todo el año: eventos al aire libre sin limitación estacional'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
                  { href: '/blog/precio-azafatas-tenerife', cat: 'Canarias', title: 'Precio azafatas para eventos en Tenerife 2026' },
                  { href: '/blog/dj-bodas-las-palmas', cat: 'Bodas', title: 'DJ para bodas en Las Palmas: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Las Palmas?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Las Palmas. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/laspalmas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en Las Palmas →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-laspalmas" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-laspalmas' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_las_palmas" />
      </div>
    </>
  );
}
