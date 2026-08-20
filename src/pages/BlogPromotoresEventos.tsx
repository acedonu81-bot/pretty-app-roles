import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const PERFILES = [
  { perfil: 'Promotor de calle', tarifa: '30€ – 80€/noche', kpi: 'Personas captadas, flyers distribuidos' },
  { perfil: 'RRPP con lista propia', tarifa: '100€ – 400€/noche', kpi: 'Reservas, taquilla atribuida, lista VIP' },
  { perfil: 'Promotor digital', tarifa: '300€ – 1.000€/mes', kpi: 'Seguidores, alcance, ventas de entradas online' },
  { perfil: 'Brand ambassador', tarifa: '150€ – 350€/evento', kpi: 'Interacciones, contenido generado, leads' },
  { perfil: 'Promotor de festival', tarifa: '200€ – 800€/evento', kpi: 'Entradas vendidas, campings, acreditaciones' },
];

const FAQ = [
  { q: '¿Cuánto cobra un promotor de discoteca en España?', a: 'Los promotores de discoteca en España cobran entre 100€ y 400€ por noche, dependiendo de la calidad de su lista de clientes y la sala. Los promotores con clientela premium o con historial en clubs reconocidos cobran más porque generan mayor retorno en taquilla y reservas VIP.' },
  { q: '¿Qué diferencia hay entre un promotor y un relaciones públicas?', a: 'El promotor trabaja principalmente en captación: flyers, redes sociales, grupos de WhatsApp y presencia en calle. El RRPP gestiona relaciones: listas de invitados, reservas de mesa VIP, comunicación con clientes premium y fidelización. Muchos profesionales en XPEAK combinan ambas funciones.' },
  { q: '¿Cómo mido el rendimiento de un promotor contratado?', a: 'Los contratos de XPEAK permiten incluir métricas acordadas: número mínimo de asistentes traídos, reservas cerradas o taquilla atribuida a su lista. También puedes añadir incentivos por objetivos: por ejemplo, un bono del 10% de la taquilla que supere el mínimo acordado.' },
];

export default function BlogPromotoresEventos() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Promotores de eventos: qué hacen y cuánto cobran en España (2026)',
    description: 'Guía completa sobre los promotores de eventos en España 2026: tipos de promotores, funciones, tarifas y cómo contratarlos con métricas reales.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    url: 'https://xpeak.es/blog/promotores-de-eventos-que-hacen',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/promotores-de-eventos-que-hacen' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Promotores de eventos: qué hacen y cuánto cobran en España (2026)', item: 'https://xpeak.es/blog/promotores-de-eventos-que-hacen' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const th = { padding: '10px 14px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#059669', borderBottom: '1px solid rgba(5,150,105,0.25)', background: 'rgba(5,150,105,0.04)' };
  const td = { padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#111', fontSize: '0.87rem', verticalAlign: 'top' as const };

  return (
    <>
      <Helmet>
        <title>Promotores de eventos: funciones y precio 2026 | XPEAK</title>
        <meta name="description" content="Guía completa sobre promotores de eventos en España 2026: tipos, funciones, tarifas reales y cómo contratar con métricas medibles." />
        <meta name="keywords" content="promotor eventos España, cuánto cobra promotor discoteca, contratar promotor sala, RRPP eventos nocturnos España" />
        <link rel="canonical" href="https://xpeak.es/blog/promotores-de-eventos-que-hacen" />
        <meta property="og:title" content="Promotores de eventos: funciones y tarifas 2026" />
        <meta property="og:description" content="Tipos de promotores, funciones reales y cuánto cobran en España. Guía completa 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/promotores-de-eventos-que-hacen" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Promotores de eventos: funciones y tarifas 2026" />
        <meta name="twitter:description" content="Tipos de promotores, funciones reales y cuánto cobran en España." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#059669' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <header className="mb-10">
            <time className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#3d3d4e' }}>3 may 2026</time>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 mb-4 leading-tight">
              Promotores de eventos: qué hacen y cuánto cobran en España (2026)
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#222' }}>
              Un buen promotor puede marcar la diferencia entre una noche vacía y un sold out. Esta guía explica los tipos de promotores, sus funciones reales y cómo fijar las métricas correctas en el contrato.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Tipos de promotores y tarifas</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Perfil</th><th style={th}>Tarifa</th><th style={th}>KPI clave</th></tr></thead>
                <tbody>
                  {PERFILES.map(r => (
                    <tr key={r.perfil}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.perfil}</td>
                      <td style={{ ...td, color: '#059669', fontWeight: 700 }}>{r.tarifa}</td>
                      <td style={td}>{r.kpi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Cómo estructurar el contrato con un promotor</h2>
            <div className="space-y-3">
              {[
                { punto: 'Define el mínimo garantizado', desc: 'Fija el número mínimo de asistentes o reservas que el promotor debe cumplir. Por debajo de ese mínimo, se aplica una penalización o reducción del pago fijo.' },
                { punto: 'Añade incentivos por objetivos', desc: 'El sistema más eficaz es fijo bajo + variable por resultados. Ejemplo: 100€ fijo + 15% de la taquilla atribuida a su lista. Esto alinea los incentivos del promotor con los tuyos.' },
                { punto: 'Especifica el territorio', desc: 'Define si el promotor trabaja exclusivamente para tu sala o puede trabajar también con la competencia. La exclusividad de zona tiene un coste adicional.' },
                { punto: 'Sistema de seguimiento', desc: 'Acordad cómo se mide la atribución: código de descuento propio, nombre en lista, QR personalizado o seguimiento por reservas. Sin seguimiento, no hay forma de medir.' },
              ].map(item => (
                <div key={item.punto} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#059669' }}>{item.punto}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ.map(f => (
                <div key={f.q} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)' }}>
            <p className="text-sm font-black mb-1">Encuentra promotores verificados para tu sala</p>
            <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Contratos con métricas incluidas. Flash Booking en menos de 1h. Sin comisión.</p>
            <a href="/contratar-promotores" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>
              Ver promotores →
            </a>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/promotores-de-eventos-que-hacen" />
      <BlogRelatedPosts currentSlug='/blog/promotores-de-eventos-que-hacen' tag='Staff' />
        <FooterPublic />
      <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_promotores_eventos" />
      </div>
    </>
  );
}
