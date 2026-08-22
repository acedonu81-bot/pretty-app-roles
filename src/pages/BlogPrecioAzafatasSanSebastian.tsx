import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en San Sebastián: guía 2026', description: 'Cuánto cobran las azafatas para eventos, el Zinemaldia y bodas en San Sebastián. Tarifas por perfil 2026.', datePublished: '2026-04-13', dateModified: '2026-07-13', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-sansebastian' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en San Sebastián?', acceptedAnswer: { '@type': 'Answer', text: 'En San Sebastián, una azafata de eventos cobra entre 14€ y 21€/hora bruto, por encima de la media nacional gracias al perfil de alta gama del sector eventos y gastronomía. Las agencias facturan al cliente entre 140€ y 210€/día por perfil. Durante el Zinemaldia (Festival de Cine) en septiembre la demanda y las tarifas suben de forma notable.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en San Sebastián?', acceptedAnswer: { '@type': 'Answer', text: 'El Zinemaldia (Festival de Cine de San Sebastián) en septiembre concentra el mayor pico de demanda de personal de eventos y azafatas de toda la temporada. El entorno de la Playa de la Concha y sus villas es muy solicitado para bodas y eventos privados de alto nivel, y el sector gastronómico de prestigio de la ciudad genera demanda constante de personal para catering y presentaciones.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para el Zinemaldia en San Sebastián?', acceptedAnswer: { '@type': 'Answer', text: 'Para el Zinemaldia en septiembre, reserva con 2-3 meses de antelación — es el pico de demanda más fuerte del año y los perfiles bilingües y con experiencia en eventos de alto nivel se agotan primero. Para bodas en villas de la Concha en temporada alta, 3-4 meses.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en San Sebastián?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil bilingüe o trilingüe de alta gama es el más demandado, especialmente durante el Zinemaldia por la presencia de prensa y personalidades internacionales. También hay fuerte demanda de azafatas de protocolo para bodas y eventos privados en villas junto a la Concha.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas San Sebastián', item: 'https://xpeak.es/blog/precio-azafatas-sansebastian' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '140–200€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '170–270€/día', nota: 'Eventos de marca de alta gama' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '180–240€/día', nota: 'Muy demandada en el Zinemaldia' },
  { perfil: 'Azafata trilingüe', tarifa: '220–320€/día', nota: 'Festival de Cine, prensa internacional' },
  { perfil: 'Coordinadora de azafatas', tarifa: '200–300€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento Zinemaldia (jornada)', tarifa: '190–280€', nota: 'Tarifa de temporada alta, septiembre' },
];

export default function BlogPrecioAzafatasSanSebastian() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en San Sebastián 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, el Zinemaldia y bodas en San Sebastián. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-sansebastian" />
        <meta property="og:title" content="Precio azafatas eventos San Sebastián 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para el Zinemaldia y eventos de alta gama en San Sebastián." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-sansebastian" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Staff · San Sebastián · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en San Sebastián: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>San Sebastián combina un mercado de eventos de alta gama, ligado a su prestigio gastronómico, con el gran pico anual del Zinemaldia en septiembre. Las tarifas están por encima de la media nacional durante todo el año.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en San Sebastián?"
              answer="Una azafata de eventos en San Sebastián cobra entre 14€ y 21€/hora bruto, y las agencias facturan entre 140€ y 210€/día por el servicio completo. Durante el Zinemaldia en septiembre, la tarifa sube un 20-30% por la alta demanda de perfiles bilingües y trilingües para prensa internacional."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en San Sebastián</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#059669' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios San Sebastián 2026. Sin IVA. Tarifas de septiembre (Zinemaldia) hasta un 20-30% superiores.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en San Sebastián</h2>
              <div className="space-y-2">{['Zinemaldia (Festival de Cine, septiembre): el mayor pico de demanda del año','Entorno de la Playa de la Concha: bodas y eventos privados en villas de alto nivel','Sector gastronómico de prestigio: catering y presentaciones de alta gama todo el año','Palacio Kursaal y centro de congresos: eventos corporativos y profesionales'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#059669' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en San Sebastián?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en San Sebastián. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/sansebastian" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>Ver staff en San Sebastián →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-sansebastian" />
        </main>
        <DJResourcesAffiliate role="azafata" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-sansebastian' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_san_sebastian" />
      </div>
    </>
  );
}
