import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Marbella: guía 2026', description: 'Cuánto cobran las azafatas para eventos, bodas de lujo y Puerto Banús en Marbella. Tarifas de temporada alta 2026.', datePublished: '2026-03-31', dateModified: '2026-05-31', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-marbella' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'En Marbella, una azafata de eventos cobra entre 17€ y 28€/hora bruto, muy por encima de la media nacional gracias al turismo internacional de lujo de Puerto Banús. Las agencias facturan al cliente entre 180€ y 320€/día por perfil. En temporada alta (junio-septiembre) la demanda se dispara con bodas en villas y hoteles 5 estrellas.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'Puerto Banús concentra gran parte de los eventos de marca y presentaciones de lujo dirigidos a clientela internacional. Las villas privadas de la Milla de Oro y los hoteles 5 estrellas del entorno son el escenario principal de bodas de alto presupuesto, especialmente en los meses de verano.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas en Marbella?', acceptedAnswer: { '@type': 'Answer', text: 'En Marbella la temporada alta (junio-septiembre) concentra la mayoría de bodas y eventos de lujo, por lo que conviene reservar con 2-3 meses de antelación para asegurar perfiles bilingües y trilingües, muy solicitados por la clientela internacional.' } },
  { '@type': 'Question', name: '¿Por qué Marbella tiene tarifas más altas que Málaga o Madrid?', acceptedAnswer: { '@type': 'Answer', text: 'La combinación de clientela internacional de alto poder adquisitivo en Puerto Banús, villas de lujo y hoteles 5 estrellas, junto a una temporada muy concentrada en verano, sitúa las tarifas de Marbella entre un 25% y un 40% por encima de Madrid o Málaga, aunque por debajo de plazas como Ibiza.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Marbella', item: 'https://xpeak.es/blog/precio-azafatas-marbella' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '180–240€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '210–320€/día', nota: 'Eventos de marca en Puerto Banús' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '220–290€/día', nota: 'Imprescindible por clientela internacional' },
  { perfil: 'Azafata trilingüe', tarifa: '260–380€/día', nota: 'Bodas y eventos de villas de lujo' },
  { perfil: 'Coordinadora de azafatas', tarifa: '250–360€/día', nota: 'Gestión de equipo en boda o evento grande' },
  { perfil: 'Pack evento en villa/hotel 5* (4h)', tarifa: '120–200€', nota: 'Milla de Oro y alrededores' },
];

export default function BlogPrecioAzafatasMarbella() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Marbella 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para bodas de lujo y eventos en Puerto Banús, Marbella. Tarifas de temporada alta 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-marbella" />
        <meta property="og:title" content="Precio azafatas eventos Marbella 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para Puerto Banús, villas y bodas de lujo en Marbella." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-marbella" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Marbella · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Marbella: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Marbella es una de las plazas más caras de España para contratar azafatas: clientela internacional de alto poder adquisitivo en Puerto Banús, villas de lujo en la Milla de Oro y una temporada de verano muy intensa.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Marbella?"
              answer="Una azafata de eventos en Marbella cobra entre 17€ y 28€/hora bruto, y las agencias facturan entre 180€ y 320€/día por el servicio completo. Es una tarifa muy por encima de la media nacional, impulsada por el turismo de lujo de Puerto Banús, aunque algo por debajo de plazas como Ibiza."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Marbella</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Marbella 2026, temporada alta. Sin IVA. Desplazamiento a villas fuera del núcleo urbano puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Marbella</h2>
              <div className="space-y-2">{['Puerto Banús: eventos de marca y presentaciones de lujo para clientela internacional','Milla de Oro: villas privadas para bodas y celebraciones de alto presupuesto','Hoteles 5 estrellas del entorno: bodas y eventos corporativos de lujo','Temporada alta (junio-septiembre): pico de demanda con la máxima afluencia turística'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-ibiza', cat: 'Turismo de lujo', title: 'Precio azafatas para eventos en Ibiza: guía 2026' },
                  { href: '/blog/precio-azafatas-malaga', cat: 'Costa del Sol', title: 'Precio azafatas para eventos en Málaga: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Marbella?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Marbella. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/marbella" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Marbella →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-marbella" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-marbella' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_marbella" />
      </div>
    </>
  );
}
