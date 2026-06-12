import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const TABLE = [
  { tipo: 'Cumpleaños íntimo (< 30 p.)', horas: '3–4 h', rango: '150€ – 350€', incluye: 'Equipo básico, listas o mezcla' },
  { tipo: 'Fiesta privada (30–80 p.)', horas: '4–5 h', rango: '300€ – 600€', incluye: 'Setup completo, micro, luces básicas' },
  { tipo: 'Evento privado grande (80–200 p.)', horas: '5–6 h', rango: '600€ – 1.200€', incluye: 'Equipo profesional, técnico incluido' },
  { tipo: 'Fiesta de empresa / evento premium', horas: '4–6 h', rango: '800€ – 2.000€', incluye: 'DJ de referencia + producción' },
];

const FAQ = [
  { q: '¿Cuánto cuesta un DJ para una fiesta privada?', a: 'Entre 150€ y 600€ para eventos hasta 80 personas. El precio depende de las horas, si el DJ lleva equipo propio y el nivel de experiencia. Para fiestas más grandes con DJ de nombre, puede superar los 1.200€.' },
  { q: '¿El DJ tiene que llevar su propio equipo?', a: 'Depende del acuerdo. Los DJs emergentes a menudo no llevan equipo y necesitan que el local lo ponga. Los profesionales suelen llevar setup completo (controladora, altavoces, subwoofer, luces). Compruébalo siempre antes de contratar.' },
  { q: '¿Con cuánta antelación hay que contratar el DJ?', a: 'Para fiestas en fines de semana en temporada alta (mayo–octubre), al menos 4–6 semanas de antelación. En temporada baja puedes cerrar con 1–2 semanas. El Flash Booking de XPEAK cubre disponibilidad de última hora.' },
  { q: '¿El DJ acepta peticiones de canciones?', a: 'La mayoría sí, especialmente para fiestas privadas. Es habitual preparar una lista de reproducción base y compartirla antes del evento para que el DJ la adapte al ambiente y los gustos del grupo.' },
];

export default function BlogDJFiestaPrivada() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DJ para fiesta privada: precios y qué incluye en España (2026)',
    description: 'Cuánto cuesta contratar un DJ para una fiesta privada en España. Precios por número de personas, horas y tipo de evento.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/dj-para-fiesta-privada-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/dj-para-fiesta-privada-precio' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'DJ para fiesta privada: precios y qué incluye en España (2026)', item: 'https://xpeak.es/blog/dj-para-fiesta-privada-precio' },
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
        <title>DJ fiesta privada: precio y qué incluye 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para una fiesta privada en España. Precios según el número de invitados, horas y equipo incluido. Guía completa 2026." />
        <meta name="keywords" content="DJ fiesta privada precio, cuánto cuesta DJ fiesta, DJ cumpleaños precio, contratar DJ fiesta privada España" />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-fiesta-privada-precio" />
        <meta property="og:title" content="DJ para fiesta privada: precios 2026" />
        <meta property="og:description" content="Cuánto cuesta un DJ para una fiesta privada en España. Precios según invitados, horas y equipo." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-fiesta-privada-precio" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/contratar-dj" className="hover:text-white transition-colors">Contratar DJ</a> › <span>Fiesta privada</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            DJ para fiesta privada: precios y qué incluye en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Contratar un DJ para una fiesta privada es una de las decisiones que más impacto tienen en el ambiente del evento, y también una de las que más dudas genera: <strong style={{ color: '#fff' }}>¿cuánto cobran? ¿tienen que llevar su propio equipo? ¿aceptan peticiones?</strong> Esta guía responde todas esas preguntas con precios reales del mercado español en 2026.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un DJ para fiesta privada en España cuesta entre <strong style={{ color: '#fff' }}>150€ y 600€</strong> para eventos de hasta 80 personas.
              El precio sube según las horas, el equipo incluido y la experiencia del DJ.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios de DJ para fiesta privada por tipo de evento</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            El número de invitados y la duración son los dos factores que más determinan el presupuesto:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Tipo de evento', 'Duración', 'Precio total', 'Qué incluye'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.tipo} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.tipo}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.horas}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.incluye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">¿Qué debe incluir el presupuesto del DJ?</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Antes de firmar, confirma por escrito qué está incluido:
          </p>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Equipo de sonido', text: 'Altavoces, subwoofer y mesa de mezclas. Muchos DJs emergentes no lo llevan y hay que alquilarlo aparte (100–300€ extra).' },
              { label: 'Iluminación básica', text: 'Algunos DJs incluyen focos LED o strobe. Para fiestas grandes conviene contratar un técnico de iluminación separado.' },
              { label: 'Desplazamiento', text: 'En zonas alejadas de la ciudad puede aplicarse un suplemento de 20–50€ por gastos de transporte y montaje.' },
              { label: 'Horas de prueba de sonido', text: 'El montaje y prueba suele tardar 1–2 horas antes del evento. Confirma si eso está incluido o se cobra aparte.' },
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
                ¿Eres DJ?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Publica tu tarifa y recibe bookings para fiestas privadas</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Activa Flash Booking y aparece en el directorio de DJs disponibles en tu ciudad. Gratis.
              </p>
              <a href="/auth?mode=register&role=dj"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil DJ — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas DJ para tu fiesta?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Directorio con tarifas públicas · Flash Booking disponible · 0 comisión</p>
              </div>
              <a href="/auth"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver DJs disponibles →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Guía completa de precios de DJs por experiencia y ciudad.' },
                { href: '/blog/dj-para-cumpleanos-precio', tag: 'DJ', title: 'DJ para cumpleaños: precios 2026', desc: 'Qué cuesta el DJ para un cumpleaños y qué debe incluir.' },
                { href: '/blog/dj-para-eventos-corporativos-precio', tag: 'Eventos', title: 'DJ para eventos corporativos: precio 2026', desc: 'Qué DJ contratar para una fiesta de empresa o presentación.' },
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
          <BlogAuthor />
          <BlogShare />
        </article>
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_fiesta_privada" />
      </div>
    </>
  );
}
