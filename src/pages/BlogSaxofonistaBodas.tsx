import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const TABLE = [
  { momento: 'Ceremonia (entrada + firma + salida)', duracion: '30–60 min', rango: '250€ – 500€', estilo: 'Clásico, jazz, pop en versión saxo' },
  { momento: 'Cóctel de bienvenida', duracion: '60–90 min', rango: '300€ – 600€', estilo: 'Jazz, bossa nova, lounge' },
  { momento: 'Ceremonia + cóctel', duracion: '2–2.5 h', rango: '450€ – 850€', estilo: 'Pack más contratado en bodas' },
  { momento: 'Sesión junto a DJ en pista', duracion: '2–3 h', rango: '400€ – 700€', estilo: 'House, deep house, nu disco con saxo en directo' },
];

const FAQ = [
  { q: '¿Cuánto cuesta un saxofonista para una boda?', a: 'Entre 250€ y 850€ dependiendo del momento del día y la duración. El pack más habitual (ceremonia + cóctel) ronda los 500€ – 700€. Los saxofonistas que actúan en directo sobre bases de DJ cuestan un poco más por la complejidad técnica.' },
  { q: '¿Es mejor un saxofonista solo o con DJ?', a: 'Depende del momento. Para ceremonia y cóctel, el saxo solo (o con piano/guitarra) es perfecto. Para animar la pista de baile, la combinación saxo + DJ es muy efectiva: aporta la energía del directo sobre la potencia de la música electrónica.' },
  { q: '¿Qué géneros toca un saxofonista de bodas?', a: 'Jazz, bossa nova, pop en versión instrumental, soul y deep house son los géneros más demandados. Muchos saxofonistas de bodas tienen también un repertorio de canciones románticas adaptadas para la ceremonia.' },
  { q: '¿El saxofonista necesita equipo de sonido?', a: 'Para bodas en espacios grandes o al aire libre, sí. El saxo lleva micro y el sistema de PA puede ser del propio músico o del local. Para ceremonias en iglesias o espacios acústicos, muchas veces no hace falta amplificación.' },
];

export default function BlogSaxofonistaBodas() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Saxofonista para bodas: precio y repertorio en España (2026)',
    description: 'Cuánto cuesta contratar un saxofonista para una boda en España. Precios por momento del evento, qué géneros toca y si es mejor solo o con DJ.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/saxofonista-para-bodas-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/saxofonista-para-bodas-precio' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Saxofonista para bodas: precio y repertorio en España (2026)', item: 'https://xpeak.es/blog/saxofonista-para-bodas-precio' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>Saxofonista para bodas: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un saxofonista para una boda en España 2026. Precios por momento (ceremonia, cóctel, pista), géneros y si combinarlo con DJ." />
        <meta name="keywords" content="saxofonista para bodas precio, contratar saxofonista boda España, saxo boda precio 2026, saxofonista DJ boda" />
        <link rel="canonical" href="https://xpeak.es/blog/saxofonista-para-bodas-precio" />
        <meta property="og:title" content="Saxofonista para bodas: precio 2026" />
        <meta property="og:description" content="Cuánto cuesta un saxofonista para una boda. Precios por ceremonia, cóctel y pista de baile." />
        <meta property="og:url" content="https://xpeak.es/blog/saxofonista-para-bodas-precio" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/blog" className="hover:text-white transition-colors">Blog</a> › <span>Saxofonista para bodas</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Música para bodas</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Saxofonista para bodas: precio y repertorio en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            El saxofón es el instrumento que más se ha popularizado en bodas españolas en los últimos años. Su sonido aporta elegancia en la ceremonia, ambiente en el cóctel y energía en la pista de baile. Esta guía desglosa los precios reales para 2026 y explica en qué momento del día vale más la pena contratarlo.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un saxofonista para boda cuesta entre <strong style={{ color: '#fff' }}>250€ y 850€</strong> según el momento del día y la duración.
              El pack más habitual (ceremonia + cóctel) ronda los <strong style={{ color: '#fff' }}>500€ – 700€</strong>.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios por momento del evento</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Momento', 'Duración', 'Precio', 'Estilo musical'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.momento} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.momento}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.duracion}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.estilo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Saxo solo vs. saxo + DJ: ¿qué funciona mejor?</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Saxo solo: perfecto para ceremonia y cóctel', text: 'La pureza del saxo en un espacio con buena acústica es difícil de superar. Para momentos de emoción (entrada de la novia, firma) el instrumento en solitario tiene más impacto que cualquier producción electrónica.' },
              { label: 'Saxo + DJ: la fórmula ganadora en la pista', text: 'Un DJ que va subiendo el BPM mientras el saxofonista improvisa encima crea un ambiente único. Es la combinación más demandada para la primera hora de baile en bodas premium.' },
              { label: 'Saxo + piano o guitarra: para cócteles íntimos', text: 'Para bodas de menor aforo o cócteles en espacios íntimos, un dúo saxo + instrumento de acompañamiento tiene más calidez que el format solo.' },
            ].map(item => (
              <li key={item.label} className="flex gap-3">
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <div>
                  <span className="text-xs font-bold">{item.label}: </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-black mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                ¿Eres músico?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Publica tu perfil y recibe bookings de bodas</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                XPEAK conecta músicos con organizadores de bodas y eventos. Perfil gratuito, tarifas públicas.
              </p>
              <a href="/auth?mode=register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Organizas una boda?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Encuentra músicos verificados con tarifas públicas</p>
              </div>
              <a href="/auth"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver profesionales →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/profesionales-bodas', tag: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026', desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
                { href: '/blog/cantante-para-bodas-precio', tag: 'Bodas', title: 'Cantante para bodas: precio 2026', desc: 'Formatos de música en vivo y precios.' },
                { href: '/blog/musica-en-vivo-para-bodas', tag: 'Bodas', title: 'Música en vivo para bodas — guía 2026', desc: 'Guía completa de opciones de música en vivo.' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España?', desc: 'Precios de DJ para combinar con saxo en boda.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/saxofonista-para-bodas-precio" />
        <FooterPublic />
      </div>
    </>
  );
}
