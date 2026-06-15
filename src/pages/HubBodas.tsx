import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

const ARTICLES = [
  { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Presupuesto', title: 'Cuánto cuesta una boda en España 2026', desc: 'Desglose por partidas: catering, DJ, fotógrafo, camareros, flores y más.' },
  { href: '/blog/musica-para-bodas-guia', tag: 'Música', title: 'Música para bodas: DJ, banda o playlist 2026', desc: 'Comparativa DJ vs banda en directo vs lista propia. Precios y cuándo elegir cada opción.' },
  { href: '/blog/dj-boda-civil-precio-canciones', tag: 'Música', title: 'DJ boda civil: precio y canciones 2026', desc: 'Cuánto cuesta el DJ y qué música poner en la entrada, firma, cóctel y pista.' },
  { href: '/blog/contratar-fotografo-de-bodas', tag: 'Fotografía', title: 'Contratar fotógrafo de bodas: guía y precios', desc: 'Precios reales por ciudad. Qué incluye y cómo elegir el fotógrafo perfecto.' },
  { href: '/blog/videografo-bodas-precio', tag: 'Fotografía', title: 'Videógrafo bodas: precio y qué incluye 2026', desc: 'Cuánto cuesta un videógrafo. Precios por paquete y diferencias con el fotógrafo.' },
  { href: '/blog/maquillaje-nupcial-precio-guia', tag: 'Imagen', title: 'Maquillaje nupcial: precios y cómo elegir 2026', desc: 'Guía de precios de maquillaje para novias. Qué incluye y cómo no equivocarte.' },
  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', tag: 'Camareros', title: 'Cuánto cobra un camarero de eventos 2026', desc: 'Precios reales para bodas, eventos de empresa y fiestas privadas.' },
  { href: '/blog/cuantos-camareros-necesito-para-mi-boda', tag: 'Camareros', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y formato de servicio.' },
  { href: '/blog/catering-boda-precio-por-persona', tag: 'Catering', title: 'Catering boda: precio por persona 2026', desc: 'Cuánto cuesta el catering de una boda. Precios por formato y qué incluye.' },
  { href: '/blog/saxofonista-para-bodas-precio', tag: 'Música', title: 'Saxofonista para bodas: precio 2026', desc: 'Cuánto cuesta un saxofonista. Precios por ceremonia, cóctel y pista.' },
  { href: '/blog/cantante-para-bodas-precio', tag: 'Música', title: 'Cantante para bodas: precio en España 2026', desc: 'Precios por formato: solista, dúo acústico, trío jazz o banda completa.' },
  { href: '/blog/musica-en-vivo-para-bodas', tag: 'Música', title: 'Música en vivo para bodas: precios 2026', desc: 'Solistas, bandas, jazz y cuartetos. Cuánto cuesta cada formato.' },
  { href: '/blog/maestro-de-ceremonias-boda-precio-guia', tag: 'Ceremonia', title: 'Maestro de ceremonias: precio y guía 2026', desc: 'Qué hace un MC, cuánto cobra y cómo elegirlo para tu boda.' },
  { href: '/blog/wedding-planner-precio-espana', tag: 'Organización', title: 'Wedding Planner: precio en España 2026', desc: 'Cuánto cobra un wedding planner. Coordinador del día vs planificación integral.' },
  { href: '/blog/tendencias-bodas-2026', tag: 'Tendencias', title: 'Tendencias bodas 2026 España', desc: 'Bodas íntimas, fincas rurales, catering experiencial y fórmulas mixtas de música.' },
  { href: '/blog/10-errores-contratar-dj-boda', tag: 'Guía', title: '10 errores al contratar DJ para tu boda', desc: 'Los errores más frecuentes y cómo evitarlos antes de firmar.' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una boda en España en 2026?', a: 'El presupuesto medio de una boda en España en 2026 ronda los 20.000-35.000€ para 100-150 invitados. Las partidas principales son catering (40-50%), música (8-12%), fotografía (8-10%), flores/decoración (6-10%) y personal de sala (5-8%).' },
  { q: '¿Qué profesionales necesito para mi boda?', a: 'Los básicos son: catering (o restaurante), DJ o música en directo, fotógrafo y personal de sala (camareros). Opcionales pero recomendados: videógrafo, maquilladora para la novia, maestro de ceremonias y wedding planner para coordinación.' },
  { q: '¿Cuándo contratar a los proveedores de la boda?', a: 'El catering y la finca: 12-18 meses antes. DJ y fotógrafo: 8-12 meses. Maquilladora y videógrafo: 6 meses. Personal de sala: 1-3 meses. Con XPEAK puedes hacer reservas Flash con menos de 1 semana de antelación para perfiles específicos.' },
  { q: '¿Es mejor DJ o banda en directo para la boda?', a: 'Depende del presupuesto y la atmósfera. Un DJ (700-1.500€) ofrece versatilidad total, ocupa poco espacio y cubre toda la jornada. Una banda en directo (2.500-6.000€) da un toque más exclusivo pero es más cara y limitada en repertorio.' },
];

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Guía completa para organizar tu boda: profesionales y precios (2026)', description: 'Todo lo que necesitas saber para contratar los mejores profesionales para tu boda en España. Precios reales, guías por partida y consejos de expertos.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/profesionales-bodas' };
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Profesionales para bodas', item: 'https://xpeak.es/blog/profesionales-bodas' }] };

const TAG_COLOR: Record<string, string> = { Presupuesto: '#D4AF37', Música: '#a78bfa', Fotografía: '#818cf8', Imagen: '#f472b6', Camareros: '#60a5fa', Catering: '#fbbf24', Ceremonia: '#34d399', Organización: '#D4AF37', Tendencias: '#f472b6', Guía: '#D4AF37' };

export default function HubBodas() {
  return (
    <>
      <Helmet>
        <title>Profesionales para bodas España: guía 2026 | XPEAK</title>
        <meta name="description" content="Guía completa para contratar DJ, fotógrafo, camareros, catering y maquilladora para tu boda en España. Precios reales y consejos por partida." />
        <link rel="canonical" href="https://xpeak.es/blog/profesionales-bodas" />
        <meta property="og:title" content="Profesionales para bodas España: guía completa 2026 — XPEAK" />
        <meta property="og:description" content="DJ, fotógrafo, camareros, catering y más para tu boda. Precios reales y guías por partida." />
        <meta property="og:url" content="https://xpeak.es/blog/profesionales-bodas" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Guía completa para organizar tu boda: profesionales y precios (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Todas las guías de XPEAK sobre profesionales para bodas en un solo lugar. Precios reales, ratios de personal y consejos prácticos para tomar las mejores decisiones.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>27 mayo 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Organizar una boda en España en 2026 implica coordinar entre 6 y 10 proveedores distintos. Cada partida tiene sus propios precios, sus propios ratios y sus propias trampas. Esta guía centraliza todo lo que necesitas saber: desde el presupuesto total hasta qué preguntar a cada proveedor antes de firmar.
              </p>
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
              <h2 className="text-lg font-black mb-4">Presupuesto orientativo por partida (100 invitados)</h2>
              <div className="space-y-2">
                {[
                  { partida: 'Catering (menú + servicio)', precio: '8.000–18.000€' },
                  { partida: 'DJ + equipo de sonido e iluminación', precio: '700–1.500€' },
                  { partida: 'Fotógrafo de bodas', precio: '1.500–3.500€' },
                  { partida: 'Camareros de sala (6-8 personas)', precio: '600–1.200€' },
                  { partida: 'Videógrafo', precio: '1.000–2.500€' },
                  { partida: 'Maquillaje y peluquería', precio: '400–900€' },
                  { partida: 'Flores y decoración', precio: '1.500–4.000€' },
                  { partida: 'Wedding planner (coordinación del día)', precio: '800–2.000€' },
                ].map((row, i) => (
                  <div key={row.partida} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.partida}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Rangos orientativos para una boda de 100 invitados en España 2026. Sin IVA.</p>
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
              <p className="text-sm font-black mb-2">¿Organizas una boda?</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>En XPEAK encuentras DJs, fotógrafos, camareros y maquilladoras verificados para bodas en toda España. Gratis para organizadores. Flash Booking en menos de 1h.</p>
              <a href="/bodas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver profesionales para bodas →</a>
            </div>
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
