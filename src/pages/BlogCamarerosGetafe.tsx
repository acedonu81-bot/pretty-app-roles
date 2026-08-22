import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de camareros para eventos en Getafe: guía 2026', description: 'Cuánto cobran los camareros y bartenders para bodas y eventos corporativos en Getafe. Tarifas por perfil 2026.', datePublished: '2026-07-04', dateModified: '2026-07-10', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/camareros-eventos-getafe' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra un camarero de eventos en Getafe?', acceptedAnswer: { '@type': 'Answer', text: 'En Getafe, un camarero de eventos cobra entre 11€ y 17€/hora bruto, algo por debajo de Madrid capital. Los bartenders con experiencia cobran entre 14€ y 20€/hora. Para una boda completa (6-7h) el presupuesto de sala suele rondar los 750€-1.800€.' } },
  { '@type': 'Question', name: '¿Dónde hay más demanda de camareros para eventos en Getafe?', acceptedAnswer: { '@type': 'Answer', text: 'Los actos institucionales y jornadas de la Universidad Carlos III generan demanda puntual de personal de sala con perfil formal. En bodas, muchas parejas de Getafe celebran en fincas del sur de Madrid o en salones de la propia ciudad, con proximidad a Madrid capital como valor añadido.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar camareros para una boda en Getafe?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas en temporada alta (mayo-septiembre), reserva con 6-8 semanas de antelación. Para eventos corporativos puntuales ligados al sector aeroespacial o la universidad, 2 semanas suele ser suficiente.' } },
  { '@type': 'Question', name: '¿Cuántos camareros necesito para una boda en Getafe?', acceptedAnswer: { '@type': 'Answer', text: 'La proporción estándar es 1 camarero por cada 10 invitados en cena sentada y 1 por cada 15-20 en formato cóctel. Para una boda de 100 invitados, lo habitual es contar con 7-9 camareros más 1 bartender.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Camareros Getafe', item: 'https://xpeak.es/blog/camareros-eventos-getafe' }] };

const PRECIOS = [
  { perfil: 'Camarero/a de sala', tarifa: '11–16€/hora', nota: 'Cóctel, cena sentada o buffet' },
  { perfil: 'Bartender / coctelería', tarifa: '14–20€/hora', nota: 'Barra libre en bodas y eventos' },
  { perfil: 'Jefe de sala / coordinador', tarifa: '19–28€/hora', nota: 'Gestión del equipo en boda o evento grande' },
  { perfil: 'Servicio boda completo (6-7h)', tarifa: '110–200€/persona', nota: 'Cóctel + cena + barra' },
  { perfil: 'Barra libre con bartender (4h)', tarifa: '140–300€', nota: 'Incluye montaje y desmontaje' },
  { perfil: 'Personal de apoyo institucional', tarifa: '12–19€/hora', nota: 'Actos y jornadas universitarias' },
];

export default function BlogCamarerosGetafe() {
  return (
    <>
      <Helmet>
        <title>Precio camareros para eventos en Getafe 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran los camareros y bartenders para bodas y eventos corporativos en Getafe. Tarifas por perfil 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/camareros-eventos-getafe" />
        <meta property="og:title" content="Precio camareros eventos Getafe 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de camareros y bartenders para bodas y eventos corporativos en Getafe." />
        <meta property="og:url" content="https://xpeak.es/blog/camareros-eventos-getafe" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>Staff · Getafe · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de camareros para eventos en Getafe: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Getafe combina bodas de proximidad a Madrid con actos institucionales ligados a la Universidad Carlos III y el sector aeroespacial de la zona. El mercado de camareros es más residencial que en Madrid capital, con tarifas ligeramente más bajas.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran los camareros de eventos en Getafe?"
              answer="Un camarero de eventos en Getafe cobra entre 11€ y 17€/hora bruto, y un bartender con experiencia entre 14€ y 20€/hora. Para una boda completa de 6-7 horas, el presupuesto de personal de sala suele estar entre 750€ y 1.800€."
            />
          </div>
          <BlogInlineCTA role="staff" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de camarero en Getafe</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(37,99,235,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#2563EB' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Getafe 2026. Sin IVA. Desplazamiento a fincas fuera del municipio puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Getafe</h2>
              <div className="space-y-2">{['Salones y fincas de bodas de proximidad a Madrid: bodas de la zona sur','Campus de la Universidad Carlos III: actos institucionales y jornadas formales','Sector aeroespacial: cenas de empresa y eventos corporativos','Centro histórico de Getafe: celebraciones privadas y actos de barrio'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#2563EB' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/camareros-eventos-madrid', cat: 'Área metropolitana', title: 'Precio camareros para eventos en Madrid: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', cat: 'Bodas', title: 'Cuántos camareros necesito para mi boda' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas camareros para tu evento en Getafe?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en Getafe. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/getafe" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>Ver camareros en Getafe →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/camareros-eventos-getafe" />
        </main>
        <DJResourcesAffiliate role="camareros" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/camareros-eventos-getafe' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_camareros_getafe" />
      </div>
    </>
  );
}
