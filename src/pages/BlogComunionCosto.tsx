import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const TABLE = [
  { partida: 'Catering (comida + bebida)', rango: '40€ – 80€/persona', notas: 'Banquete completo en restaurante o finca' },
  { partida: 'DJ / Disco móvil', rango: '300€ – 700€', notas: 'Equipo + sesión 4–5 horas' },
  { partida: 'Fotógrafo', rango: '400€ – 900€', notas: 'Ceremonia + banquete + álbum digital' },
  { partida: 'Videógrafo', rango: '400€ – 800€', notas: 'Vídeo resumen editado del día' },
  { partida: 'Animación infantil', rango: '200€ – 500€', notas: 'Monitor + taller + juegos 2–3 horas' },
  { partida: 'Flores y decoración', rango: '200€ – 600€', notas: 'Iglesia, mesa presidencial y centro' },
  { partida: 'Traje / Vestido', rango: '200€ – 800€', notas: 'Amplio rango según diseñador' },
  { partida: 'Invitaciones + detalles', rango: '100€ – 350€', notas: 'Por 80–120 invitados' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una comunión de media en España?', a: 'Una comunión para 80–100 personas tiene un coste total de entre 6.000€ y 15.000€. La partida más cara es siempre el catering, que puede representar el 40–50% del presupuesto total.' },
  { q: '¿Cuántos invitados es lo habitual en una comunión?', a: 'La media en España está entre 60 y 120 invitados. Las comuniones íntimas (familiares) tienen entre 20 y 40 personas, lo que reduce considerablemente el presupuesto.' },
  { q: '¿Se puede ahorrar en el DJ de la comunión?', a: 'Sí. Una disco móvil básica para comunión cuesta entre 300€ y 500€ y suele incluir equipo y animación para niños. Es una opción más económica que contratar un DJ de sala.' },
  { q: '¿El fotógrafo de la comunión también hace vídeo?', a: 'Depende. Muchos fotógrafos ofrecen paquetes combinados foto+vídeo con descuento frente a contratar por separado. Es la opción más común en comuniones para reducir coordinación y coste.' },
];

export default function BlogComunionCosto() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '¿Cuánto cuesta una comunión en España? Presupuesto completo 2026',
    description: 'Desglose real del coste de una comunión en España. Catering, DJ, fotógrafo, animación y decoración: precios por partida para 2026.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/cuanto-cuesta-una-comunion-en-espana',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/cuanto-cuesta-una-comunion-en-espana' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: '¿Cuánto cuesta una comunión en España? Presupuesto completo 2026', item: 'https://xpeak.es/blog/cuanto-cuesta-una-comunion-en-espana' },
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
        <title>Cuánto cuesta una comunión en España 2026 | XPEAK</title>
        <meta name="description" content="Desglose real del coste de una comunión en España 2026. Catering, DJ, fotógrafo, animación y decoración: precios por partida para 80–100 invitados." />
        <meta name="keywords" content="cuánto cuesta una comunión, precio comunión España, presupuesto comunión 2026, comunión precio total" />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cuesta-una-comunion-en-espana" />
        <meta property="og:title" content="¿Cuánto cuesta una comunión en España? Presupuesto 2026" />
        <meta property="og:description" content="Desglose del coste de una comunión en España. Catering, DJ, fotógrafo, animación y decoración." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cuesta-una-comunion-en-espana" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/blog" className="hover:text-white transition-colors">Blog</a> › <span>Presupuesto comunión</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            ¿Cuánto cuesta una comunión en España? Presupuesto completo 2026
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 5 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Organizar una comunión en España en 2026 tiene un coste que puede ir de <strong style={{ color: '#fff' }}>4.000€ a más de 20.000€</strong> dependiendo del número de invitados, la ciudad y las partidas que se contraten. Esta guía desglosa cada partida con precios reales para que puedas planificar sin sorpresas.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Una comunión para <strong style={{ color: '#fff' }}>80–100 invitados</strong> cuesta entre <strong style={{ color: '#fff' }}>8.000€ y 15.000€</strong> de media.
              El catering es la partida más cara (40–50% del total). DJ, fotógrafo y animación suman entre 1.000€ y 2.500€.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Desglose de costes por partida</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Estos son los rangos reales de cada partida para una comunión de 80–100 personas en España:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[480px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Partida', 'Precio estimado', 'Notas'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.partida} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.partida}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Cómo ahorrar sin sacrificar calidad</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Fecha de temporada baja', text: 'Las comuniones en octubre o noviembre tienen precios de catering y DJ un 20–30% más bajos que en mayo, la temporada alta.' },
              { label: 'Paquetes combinados', text: 'Muchos fotógrafos ofrecen foto+vídeo con descuento. Algunos DJs también hacen paquetes con animación para niños.' },
              { label: 'Menú cerrado vs. a la carta', text: 'Un menú cerrado negociado con el restaurante es siempre más económico que un servicio a la carta o personalizado.' },
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
                Profesionales para comuniones
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">DJ, fotógrafo y animadores verificados para tu comunión</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Encuentra todos los profesionales que necesitas en XPEAK. Tarifas públicas, perfiles verificados y Flash Booking para reservar en minutos.
              </p>
              <a href="/auth"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Ver profesionales disponibles
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Eres DJ o fotógrafo de comuniones?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Crea tu perfil gratis y empieza a recibir solicitudes</p>
              </div>
              <a href="/auth?mode=register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Crear perfil gratis →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/comuniones-guia-completa', tag: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026', desc: 'Presupuesto, DJ, fotógrafo, catering y animación para tu comunión.' },
                { href: '/blog/disco-movil-para-comuniones', tag: 'DJ', title: 'Disco móvil para comuniones: precios 2026', desc: 'Qué incluye el servicio y cómo elegir el DJ.' },
                { href: '/blog/catering-comuniones-precio-persona', tag: 'Catering', title: 'Catering para comuniones: precio por persona', desc: 'Formatos, precios y cómo ahorrar sin perder calidad.' },
                { href: '/blog/animadores-infantiles-comuniones-cumpleanos', tag: 'Staff', title: 'Animadores infantiles: precios 2026', desc: 'Tipos de animación y cuánto cuestan.' },
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
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/cuanto-cuesta-una-comunion-en-espana" />
        <FooterPublic />
      </div>
    </>
  );
}
