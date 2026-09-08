import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const TABLE = [
  { servicio: 'Peinado novia (solo)', duracion: '60–90 min', rango: '80€ – 180€', notas: 'Incluye prueba previa' },
  { servicio: 'Peinado novia + recogido invitadas', duracion: '3–4 h', rango: '200€ – 400€', notas: 'Servicio integral más demandado' },
  { servicio: 'Madrina / invitada especial', duracion: '30–45 min', rango: '40€ – 80€', notas: 'Sin prueba previa habitualmente' },
  { servicio: 'Pack boda (novia + 3 personas)', duracion: '3–5 h', rango: '250€ – 550€', notas: 'La peluquera se desplaza al domicilio' },
  { servicio: 'Evento corporativo / azafata', duracion: '15–20 min/persona', rango: '20€ – 40€/persona', notas: 'Recogido rápido y uniforme' },
  { servicio: 'Corte y peinado a domicilio', duracion: '45–60 min', rango: '30€ – 60€', notas: 'Fuera de evento, servicio de día a día' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una peluquera a domicilio para un evento?', a: 'Depende del tipo de evento. Para bodas, el peinado de novia oscila entre 80€ y 180€. Para eventos corporativos, entre 20€ y 40€ por persona. El desplazamiento puede suponer un suplemento de 15–40€ según la distancia.' },
  { q: '¿La peluquera lleva su propio material?', a: 'Sí, siempre. Una peluquera profesional a domicilio lleva su propio kit completo (planchas, tenacillas, secador, horquillas, laca y productos de fijación). Solo debes tener el pelo limpio y seco, o comunicarlo con antelación si prefieres lavado incluido.' },
  { q: '¿Es necesaria la prueba de peinado para una boda?', a: 'Se recomienda siempre, especialmente para la novia. La prueba (incluida habitualmente en el precio de boda) permite ajustar el recogido, comprobar que aguanta toda la jornada y resolver dudas de estilo antes del gran día.' },
  { q: '¿Con cuánta antelación hay que reservar la peluquera?', a: 'Para bodas en temporada alta (mayo–julio, septiembre–octubre), al menos 3–4 meses. Para eventos corporativos o servicios puntuales, con 1–2 semanas suele ser suficiente.' },
];

export default function BlogPeluqueriaEventos() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Peluquería a domicilio para eventos: precios y qué incluye en España (2026)',
    description: 'Cuánto cobra una peluquera a domicilio para bodas, eventos corporativos y el día a día en España. Precios por servicio y qué incluye cada paquete.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-09-09',
    dateModified: '2026-09-09',
    url: 'https://xpeak.es/blog/peluqueria-domicilio-eventos-precio',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/peluqueria-domicilio-eventos-precio' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: 'Peluquería a domicilio para eventos: precios y qué incluye en España (2026)', item: 'https://xpeak.es/blog/peluqueria-domicilio-eventos-precio' },
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
        <title>Peluquería a domicilio para eventos: precios 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cobra una peluquera a domicilio para bodas, eventos corporativos y el día a día en España 2026. Precios por servicio, duración y qué incluye cada paquete." />
        <meta name="keywords" content="peluquera a domicilio precio, peinado novia precio, peluquería a domicilio eventos España, contratar peluquera evento 2026" />
        <link rel="canonical" href="https://xpeak.es/blog/peluqueria-domicilio-eventos-precio" />
        <meta property="og:title" content="Peluquería a domicilio para eventos: precios 2026" />
        <meta property="og:description" content="Cuánto cobra una peluquera a domicilio para bodas, eventos corporativos y el día a día en España." />
        <meta property="og:url" content="https://xpeak.es/blog/peluqueria-domicilio-eventos-precio" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#DB2777' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">

          <p className="text-xs mb-6 font-bold" style={{ color: '#666' }}>
            <a href="/" className="hover:text-[#8A6D0F] transition-colors">XPEAK</a> › <a href="/contratar-peluqueria" className="hover:text-[#8A6D0F] transition-colors">Contratar peluquería</a> › <span>Precios</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#DB2777' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#DB2777' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Peluquería a domicilio para eventos: precios y qué incluye en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: '#555' }}>XPEAK · 9 de septiembre de 2026 · 4 min de lectura</p>

          <p className="text-base leading-relaxed mb-6" style={{ color: '#222' }}>
            Contratar una peluquera a domicilio no es solo cosa de novias. Bodas, comuniones, galas corporativas o simplemente no tener tiempo de ir a la peluquería: en todos estos casos llevar el servicio a casa ahorra desplazamientos y encaja con horarios ajustados. Esta guía recoge los precios reales del mercado español en 2026.
          </p>

          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(219,39,119,0.06)', border: '1px solid rgba(219,39,119,0.15)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#DB2777' }}>Resumen rápido</p>
            <p className="text-sm leading-relaxed" style={{ color: '#333' }}>
              Peinado de novia: <strong style={{ color: '#111' }}>80€ – 180€</strong>. Pack boda completo (4 personas): <strong style={{ color: '#111' }}>250€ – 550€</strong>.
              Eventos corporativos por persona: <strong style={{ color: '#111' }}>20€ – 40€</strong>. Todas las profesionales llevan su propio material.
            </p>
          </div>

          <h2 className="text-xl font-black mb-4">Precios de peluquería a domicilio por tipo de servicio</h2>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {['Servicio', 'Duración', 'Precio', 'Notas'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider"
                      style={{ color: '#333', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={row.servicio} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td className="px-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.servicio}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#444', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.duracion}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#DB2777', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.rango}</td>
                    <td className="px-4 py-3" style={{ color: '#333', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-black mb-4">Qué incluye el servicio de peluquería a domicilio</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Kit profesional completo', text: 'Planchas, tenacillas, secador de alta potencia, horquillas y productos de fijación de gama profesional. No necesitas tener nada preparado salvo indicación previa.' },
              { label: 'Adaptación al tipo de pelo', text: 'Peinado adaptado a pelo fino, grueso, rizado o con extensiones. Las buenas profesionales hacen una breve consulta antes de empezar.' },
              { label: 'Durabilidad larga jornada', text: 'El peinado de evento está pensado para aguantar 8–12 horas con fijadores profesionales, resistente a la humedad y al baile.' },
              { label: 'Desplazamiento', text: 'La mayoría de peluqueras se desplazan al domicilio o al hotel. Confirma si el desplazamiento tiene suplemento (habitualmente 15–40€ fuera de un radio de 20km).' },
            ].map(item => (
              <li key={item.label} className="flex gap-3">
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#DB2777' }} />
                <div>
                  <span className="text-xs font-bold">{item.label}: </span>
                  <span className="text-xs" style={{ color: '#222' }}>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-black mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(219,39,119,0.2)' }}>
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', color: '#fff', borderBottom: '1px solid rgba(219,39,119,0.15)' }}>
              <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
                style={{ background: 'rgba(219,39,119,0.12)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.25)' }}>
                ¿Eres peluquera?
              </span>
              <h2 className="text-xl font-black mb-2 leading-snug">Publica tu perfil y recibe bookings de eventos</h2>
              <p className="text-base mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Sube tu portfolio, publica tus tarifas y activa Flash Booking para disponibilidad de última hora. Gratis.
              </p>
              <a href="/auth?mode=register&role=peluqueria"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#DB2777,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil — gratis
              </a>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas peluquera para tu evento?</p>
                <p className="text-xs" style={{ color: '#333' }}>Directorio verificado · Tarifas públicas · Flash Booking</p>
              </div>
              <a href="/contratar-peluqueria"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.25)', whiteSpace: 'nowrap' }}>
                Ver peluquerías →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: '#111' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/maquilladora-para-eventos-precio', tag: 'Maquillaje', title: 'Maquilladora para eventos: precios 2026', desc: 'Precios reales de maquillaje profesional para eventos.' },
                { href: '/blog/maquillaje-nupcial-precio-guia', tag: 'Maquillaje', title: 'Maquillaje nupcial: precios y guía 2026', desc: 'Guía específica de maquillaje para novias.' },
                { href: '/blog/cuanto-cuesta-una-boda-en-espana', tag: 'Bodas', title: '¿Cuánto cuesta una boda en España?', desc: 'Presupuesto completo por partidas para 2026.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(219,39,119,0.1)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <DJResourcesAffiliate role="peluqueria" />
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-peluqueria" articlePath="/blog/peluqueria-domicilio-eventos-precio" />
        <BlogRelatedPosts currentSlug='/blog/peluqueria-domicilio-eventos-precio' tag='Maquillaje' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_peluqueria_eventos" />
      </div>
    </>
  );
}
