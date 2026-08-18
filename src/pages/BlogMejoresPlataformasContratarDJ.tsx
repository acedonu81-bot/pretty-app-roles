import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Check, X, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';

const PLATFORMS = [
  {
    name: 'XPEAK',
    comision: '0% — gratis',
    cuotaProfesional: 'Gratis',
    contacto: 'Directo, sin intermediación',
    cobertura: 'DJs, fotógrafos, staff, catering, animación y más (13 categorías)',
    destacado: true,
  },
  {
    name: 'Gigstarter',
    comision: '0% al contratante',
    cuotaProfesional: 'No especificada públicamente',
    contacto: 'Directo con el artista',
    cobertura: 'DJs, bandas y solistas (música en vivo)',
    destacado: false,
  },
  {
    name: 'Bodas.net',
    comision: 'Gratis para el organizador',
    cuotaProfesional: 'Suscripción Premium (~106€/6 meses) para no quedar relegado',
    contacto: 'A través de la plataforma, leads pueden ser poco cualificados',
    cobertura: 'Solo proveedores de boda, no eventos corporativos',
    destacado: false,
  },
  {
    name: 'Agencia de contratación tradicional',
    comision: '20% – 40% sobre el caché',
    cuotaProfesional: 'Comisión por reserva',
    contacto: 'Intermediado por la agencia',
    cobertura: 'Depende de la cartera propia de la agencia',
    destacado: false,
  },
];

const FAQ = [
  { q: '¿Cuál es la plataforma más barata para contratar un DJ en España?', a: 'XPEAK y Gigstarter no cobran comisión al organizador. La diferencia está en el profesional: en XPEAK el perfil también es gratis y sin cuota de visibilidad, mientras que en portales tipo Bodas.net el profesional suele pagar una suscripción Premium para no quedar relegado frente a perfiles gratuitos.' },
  { q: '¿Qué plataforma tiene más categorías de profesionales, no solo DJs?', a: 'XPEAK cubre 13 categorías (DJs, fotógrafos, staff, camareros, catering, animación, magos, humoristas, bailarines, speakers, estilistas, photo booth, wedding planners), útil si necesitas varios perfiles para el mismo evento. Gigstarter y Bodas.net están más centrados en música en vivo o bodas respectivamente.' },
  { q: '¿Es mejor contratar directo o por agencia?', a: 'Contratar directo (XPEAK, Gigstarter) evita la comisión del 20-40% que cobran las agencias tradicionales sobre el caché del profesional. La agencia tiene sentido si necesitas gestión completa del evento, no solo un proveedor puntual.' },
  { q: '¿Bodas.net cobra a los novios o a los proveedores?', a: 'A los novios/organizadores no les cobra por buscar o contactar. El coste está en el lado del proveedor: para aparecer bien posicionado suele requerir una suscripción Premium de pago, lo que puede sesgar qué perfiles ves primero.' },
];

export default function BlogMejoresPlataformasContratarDJ() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Mejores plataformas para contratar DJ en España (2026): comparativa',
    description: 'Comparativa de XPEAK, Gigstarter, Bodas.net y agencias tradicionales para contratar DJ en España: comisión, coste para el profesional y cobertura de categorías.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-08-18',
    dateModified: '2026-08-18',
    url: 'https://xpeak.es/blog/mejores-plataformas-contratar-dj-espana',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/mejores-plataformas-contratar-dj-espana' },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: 'Mejores plataformas para contratar DJ en España', item: 'https://xpeak.es/blog/mejores-plataformas-contratar-dj-espana' },
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

  const itemListStructured = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PLATFORMS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Mejores Plataformas para Contratar DJ en España (2026) | XPEAK</title>
        <meta name="description" content="Comparativa 2026 de XPEAK, Gigstarter, Bodas.net y agencias tradicionales para contratar DJ en España: comisión, coste real y cobertura de categorías." />
        <meta name="keywords" content="mejores plataformas contratar DJ, comparativa contratar DJ España, plataforma DJ sin comisión, XPEAK vs Gigstarter, XPEAK vs Bodas.net" />
        <link rel="canonical" href="https://xpeak.es/blog/mejores-plataformas-contratar-dj-espana" />
        <meta property="og:title" content="Mejores Plataformas para Contratar DJ en España (2026)" />
        <meta property="og:description" content="Comparativa de XPEAK, Gigstarter, Bodas.net y agencias tradicionales: comisión, coste real y cobertura." />
        <meta property="og:url" content="https://xpeak.es/blog/mejores-plataformas-contratar-dj-espana" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mejores Plataformas para Contratar DJ en España (2026)" />
        <meta name="twitter:description" content="Comparativa de XPEAK, Gigstarter, Bodas.net y agencias tradicionales: comisión, coste real y cobertura." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListStructured)}</script>
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

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <BlogTopCTA href="/auth?mode=register&intent=contratar-dj" label="Ver DJs →" />

          <p className="text-xs mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="/" className="hover:text-white transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/contratar-dj" className="hover:text-white transition-colors">Contratar DJ</a>
            {' '}›{' '}
            <span>Comparativa plataformas 2026</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Comparativa</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Mejores plataformas para contratar DJ en España (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            XPEAK · 18 de agosto de 2026 · 5 min de lectura
          </p>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            No todas las plataformas para contratar un DJ en España funcionan igual. Algunas no cobran nada a ninguna de las dos partes, otras cobran al profesional una cuota para destacar, y las agencias tradicionales siguen aplicando comisiones del 20-40% sobre el caché. Esta comparativa resume lo que paga cada parte y qué cubre cada plataforma, con datos verificables de cada una.
          </p>

          <BlogAnswerBox
            question="¿Cuál es la mejor plataforma para contratar un DJ en España en 2026?"
            answer="Depende de qué priorices. XPEAK y Gigstarter no cobran comisión al organizador; la diferencia está en el profesional, donde XPEAK tampoco cobra cuota de visibilidad y cubre además otras 12 categorías de eventos (fotógrafos, staff, catering, animación...). Bodas.net tiene el mayor volumen pero cobra suscripción Premium al proveedor para no quedar relegado. Las agencias tradicionales siguen siendo las más caras, con comisiones del 20-40% sobre el caché."
          />

          <h2 className="text-xl font-black mb-4">Comparativa: comisión, coste y cobertura</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Tabla comparativa con datos públicos de cada plataforma, actualizada en agosto de 2026:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Plataforma', 'Comisión organizador', 'Coste profesional', 'Contacto', 'Cobertura'].map(h => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p, i) => (
                  <tr key={p.name} style={{ background: p.destacado ? 'rgba(212,175,55,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td className="px-2 sm:px-4 py-3 font-black whitespace-nowrap" style={{ color: p.destacado ? '#D4AF37' : '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {p.name}{p.destacado && <span className="ml-1.5 text-[0.6rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>propia</span>}
                    </td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{p.comision}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{p.cuotaProfesional}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{p.contacto}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{p.cobertura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.65rem] mb-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Datos de comisión y cobertura recogidos de la información pública de cada plataforma en agosto de 2026. Las condiciones pueden cambiar — consulta siempre la fuente oficial antes de decidir.
          </p>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/mejores-plataformas-contratar-dj-espana" />
          <BlogInlineCTA role="dj" variant="upgrade" />

          <h2 className="text-xl font-black mb-4">Qué mirar antes de elegir plataforma</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Quién paga la comisión', text: 'Si no cobran al organizador, revisa si cobran al profesional — esa cuota suele acabar reflejada en el precio final que te pasan.' },
              { label: 'Contacto directo o intermediado', text: 'El contacto directo con el profesional (sin pasar por un centro de leads) suele dar respuestas más rápidas y presupuestos más ajustados.' },
              { label: 'Cobertura real de categorías', text: 'Si necesitas varios perfiles para el mismo evento (DJ + catering + staff), una plataforma multi-categoría evita gestionar 3-4 herramientas distintas.' },
              { label: 'Transparencia de precios', text: 'Los directorios con tarifas públicas por perfil evitan el ida-y-vuelta de "mándame presupuesto" antes de saber si encaja en tu rango.' },
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
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  ¿Eres DJ?
                </span>
              </div>
              <h2 className="text-xl font-black mb-2 leading-snug">
                Perfil gratis, sin comisión ni cuota de visibilidad
              </h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                A diferencia de otras plataformas, en XPEAK no pagas para aparecer bien posicionado. Perfil gratuito, tarifas públicas y Flash Booking para fechas urgentes.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {['Perfil gratuito', 'Sin cuota de visibilidad', 'Contacto directo', 'Contratos automáticos'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: 'rgba(212,175,55,0.8)' }}>
                    <Check size={10} style={{ color: '#D4AF37' }} /> {f}
                  </span>
                ))}
              </div>
              <a href="/auth?mode=register&role=dj"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil DJ — es gratis
              </a>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas DJ para tu sala o evento?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Directorio con tarifas públicas · Flash Booking para esta noche · 0 comisión
                </p>
              </div>
              <a href="/contratar-dj"
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
                { href: '/blog/cuanto-cobra-un-dj-en-espana', tag: 'DJ', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Precios reales por experiencia y ciudad.' },
                { href: '/blog/dj-para-eventos', tag: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026', desc: 'Precios, perfiles y cómo contratar DJ para cada tipo de evento.' },
                { href: '/blog/comparar-presupuestos-proveedores-eventos', tag: 'Organizadores', title: 'Cómo comparar presupuestos de proveedores', desc: 'Método práctico sin perder días en llamadas cruzadas.' },
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
        <BlogRelatedPosts currentSlug='/blog/mejores-plataformas-contratar-dj-espana' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_comparativa_dj" />
      </div>
    </>
  );
}
