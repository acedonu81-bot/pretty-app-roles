import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: "Precio de azafatas para eventos en L'Hospitalet: guía 2026", description: "Cuánto cobran las azafatas para ferias y eventos corporativos en L'Hospitalet de Llobregat. Tarifas por perfil 2026.", datePublished: '2026-03-13', dateModified: '2026-06-21', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/precio-azafatas-hospitalet' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: "¿Cuánto cobran las azafatas de eventos en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: "En L'Hospitalet de Llobregat, una azafata de eventos cobra entre 14€ y 20€/hora bruto, prácticamente en línea con Barcelona capital por la cercanía directa. Las agencias facturan al cliente entre 140€ y 200€/día por perfil. La presencia de Fira de Barcelona Gran Via en su término municipal empuja la demanda al alza en fechas de feria." } },
  { '@type': 'Question', name: "¿Dónde se concentran los eventos y ferias en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: "Fira de Barcelona Gran Via, uno de los recintos feriales más grandes de España, está ubicado en el término municipal de L'Hospitalet y concentra buena parte de la demanda de azafatas de la ciudad. También hay eventos corporativos vinculados a las torres de oficinas de la zona de la Ciutat de la Justícia y el eje del Llobregat." } },
  { '@type': 'Question', name: "¿Con cuánta antelación reservar azafatas para una feria en Gran Via?", acceptedAnswer: { '@type': 'Answer', text: 'Para ferias grandes en Fira Gran Via reserva con 4-6 semanas de antelación, ya que muchas agencias comparten los mismos perfiles bilingües que trabajan también en el recinto de Montjuïc. Para eventos corporativos puntuales en la ciudad, 2 semanas suele bastar.' } },
  { '@type': 'Question', name: "¿Es lo mismo contratar azafatas en L'Hospitalet que en Barcelona?", acceptedAnswer: { '@type': 'Answer', text: "Prácticamente sí. Al compartir el mismo recinto ferial (Gran Via) y estar a minutos del centro de Barcelona, el mercado de azafatas de L'Hospitalet usa las mismas agencias y perfiles que la capital catalana, con tarifas muy similares." } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: "Azafatas L'Hospitalet", item: 'https://xpeak.es/blog/precio-azafatas-hospitalet' }] };

const PRECIOS = [
  { perfil: 'Azafata de stand / feria Gran Via', tarifa: '145–195€/día', nota: 'Jornada completa 8h' },
  { perfil: 'Azafata de imagen', tarifa: '165–250€/día', nota: 'Eventos de marca y presentaciones' },
  { perfil: 'Azafata bilingüe (inglés)', tarifa: '175–225€/día', nota: 'Muy demandada en ferias de Gran Via' },
  { perfil: 'Azafata trilingüe', tarifa: '210–295€/día', nota: 'Ferias internacionales del recinto' },
  { perfil: 'Coordinadora de azafatas', tarifa: '185–275€/día', nota: 'Gestión del equipo completo' },
  { perfil: 'Pack evento corporativo (4h)', tarifa: '85–130€', nota: 'Acto único, media jornada' },
];

export default function BlogPrecioAzafatasHospitalet() {
  return (
    <>
      <Helmet>
        <title>Precio azafatas para eventos en L'Hospitalet 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran las azafatas para ferias en Fira Gran Via y eventos corporativos en L'Hospitalet. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/precio-azafatas-hospitalet" />
        <meta property="og:title" content="Precio azafatas eventos L'Hospitalet 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de azafatas para ferias en Gran Via y eventos corporativos en L'Hospitalet." />
        <meta property="og:url" content="https://xpeak.es/blog/precio-azafatas-hospitalet" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Staff · L'Hospitalet · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de azafatas para eventos en L'Hospitalet: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>L'Hospitalet de Llobregat, segunda ciudad más poblada de Cataluña, alberga en su término municipal el recinto de Fira de Barcelona Gran Via. Esto la convierte en un polo ferial propio que comparte mercado de azafatas prácticamente al completo con Barcelona capital.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran las azafatas en L'Hospitalet?"
              answer="Una azafata de eventos en L'Hospitalet cobra entre 14€ y 20€/hora bruto, y las agencias facturan entre 140€ y 200€/día por el servicio completo. Al compartir el recinto de Fira Gran Via con Barcelona, las tarifas están prácticamente igualadas a las de la capital."
            />
          </div>
          <BlogInlineCTA role="azafata" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de azafata en L'Hospitalet</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios L'Hospitalet 2026. Sin IVA. Servicio en Fira Gran Via suele incluir acreditación de recinto.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en L'Hospitalet</h2>
              <div className="space-y-2">{['Fira de Barcelona Gran Via: ferias internacionales y grandes congresos','Zona Ciutat de la Justícia y torres de oficinas: eventos corporativos e institucionales','Eje del Llobregat: presentaciones de empresa y actos de marca','Conexión directa con Barcelona: agencias y perfiles compartidos con la capital'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/precio-azafatas-barcelona', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Barcelona: guía 2026' },
                  { href: '/blog/precio-azafatas-badalona', cat: 'Área metropolitana', title: 'Precio azafatas para eventos en Badalona: guía 2026' },
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
              <p className="text-sm font-black mb-2">¿Necesitas azafatas para tu evento en L'Hospitalet?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en L'Hospitalet. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/hospitalet" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver staff en L'Hospitalet →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/precio-azafatas-hospitalet" />
        </main>
        <DJResourcesAffiliate role="staff" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/precio-azafatas-hospitalet' tag='Staff' />
        <FooterPublic />
        <BlogScrollCTA role="azafata" storageKey="xpeak_scrollcta_precio_azafatas_hospitalet" />
      </div>
    </>
  );
}
