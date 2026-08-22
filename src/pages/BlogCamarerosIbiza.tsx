import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de camareros para eventos en Ibiza: guía 2026', description: 'Cuánto cobran los camareros y bartenders para fiestas privadas, villas y superyates en Ibiza. Tarifas de temporada alta 2026.', datePublished: '2026-04-05', dateModified: '2026-06-30', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/camareros-eventos-ibiza' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza, un camarero de eventos cobra entre 18€ y 30€/hora bruto, la tarifa más alta de España junto a Mallorca, por la exigencia de las fiestas privadas de lujo. Los bartenders de coctelería premium cobran entre 24€ y 38€/hora. Un evento privado en villa (6-7h) puede suponer un presupuesto de sala de 2.000€ a 4.000€.' } },
  { '@type': 'Question', name: '¿Dónde hay más demanda de camareros para eventos en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'Las villas privadas del interior y la costa concentran la mayoría de fiestas exclusivas de temporada. Los superyates fondeados en la isla también generan demanda de personal de sala con experiencia en servicio a bordo, y los beach clubs de Playa d\'en Bossa y Talamanca contratan equipos grandes en verano.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar camareros para un evento en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza conviene reservar con 2-3 meses de antelación para temporada alta (mayo-septiembre). Los equipos con experiencia en villas de lujo y eventos náuticos, que son los más solicitados, se agotan primero por la altísima rotación de eventos privados.' } },
  { '@type': 'Question', name: '¿Por qué son tan caros los camareros en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'La clientela internacional de muy alto poder adquisitivo, el nivel de exigencia de servicio en villas y superyates, y una temporada extremadamente concentrada (mayo-septiembre) elevan las tarifas de Ibiza entre un 40% y un 60% por encima de Madrid o Barcelona.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Camareros Ibiza', item: 'https://xpeak.es/blog/camareros-eventos-ibiza' }] };

const PRECIOS = [
  { perfil: 'Camarero/a de sala', tarifa: '18–26€/hora', nota: 'Fiestas privadas en villas y beach clubs' },
  { perfil: 'Bartender / coctelería premium', tarifa: '24–38€/hora', nota: 'Barra libre y coctelería de autor' },
  { perfil: 'Jefe de sala / coordinador', tarifa: '32–50€/hora', nota: 'Gestión del equipo en evento privado grande' },
  { perfil: 'Servicio evento en villa (6-7h)', tarifa: '260–480€/persona', nota: 'Estándar de servicio internacional' },
  { perfil: 'Barra libre con bartender (4h)', tarifa: '300–600€', nota: 'Incluye montaje y desmontaje' },
  { perfil: 'Personal de apoyo en yate/evento náutico', tarifa: '22–34€/hora', nota: 'Servicio a bordo, experiencia imprescindible' },
];

export default function BlogCamarerosIbiza() {
  return (
    <>
      <Helmet>
        <title>Precio camareros para eventos en Ibiza 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran los camareros y bartenders para fiestas privadas, villas y yates en Ibiza. Tarifas de temporada alta 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/camareros-eventos-ibiza" />
        <meta property="og:title" content="Precio camareros eventos Ibiza 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de camareros y bartenders para villas, yates y clubes en Ibiza." />
        <meta property="og:url" content="https://xpeak.es/blog/camareros-eventos-ibiza" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#2563EB' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>Staff · Ibiza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de camareros para eventos en Ibiza: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Ibiza exige el nivel de servicio más alto de España: fiestas privadas en villas de lujo, eventos a bordo de superyates y beach clubs de referencia internacional. Esto sitúa las tarifas de personal de sala entre las más altas del país.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran los camareros de eventos en Ibiza?"
              answer="Un camarero de eventos en Ibiza cobra entre 18€ y 30€/hora bruto, y un bartender de coctelería premium entre 24€ y 38€/hora. Para un evento privado en villa de 6-7 horas, el presupuesto de personal de sala puede superar los 2.000€ por la exigencia de servicio internacional."
            />
          </div>
          <BlogInlineCTA role="staff" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de camarero en Ibiza</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(37,99,235,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#2563EB' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Ibiza 2026, temporada alta. Sin IVA. Desplazamiento a villas o embarcaciones puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Ibiza</h2>
              <div className="space-y-2">{['Villas privadas del interior y la costa: fiestas exclusivas con estándar de servicio internacional','Superyates fondeados en Ibiza y Formentera: personal de sala con experiencia a bordo','Beach clubs de Playa d\'en Bossa y Talamanca: equipos grandes durante toda la temporada','Clubes nocturnos de la isla: bartenders y personal de barra en noches de gran afluencia'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#2563EB' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/camareros-eventos-palma', cat: 'Temporada alta', title: 'Precio camareros para eventos en Palma de Mallorca: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Nacional', title: 'Cuánto cobra un camarero de eventos en España 2026' },
                  { href: '/blog/contratar-barman-evento-privado', cat: 'Staff', title: 'Barman evento privado: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas camareros para tu evento en Ibiza?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Ibiza. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/ibiza" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>Ver camareros en Ibiza →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/camareros-eventos-ibiza" />
        </main>
        <DJResourcesAffiliate role="camareros" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/camareros-eventos-ibiza' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_camareros_ibiza" />
      </div>
    </>
  );
}
