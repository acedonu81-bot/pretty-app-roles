import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const TABLE = [
  { perfil: 'Azafata de feria / congreso', jornada: 'Media (5h) / Completa (8h)', rango: '80€ – 180€/día', notas: 'Imagen de marca, atención al visitante' },
  { perfil: 'Promotora de calle', jornada: 'Media / Completa', rango: '60€ – 120€/día', notas: 'Reparto de material, encuestas, sampling' },
  { perfil: 'Modelo para evento / showroom', jornada: 'Por hora', rango: '30€ – 80€/h', notas: 'Presentación de producto, catálogo' },
  { perfil: 'Presentadora de evento', jornada: 'Por actuación', rango: '200€ – 600€', notas: 'Con o sin guion, bilingual disponible' },
  { perfil: 'Pack equipo de 5 promotoras', jornada: 'Completa', rango: '400€ – 800€/día', notas: 'Coordinador incluido en packs grandes' },
];

const FAQ = [
  { q: '¿Qué es el personal de imagen para eventos?', a: 'Es el equipo de azafatas, promotoras, modelos y presentadoras que representan la marca en ferias, congresos, lanzamientos de producto y eventos corporativos. Su función es mejorar la imagen de la empresa, captar leads y facilitar la experiencia del visitante.' },
  { q: '¿Cuántas azafatas necesito para una feria?', a: 'Depende del tamaño del stand y el flujo esperado de visitantes. Una regla general: 1 azafata por cada 20–30 m² de stand, con un mínimo de 2 para no dejar el espacio desatendido. Para stands grandes (más de 100 m²) lo habitual es 4–6 personas.' },
  { q: '¿La ropa la pone la empresa o la azafata?', a: 'Depende del acuerdo. Para eventos de marca, la empresa suele proporcionar el uniforme o código de vestimenta (colores corporativos, traje de chaqueta específico). Para eventos genéricos, las azafatas llevan ropa según el dress code acordado.' },
  { q: '¿Con cuánta antelación hay que contratar el personal de imagen?', a: 'Para ferias grandes (FITUR, IFEMA, MWC) con al menos 4–6 semanas. Para eventos corporativos más pequeños, 1–2 semanas suele ser suficiente. El Flash Booking de XPEAK cubre disponibilidad de última hora para perfiles verificados.' },
];

export default function BlogPersonalImagen() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Personal de imagen para ferias y congresos: precios en España (2026)',
    description: 'Cuánto cuesta contratar azafatas, promotoras y modelos para ferias y congresos en España. Precios por perfil, jornada y cómo elegir el equipo correcto.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/personal-de-imagen-ferias-y-congresos',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/personal-de-imagen-ferias-y-congresos' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Personal de imagen para ferias y congresos: precios en España (2026)', item: 'https://xpeak.es/blog/personal-de-imagen-ferias-y-congresos' },
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
        <title>Personal de imagen para ferias: precios 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta contratar azafatas, promotoras y modelos para ferias y congresos en España 2026. Precios por perfil, jornada y cuántas necesitas." />
        <meta name="keywords" content="azafatas feria precio, personal imagen congresos España, contratar promotoras evento, azafatas IFEMA precio 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/personal-de-imagen-ferias-y-congresos" />
        <meta property="og:title" content="Personal de imagen para ferias: precios 2026" />
        <meta property="og:description" content="Cuánto cuesta contratar azafatas, promotoras y modelos para ferias y congresos en España." />
        <meta property="og:url" content="https://xpeak.es/blog/personal-de-imagen-ferias-y-congresos" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/contratar-staff" className="hover:text-white transition-colors">Contratar Staff</a> › <span>Personal de imagen</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Personal de imagen para ferias y congresos: precios en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Las ferias y congresos son una de las mayores inversiones de marketing para muchas empresas. El personal de imagen — azafatas, promotoras, modelos y presentadoras — es lo que convierte un stand en una experiencia memorable. Esta guía recoge los precios reales del mercado español en 2026 y explica cuántas personas necesitas según el tamaño del evento.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Azafata de feria: <strong style={{ color: '#fff' }}>80€ – 180€/día</strong>. Promotora de calle: <strong style={{ color: '#fff' }}>60€ – 120€/día</strong>.
              Pack de 5 promotoras con coordinador: <strong style={{ color: '#fff' }}>400€ – 800€/día</strong>.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Tarifas por perfil de personal de imagen</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Perfil', 'Jornada', 'Tarifa', 'Funciones principales'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.perfil} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.perfil}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.jornada}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Qué debes exigir al personal de imagen</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Briefing previo de producto o servicio', text: 'El personal de imagen debe conocer bien lo que representa. Organiza una sesión de formación de 1–2 horas antes del evento para trasladar mensajes clave y preguntas frecuentes.' },
              { label: 'Imagen y dicción', text: 'Exige portfolio fotográfico actualizado y, si es para presentaciones, un vídeo o prueba de dicción. Para eventos bilingües, confirma el nivel real de idiomas.' },
              { label: 'Puntualidad y cobertura de contingencias', text: 'Solicita siempre una sustituta de guardia para jornadas largas (más de 2 días). Las bajas de última hora pueden arruinar la presencia en una feria clave.' },
              { label: 'Contrato con métricas', text: 'Define KPIs: número de leads captados, folletos entregados, encuestas completadas. El personal de imagen con objetivos medibles aporta mucho más valor.' },
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
                ¿Eres azafata o promotora?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Crea tu perfil y recibe solicitudes de ferias y eventos</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Publica tu experiencia, idiomas y disponibilidad en XPEAK. Gratis.
              </p>
              <a href="/auth?mode=register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Necesitas personal de imagen para tu feria?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Directorio verificado · Flash Booking para urgencias · Sin comisión</p>
              </div>
              <a href="/contratar-staff"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver staff disponible →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/staff-para-eventos', tag: 'Hub Staff', title: 'Staff para eventos: guía completa 2026', desc: 'Camareros, azafatas, RRPP y personal de sala. Precios y ratios.' },
                { href: '/blog/precio-azafatas-eventos-espana', tag: 'Staff', title: 'Precio de azafatas para eventos 2026', desc: 'Tarifas por jornada y tipo de evento.' },
                { href: '/blog/promotores-de-eventos-que-hacen', tag: 'Staff', title: 'Promotores de eventos: funciones y precio', desc: 'Qué hacen los promotores y cuánto cobran.' },
                { href: '/blog/como-organizar-evento-corporativo', tag: 'Eventos', title: 'Cómo organizar un evento corporativo', desc: 'Checklist completo de proveedores y presupuesto.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,56,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="guia" intent="ser-profesional" articlePath="/blog/personal-de-imagen-ferias-y-congresos" />
        <FooterPublic />
      </div>
    </>
  );
}
