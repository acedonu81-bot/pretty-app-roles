import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const PAQUETES = [
  { paquete: 'Básico (4h)', precio: '400€ – 650€', incluye: 'DJ + equipo de sonido + luces de color básicas' },
  { paquete: 'Estándar (6h)', precio: '600€ – 900€', incluye: 'DJ + sonido + iluminación completa + máquina de humo' },
  { paquete: 'Premium (8h)', precio: '800€ – 1.300€', incluye: 'DJ + sonido + luces + efectos (cañón confeti, humo, CO2)' },
  { paquete: 'Comunión completa', precio: '700€ – 1.100€', incluye: 'Música en el convite + baile con equipo completo' },
  { paquete: 'Pack foto + disco móvil', precio: '1.200€ – 2.000€', incluye: 'DJ con equipo + fotógrafo del evento' },
];

const FAQ = [
  { q: '¿Qué diferencia hay entre contratar un DJ suelto y una disco móvil para la comunión?', a: 'Un DJ suelto solo pone la música. Una disco móvil incluye el DJ más el equipo completo: altavoces profesionales, mesa de mezclas, iluminación de colores, máquina de humo y cañón de confeti. Si el local de la comunión no tiene equipo de sonido propio, necesitas una disco móvil.' },
  { q: '¿Puede el DJ de disco móvil poner música para todas las edades?', a: 'Sí. Los DJs de disco móvil para comuniones están especializados en adaptarse a diferentes públicos en el mismo evento: canciones actuales para los niños, clásicos para los adultos y una selección de baile para el final de la noche. Especifica en tu solicitud las preferencias musicales al contratar.' },
  { q: '¿La disco móvil incluye montaje y desmontaje?', a: 'Sí. El montaje y desmontaje del equipo está siempre incluido en el precio. El DJ llega entre 1 y 2 horas antes del evento para instalar el equipo y lo recoge al terminar. Solo necesitas tener el espacio disponible y una toma de corriente de 220V.' },
];

export default function BlogDiscoMovilComuniones() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Disco móvil para comuniones: precios y qué incluye en 2026',
    description: 'Guía completa para contratar una disco móvil para tu comunión en España: precios por paquete, qué incluye y cómo elegir bien.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    url: 'https://xpeak.es/blog/disco-movil-para-comuniones',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/disco-movil-para-comuniones' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Disco móvil para comuniones: precios y qué incluye en 2026', item: 'https://xpeak.es/blog/disco-movil-para-comuniones' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const th = { padding: '10px 14px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#D4AF37', borderBottom: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.04)' };
  const td = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.82)', fontSize: '0.87rem', verticalAlign: 'top' as const };

  return (
    <>
      <Helmet>
        <title>Disco móvil comuniones: precio y qué incluye | XPEAK</title>
        <meta name="description" content="Guía para contratar disco móvil para comuniones en España 2026: precios por paquete, qué incluye el servicio y cómo elegir el DJ correcto." />
        <meta name="keywords" content="disco móvil comunión España, precio disco móvil comunión, contratar DJ comunión, disco movil comunion precio" />
        <link rel="canonical" href="https://xpeak.es/blog/disco-movil-para-comuniones" />
        <meta property="og:title" content="Disco móvil para comuniones: precios 2026" />
        <meta property="og:description" content="Guía completa: precios por paquete, qué incluye y cómo elegir el DJ para tu comunión." />
        <meta property="og:url" content="https://xpeak.es/blog/disco-movil-para-comuniones" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Disco móvil para comuniones: precios 2026" />
        <meta name="twitter:description" content="Precios por paquete, qué incluye y cómo elegir el DJ para tu comunión en España." />
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
          <header className="mb-10">
            <time className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#8E8EA0' }}>3 may 2026</time>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 mb-4 leading-tight">
              Disco móvil para comuniones: precios y qué incluye en 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              La disco móvil convierte el baile de la comunión en un momento que todos recuerdan. Aquí tienes todo lo que necesitas saber antes de contratar.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Precios por paquete</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Paquete</th><th style={th}>Precio</th><th style={th}>Incluye</th></tr></thead>
                <tbody>
                  {PAQUETES.map(r => (
                    <tr key={r.paquete}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.paquete}</td>
                      <td style={{ ...td, color: '#D4AF37', fontWeight: 700 }}>{r.precio}</td>
                      <td style={td}>{r.incluye}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Qué siempre incluye una disco móvil</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { item: 'DJ profesional', desc: 'Con experiencia en eventos familiares y para todos los públicos' },
                { item: 'Equipo de sonido', desc: 'Altavoces activos profesionales, subwoofer y mesa de mezclas' },
                { item: 'Iluminación de colores', desc: 'Focos LED, strobo y efectos de luz programados' },
                { item: 'Montaje y desmontaje', desc: '1-2h antes del evento para instalar, recogida al terminar' },
                { item: 'Repertorio adaptable', desc: 'Música para niños, adultos y baile mixto' },
                { item: 'Seguro de responsabilidad', desc: 'El equipo propio del DJ va asegurado' },
              ].map(item => (
                <div key={item.item} className="p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                  <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>{item.item}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ.map(f => (
                <div key={f.q} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-black mb-1">Encuentra disco móvil para tu comunión</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>DJs con equipo completo verificados en toda España. Sin comisión.</p>
            <a href="/contratar-disco-movil" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver disco móvil →
            </a>
          </div>
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/disco-movil-para-comuniones" />
      <FooterPublic />
      </div>
    </>
  );
}
