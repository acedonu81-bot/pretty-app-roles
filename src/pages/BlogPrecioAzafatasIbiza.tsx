import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Ibiza: guía 2026', description: 'Cuánto cobran las azafatas para eventos, clubes y fiestas privadas en Ibiza. Tarifas de temporada alta 2026.', datePublished: '2026-05-20', dateModified: '2026-07-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-ibiza' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza, una azafata de eventos cobra entre 20€ y 35€/hora bruto, la tarifa más alta de España, por el peso del turismo de lujo internacional. Las agencias facturan al cliente entre 220€ y 400€/día por perfil. En temporada alta (mayo-septiembre) la demanda se dispara y hay que reservar con mucha antelación.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'La demanda se concentra en villas privadas del interior y la costa para fiestas exclusivas, en superyates fondeados en Ibiza y Formentera para eventos náuticos, y en clubes de playa (beach clubs) de Playa d\'en Bossa y Talamanca para eventos de marca durante toda la temporada.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza la reserva con antelación es crítica: para eventos en temporada alta (mayo-septiembre) conviene cerrar el equipo con 2-3 meses de margen, ya que los perfiles bilingües y trilingües se agotan pronto por la alta rotación de eventos privados y de clubes.' } },
  { '@type': 'Question', name: '¿Por qué Ibiza es la plaza más cara de España para contratar azafatas?', acceptedAnswer: { '@type': 'Answer', text: 'La combinación de clientela internacional de muy alto poder adquisitivo, una temporada extremadamente concentrada (mayo-septiembre) y el coste de vida elevado de la isla sitúan las tarifas de Ibiza entre un 40% y un 60% por encima de Madrid o Barcelona en plena temporada.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Ibiza', item: 'https://xpeak.es/blog/precio-azafatas-ibiza' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '220–300€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '260–400€/día', nota: 'Eventos de marca en clubes y beach clubs' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '270–380€/día', nota: 'Imprescindible por clientela internacional' },
  { perfil: 'Azafata trilingüe', tarifa: '320–480€/día', nota: 'Eventos en villas y superyates' },
  { perfil: 'Coordinadora de azafatas', tarifa: '300–450€/día', nota: 'Gestión de equipo en fiesta privada grande' },
  { perfil: 'Pack evento en villa/yate (4h)', tarifa: '150–260€', nota: 'Desplazamiento dentro de la isla incluido' },
];

export default function BlogPrecioAzafatasIbiza() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Ibiza 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, clubes y fiestas privadas en Ibiza. Tarifas de temporada alta 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-ibiza" />
        <meta property="og:title" content="Precio azafatas eventos Ibiza 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para clubes, villas y eventos privados en Ibiza." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-ibiza" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Ibiza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Ibiza: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Ibiza es la plaza más cara de España para contratar azafatas: clientela internacional de alto poder adquisitivo, temporada muy concentrada (mayo-septiembre) y una altísima rotación de eventos en villas, clubes y superyates.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Ibiza?"
              answer="Una azafata de eventos en Ibiza cobra entre 20€ y 35€/hora bruto, y las agencias facturan entre 220€ y 400€/día por el servicio completo. Es la tarifa más alta de España, impulsada por el turismo de lujo y la corta duración de la temporada."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Ibiza</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Ibiza 2026, temporada alta. Sin IVA. Desplazamiento a fincas o embarcaciones puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Ibiza</h2>
              <div className="space-y-2">{['Villas privadas del interior y la costa: fiestas exclusivas y eventos de temporada','Superyates fondeados en Ibiza y Formentera: eventos náuticos y presentaciones a bordo','Beach clubs de Playa d\'en Bossa y Talamanca: eventos de marca durante toda la temporada','Clubes nocturnos de la isla: azafatas de imagen y RRPP en noches de gran afluencia'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-palma', cat: 'Temporada alta', title: 'Precio azafatas para eventos en Palma de Mallorca: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Nacional', title: 'Precio azafatas para eventos en España: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Ibiza?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Ibiza. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/ibiza" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Ibiza →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-ibiza" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-ibiza' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_ibiza" />
      </div>
    </>
  );
}
