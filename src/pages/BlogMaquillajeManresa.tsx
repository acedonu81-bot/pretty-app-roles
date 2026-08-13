import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Manresa: guía 2026', description: 'Cuánto cobra una maquilladora para bodas en fincas del Bages y eventos en Manresa. Tarifas por servicio 2026.', datePublished: '2026-03-09', dateModified: '2026-06-01', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-manresa' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'En Manresa una maquilladora para novia cobra entre 80€ y 200€, por debajo de la media del área metropolitana de Barcelona al ser un mercado interior más pequeño. Para eventos institucionales, el precio por persona ronda 28€-55€.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Las fincas rurales del Bages concentran la mayor parte de las bodas de la comarca en temporada alta, con demanda de maquillaje de novia e invitada. El centro de Manresa también genera demanda puntual para actos institucionales de la Catalunya Central.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Reserva con 2-3 meses de antelación en temporada alta (mayo-septiembre). Al ser un mercado más pequeño, las maquilladoras con buena reputación de la comarca se agotan primero en fines de semana de junio y julio.' } },
  { '@type': 'Question', name: '¿Por qué es más económico el maquillaje de novia en Manresa?', acceptedAnswer: { '@type': 'Answer', text: 'Al tratarse de un mercado interior con menos presión de bodas de alto presupuesto que Barcelona, las tarifas son más ajustadas, manteniendo profesionales con buena formación y experiencia en la comarca del Bages.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Manresa', item: 'https://xpeak.es/blog/maquillaje-eventos-manresa' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '80–200€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '170–360€', nota: 'Servicio integral más demandado' },
  { perfil: 'Madrina / invitada especial', tarifa: '48–95€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Pack boda (novia + 3 personas)', tarifa: '280–560€', nota: 'Desplazamiento a finca del Bages incluido' },
  { perfil: 'Evento institucional / empresa', tarifa: '28–55€/persona', nota: 'Maquillaje fast-track profesional' },
  { perfil: 'Sesión foto / vídeo', tarifa: '65–160€', nota: 'HD, flash-friendly, retoque incluido' },
];

export default function BlogMaquillajeManresa() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Manresa 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas en fincas del Bages en Manresa. Tarifas por servicio 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-manresa" />
        <meta property="og:title" content="Precio maquilladora eventos Manresa 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas y eventos en Manresa." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-manresa" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Maquillaje · Manresa · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Manresa: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Manresa, capital de la Catalunya Central, tiene un mercado de maquillaje de eventos más pequeño e interior donde predominan las bodas en fincas rurales del Bages, con tarifas más ajustadas que en el área metropolitana de Barcelona.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Manresa?"
              answer="Una maquilladora de novia en Manresa cobra entre 80€ y 200€, incluyendo prueba previa. El pack boda completo (novia + 3 personas) ronda los 280€-560€. Para eventos institucionales, el precio por persona está entre 28€ y 55€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Manresa</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Manresa 2026. Desplazamiento a fincas rurales del Bages puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Manresa</h2>
              <div className="space-y-2">{['Fincas rurales del Bages: maquillaje de novia e invitada en temporada alta','Centro de Manresa: actos institucionales de la comarca con maquillaje de protocolo','Salones y espacios de eventos privados: celebraciones familiares','Estudios de foto locales: sesiones profesionales con maquillaje HD'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquillaje-eventos-terrassa', cat: 'Vallès', title: 'Precio maquilladora para eventos en Terrassa: guía 2026' },
                  { href: '/blog/maquilladora-para-eventos-precio', cat: 'Nacional', title: 'Maquilladora para eventos: precios en España 2026' },
                  { href: '/blog/maquillaje-nupcial-precio-guia', cat: 'Bodas', title: 'Maquillaje nupcial: precios y guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Manresa?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Manresa. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/manresa" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver maquilladoras en Manresa →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-manresa" />
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-manresa' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_manresa" />
      </div>
    </>
  );
}
