import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const FORMATOS = [
  { formato: 'Coffee break', precio: '8€ – 18€/persona', cuando: 'Reuniones y formaciones de media jornada' },
  { formato: 'Cóctel / Finger food', precio: '20€ – 45€/persona', cuando: 'Presentaciones de producto, inauguraciones' },
  { formato: 'Almuerzo de trabajo (bufé)', precio: '25€ – 50€/persona', cuando: 'Teambuilding, jornadas de empresa de día' },
  { formato: 'Cena de gala sentada', precio: '55€ – 120€/persona', cuando: 'Premios, celebraciones anuales, fin de año' },
  { formato: 'Barra libre premium', precio: '20€ – 40€/persona/hora', cuando: 'Fiestas de empresa y eventos nocturnos' },
  { formato: 'Food trucks / Street food', precio: '15€ – 35€/persona', cuando: 'Teambuilding outdoor, festivales corporativos' },
];

const FAQ = [
  { q: '¿Con cuánta antelación debo contratar el catering para un evento de empresa?', a: 'Para eventos de hasta 50 personas, con 1-2 semanas es suficiente si usas Flash Booking. Para eventos de más de 100 personas, lo recomendable es 4-8 semanas. Los grandes eventos corporativos (más de 300 personas) requieren 3-6 meses de planificación.' },
  { q: '¿El catering corporativo incluye personal de sala?', a: 'Depende del proveedor. Muchos servicios de catering incluyen camareros y personal de sala, mientras que otros solo proveen la comida y bebida. En XPEAK cada perfil especifica exactamente qué está incluido en el precio por persona. Siempre compruébalo antes de firmar.' },
  { q: '¿Puedo pedir opciones vegetarianas o sin gluten para eventos de empresa?', a: 'Sí. Todos los proveedores de catering en XPEAK ofrecen menús adaptados a restricciones alimentarias: vegetariano, vegano, sin gluten, sin lactosa y alergias específicas. Especifícalo en tu solicitud indicando el porcentaje aproximado de asistentes con cada restricción.' },
];

export default function BlogCateringEmpresas() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Catering para eventos de empresa en España: tipos y precios 2026',
    description: 'Guía completa de catering corporativo en España 2026: formatos, precios por persona y cómo elegir el servicio para tu evento de empresa.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    url: 'https://xpeak.es/blog/catering-para-eventos-de-empresa',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/catering-para-eventos-de-empresa' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Catering para eventos de empresa en España: tipos y precios 2026', item: 'https://xpeak.es/blog/catering-para-eventos-de-empresa' },
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
        <title>Catering eventos empresa: tipos y precios 2026 | XPEAK</title>
        <meta name="description" content="Guía completa de catering corporativo en España 2026: coffee breaks, cócteles, cenas de gala y food trucks. Precios por persona y cuándo contratar." />
        <meta name="keywords" content="catering eventos empresa España, catering corporativo Madrid, precio catering empresa, contratar catering evento empresa" />
        <link rel="canonical" href="https://xpeak.es/blog/catering-para-eventos-de-empresa" />
        <meta property="og:title" content="Catering para eventos de empresa: precios 2026" />
        <meta property="og:description" content="Formatos, precios por persona y cómo elegir el catering para tu evento corporativo." />
        <meta property="og:url" content="https://xpeak.es/blog/catering-para-eventos-de-empresa" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Catering para eventos de empresa: precios 2026" />
        <meta name="twitter:description" content="Coffee breaks, cócteles, cenas de gala y food trucks. Precios por persona en España." />
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
              Catering para eventos de empresa en España: tipos y precios 2026
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              El catering es uno de los elementos que más recuerdan los asistentes a un evento corporativo. Esta guía te ayuda a elegir el formato correcto y saber cuánto presupuestar.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Formatos y precios por persona</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Formato</th><th style={th}>Precio/persona</th><th style={th}>Ideal para</th></tr></thead>
                <tbody>
                  {FORMATOS.map(r => (
                    <tr key={r.formato}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.formato}</td>
                      <td style={{ ...td, color: '#D4AF37', fontWeight: 700 }}>{r.precio}</td>
                      <td style={td}>{r.cuando}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Cómo elegir el formato correcto</h2>
            <div className="space-y-3">
              {[
                { titulo: 'Duración del evento', desc: 'Para eventos de menos de 2 horas, un coffee break o cóctel es suficiente. Eventos de medio día necesitan almuerzo completo. Jornadas de día completo requieren coffee break + almuerzo + merienda.' },
                { titulo: 'Objetivo del evento', desc: 'Eventos de networking: formato cóctel favorece las conversaciones. Presentaciones formales: bufé de pie o almuerzo sentado. Celebraciones: cena de gala o barra libre.' },
                { titulo: 'Presupuesto por persona', desc: 'Regla práctica: coffee break (10€), cóctel (30€), almuerzo (40€), cena de gala (80€). Multiplica por el número de asistentes y añade 15-20% para imprevistos.' },
                { titulo: 'Restricciones del espacio', desc: 'Si el venue no tiene cocina propia, opta por catering en frío o food trucks. Si tienes cocina disponible, puedes negociar servicio más completo a menor coste.' },
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

          <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-black mb-1">Compara proveedores de catering en España</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Perfiles verificados, tarifas públicas y contratos digitales. Sin comisión.</p>
            <a href="/contratar-catering" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver catering →
            </a>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/catering-para-eventos-de-empresa" />
      <FooterPublic />
      </div>
    </>
  );
}
