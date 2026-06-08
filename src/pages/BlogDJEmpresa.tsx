import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const slug = 'dj-para-empresa-precio';
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para evento corporativo cuesta entre 500€ y 2.000€ dependiendo de la duración, el equipo y la ciudad. Los eventos de empresa suelen ser en horario de tarde-noche con 4-6 horas de servicio. El precio incluye equipo de sonido y desplazamiento local.' } },
  { '@type': 'Question', name: '¿Qué tipo de música pone un DJ en una fiesta de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'En eventos corporativos el DJ adapta el repertorio al público: música de fondo durante la cena (pop, soul, jazz), música ambiental durante el cocktail y sesión más movida (pop, electrónica suave, éxitos de distintas décadas) para la pista de baile. El objetivo es que bailen todas las generaciones.' } },
  { '@type': 'Question', name: '¿Puede el DJ hacer el papel de animador o presentador?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Muchos DJs corporativos ofrecen también servicio de MC (maestro de ceremonias): presentan a los ponentes, dinamizan los premios, animan el cóctel o hacen la cuenta atrás de Año Nuevo. Este perfil mixto tiene un coste un 20-30% mayor que el DJ puro.' } },
  { '@type': 'Question', name: '¿Qué necesita el DJ para montar en el venue de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Normalmente necesita: espacio mínimo de 2x1,5m para la mesa de mezclas, 2-4 enchufes cerca del área DJ, acceso 1h antes para montaje y autorización del venue. Si el evento es en un hotel, confirma con el hotel si permiten DJs externos o tienen lista de proveedores.' } },
] };

const PRECIOS = [
  { tipo: 'Cocktail o cena (3-4h)', precio: '400–900€' },
  { tipo: 'Fiesta de empresa completa (5-6h)', precio: '600–1.400€' },
  { tipo: 'Cena + pista de baile (hasta 8h)', precio: '800–2.000€' },
  { tipo: 'DJ + MC (presentador corporativo)', precio: '900–2.500€' },
  { tipo: 'Evento multinacional / incentivos', precio: '1.200–3.500€' },
];

export default function BlogDJEmpresa() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "DJ para eventos de empresa: precio y cómo contratar 2026",
    description: "Cuánto cuesta un DJ para un evento corporativo o fiesta de empresa. Precios 2026, qué incluye, qué música pone y cómo elegir el perfil correcto.",
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-06-07',
    url: "https://xpeak.es/blog/dj-para-empresa-precio",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/dj-para-empresa-precio" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "DJ para eventos de empresa: precio y cómo contratar 2026", item: "https://xpeak.es/blog/dj-para-empresa-precio" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>DJ para eventos de empresa: precio y cómo contratar 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para un evento corporativo o fiesta de empresa. Precios 2026, qué incluye, qué música pone y cómo elegir el perfil correcto." />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content="DJ para eventos de empresa: precio 2026 — XPEAK" />
        <meta property="og:description" content="Precios y guía para contratar DJ en eventos corporativos. Fiesta de empresa, cocktail, cena de Navidad." />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Empresas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para eventos de empresa: precio y cómo contratar en 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Desde la cena de Navidad hasta el team building o el incentive de fin de año — el DJ corporativo es uno de los servicios más demandados en eventos de empresa. Te explicamos precios, qué pedir y cómo elegir el perfil correcto.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>6 junio 2026</time>
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios de DJ para eventos de empresa (2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.tipo} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-medium">{row.tipo}</p>
                    <span className="text-xs font-bold ml-4 shrink-0" style={{ color: '#D4AF37' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#8E8EA0' }}>Precios orientativos 2026. Sin IVA. Madrid y Barcelona tienen un 15-20% de sobreprecio.</p>
            </section>

            <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <BlogInlineCTA role="dj" variant="upgrade" />

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/como-contratar-un-dj', cat: 'Guía', title: 'Cómo contratar un DJ: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-organizar-evento-corporativo', cat: 'Empresa', title: 'Cómo organizar un evento corporativo 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_empresa" />
      </div>
    </>
  );
}
