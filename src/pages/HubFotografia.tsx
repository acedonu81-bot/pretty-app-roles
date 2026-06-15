import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const ARTICLES = [
  { href: '/blog/contratar-fotografo-de-bodas', tag: 'Bodas', title: 'Contratar fotógrafo de bodas: guía y precios', desc: 'Precios reales por ciudad. Qué incluye y cómo elegir el fotógrafo perfecto.' },
  { href: '/blog/fotografo-para-comunion-precio', tag: 'Comuniones', title: 'Fotógrafo para comunión: precio y guía 2026', desc: 'Precios por paquetes, qué incluye el reportaje y cuándo reservar.' },
  { href: '/blog/videografo-bodas-precio', tag: 'Vídeo', title: 'Videógrafo bodas: precio y qué incluye 2026', desc: 'Cuánto cuesta un videógrafo. Paquetes, diferencias con el fotógrafo y qué pedir.' },
  { href: '/blog/fotografia-eventos-nocturnos', tag: 'Noche', title: 'Fotografía eventos nocturnos: precios 2026', desc: 'Cuánto cobra un fotógrafo de discoteca o eventos nocturnos. Equipo y cómo elegirlo.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta un fotógrafo para un evento en España?', a: 'El precio varía según el tipo de evento: boda completa 1.500-3.500€, comunión 400-1.200€, evento corporativo 400-1.000€, sesión de producto o moda 300-800€. El factor más determinante es la duración del evento y si incluye álbum impreso.' },
  { q: '¿Qué diferencia hay entre fotógrafo de bodas y fotógrafo de eventos?', a: 'El fotógrafo de bodas está especializado en capturar momentos emocionales durante 8-12 horas seguidas, con gran manejo de luz natural e interior. El fotógrafo de eventos cubre celebraciones más cortas o corporativas y suele tener un estilo más dinámico y documental.' },
  { q: '¿Fotógrafo o videógrafo: qué priorizar?', a: 'Si tienes presupuesto para uno solo, prioriza el fotógrafo. Las fotos tienen más uso a largo plazo (álbum, redes, impresiones). El vídeo es muy emotivo pero se ve una o dos veces. Si el presupuesto lo permite, muchos profesionales ofrecen packs fotógrafo + videógrafo con descuento.' },
  { q: '¿Con cuánta antelación reservar un fotógrafo para una boda?', a: 'Para bodas en sábados de primavera o verano (mayo-septiembre), reserva con 12 meses de antelación. Los mejores fotógrafos se agotan en temporada alta. Para bodas entre semana o en otoño-invierno, 6 meses suelen ser suficientes.' },
];

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Fotógrafos para eventos en España: guía completa de precios y tipos (2026)', description: 'Todo sobre contratar fotógrafo para bodas, comuniones y eventos en España. Precios reales, diferencias por tipo de evento y qué incluye el servicio.', datePublished: '2026-05-28', dateModified: '2026-05-28', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/fotografos-eventos' };
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Fotógrafos para eventos', item: 'https://xpeak.es/blog/fotografos-eventos' }] };

const TAG_COLOR: Record<string, string> = { Bodas: '#f472b6', Comuniones: '#fbbf24', Vídeo: '#a78bfa', Noche: '#60a5fa' };

export default function HubFotografia() {
  return (
    <>
      <Helmet>
        <title>Fotógrafos para eventos España: guía completa 2026 | XPEAK</title>
        <meta name="description" content="Todo sobre contratar fotógrafo para bodas, comuniones y eventos en España. Precios reales, diferencias por tipo de evento y qué incluye el servicio." />
        <link rel="canonical" href="https://xpeak.es/blog/fotografos-eventos" />
        <meta property="og:title" content="Fotógrafos para eventos España: guía completa 2026 — XPEAK" />
        <meta property="og:description" content="Precios de fotógrafos para bodas, comuniones y eventos en España. Guías por tipo de evento." />
        <meta property="og:url" content="https://xpeak.es/blog/fotografos-eventos" />
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
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Fotografía · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Fotógrafos para eventos en España: guía completa de precios y tipos (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Precios reales, qué incluye cada servicio y cómo elegir el fotógrafo correcto para cada tipo de evento. Todo en un solo lugar.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>28 mayo 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>El fotógrafo de tu evento es el único proveedor cuyo trabajo te acompañará el resto de tu vida. Elegir bien o mal marca la diferencia entre un álbum que abres con emoción y uno que guardas en un cajón. Esta guía cubre todos los tipos de fotografía de eventos con precios reales y consejos prácticos.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Guías por tipo de evento</h2>
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
              <h2 className="text-lg font-black mb-4">Precios por tipo de evento fotográfico</h2>
              <div className="space-y-2">
                {[
                  { tipo: 'Boda completa (8-12h + álbum)', precio: '1.500–3.500€' },
                  { tipo: 'Comunión (4-6h)', precio: '400–1.200€' },
                  { tipo: 'Evento corporativo / afterwork', precio: '350–1.000€' },
                  { tipo: 'Evento nocturno / discoteca', precio: '250–600€/noche' },
                  { tipo: 'Pack fotógrafo + videógrafo boda', precio: '2.500–5.500€' },
                ].map((row, i) => (
                  <div key={row.tipo} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.tipo}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos España 2026. Sin IVA. Madrid y Barcelona suelen estar un 20-30% por encima de la media nacional.</p>
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
              <p className="text-sm font-black mb-2">¿Buscas fotógrafo para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>XPEAK tiene fotógrafos y videógrafos verificados para bodas, comuniones y eventos en toda España. Portfolios reales, reseñas verificadas y contrato digital automático.</p>
              <a href="/contratar-fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver fotógrafos en XPEAK →</a>
            </div>
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
