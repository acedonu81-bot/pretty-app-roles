import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Precio de maquilladora para eventos en Ibiza: guía 2026', description: 'Cuánto cobra una maquilladora para bodas y fiestas privadas en villas de Ibiza. Tarifas de temporada alta 2026.', datePublished: '2026-06-29', dateModified: '2026-07-07', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/maquillaje-eventos-ibiza' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cobra una maquilladora para eventos en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza una maquilladora para novia cobra entre 190€ y 450€, la tarifa más alta de España, por el peso de las bodas y fiestas privadas de lujo internacional. Para eventos corporativos, el precio por persona ronda 50€-110€. La reserva con antelación es clave por la corta temporada.' } },
  { '@type': 'Question', name: '¿Dónde se concentra la demanda de maquilladoras en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'Las villas privadas del interior y la costa concentran la mayoría de bodas y fiestas exclusivas de temporada. También hay demanda de maquillaje para eventos a bordo de superyates y para beach clubs de Playa d\'en Bossa y Talamanca en verano.' } },
  { '@type': 'Question', name: '¿Con cuánta antelación reservar maquilladora para una boda en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'En Ibiza, temporada alta (mayo-septiembre), reserva con 3-4 meses de antelación como mínimo. Las maquilladoras con experiencia en bodas internacionales y clima mediterráneo se agotan primero por la alta rotación de eventos privados.' } },
  { '@type': 'Question', name: '¿Por qué es tan caro el maquillaje de novia en Ibiza?', acceptedAnswer: { '@type': 'Answer', text: 'La clientela internacional de muy alto poder adquisitivo, la exigencia de maquillaje resistente a calor y agua para bodas junto al mar, y una temporada extremadamente concentrada (mayo-septiembre) sitúan las tarifas de Ibiza entre un 40% y un 60% por encima de Madrid o Barcelona.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Maquillaje Ibiza', item: 'https://xpeak.es/blog/maquillaje-eventos-ibiza' }] };

const PRECIOS = [
  { perfil: 'Maquillaje novia (solo)', tarifa: '190–450€', nota: 'Incluye prueba previa' },
  { perfil: 'Maquillaje novia + peinado', tarifa: '350–720€', nota: 'Servicio integral más demandado' },
  { perfil: 'Madrina / invitada especial', tarifa: '100–190€', nota: 'Sin prueba previa habitualmente' },
  { perfil: 'Pack boda (novia + 3 personas)', tarifa: '600–1.150€', nota: 'Desplazamiento a villa incluido' },
  { perfil: 'Evento corporativo / azafata', tarifa: '50–110€/persona', nota: 'Maquillaje fast-track profesional' },
  { perfil: 'Sesión foto / vídeo', tarifa: '150–320€', nota: 'HD, flash-friendly, retoque incluido' },
];

export default function BlogMaquillajeIbiza() {
  return (
    <>
      <Helmet>
        <title>Precio maquilladora para eventos en Ibiza 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas y fiestas privadas en villas de Ibiza. Tarifas de temporada alta 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/maquillaje-eventos-ibiza" />
        <meta property="og:title" content="Precio maquilladora eventos Ibiza 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas de maquilladoras para bodas de lujo y fiestas privadas en Ibiza." />
        <meta property="og:url" content="https://xpeak.es/blog/maquillaje-eventos-ibiza" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Maquillaje · Ibiza · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Precio de maquilladora para eventos en Ibiza: guía 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Ibiza tiene el mercado de maquillaje de novia más caro de España: bodas en villas privadas con clientela internacional, técnicas resistentes a calor y agua, y una temporada muy concentrada entre mayo y septiembre.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>8 julio 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cobra una maquilladora en Ibiza?"
              answer="Una maquilladora de novia en Ibiza cobra entre 190€ y 450€, incluyendo prueba previa. El pack boda completo (novia + 3 personas) ronda los 600€-1.150€. Para eventos corporativos, el precio por persona está entre 50€ y 110€."
            />
          </div>
          <BlogInlineCTA role="makeup" variant="upgrade" />
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Tarifas de maquillaje para eventos en Ibiza</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><th className="text-left px-4 py-3 font-bold">Servicio</th><th className="px-4 py-3 font-bold text-right">Precio</th><th className="px-4 py-3 font-bold text-left hidden sm:table-cell">Nota</th></tr></thead>
                  <tbody>{PRECIOS.map((row, i) => (<tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="px-4 py-3 font-medium">{row.perfil}</td><td className="px-4 py-3 text-right font-bold" style={{ color: '#D4AF37' }}>{row.tarifa}</td><td className="px-4 py-3 hidden sm:table-cell" style={{ color: '#3d3d4e' }}>{row.nota}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios Ibiza 2026, temporada alta. Desplazamiento a villas puede facturarse aparte.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-3">Dónde se concentra la demanda en Ibiza</h2>
              <div className="space-y-2">{['Villas privadas del interior y la costa: bodas y fiestas exclusivas de temporada','Superyates fondeados en la isla: maquillaje para eventos náuticos a bordo','Beach clubs de Playa d\'en Bossa y Talamanca: eventos de marca durante el verano','Clubes nocturnos de la isla: maquillaje de imagen para noches de gran afluencia'].map((item,i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-xs font-black shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>✓</span><p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/maquillaje-eventos-palma', cat: 'Temporada alta', title: 'Precio maquilladora para eventos en Palma de Mallorca: guía 2026' },
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
              <p className="text-sm font-black mb-2">¿Necesitas maquilladora para tu evento en Ibiza?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK conecta organizadores con maquilladoras profesionales verificadas en Ibiza. Contrato digital automático incluido.</p>
              <a href="/contratar-maquillaje/ibiza" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver maquilladoras en Ibiza →</a>
            </div>
          </div>
          <BlogEmailCapture variant="presupuestos" intent="contratar-makeup" articlePath="/blog/maquillaje-eventos-ibiza" />
        </main>
        <DJResourcesAffiliate role="maquillaje" />
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/maquillaje-eventos-ibiza' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_maquillaje_ibiza" />
      </div>
    </>
  );
}
