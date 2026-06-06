import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const TIPOS = [
  { tipo: 'Sesión de retrato (2h)', rango: '80€ – 180€', nota: 'Fotos de pareja o pre-boda' },
  { tipo: 'Reportaje solo ceremonia', rango: '300€ – 600€', nota: 'Entrada, intercambio de votos y salida' },
  { tipo: 'Boda completa (8h)', rango: '900€ – 2.500€', nota: 'Ceremonia, cóctel y banquete' },
  { tipo: 'Pack foto + vídeo', rango: '1.500€ – 4.000€', nota: 'Ahorro medio de un 20% vs contratar por separado' },
  { tipo: 'Álbum de boda premium', rango: '300€ – 800€', nota: 'Adicional al reportaje, entrega en 4–8 semanas' },
];

const CIUDADES = [
  { ciudad: 'Madrid', rango: '1.000€ – 2.800€', nota: 'Mayor oferta de fotógrafos especializados en bodas' },
  { ciudad: 'Barcelona', rango: '1.200€ – 3.500€', nota: 'Destino de bodas destino, muchos internacionales' },
  { ciudad: 'Valencia', rango: '800€ – 2.200€', nota: 'Buena relación calidad-precio, mercado creciente' },
  { ciudad: 'Sevilla', rango: '700€ – 2.000€', nota: 'Especialistas en bodas al aire libre y fincas' },
  { ciudad: 'Málaga / Costa del Sol', rango: '900€ – 2.500€', nota: 'Bodas destino con clientes internacionales' },
  { ciudad: 'Ibiza / Baleares', rango: '1.500€ – 5.000€', nota: 'Mercado de lujo, fotógrafos internacionales' },
];

const FAQ = [
  { q: '¿Con cuánta antelación debo contratar el fotógrafo de boda?', a: 'Lo ideal es contratar el fotógrafo entre 9 y 18 meses antes de la boda. Los mejores fotógrafos suelen tener agenda completa con un año de antelación en temporada alta (mayo–octubre). Para bodas en fechas fuera de temporada puedes encontrar disponibilidad con 3–6 meses.' },
  { q: '¿Qué diferencia hay entre un fotógrafo de boda y uno de eventos?', a: 'Un fotógrafo de bodas está especializado en capturar momentos únicos e irrepetibles: la primera mirada, las lágrimas, los detalles. Trabaja con luz natural y en espacios complejos. El fotógrafo de eventos tiene un ritmo diferente, más dinámico y orientado al contenido de marca. Para tu boda, busca siempre portfolio específico de bodas.' },
  { q: '¿Cuántas fotos entrega un fotógrafo de bodas?', a: 'Lo habitual es entre 400 y 800 fotos editadas para una boda completa de 8 horas. El número varía según el estilo del fotógrafo: los documentalistas tienden a entregar más, los artísticos seleccionan más. Pregunta siempre cuántas fotos incluye el precio y en qué plazo.' },
  { q: '¿Puedo ver el reportaje completo de una boda antes de contratar?', a: 'Sí, y es algo que deberías pedir siempre. Cualquier fotógrafo serio te mostrará reportajes completos, no solo las mejores fotos. Esto te permite evaluar cómo trabaja durante todo el evento, no solo en los momentos perfectos.' },
];

export default function BlogFotografoBodas() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cómo contratar un fotógrafo de bodas en España: guía de precios 2026',
    description: 'Precios reales de fotógrafos de bodas en España 2026. Qué incluye, cómo elegir y cuándo contratar.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    url: 'https://xpeak.es/blog/contratar-fotografo-de-bodas',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/contratar-fotografo-de-bodas' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo contratar un fotógrafo de bodas en España: guía de precios 2026', item: 'https://xpeak.es/blog/contratar-fotografo-de-bodas' },
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
        <title>Fotógrafo bodas España: precio y cómo contratar | XPEAK</title>
        <meta name="description" content="Precios reales de fotógrafos de bodas en España 2026: qué incluye, cuánto cuesta por ciudad y cómo elegir el fotógrafo perfecto para tu boda." />
        <meta name="keywords" content="contratar fotógrafo boda España, precio fotógrafo boda 2026, fotógrafo boda Madrid, cuánto cuesta fotógrafo boda" />
        <link rel="canonical" href="https://xpeak.es/blog/contratar-fotografo-de-bodas" />
        <meta property="og:title" content="Cómo contratar un fotógrafo de bodas en España: precios 2026" />
        <meta property="og:description" content="Precios reales de fotógrafos de bodas por ciudad y tipo de servicio. Guía completa 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/contratar-fotografo-de-bodas" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fotógrafo de bodas en España: precios 2026" />
        <meta name="twitter:description" content="Precios reales por ciudad y tipo de servicio. Guía completa para contratar el fotógrafo de tu boda." />
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
              Cómo contratar un fotógrafo de bodas en España: guía de precios 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              El fotógrafo de boda es una de las decisiones más importantes: las fotos son lo único que queda para siempre. Esta guía te explica qué cuesta, qué incluye y cómo elegir al profesional adecuado.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Precios por tipo de servicio</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Servicio</th><th style={th}>Precio</th><th style={th}>Qué incluye</th></tr></thead>
                <tbody>
                  {TIPOS.map(r => (
                    <tr key={r.tipo}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.tipo}</td>
                      <td style={{ ...td, color: '#D4AF37', fontWeight: 700 }}>{r.rango}</td>
                      <td style={td}>{r.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <BlogInlineCTA role="fotografo" />

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Precios por ciudad</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Ciudad</th><th style={th}>Boda completa</th><th style={th}>Nota</th></tr></thead>
                <tbody>
                  {CIUDADES.map(r => (
                    <tr key={r.ciudad}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.ciudad}</td>
                      <td style={{ ...td, color: '#D4AF37', fontWeight: 700 }}>{r.rango}</td>
                      <td style={td}>{r.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Qué mirar antes de contratar</h2>
            <div className="space-y-3">
              {[
                { titulo: 'Portfolio de bodas completas', desc: 'Pide ver reportajes enteros, no solo las mejores fotos. Evalúa cómo trabaja en la cena, el baile y los momentos espontáneos.' },
                { titulo: 'Estilo fotográfico', desc: 'Hay tres estilos principales: documental (natural, sin poses), romántico (luz cálida, tonos suaves) y artístico (edición fuerte, contrastes). Elige el que se adapte a tu boda.' },
                { titulo: 'Segunda cámara', desc: 'Muchos fotógrafos trabajan con un segundo asistente para cubrir simultaneamente la novia y el novio. Pregunta si está incluido o tiene coste adicional.' },
                { titulo: 'Contrato claro', desc: 'Asegúrate de que el contrato especifique: horas contratadas, número de fotos editadas, plazo de entrega, derechos de uso y condiciones de cancelación.' },
              ].map(item => (
                <div key={item.titulo} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>{item.titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
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
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/fotografos-eventos', cat: 'Hub Foto', title: 'Fotógrafos para eventos: guía completa 2026' },
                  { href: '/blog/videografo-bodas-precio', cat: 'Bodas', title: 'Videógrafo de bodas: precio y qué incluye 2026' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/fotografia-eventos-nocturnos', cat: 'Fotografía', title: 'Fotografía eventos nocturnos: precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-black mb-1">Encuentra fotógrafos verificados en España</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Portafolios reales, tarifas públicas y contratos digitales. Sin comisión.</p>
            <a href="/contratar-fotografo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver fotógrafos →
            </a>
          </div>
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/contratar-fotografo-de-bodas" />
      <FooterPublic />
      </div>
    </>
  );
}
