import { Helmet } from 'react-helmet-async';
import { Music, Camera, UtensilsCrossed, Flower2, Users, Car, ChevronRight } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const PARTIDAS = [
  { icon: UtensilsCrossed, label: 'Catering y banquete', min: 8000, max: 25000, nota: 'Partida más alta. €50–150/comensal según menú y servicio.' },
  { icon: Flower2,         label: 'Finca / Venue',       min: 3000, max: 15000, nota: 'Precio muy variable. Fincas rurales más económicas que hoteles.' },
  { icon: Camera,          label: 'Fotógrafo y vídeo',   min: 1200, max: 4500,  nota: 'Pack foto + vídeo: €2.000–3.500. Solo foto: desde €1.200.' },
  { icon: Music,           label: 'DJ para boda',         min: 400,  max: 1800,  nota: 'Incluye equipo. Precio por actuación completa (4–6h).' },
  { icon: Users,           label: 'Camareros y personal', min: 600,  max: 2500,  nota: '€80–120/camarero/jornada. Mínimo 1 por cada 8–10 invitados.' },
  { icon: Flower2,         label: 'Flores y decoración',  min: 800,  max: 4000,  nota: 'Centros de mesa, arco floral, tocado novia incluidos.' },
  { icon: Users,           label: 'Maquillaje y estilismo', min: 300, max: 1200, nota: 'Novia + madres. Pack completo con peluquería.' },
  { icon: Car,             label: 'Transporte',           min: 400,  max: 1500,  nota: 'Coche nupcial + bus para invitados si el venue es alejado.' },
];

const RANGOS = [
  { tipo: 'Boda íntima', invitados: '< 50 invitados', rango: '8.000€ – 18.000€', color: '#22c55e' },
  { tipo: 'Boda media',  invitados: '50–120 invitados', rango: '18.000€ – 35.000€', color: '#D4AF37' },
  { tipo: 'Boda grande', invitados: '120–200 invitados', rango: '35.000€ – 55.000€', color: '#ff9f40' },
  { tipo: 'Boda premium', invitados: '+200 invitados', rango: '55.000€ – 100.000€+', color: '#ff5f56' },
];

const CIUDADES = [
  { ciudad: 'Madrid',    rango: '25.000€ – 50.000€', nota: 'Precio medio más alto de España' },
  { ciudad: 'Barcelona', rango: '22.000€ – 45.000€', nota: 'Gran oferta de venues y proveedores' },
  { ciudad: 'Valencia',  rango: '18.000€ – 38.000€', nota: 'Buena relación calidad-precio' },
  { ciudad: 'Sevilla',   rango: '16.000€ – 35.000€', nota: 'Tradición fuerte, venues únicos' },
  { ciudad: 'Málaga',    rango: '17.000€ – 40.000€', nota: 'Bodas al aire libre muy demandadas' },
  { ciudad: 'Islas Baleares', rango: '30.000€ – 80.000€+', nota: 'Destino de bodas de lujo en España' },
];

const FAQ = [
  {
    q: '¿Cuánto cuesta de media una boda en España en 2026?',
    a: 'Una boda media en España cuesta entre 20.000€ y 35.000€ para 100–130 invitados. El precio varía mucho según la ciudad, el tipo de venue y el nivel de servicio. En grandes ciudades como Madrid o Barcelona el presupuesto medio supera los 25.000€.',
  },
  {
    q: '¿Cuál es la partida más cara de una boda?',
    a: 'El catering es invariablemente la partida más cara, representando entre el 35% y el 45% del presupuesto total. Un banquete para 100 personas puede costar entre 8.000€ y 20.000€ según el menú, el servicio y el número de camareros contratados.',
  },
  {
    q: '¿Cómo ahorrar en una boda sin perder calidad?',
    a: 'Las mayores oportunidades de ahorro son: elegir fecha entre semana o en temporada baja (noviembre–febrero), apostar por un catering tipo bufé en lugar de menú servido, contratar fotógrafo local en lugar de muy conocido, y usar plataformas como XPEAK para contratar DJ y personal sin comisiones de intermediarios.',
  },
  {
    q: '¿Cuánto cobra un DJ para una boda en España?',
    a: 'Un DJ profesional para boda en España cuesta entre 400€ y 1.800€ por actuación completa (cóctel + baile, 4–6 horas), incluyendo equipo de sonido. El precio depende de la ciudad, experiencia del DJ y si incluye actuación en la ceremonia. En XPEAK puedes ver tarifas reales de DJs verificados en tu ciudad.',
  },
  {
    q: '¿Cuántos camareros necesito para mi boda?',
    a: 'La regla general es 1 camarero por cada 8–10 invitados en servicio de menú, y 1 por cada 15 en formato bufé. Para 100 invitados necesitarás entre 10 y 12 camareros. Añade 1–2 extras para la barra libre y el café. Consulta nuestra guía completa de camareros para bodas.',
  },
];

export default function BlogCosteBoda() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '¿Cuánto cuesta una boda en España en 2026? Guía de presupuesto',
    description: 'Guía completa con el coste real de una boda en España en 2026: desglose por partidas, precio según número de invitados y ciudad. DJ, catering, fotógrafo, personal.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-04-30',
    dateModified: '2026-04-30',
    url: 'https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: '¿Cuánto cuesta una boda en España en 2026? Presupuesto completo', item: 'https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const tdStyle = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', verticalAlign: 'top' as const };
  const thStyle = { padding: '10px 14px', textAlign: 'left' as const, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#D4AF37', borderBottom: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)' };

  return (
    <>
      <Helmet>
        <title>Cuánto cuesta una boda en España 2026 | XPEAK</title>
        <meta name="description" content="Guía completa del coste de una boda en España 2026: desglose por partidas (catering, DJ, fotógrafo, personal), precio según invitados y ciudad. Datos reales." />
        <meta name="keywords" content="cuánto cuesta una boda España, presupuesto boda 2026, precio boda España, coste boda media España, cuánto vale organizar una boda" />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana" />
        <meta property="og:title" content="¿Cuánto cuesta una boda en España en 2026? Guía completa de presupuesto" />
        <meta property="og:description" content="Desglose real del coste de una boda en España: catering, DJ, fotógrafo, camareros, flores y más. Presupuestos según número de invitados y ciudad." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="¿Cuánto cuesta una boda en España en 2026? Guía completa" />
        <meta name="twitter:description" content="Desglose real del coste de una boda en España: catering, DJ, fotógrafo, camareros, flores y más." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.35)' }} className="hover:text-white transition-colors">Inicio</a>
            <ChevronRight size={12} />
            <a href="/blog" style={{ color: 'rgba(255,255,255,0.35)' }} className="hover:text-white transition-colors">Blog</a>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cuánto cuesta una boda</span>
          </div>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                Bodas · Guía de presupuesto
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-4">
              ¿Cuánto cuesta una boda en España en 2026?
            </h1>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Guía completa con el coste real de cada partida: catering, DJ, fotógrafo, camareros, flores y más.
              Presupuestos según número de invitados y ciudad, con datos actualizados a 2026.
            </p>
            <div className="flex items-center gap-4 mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span>XPEAK · Abril 2026</span>
              <span>·</span>
              <span>10 min de lectura</span>
            </div>
          </header>

          {/* Resumen rápido */}
          <div className="rounded-2xl p-5 mb-10" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <ul className="space-y-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li>💰 Boda media en España (100 invitados): <strong style={{ color: '#fff' }}>20.000€ – 35.000€</strong></li>
              <li>🍽️ Partida más cara: <strong style={{ color: '#fff' }}>catering (35–45% del total)</strong></li>
              <li>🎧 DJ para boda: <strong style={{ color: '#fff' }}>400€ – 1.800€</strong></li>
              <li>📸 Fotógrafo: <strong style={{ color: '#fff' }}>1.200€ – 4.500€</strong></li>
              <li>🍾 Camareros: <strong style={{ color: '#fff' }}>1 por cada 8–10 invitados</strong></li>
            </ul>
          </div>

          {/* Presupuesto por tamaño */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Presupuesto según el número de invitados</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              El número de invitados es el factor que más impacta en el coste total, principalmente por el catering y el personal de servicio.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RANGOS.map(r => (
                <div key={r.tipo} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)` }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.invitados}</p>
                  <p className="text-lg font-black mb-0.5">{r.tipo}</p>
                  <p className="text-xl font-black" style={{ color: r.color }}>{r.rango}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Desglose por partidas */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Desglose por partidas: ¿en qué se va el dinero?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Datos basados en el mercado español para una boda de 100 invitados con nivel de servicio estándar.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Partida</th>
                    <th style={thStyle}>Rango de precio</th>
                    <th style={thStyle}>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {PARTIDAS.map((p, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <div className="flex items-center gap-2">
                          <p.icon size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                          <span className="font-semibold">{p.label}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#D4AF37', whiteSpace: 'nowrap' }}>
                        {p.min.toLocaleString('es-ES')}€ – {p.max.toLocaleString('es-ES')}€
                      </td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)' }}>{p.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              * Precios de referencia para 100 invitados en España. No incluyen luna de miel, vestido/traje, alianzas ni invitaciones.
            </p>
          </section>

          {/* Precio por ciudad */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-2">¿Cuánto cuesta una boda según la ciudad?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              El precio varía significativamente según la ciudad. Madrid y Barcelona concentran los venues más exclusivos y los proveedores más caros.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '440px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Ciudad</th>
                    <th style={thStyle}>Presupuesto medio (100 invitados)</th>
                    <th style={thStyle}>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {CIUDADES.map((c, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{c.ciudad}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#D4AF37' }}>{c.rango}</td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)' }}>{c.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <BlogInlineCTA role="general" />

          {/* DJ */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-2">DJ para boda: ¿cuánto cuesta y qué incluye?</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              El DJ es uno de los proveedores que más impacto tiene en la experiencia de los invitados y uno de los más fáciles de contratar a través de XPEAK.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { tipo: 'DJ básico', precio: '400€ – 700€', desc: 'Solo música, equipo propio básico. Ideal para bodas íntimas.' },
                { tipo: 'DJ profesional', precio: '700€ – 1.200€', desc: 'Equipo completo, música en cóctel y baile (5–6h).' },
                { tipo: 'DJ de referencia', precio: '1.200€ – 1.800€', desc: 'DJ con nombre, setup premium, iluminación incluida.' },
              ].map(d => (
                <div key={d.tipo} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.tipo}</p>
                  <p className="text-lg font-black mb-1" style={{ color: '#D4AF37' }}>{d.precio}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <span className="text-lg">💡</span>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                En XPEAK puedes contratar DJs verificados para tu boda con precio cerrado desde el primer mensaje,
                contrato automático y Flash Booking si necesitas cubrir una fecha urgente.{' '}
                <a href="/contratar-dj" className="font-bold underline" style={{ color: '#D4AF37' }}>Ver DJs disponibles →</a>
              </p>
            </div>
          </section>

          {/* Camareros */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Personal de servicio: camareros y barra</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              El personal de servicio es la segunda partida más importante después del catering. Un ratio correcto de camareros marca la diferencia entre una boda fluida y una caótica.
            </p>
            <div className="overflow-x-auto rounded-xl mb-4" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '420px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Tipo de servicio</th>
                    <th style={thStyle}>Ratio recomendado</th>
                    <th style={thStyle}>Precio/camarero/jornada</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tipo: 'Menú servido', ratio: '1 por cada 8–10 invitados', precio: '90€ – 120€' },
                    { tipo: 'Bufé', ratio: '1 por cada 12–15 invitados', precio: '80€ – 110€' },
                    { tipo: 'Cóctel / barra libre', ratio: '1 por cada 15 invitados', precio: '80€ – 120€' },
                    { tipo: 'Maitre / jefe de sala', ratio: '1 por evento', precio: '120€ – 180€' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{r.tipo}</td>
                      <td style={tdStyle}>{r.ratio}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#D4AF37' }}>{r.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <span className="text-lg">💡</span>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                ¿No sabes cuántos camareros necesitas exactamente?{' '}
                <a href="/blog/cuantos-camareros-necesito-para-mi-boda" className="font-bold underline" style={{ color: '#D4AF37' }}>
                  Lee nuestra guía completa con tabla de ratios →
                </a>
              </p>
            </div>
          </section>

          {/* Consejos ahorro */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-5">5 formas de ahorrar sin renunciar a la calidad</h2>
            <div className="space-y-3">
              {[
                { num: '01', tip: 'Elige fecha en temporada baja', desc: 'Los proveedores bajan precios un 15–30% en noviembre, enero y febrero. Los fines de semana de verano tienen recargo en casi todos los servicios.' },
                { num: '02', tip: 'Bufé en lugar de menú servido', desc: 'El bufé reduce el coste de camareros un 30% y suele tener mejor valoración por parte de los invitados: más variedad y menos esperas.' },
                { num: '03', tip: 'Contrata DJ y personal directamente sin intermediarios', desc: 'Plataformas como XPEAK te conectan directamente con el profesional sin comisión de agencia. El ahorro puede ser de 200€ a 500€ solo en el DJ.' },
                { num: '04', tip: 'Optimiza el número de camareros', desc: 'Muchas parejas contratan más personal del necesario por miedo al caos. Con los ratios correctos y un buen maitre, 100 invitados funcionan perfectamente con 10–11 camareros.' },
                { num: '05', tip: 'Pide pack foto + vídeo al mismo proveedor', desc: 'Contratar fotógrafo y videógrafo por separado cuesta un 20–30% más que el pack combinado. Negocia ambos con el mismo profesional.' },
              ].map(c => (
                <div key={c.num} className="flex gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-2xl font-black flex-shrink-0 w-8" style={{ color: 'rgba(212,175,55,0.3)' }}>{c.num}</span>
                  <div>
                    <p className="font-bold mb-0.5">{c.tip}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black mb-6">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ.map((f, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-bold mb-2">{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-lg sm:text-xl font-black mb-2">Contrata a los mejores profesionales para tu boda</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.72)' }}>
              DJs, fotógrafos, camareros y staff verificados en toda España. Precio cerrado desde el primer contacto. Sin comisiones ocultas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contratar-dj"
                className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Contratar DJ para mi boda
              </a>
              <a href="/contratar-camareros"
                className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                Contratar camareros
              </a>
            </div>
          </div>

          {/* Artículos relacionados */}
          {/* Planificador CTA */}
          <section className="mt-10 mb-4">
            <a href="/presupuesto-boda"
              className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl transition-all hover:scale-[1.01]"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <span className="text-4xl flex-shrink-0">🛒</span>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-black mb-1">Calcula tu presupuesto de boda al instante</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Añade DJ, catering, fotógrafo y camareros. Las fichas se suman en tiempo real con el total estimado.
                </p>
              </div>
              <span className="text-xs font-black px-4 py-2 rounded-lg flex-shrink-0"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ir al planificador →
              </span>
            </a>
          </section>

          <section className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Artículos relacionados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                { href: '/blog/cuantos-camareros-necesito-para-mi-boda', title: 'Cuántos camareros necesito para mi boda', cat: 'Bodas' },
                { href: '/blog/cuanto-cobra-un-camarero-de-eventos', title: 'Cuánto cobra un camarero de eventos en España', cat: 'Precios' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', cat: 'Precios' },
                { href: '/blog/dj-para-bodas-vs-discoteca', title: 'DJ para bodas vs DJ para discoteca', cat: 'Bodas' },
              ].map(a => (
                <a key={a.href} href={a.href}
                  className="flex items-start gap-3 rounded-xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                  <ChevronRight size={14} style={{ color: '#D4AF37', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#D4AF37' }}>{a.cat}</p>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{a.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/cuanto-cuesta-una-boda-en-espana" />
      <FooterPublic />
      </div>
    </>
  );
}
