import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';

const ARTICLES = [
  { href: '/blog/cuanto-cuesta-una-comunion-en-espana', tag: 'Presupuesto', title: '¿Cuánto cuesta una comunión en España 2026?', desc: 'Desglose por partidas: catering, DJ, fotógrafo, animación y decoración.' },
  { href: '/blog/dj-para-comunion-precio', tag: 'Música', title: 'DJ para comunión: precio y qué incluye 2026', desc: 'Precios por horas, DJ vs disco móvil y qué música poner.' },
  { href: '/blog/fotografo-para-comunion-precio', tag: 'Fotografía', title: 'Fotógrafo para comunión: precio y guía 2026', desc: 'Paquetes, precios por ciudad y checklist antes de contratar.' },
  { href: '/blog/disco-movil-para-comuniones', tag: 'Música', title: 'Disco móvil comuniones: precio y qué incluye', desc: 'Paquetes, diferencias con DJ y cómo elegir para tu comunión.' },
  { href: '/blog/catering-comuniones-precio-persona', tag: 'Catering', title: 'Catering comuniones: precio por persona 2026', desc: 'Precios por formato (aperitivo, banquete, todo incluido) y consejos para ahorrar.' },
  { href: '/blog/animadores-infantiles-comuniones-cumpleanos', tag: 'Animación', title: 'Animadores infantiles: precios 2026 España', desc: 'Tipos de animación, ratios por edad y qué preguntar antes de contratar.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una comunión en España en 2026?', a: 'El presupuesto medio de una comunión en España ronda los 6.000-15.000€ para 80-100 invitados. Las partidas principales son: catering (50-60%), fotografía (8-12%), música/DJ (5-10%), animación infantil (4-8%) y decoración (5-10%). En Madrid y Barcelona los precios son un 20-30% más altos.' },
  { q: '¿DJ o disco móvil para una comunión?', a: 'La disco móvil (250-500€) incluye pantalla, karaoke y máquina de espuma — perfecta para niños de 8-12 años. El DJ profesional (350-700€) tiene mejor sonido y más personalización. Para más de 60 invitados o si quieres que los adultos también disfruten, el DJ marca la diferencia.' },
  { q: '¿Qué animación se contrata para una comunión?', a: 'Lo más habitual: animadores con talleres de magia, gymkanas, hinchables y bailes. Para menos de 20 niños, un animador es suficiente. Para más, lo ideal es 1 animador por cada 10-15 niños. El coste varía entre 150-400€ para una sesión de 2-3 horas.' },
  { q: '¿Con cuánta antelación organizar una comunión?', a: 'Las comuniones se celebran mayoritariamente en mayo y junio. Empieza a reservar los proveedores principales (finca o restaurante, fotógrafo, catering) con 8-12 meses de antelación. DJ, animadores y decoración pueden reservarse con 3-4 meses.' },
];

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Comuniones en España: guía completa de presupuesto y profesionales (2026)', description: 'Todo lo que necesitas para organizar una comunión en España. Presupuesto real por partidas, DJ, fotógrafo, catering y animación. Guía completa 2026.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/comuniones-guia-completa' };
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Comuniones guía completa', item: 'https://xpeak.es/blog/comuniones-guia-completa' }] };

const TAG_COLOR: Record<string, string> = { Presupuesto: '#D4AF37', Música: '#a78bfa', Fotografía: '#818cf8', Catering: '#fbbf24', Animación: '#34d399' };

export default function HubComuniones() {
  return (
    <>
      <Helmet>
        <title>Comuniones España: guía completa presupuesto 2026 | XPEAK</title>
        <meta name="description" content="Todo para organizar una comunión en España. Presupuesto real por partidas, DJ, fotógrafo, catering y animación infantil. Guía completa 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/comuniones-guia-completa" />
        <meta property="og:title" content="Comuniones España: guía completa presupuesto 2026 — XPEAK" />
        <meta property="og:description" content="DJ, fotógrafo, catering y animación para tu comunión. Presupuesto real y guías por partida." />
        <meta property="og:url" content="https://xpeak.es/blog/comuniones-guia-completa" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Comuniones · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Comuniones en España: guía completa de presupuesto y profesionales (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Todo lo que necesitas para organizar una comunión memorable: presupuesto real por partidas, qué profesionales contratar y cómo no llevarte sorpresas el día del evento.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>Una comunión tiene dos audiencias completamente distintas: los niños que quieren bailar reggaeton y las tías que quieren hablar tranquilas. Coordinar bien los proveedores para que ambos lo pasen bien es la clave de una buena organización. Esta guía reúne todas las guías de XPEAK sobre comuniones en un solo lugar.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Guías por profesional y partida</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARTICLES.map(a => (
                  <a key={a.href} href={a.href} className="block p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2" style={{ background: 'rgba(212,175,55,0.1)', color: TAG_COLOR[a.tag] || '#D4AF37', border: `1px solid ${TAG_COLOR[a.tag] || '#D4AF37'}22` }}>{a.tag}</span>
                    <p className="text-sm font-black leading-snug mb-1">{a.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{a.desc}</p>
                  </a>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Presupuesto orientativo comunión 80-100 invitados</h2>
              <div className="space-y-2">
                {[
                  { partida: 'Catering (menú + servicio)', precio: '4.000–10.000€', pct: '55%' },
                  { partida: 'Fotografía (reportaje completo)', precio: '500–1.200€', pct: '10%' },
                  { partida: 'DJ o disco móvil', precio: '300–700€', pct: '6%' },
                  { partida: 'Animación infantil', precio: '200–500€', pct: '5%' },
                  { partida: 'Decoración y detalles', precio: '300–800€', pct: '7%' },
                  { partida: 'Invitaciones y recordatorios', precio: '150–400€', pct: '3%' },
                ].map((row, i) => (
                  <div key={row.partida} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-xs font-medium">{row.partida}</p>
                      <p className="text-[0.6rem] mt-0.5" style={{ color: '#3d3d4e' }}>~{row.pct} del total</p>
                    </div>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Rangos orientativos para una comunión de 80-100 invitados en España 2026. Sin IVA.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {FAQ.map(f => (
                  <div key={f.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.q}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Organizas una comunión?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs, fotógrafos, animadores y camareros verificados para comuniones en toda España. Flash Booking en menos de 1h. Gratis para organizadores.</p>
              <a href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Buscar profesionales para mi comunión →</a>
            </div>
          </div>
        </main>
        <BlogRelatedPosts currentSlug='/blog/comuniones-guia-completa' tag='Eventos' />
        <FooterPublic />
      </div>
    </>
  );
}
