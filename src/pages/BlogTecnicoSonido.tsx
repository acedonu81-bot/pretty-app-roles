import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const TABLE = [
  { evento: 'Boda o comunión (sala con PA)', horas: '6–10 h', rango: '200€ – 400€', notas: 'Montaje, prueba, ceremonia y recepción' },
  { evento: 'Concierto o evento musical en sala', horas: '8–12 h', rango: '300€ – 600€', notas: 'FOH + monitor, según riders' },
  { evento: 'Evento corporativo / convención', horas: '6–8 h', rango: '250€ – 500€', notas: 'Micros de solapa, PA, línea para vídeo' },
  { evento: 'Festival (técnico de escenario)', horas: '10–14 h', rango: '400€ – 800€', notas: 'Gestión de múltiples riders de artista' },
  { evento: 'Sesión club / discoteca', horas: '4–6 h', rango: '150€ – 300€', notas: 'Asistencia a DJ, control de volumen' },
];

const FAQ = [
  { q: '¿Cuándo necesito contratar un técnico de sonido?', a: 'Siempre que el evento supere las 100 personas o incluya actuaciones en directo (bandas, cantantes, DJ con backline). Para eventos pequeños en locales con PA instalado, el DJ o el venue pueden encargarse. Para conciertos, festivales o galas de empresa, el técnico es imprescindible.' },
  { q: '¿Qué diferencia hay entre técnico FOH y técnico de monitor?', a: 'El técnico FOH (Front of House) mezcla el sonido que escucha el público desde la mesa principal. El técnico de monitor mezcla el sonido que escuchan los artistas en el escenario. En eventos grandes se necesitan ambos; en eventos medianos, uno puede hacer las dos funciones.' },
  { q: '¿El técnico de sonido lleva su propio equipo?', a: 'Depende del acuerdo. Algunos técnicos trabajan con el PA del venue; otros son autónomos y llevan su propio sistema (PA, mesa, procesadores). Un técnico con equipo propio cuesta más pero da más garantías de calidad.' },
  { q: '¿Con cuánta antelación hay que contratar el técnico de sonido?', a: 'Para bodas y eventos corporativos, con 2–4 semanas es suficiente. Para festivales y conciertos, al menos 1–2 meses para coordinar riders de artistas y confirmaciones técnicas con el venue.' },
];

export default function BlogTecnicoSonido() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Técnico de sonido para eventos: funciones y precios en España (2026)',
    description: 'Cuánto cuesta un técnico de sonido para bodas, conciertos y eventos corporativos en España. Funciones, diferencias FOH/monitor y cuándo es necesario.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/tecnico-de-sonido-para-eventos',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/tecnico-de-sonido-para-eventos' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Técnico de sonido para eventos: funciones y precios en España (2026)', item: 'https://xpeak.es/blog/tecnico-de-sonido-para-eventos' },
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
        <title>Técnico de sonido eventos: precios 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un técnico de sonido para bodas, conciertos y eventos corporativos en España 2026. Funciones, tipos (FOH/monitor) y cuándo contratarlo." />
        <meta name="keywords" content="técnico de sonido precio, técnico sonido eventos España, cuánto cobra técnico sonido, contratar técnico sonido boda" />
        <link rel="canonical" href="https://xpeak.es/blog/tecnico-de-sonido-para-eventos" />
        <meta property="og:title" content="Técnico de sonido para eventos: precios 2026" />
        <meta property="og:description" content="Cuánto cuesta un técnico de sonido para bodas, conciertos y eventos corporativos en España." />
        <meta property="og:url" content="https://xpeak.es/blog/tecnico-de-sonido-para-eventos" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/blog" className="hover:text-white transition-colors">Blog</a> › <span>Técnico de sonido</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Técnico de sonido para eventos: funciones y precios en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            El técnico de sonido es el profesional invisible que hace que todo suene bien: mezcla las voces, controla los graves, evita los acoples y garantiza que el artista se escuche con claridad desde cualquier punto del espacio. Sin él, incluso el mejor DJ o la mejor banda pueden sonar mal. Esta guía explica qué hace, cuándo necesitas uno y cuánto cuesta en España en 2026.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un técnico de sonido para eventos cuesta entre <strong style={{ color: '#fff' }}>150€ y 800€</strong> según el tipo y duración del evento.
              Para bodas: <strong style={{ color: '#fff' }}>200€ – 400€</strong>. Para festivales y conciertos: <strong style={{ color: '#fff' }}>400€ – 800€</strong> o más.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios por tipo de evento</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Tipo de evento', 'Jornada', 'Precio', 'Notas'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.evento} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.evento}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.horas}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Qué hace exactamente un técnico de sonido</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Montaje y prueba de sonido', text: 'Llega 2–4 horas antes del evento para montar el sistema de PA, conectar todos los inputs (micros, instrumentos, líneas) y hacer la prueba de sonido con los artistas.' },
              { label: 'Mezcla en tiempo real', text: 'Durante el evento ajusta volúmenes, ecualizadores y efectos en tiempo real para que el sonido sea óptimo en cada momento: discurso, actuación, baile.' },
              { label: 'Gestión de riders técnicos', text: 'En eventos con artistas, coordina los riders técnicos (lista de necesidades de sonido) y asegura que el venue cumple los requisitos antes del día del evento.' },
              { label: 'Prevención de problemas', text: 'Evita acoples, distorsión y cortes de sonido. Detecta problemas técnicos antes de que afecten al espectáculo.' },
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
                ¿Eres técnico de sonido?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Publica tu perfil y recibe solicitudes de eventos</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Crea tu perfil en XPEAK, publica tus tarifas y activa Flash Booking para disponibilidad urgente. Gratis.
              </p>
              <a href="/auth?mode=register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas técnico de sonido para tu evento?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Directorio verificado · Tarifas públicas · Sin comisión</p>
              </div>
              <a href="/auth"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver técnicos →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España?', desc: 'Precios de DJs según experiencia y ciudad.' },
                { href: '/blog/como-organizar-evento-corporativo', tag: 'Eventos', title: 'Cómo organizar un evento corporativo', desc: 'Checklist completo: sonido, AV y proveedores.' },
                { href: '/blog/staff-de-discoteca-funciones-y-salario', tag: 'Staff', title: 'Staff de discoteca: funciones y sueldos', desc: 'Todos los perfiles de personal de sala y sus tarifas.' },
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
          <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/tecnico-de-sonido-para-eventos" />
        <FooterPublic />
      </div>
    </>
  );
}
