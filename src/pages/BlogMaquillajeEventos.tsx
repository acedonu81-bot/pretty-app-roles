import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';

const TABLE = [
  { servicio: 'Maquillaje novia (solo)', duracion: '60–90 min', rango: '100€ – 250€', notas: 'Incluye prueba previa' },
  { servicio: 'Maquillaje novia + peinado', duracion: '2–3 h', rango: '200€ – 450€', notas: 'Servicio integral más demandado' },
  { servicio: 'Madrina / invitada especial', duracion: '45–60 min', rango: '60€ – 120€', notas: 'Sin prueba previa habitualmente' },
  { servicio: 'Pack boda (novia + 3 personas)', duracion: '4–5 h', rango: '350€ – 700€', notas: 'Maquilladora se desplaza al domicilio' },
  { servicio: 'Evento corporativo / azafata', duracion: '20–30 min/persona', rango: '30€ – 70€/persona', notas: 'Maquillaje fast-track profesional' },
  { servicio: 'Sesión foto / vídeo', duracion: '60–90 min', rango: '80€ – 200€', notas: 'HD, flash-friendly, retoque incluido' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una maquilladora para eventos?', a: 'Depende del tipo de evento. Para bodas, el precio de la novia oscila entre 100€ y 250€. Para eventos corporativos o sesiones de foto, entre 30€ y 70€ por persona. El desplazamiento puede suponer un suplemento de 20–50€ según la distancia.' },
  { q: '¿La maquilladora lleva sus propios productos?', a: 'Sí, siempre. Una maquilladora profesional lleva su maletín completo con productos de marcas profesionales (MAC, NARS, Charlotte Tilbury, etc.). Solo debes comunicar alergias o preferencias de acabado (natural, glam, smoky).' },
  { q: '¿Es necesaria la prueba de maquillaje para una boda?', a: 'Se recomienda siempre, especialmente para la novia. La prueba (incluida habitualmente en el precio de boda) permite ajustar colores, comprobar la durabilidad y resolver nervios antes del gran día.' },
  { q: '¿Con cuánta antelación hay que reservar la maquilladora?', a: 'Para bodas en temporada alta (mayo–julio, septiembre–octubre), al menos 3–4 meses. Para eventos corporativos o sesiones de foto, con 1–2 semanas suele ser suficiente.' },
];

export default function BlogMaquillajeEventos() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Maquilladora para eventos: precios y qué incluye en España (2026)',
    description: 'Cuánto cobra una maquilladora para bodas, eventos corporativos y sesiones de foto en España. Precios por servicio y qué incluye cada paquete.',
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-23',
    dateModified: '2026-05-23',
    url: 'https://xpeak.es/blog/maquilladora-para-eventos-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/maquilladora-para-eventos-precio' },
  };
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Maquilladora para eventos: precios y qué incluye en España (2026)', item: 'https://xpeak.es/blog/maquilladora-para-eventos-precio' },
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
        <title>Maquilladora para eventos: precios 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una maquilladora para bodas, eventos corporativos y sesiones de foto en España 2026. Precios por servicio, duración y qué incluye cada paquete." />
        <meta name="keywords" content="maquilladora eventos precio, maquilladora boda precio, contratar maquilladora evento España, precio maquillaje profesional 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/maquilladora-para-eventos-precio" />
        <meta property="og:title" content="Maquilladora para eventos: precios 2026" />
        <meta property="og:description" content="Cuánto cobra una maquilladora para bodas, eventos corporativos y sesiones de foto en España." />
        <meta property="og:url" content="https://xpeak.es/blog/maquilladora-para-eventos-precio" />
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
            <a href="/" className="hover:text-white transition-colors">XPEAK</a> › <a href="/contratar-maquillaje" className="hover:text-white transition-colors">Contratar maquilladora</a> › <span>Precios</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Maquilladora para eventos: precios y qué incluye en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>XPEAK · 23 de mayo de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Contratar una maquilladora profesional para un evento no es solo cosa de novias. Bodas, comuniones, galas corporativas, sesiones de foto y vídeo: en todos estos contextos la imagen importa y el maquillaje profesional marca la diferencia. Esta guía recoge los precios reales del mercado español en 2026.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>Resumen rápido</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Maquillaje de novia: <strong style={{ color: '#fff' }}>100€ – 250€</strong>. Pack boda completo (4 personas): <strong style={{ color: '#fff' }}>350€ – 700€</strong>.
              Eventos corporativos por persona: <strong style={{ color: '#fff' }}>30€ – 70€</strong>. Todas las profesionales llevan su propio maletín.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios de maquilladora por tipo de servicio</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Servicio', 'Duración', 'Precio', 'Notas'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.servicio} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.servicio}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.duracion}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Qué incluye el servicio de maquillaje profesional</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Maletín profesional completo', text: 'Productos de gama alta (primers, bases, correctores, sombras, labiales, fixers). No necesitas llevar nada.' },
              { label: 'Adaptación al tipo de piel', text: 'Maquillaje adaptado a piel seca, grasa o mixta, y al tono natural. Las buenas profesionales hacen una breve consulta antes de empezar.' },
              { label: 'Durabilidad larga jornada', text: 'El maquillaje de evento está formulado para durar 8–12 horas con fijadores profesionales, resistente a la humedad y al calor.' },
              { label: 'Desplazamiento', text: 'Muchas maquilladores se desplazan al domicilio o al hotel. Confirma si el desplazamiento tiene suplemento (habitualmente 20–50€ fuera de un radio de 20km).' },
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
                ¿Eres maquilladora?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Publica tu perfil y recibe bookings de eventos</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Sube tu portfolio, publica tus tarifas y activa Flash Booking para disponibilidad de última hora. Gratis.
              </p>
              <a href="/auth?mode=register&role=makeup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas maquilladora para tu evento?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Directorio verificado · Tarifas públicas · Flash Booking</p>
              </div>
              <a href="/contratar-maquillaje"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver maquilladoras →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/maquillaje-nupcial-precio-guia', tag: 'Maquillaje', title: 'Maquillaje nupcial: precios y guía 2026', desc: 'Guía específica de maquillaje para novias.' },
                { href: '/blog/contratar-fotografo-de-bodas', tag: 'Fotografía', title: 'Fotógrafo de bodas: precio y guía 2026', desc: 'Cómo elegir el fotógrafo perfecto para tu boda.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España?', desc: 'Presupuesto completo por partidas para 2026.' },
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
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/maquilladora-para-eventos-precio" />
        <FooterPublic />
      </div>
    </>
  );
}
