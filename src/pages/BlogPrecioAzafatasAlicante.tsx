import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de azafatas para eventos en Alicante: guía 2026', description: 'Cuánto cobran las azafatas para eventos, bodas en la Costa Blanca y ferias en Alicante. Tarifas por perfil 2026.', datePublished: '2026-06-14', dateModified: '2026-07-02', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-alicante' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobran las azafatas de eventos en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'En Alicante, una azafata de eventos cobra entre 11€ y 17€/hora bruto, en línea con la media nacional. Las agencias facturan al cliente entre 115€ y 175€/día por perfil. La temporada alta de la Costa Blanca (abril-octubre) sube la demanda de personal para bodas y eventos de playa.' } },
  { '@type': 'Question', name: '¿Dónde se concentran los eventos en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'La Costa Blanca concentra gran parte de la demanda: fincas y villas para bodas en el interior, clubes de playa y beach clubs en la costa para eventos de temporada, y el centro de Alicante capital para congresos y eventos corporativos durante todo el año.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar azafatas para una boda en la Costa Blanca?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en fincas de la Costa Blanca en temporada alta (abril-octubre) reserva con 2-3 meses de antelación. Fuera de temporada, con 2-3 semanas suele ser suficiente para eventos corporativos puntuales en Alicante capital.' } },
  { '@type': 'Question', name: '¿Qué perfil de azafata se pide más en Alicante?', acceptedAnswer: { '@type': 'Answer', text: 'El perfil bilingüe (inglés) tiene mucha demanda por el turismo europeo de la Costa Blanca, especialmente en bodas y eventos de playa. También hay demanda estable de azafatas de protocolo para eventos corporativos en el centro de Alicante.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Azafatas Alicante', item: 'https://xpeak.es/blog/precio-azafatas-alicante' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria', tarifa: '115–165€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '140–210€/día', nota: 'Eventos de marca y presentaciones' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '150–215€/día', nota: 'Muy demandada por turismo europeo' },
  { perfil: 'Azafata de protocolo', tarifa: '155–225€/día', nota: 'Bodas y eventos institucionales' },
  { perfil: 'Coordinadora de azafatas', tarifa: '165–240€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento de playa (4h)', tarifa: '75–120€', nota: 'Beach club o finca costera' },
];

export default function BlogPrecioAzafatasAlicante() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en Alicante 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para eventos, bodas y ferias en Alicante y la Costa Blanca. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-alicante" />
        <meta property="og:title" content="Precio azafatas eventos Alicante 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para bodas en la Costa Blanca y eventos corporativos en Alicante." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-alicante" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · Alicante · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en Alicante: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Alicante combina un centro de negocios activo con la fuerte temporada de bodas y eventos de playa de la Costa Blanca, entre abril y octubre. Las tarifas se mantienen en línea con la media nacional, con picos en temporada alta.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en Alicante?"
              answer="Una azafata de eventos en Alicante cobra entre 11€ y 17€/hora bruto, y las agencias facturan entre 115€ y 175€/día por el servicio completo. En temporada alta de la Costa Blanca (abril-octubre), con más bodas y eventos de playa, la demanda de perfiles bilingües sube."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en Alicante</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Alicante 2026. Sin IVA. Desplazamiento fuera del área metropolitana puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Alicante</h2>
              <div className="space-y-2">{['Fincas y villas del interior de la Costa Blanca: bodas en temporada abril-octubre','Beach clubs y clubes de playa de la costa: eventos de marca y fiestas de temporada','Centro de Alicante capital: congresos y eventos corporativos durante todo el año','Zonas turísticas de Benidorm y alrededores: eventos de empresa y presentaciones'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en Alicante?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Alicante. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/alicante" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en Alicante →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-alicante" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-alicante' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_alicante" />
      </div>
    </>
  );
}
