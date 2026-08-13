import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: "Precio de camareros para eventos en L'Hospitalet: guía 2026", description: "Cuánto cobran los camareros y bartenders para eventos corporativos y bodas en L'Hospitalet de Llobregat. Tarifas 2026.", datePublished: '2026-04-28', dateModified: '2026-08-10', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/camareros-eventos-hospitalet' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: "¿Cuánto cobra un camarero de eventos en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: "En L'Hospitalet de Llobregat, un camarero de eventos cobra entre 13€ y 19€/hora bruto, prácticamente igualado a Barcelona capital por la cercanía y el recinto de Fira Gran Via. Los bartenders con experiencia en coctelería cobran entre 17€ y 23€/hora." } },
  { '@type': 'Question', name: "¿Dónde hay más demanda de camareros en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: "Los eventos corporativos ligados a Fira de Barcelona Gran Via generan buena parte de la demanda de personal de sala y catering. También hay actividad constante en las torres de oficinas y espacios de eventos de la Ciutat de la Justícia." } },
  { '@type': 'Question', name: "¿Con cuánta antelación reservar camareros para un evento en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: 'Para eventos vinculados a ferias grandes de Gran Via, reserva con 4-5 semanas de antelación porque los equipos de catering se comparten con el resto de eventos del recinto. Para actos corporativos puntuales, 2 semanas suele bastar.' } },
  { '@type': 'Question', name: "¿Cuántos camareros necesito para un evento en L'Hospitalet?", acceptedAnswer: { '@type': 'Answer', text: 'La proporción estándar es 1 camarero por cada 10 invitados en cena sentada y 1 por cada 15-20 en formato cóctel, igual que en Barcelona capital al compartir el mismo mercado de catering.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: "Camareros L'Hospitalet", item: 'https://xpeak.es/blog/camareros-eventos-hospitalet' }] };

const PRECIOS = [
  { perfil: 'Camarero/a de sala', tarifa: '13–18€/hora', nota: 'Cóctel, cena sentada o buffet' },
  { perfil: 'Bartender / coctelería', tarifa: '17–23€/hora', nota: 'Barra libre y coctelería de autor' },
  { perfil: 'Jefe de sala / coordinador', tarifa: '21–30€/hora', nota: 'Gestión del equipo en evento grande' },
  { perfil: 'Servicio evento completo (6-7h)', tarifa: '135–245€/persona', nota: 'Cóctel + cena + barra' },
  { perfil: 'Barra libre con bartender (4h)', tarifa: '165–360€', nota: 'Incluye montaje y desmontaje' },
  { perfil: 'Personal de apoyo cocina', tarifa: '13–20€/hora', nota: 'Emplatado y logística en directo' },
];

export default function BlogCamarerosHospitalet() {
  return (
    <>
      <Helmet>
        <title>Precio camareros para eventos en L'Hospitalet 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobran los camareros y bartenders para eventos corporativos en L'Hospitalet de Llobregat. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/camareros-eventos-hospitalet" />
        <meta property="og:title" content="Precio camareros eventos L'Hospitalet 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de camareros y bartenders para eventos corporativos en L'Hospitalet." />
        <meta property="og:url" content="https://xpeak.es/blog/camareros-eventos-hospitalet" />
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
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de camareros para eventos en L'Hospitalet: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>L'Hospitalet, sede del recinto ferial de Fira Gran Via, genera un volumen alto de eventos corporativos con servicio de catering. El mercado de camareros y bartenders comparte prácticamente las mismas agencias que Barcelona capital.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobran los camareros de eventos en L'Hospitalet?"
              answer="Un camarero de eventos en L'Hospitalet cobra entre 13€ y 19€/hora bruto, y un bartender con experiencia en coctelería entre 17€ y 23€/hora. Los precios están prácticamente igualados a Barcelona capital por la cercanía y el recinto ferial de Gran Via."
            />
          </div>
          <BlogInlineCTA role="staff" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas por perfil de camarero en L'Hospitalet</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Perfil</th><th className="px-4 py-3 font-bold text-right">Tarifa</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios L'Hospitalet 2026. Sin IVA.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en L'Hospitalet</h2>
              <div className="space-y-2">{['Fira de Barcelona Gran Via: catering de eventos corporativos y ferias internacionales','Torres de oficinas y Ciutat de la Justícia: cenas de empresa y eventos institucionales','Espacios de eventos del centro: celebraciones privadas y actos de entidades locales','Conexión con Barcelona: proveedores y personal de catering compartidos con la capital'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/camareros-eventos-badalona', cat: 'Área metropolitana', title: 'Precio camareros para eventos en Badalona: guía 2026' },
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Nacional', title: 'Cuánto cobra un camarero de eventos en España 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas camareros para tu evento en L'Hospitalet?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con staff profesional verificado en L'Hospitalet. Contrato digital automático incluido.</p>
              <a href="/contratar-staff/hospitalet" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver camareros en L'Hospitalet →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/camareros-eventos-hospitalet" />
        </main>
        <DJResourcesAffiliate role="camareros" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/camareros-eventos-hospitalet' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_camareros_hospitalet" />
      </div>
    </>
  );
}
