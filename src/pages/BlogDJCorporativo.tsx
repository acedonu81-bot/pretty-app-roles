import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const TABLE = [
  { tipo: 'Afterwork / coctelería (< 100 p.)', horas: '3–4 h', rango: '400€ – 800€', notas: 'Música ambiental, lounge/house suave' },
  { tipo: 'Cena de gala empresarial', horas: '4–5 h', rango: '600€ – 1.200€', notas: 'Ambiente premium, equipo incluido' },
  { tipo: 'Fiesta de empresa > 200 personas', horas: '4–6 h', rango: '900€ – 2.000€', notas: 'DJ de referencia + producción AV' },
  { tipo: 'Presentación de producto / lanzamiento', horas: '2–3 h', rango: '500€ – 1.500€', notas: 'Música en directo o set ambiental' },
  { tipo: 'Convención o team building', horas: '2–4 h', rango: '400€ – 900€', notas: 'Sesión interactiva o ambiental' },
];

const FAQ = [
  { q: '¿Qué diferencia a un DJ corporativo de uno de discoteca?', a: 'Un DJ corporativo entiende que el objetivo no es la pista de baile a las 4AM sino crear un ambiente que favorezca la conversación, el networking o el baile controlado en una gala. Controla la energía de la sala progresivamente y adapta géneros al perfil de la empresa.' },
  { q: '¿El DJ necesita equipo propio para eventos corporativos?', a: 'En muchos venues corporativos ya existe instalación de sonido. El DJ debe poder conectarse a ella. Para venues sin instalación, el DJ lleva su propio equipo (habitualmente incluido en el precio para eventos de 100–200 personas).' },
  { q: '¿Qué música se pone en una fiesta de empresa?', a: 'Depende del perfil de los asistentes y la fase del evento. En cenas de gala se suele empezar con lounge/chill y escalar a pop comercial o funk. En afterworks, house suave o pop latino. Lo más importante es evitar géneros polarizadores (reggaeton muy explícito, metal, etc.) en el inicio.' },
  { q: '¿Hay que hacer un briefing previo con el DJ corporativo?', a: 'Sí, siempre. Un buen DJ corporativo pedirá información sobre el tipo de empresa, la media de edad de los asistentes, el dress code y si hay momentos especiales (premios, discursos). Esa información define el tracklist.' },
];

export default function BlogDJCorporativo() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DJ para eventos corporativos: precio y qué pedir en España (2026)',
    description: 'Cuánto cuesta contratar un DJ para un evento corporativo en España. Precios para afterworks, galas, fiestas de empresa y presentaciones.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/dj-para-eventos-corporativos-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/dj-para-eventos-corporativos-precio' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'DJ para eventos corporativos: precio y qué pedir en España (2026)', item: 'https://xpeak.es/blog/dj-para-eventos-corporativos-precio' },
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
        <title>DJ para eventos corporativos: precio 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para un evento corporativo en España 2026. Precios para afterworks, galas, fiestas de empresa y presentaciones de producto." />
        <meta name="keywords" content="DJ evento corporativo precio, DJ fiesta empresa, contratar DJ gala empresarial, DJ afterwork precio España" />
        <link rel="canonical" href="https://xpeak.es/blog/dj-para-eventos-corporativos-precio" />
        <meta property="og:title" content="DJ para eventos corporativos: precio 2026" />
        <meta property="og:description" content="Precios de DJ para afterworks, galas, fiestas de empresa y presentaciones en España 2026." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-para-eventos-corporativos-precio" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/blog" className="hover:text-white transition-colors">Blog</a> › <span>DJ corporativo</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Eventos de empresa</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            DJ para eventos corporativos: precio y qué pedir en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Un DJ para un evento corporativo no es lo mismo que un DJ de discoteca. El objetivo cambia: en vez de hacer bailar a todo el mundo hasta las 6AM, el DJ corporativo crea un ambiente que facilita la conversación, premia a los equipos y concluye en una fiesta controlada. Esta guía explica precios y qué exigir en el briefing.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Un DJ para evento corporativo en España cuesta entre <strong style={{ color: '#fff' }}>400€ y 2.000€</strong> según el tipo de evento y el aforo.
              El briefing previo es imprescindible. Exige siempre que el DJ tenga experiencia en eventos de empresa.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios según el tipo de evento corporativo</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Tipo de evento', 'Duración', 'Precio', 'Notas'].map(h => (
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
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Qué exigir al DJ en el briefing</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Experiencia corporativa demostrable', text: 'Pide referencias de eventos de empresa anteriores. Un DJ de sala con mucha experiencia puede no saber gestionar el tono de una gala de premios.' },
              { label: 'Propuesta de tracklist por momentos', text: 'Divide la noche en fases: llegada/networking, cena/banquete, baile. El DJ debe proponer géneros específicos para cada fase.' },
              { label: 'Compatibilidad con el sistema AV del venue', text: 'Muchos hoteles y centros de convenciones tienen instalación propia. El DJ debe confirmar que puede conectarse antes de la fecha.' },
              { label: 'Contrato con rider técnico', text: 'El rider especifica qué necesita el DJ (espacio, corriente, conexiones). Es obligatorio para evitar sorpresas el día del evento.' },
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
                ¿Organizas eventos de empresa?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">DJs con experiencia corporativa verificada en XPEAK</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Tarifas públicas, Flash Booking para fechas urgentes y contratos automáticos. Sin comisión.
              </p>
              <a href="/auth"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Ver DJs corporativos
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Eres DJ con experiencia corporativa?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Publica tu perfil y tus tarifas. Gratis.</p>
              </div>
              <a href="/auth?mode=register&role=dj"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Crear perfil DJ →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/como-organizar-evento-corporativo', tag: 'Eventos', title: 'Cómo organizar un evento corporativo', desc: 'Checklist completo: presupuesto, proveedores y timeline.' },
                { href: '/blog/como-organizar-fiesta-empresa', tag: 'Eventos', title: 'Fiesta de empresa: checklist y proveedores', desc: 'Guía completa para la fiesta de empresa perfecta.' },
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Precios por experiencia, ciudad y tipo de evento.' },
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
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-para-eventos-corporativos-precio" />
        <FooterPublic />
      </div>
    </>
  );
}
