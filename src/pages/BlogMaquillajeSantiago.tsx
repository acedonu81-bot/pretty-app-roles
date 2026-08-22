import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Santiago de Compostela: guía 2026', description: 'Cuánto cobra una maquilladora para bodas en el casco histórico y eventos universitarios en Santiago. Tarifas por servicio 2026.', datePublished: '2026-03-26', dateModified: '2026-04-08', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-santiago' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Santiago de Compostela?', acceptedAnswer: { '@type': 'Answer', text: 'En Santiago de Compostela una maquilladora para novia cobra entre 95€ y 235€, en línea con la media nacional. Para eventos corporativos e institucionales, el precio por persona ronda 30€-65€. El turismo del Camino de Santiago mantiene la demanda estable durante todo el año.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Santiago?', acceptedAnswer: { '@type': 'Answer', text: 'El casco histórico, en torno a la Catedral, concentra bodas y celebraciones ligadas al turismo religioso durante todo el año. Los pazos del entorno rural son el destino preferido para bodas de mayor formato, y la Universidad de Santiago genera demanda de maquillaje para actos institucionales.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Santiago?', acceptedAnswer: { '@type': 'Answer', text: 'En Santiago, temporada alta de bodas (junio-septiembre), reserva con 3 meses de antelación, sobre todo en fechas coincidentes con el Xacobeo o festividades del Apóstol. Las maquilladoras con experiencia en el casco histórico se agotan primero.' } },
  { '@type': 'Question', name: '¿Es más caro el maquillaje de novia que el de invitada en Santiago?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. El maquillaje de novia incluye prueba previa y una sesión más larga (60-90 min), por lo que cuesta entre 95€ y 235€. El de madrina o invitada especial es más rápido (45-60 min) y ronda los 55€-115€ en Santiago.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Santiago', item: 'https://xpeak.es/blog/maquillaje-eventos-santiago' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '95–235€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '190–420€', nota: 'Servicio integral más demandado' },
  { perfil: 'Madrina / invitada especial', tarifa: '55–115€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Pack boda (novia + 3 personas)', tarifa: '330–650€', nota: 'Desplazamiento a pazo incluido' },
  { perfil: 'Evento corporativo / institucional', tarifa: '30–65€/persona', nota: 'Maquillaje fast-track profesional' },
  { perfil: 'Sesión foto / vídeo', tarifa: '80–190€', nota: 'HD, flash-friendly, retoque incluido' },
];

export default function BlogMaquillajeSantiago() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Santiago 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas en el casco histórico y eventos universitarios en Santiago. Tarifas 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-santiago" />
        <meta property="og:title" content="Precio maquilladora eventos Santiago 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas y eventos universitarios en Santiago de Compostela." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-santiago" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DB2777' }}>Maquillaje · Santiago de Compostela · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Santiago de Compostela: guía 2026</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Santiago de Compostela combina bodas en el casco histórico y pazos del entorno con una demanda de maquillaje institucional sostenida por la Universidad y el turismo del Camino de Santiago durante todo el año.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Santiago de Compostela?"
              answer="Una maquilladora de novia en Santiago cobra entre 95€ y 235€, incluyendo prueba previa. El pack boda completo (novia + 3 personas) ronda los 330€-650€. Para eventos corporativos e institucionales, el precio por persona está entre 30€ y 65€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Santiago</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(219,39,119,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#DB2777' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Santiago de Compostela 2026. Desplazamiento a pazos fuera de la ciudad puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Santiago</h2>
              <div className="space-y-2">{['Casco histórico y entorno de la Catedral: bodas ligadas al turismo religioso todo el año','Pazos del entorno rural: bodas de mayor formato en temporada alta','Universidad de Santiago: maquillaje para congresos y actos institucionales','Camino de Santiago: turismo religioso que sostiene la demanda fuera de temporada'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#DB2777' }}>✓</span><p className="text-xs" style={{ color: '#111' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquilladora-para-eventos-precio', cat: 'Nacional', title: 'Maquilladora para eventos: precios en España 2026' },
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Bodas', title: 'Maquillaje nupcial: precios y guía 2026' },
                  { href: '/blog/dj-bodas-santiago', cat: 'Bodas', title: 'DJ para bodas en Santiago: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Santiago?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Santiago de Compostela. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/santiago" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>Ver maquilladoras en Santiago →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-santiago" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-santiago' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_santiago" />
      </div>
    </>
  );
}
