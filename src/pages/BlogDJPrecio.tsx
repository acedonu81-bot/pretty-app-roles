import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, MapPin, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import RelatedPosts from '@/components/RelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';

const TABLE = [
  { perfil: 'DJ emergente / rookie', experiencia: '< 1 año', rango: '30€ – 60€/h', nota: 'Bodas pequeñas, cumpleaños' },
  { perfil: 'DJ semi-profesional', experiencia: '1–3 años', rango: '60€ – 120€/h', nota: 'Bares, salas pequeñas, eventos' },
  { perfil: 'DJ profesional', experiencia: '3–7 años', rango: '120€ – 250€/h', nota: 'Salas medianas, festivales locales' },
  { perfil: 'DJ de referencia', experiencia: '+7 años', rango: '250€ – 500€/h', nota: 'Clubs nacionales, festivales' },
  { perfil: 'DJ artista internacional', experiencia: 'Booking exclusivo', rango: '500€+/h', nota: 'Macrofestivales, residencias' },
];

const CITIES = [
  { ciudad: 'Madrid', rango: '80€ – 300€/h', note: 'Mayor oferta y demanda de España' },
  { ciudad: 'Barcelona', rango: '100€ – 400€/h', note: 'Referente europeo, DJs internacionales' },
  { ciudad: 'Valencia', rango: '60€ – 250€/h', note: 'Mercado creciente, Lower Festival' },
  { ciudad: 'Sevilla', rango: '50€ – 200€/h', note: 'Fuerte tradición de eventos privados' },
  { ciudad: 'Bilbao / País Vasco', rango: '70€ – 220€/h', note: 'BBK Live, escena techno activa' },
  { ciudad: 'Málaga / Costa del Sol', rango: '60€ – 280€/h', note: 'Temporada alta junio–septiembre' },
];

const FAQ = [
  { q: '¿Se puede negociar el precio con un DJ?', a: 'Sí. La mayoría de los DJs tienen márgenes de negociación, especialmente para contratos de temporada o más de una fecha. Plataformas como XPEAK muestran tarifas públicas de referencia para que la negociación parta de datos reales.' },
  { q: '¿El precio incluye equipo de sonido?', a: 'Depende del DJ. Muchos DJs emergentes no llevan equipo; los profesionales suelen tener setup propio (controladora, monitores). Comprueba en el perfil si el equipo está incluido o si necesitas contratar técnico de sonido aparte.' },
  { q: '¿Hay que pagar IRPF al contratar un DJ?', a: 'Si el DJ es autónomo (epígrafe 962 de IAE), la factura incluirá un 15% de retención de IRPF. El empresario descuenta ese porcentaje del pago y lo ingresa a Hacienda. Los contratos generados en XPEAK incluyen este cálculo automáticamente.' },
  { q: '¿Cuánto vale un DJ para una boda en España?', a: 'Un DJ para boda en España cuesta entre 400€ y 1.200€ por actuación completa (4–6h), incluyendo equipo. El precio depende de la ciudad, duración y si incluye música en la ceremonia y cóctel.' },
];

export default function BlogDJPrecio() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '¿Cuánto cobra un DJ en España? Tarifas y precios 2026',
    description: 'Guía completa de precios de DJs en España por experiencia, ciudad y tipo de evento. Tarifas reales, IVA e IRPF, Flash Booking.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-04-28',
    dateModified: '2026-06-08',
    url: 'https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: '¿Cuánto cobra un DJ en España? Tarifas y precios 2026', item: 'https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana' },
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

  return (
    <>
      <Helmet>
        <title>Cuánto cobra un DJ en España: precios 2026 | XPEAK</title>
        <meta name="description" content="Guía completa con precios de DJs en España 2026: tarifas por experiencia, ciudad y tipo de evento. IVA, IRPF, equipo incluido o no. Datos reales de XPEAK." />
        <meta name="keywords" content="cuánto cobra un DJ, precio DJ España, tarifa DJ boda, DJ precio hora España, cuánto cuesta DJ 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana" />
        <meta property="og:title" content="¿Cuánto cobra un DJ en España? Tarifas 2026" />
        <meta property="og:description" content="Precios reales de DJs en España por experiencia, ciudad y tipo de evento. Guía completa 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="¿Cuánto cobra un DJ en España? Tarifas 2026" />
        <meta name="twitter:description" content="Precios reales de DJs en España por experiencia, ciudad y tipo de evento. Guía completa 2026." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
            <BlogTopCTA href="/auth?mode=register&intent=contratar-dj" label="Ver DJs →" />

          {/* Breadcrumb */}
          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/contratar-dj" className="hover:text-white transition-colors">Contratar DJ</a>
            {' '}›{' '}
            <span>Precios 2026</span>
          </p>

          {/* Cabecera */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            ¿Cuánto cobra un DJ en España? Tarifas y precios 2026
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            XPEAK · 28 de abril de 2026 · 6 min de lectura
          </p>

          {/* Intro */}
          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            La pregunta que más reciben salas, promotoras y organizadores cuando van a contratar un DJ es siempre la misma: <strong style={{ color: '#fff' }}>¿cuánto cuesta?</strong> La respuesta honesta es que depende de tres variables — experiencia, ciudad y tipo de evento — y que la horquilla va de 30€ a más de 500€/hora. Esta guía desglosa esos números con datos reales de la plataforma XPEAK.
          </p>

          <BlogAnswerBox
            question="¿Cuánto cobra un DJ en España en 2026?"
            answer="Un DJ profesional en España cobra entre 60€ y 300€/hora. Para bodas y eventos privados el presupuesto total es de 400€ – 1.200€ por actuación completa. Barcelona y Madrid son las ciudades más caras; las medianas del interior, las más económicas. El precio varía según experiencia, equipo incluido y tipo de evento."
          />
          <img
            src="/images/blog/cuanto-cobra-dj-espana-2026.jpg"
            alt="DJ profesional en cabina con controladora y luces de evento — precios de DJ en España 2026"
            className="w-full rounded-xl my-6 object-cover"
            style={{ maxHeight: 320, filter: 'brightness(0.9)' }}
            loading="lazy"
          />

          {/* Tabla por experiencia */}
          <h2 className="text-xl font-black mb-4">Tarifas de DJ por nivel de experiencia</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            El factor que más influye en el precio de un DJ es su trayectoria profesional. Esta tabla resume los rangos habituales del mercado español en 2026:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Perfil', 'Experiencia', 'Tarifa/hora', 'Típico en'].map(h => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-2 sm:px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.perfil}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.experiencia}</td>
                    <td className="px-2 sm:px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/cuanto-cobra-un-dj-en-espana" />
          <BlogInlineCTA role="dj" variant="upgrade" />

          {/* Por ciudad */}
          <h2 className="text-xl font-black mb-4">Precio de un DJ por ciudad</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            La geografía también importa. Las ciudades con mayor demanda de ocio nocturno tienen precios más altos, pero también más oferta de DJs.
            Consulta la guía específica de tu ciudad: <a href="/blog/dj-bodas-madrid" style={{ color: '#D4AF37' }}>DJ bodas Madrid</a>,{' '}
            <a href="/blog/dj-bodas-barcelona" style={{ color: '#D4AF37' }}>Barcelona</a>,{' '}
            <a href="/blog/dj-bodas-sevilla" style={{ color: '#D4AF37' }}>Sevilla</a>{' '}
            o <a href="/blog/dj-bodas-valencia" style={{ color: '#D4AF37' }}>Valencia</a>.
            Si ya tienes claro el precio, usa nuestra{' '}
            <a href="/blog/calculadora-tarifa-dj" style={{ color: '#D4AF37' }}>calculadora de tarifa DJ</a>{' '}
            o descarga la{' '}
            <a href="/plantilla-contrato-dj" style={{ color: '#D4AF37' }}>plantilla de contrato gratis</a>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {CITIES.map(c => (
              <div key={c.ciudad} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-black">{c.ciudad}</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#D4AF37' }}>{c.rango}</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.note}</p>
              </div>
            ))}
          </div>

          {/* IVA e IRPF */}
          <h2 className="text-xl font-black mb-4">IVA e IRPF: lo que no te dicen en otros artículos</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Los precios que ves en perfiles de XPEAK son tarifas brutas <em>antes de impuestos</em>. Al contratar un DJ autónomo en España hay que tener en cuenta:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              { label: 'IVA (21%)', text: 'El DJ factura con IVA al 21%. Si la sala o empresa es sujeto pasivo, puede deducirlo en su declaración trimestral.' },
              { label: 'IRPF (15%)', text: 'Si el DJ lleva más de 2 años como autónomo, aplica retención del 15% sobre la base imponible. Los nuevos autónomos pueden aplicar el 7% los primeros 3 años.' },
              { label: 'Contrato obligatorio', text: 'Desde 2024, cualquier contratación artística requiere contrato firmado con número de actuación para justificar el gasto ante Hacienda. Los contratos de XPEAK cumplen este requisito.' },
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

          {/* Cómo ahorrar */}
          <h2 className="text-xl font-black mb-4">¿Cómo conseguir el mejor precio?</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Tres consejos prácticos para organizadores y salas:
          </p>
          <ol className="space-y-3 mb-10">
            {[
              { n: '01', text: 'Usa Flash Booking para fechas urgentes. La competencia entre DJs disponibles en tu zona te garantiza precios de mercado real, no tarifas infladas.' },
              { n: '02', text: 'Negocia contratos de temporada. Si necesitas un DJ fijo para los viernes o los veranos, ofrece 4–8 fechas cerradas a cambio de un descuento del 15–25%.' },
              { n: '03', text: 'Filtra por tarifa en el directorio XPEAK antes de contactar. Evita conversaciones que acaban en "está fuera de presupuesto" — todos los precios son públicos.' },
            ].map(item => (
              <li key={item.n} className="flex gap-3">
                <span className="text-2xl font-black flex-shrink-0" style={{ color: 'rgba(212,175,55,0.2)', lineHeight: '1.1' }}>{item.n}</span>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</p>
              </li>
            ))}
          </ol>

          {/* FAQs */}
          <h2 className="text-xl font-black mb-5">Preguntas frecuentes sobre precios de DJs</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          {/* CTA dual — DJ + Organizador */}
          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            {/* CTA DJ */}
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  ¿Eres DJ?
                </span>
              </div>
              <h2 className="text-xl font-black mb-2 leading-snug">
                Publica tu tarifa y empieza a recibir bookings
              </h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Más de 9 DJs ya tienen perfil verificado en XPEAK. Aparece en el directorio, activa Flash Booking para fechas disponibles y genera contratos en segundos.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {['Perfil gratuito', 'Tarifas públicas', 'Flash Booking', 'Contratos automáticos'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: 'rgba(212,175,55,0.8)' }}>
                    <Star size={10} style={{ color: '#D4AF37' }} /> {f}
                  </span>
                ))}
              </div>
              <a href="/auth?mode=register&role=dj"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil DJ — es gratis
              </a>
            </div>

            {/* CTA Organizador */}
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas DJ para tu sala o evento?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Directorio con tarifas públicas · Flash Booking para esta noche · 0 comisión
                </p>
              </div>
              <a href="/auth"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver DJs disponibles →
              </a>
            </div>
          </div>

          <div className="mt-10 mb-10">
            <h2 className="text-lg font-black mb-4">Contratar DJ por ciudad</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'DJ Madrid', href: '/contratar-dj/madrid' },
                { label: 'DJ Barcelona', href: '/contratar-dj/barcelona' },
                { label: 'DJ Valencia', href: '/contratar-dj/valencia' },
                { label: 'DJ Sevilla', href: '/contratar-dj/sevilla' },
                { label: 'DJ Málaga', href: '/contratar-dj/malaga' },
                { label: 'DJ Ibiza', href: '/contratar-dj/ibiza' },
                { label: 'DJ Bilbao', href: '/contratar-dj/bilbao' },
                { label: 'DJ Mallorca', href: '/contratar-dj/palma' },
                { label: 'DJ Zaragoza', href: '/contratar-dj/zaragoza' },
                { label: 'DJ Alicante', href: '/contratar-dj/alicante' },
              ].map(c => (
                <a key={c.href} href={c.href}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/dj-para-eventos', tag: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026', desc: 'Precios, perfiles y cómo contratar DJ para cada tipo de evento en España.' },
                { href: '/blog/musica-en-vivo-para-bodas', tag: 'Bodas', title: 'Música en vivo para bodas — grupos y precios 2026', desc: 'Solistas, bandas, jazz y cuartetos. Cuánto cuesta cada formato.' },
                { href: '/blog/maestro-de-ceremonias-boda-precio-guia', tag: 'Bodas', title: 'Maestro de ceremonias: precio y guía 2026', desc: 'Qué hace un MC, cuánto cobra y cómo elegirlo para tu boda.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Presupuesto completo por partida: catering, música, fotos y más.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_precio" />
      </div>
    </>
  );
}
