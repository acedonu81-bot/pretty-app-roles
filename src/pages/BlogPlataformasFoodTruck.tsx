import { Helmet } from 'react-helmet-async';
import { Zap, TrendingUp, Check, Star } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';

const PLATFORMS = [
  {
    name: 'XPEAK',
    coste: '0€, sin cuota de visibilidad',
    contacto: 'Directo, sin intermediación',
    cobertura: 'Food truck dentro de Catering + 12 categorías más (DJ, fotógrafo, staff...)',
    destacado: true,
  },
  {
    name: 'Foodtruckya',
    coste: 'Planes de suscripción para destacar en el buscador',
    contacto: 'Directo con el food truck, sin comisión por reserva',
    cobertura: 'Especializada solo en food trucks y proveedores del sector',
    destacado: false,
  },
  {
    name: 'Bodas.net / Bodas.com',
    coste: 'Alta gratuita, pero pago por desbloquear cada contacto (créditos desde 20€)',
    contacto: 'A través de la plataforma, pagas para ver los datos del cliente',
    cobertura: 'Solo bodas, categoría "Food truck y mesas dulces"',
    destacado: false,
  },
  {
    name: 'Instagram / boca a boca',
    coste: 'Gratis, pero sin estructura ni tarifas públicas',
    contacto: 'DMs manuales, sin filtro por ciudad ni presupuesto',
    cobertura: 'Depende de tu propio alcance orgánico',
    destacado: false,
  },
];

const FAQ = [
  { q: '¿Cuánto cuesta darse de alta como food truck en XPEAK?', a: 'Nada. Crear el perfil, publicar tu tarifa y aparecer en el directorio de Catering es gratuito, sin cuota de visibilidad ni suscripción para destacar frente a otros perfiles.' },
  { q: '¿XPEAK cobra comisión por cada evento cerrado?', a: 'No. El contrato se gestiona directamente entre tu food truck y el organizador, sin intermediación en el pago ni comisión sobre lo que factures.' },
  { q: '¿Qué diferencia hay con Foodtruckya?', a: 'Foodtruckya es una plataforma especializada solo en food trucks, con planes de pago para destacar en su buscador. XPEAK no cobra por visibilidad y además te pone delante de organizadores que buscan otros proveedores para el mismo evento (DJ, staff, fotografía), no solo comida.' },
  { q: '¿Y con Bodas.net?', a: 'En Bodas.net (y su versión para proveedores, Bodas.com) el alta es gratuita, pero pagas para desbloquear el contacto de cada pareja interesada, con paquetes de créditos desde 20€. En XPEAK el contacto es directo desde el primer momento, sin coste por lead.' },
  { q: '¿Necesito tener muchos seguidores en Instagram para que me contraten?', a: 'No. En XPEAK te encuentran por ciudad, tipo de menú y presupuesto, no por número de seguidores. Un perfil completo con fotos reales y precio claro compite igual de bien que uno con mucha audiencia en redes.' },
  { q: '¿Puedo aparecer en varias plataformas a la vez?', a: 'Sí, no son excluyentes. Muchos food trucks combinan XPEAK (gratis, sin comisión) con Instagram y alguna plataforma especializada para maximizar cuántos organizadores les encuentran.' },
];

export default function BlogPlataformasFoodTruck() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde publicar tu food truck para conseguir eventos (2026): comparativa',
    description: 'Comparativa de XPEAK, Foodtruckya, Bodas.net e Instagram para que un food truck consiga bodas y eventos: coste, contacto y cobertura real.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-09-24',
    dateModified: '2026-09-24',
    url: 'https://xpeak.es/blog/donde-publicar-food-truck-eventos',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/donde-publicar-food-truck-eventos' },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: 'Dónde publicar tu food truck para conseguir eventos', item: 'https://xpeak.es/blog/donde-publicar-food-truck-eventos' },
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
        <title>Dónde Publicar tu Food Truck para Conseguir Eventos (2026) | XPEAK</title>
        <meta name="description" content="Comparativa 2026 de XPEAK, Foodtruckya, Bodas.net e Instagram para que tu food truck consiga bodas y eventos: coste real, contacto y cobertura." />
        <meta name="keywords" content="dónde publicar food truck, plataforma food truck eventos, registrar food truck España, conseguir bodas food truck, XPEAK food truck" />
        <link rel="canonical" href="https://xpeak.es/blog/donde-publicar-food-truck-eventos" />
        <meta property="og:title" content="Dónde Publicar tu Food Truck para Conseguir Eventos (2026)" />
        <meta property="og:description" content="Comparativa de XPEAK, Foodtruckya, Bodas.net e Instagram: coste real, contacto y cobertura para food trucks." />
        <meta property="og:url" content="https://xpeak.es/blog/donde-publicar-food-truck-eventos" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dónde Publicar tu Food Truck para Conseguir Eventos (2026)" />
        <meta name="twitter:description" content="Comparativa de XPEAK, Foodtruckya, Bodas.net e Instagram para food trucks. Coste real y cobertura." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <BlogTopCTA href="/auth?mode=register&role=catering" label="Crear mi perfil →" articlePath="/blog/donde-publicar-food-truck-eventos" />

          <p className="text-xs mb-6 font-bold" style={{ color: '#666' }}>
            <a href="/" className="hover:text-[#8A6D0F] transition-colors">XPEAK</a>
            {' '}›{' '}
            <a href="/contratar-catering" className="hover:text-[#8A6D0F] transition-colors">Catering</a>
            {' '}›{' '}
            <span>Plataformas para food trucks 2026</span>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Comparativa</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Dónde publicar tu food truck para conseguir eventos (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: '#555' }}>
            XPEAK · 24 de septiembre de 2026 · 5 min de lectura
          </p>

          <p className="text-base leading-relaxed mb-6" style={{ color: '#222' }}>
            Si tienes un food truck, cada vez más bodas y eventos de empresa lo prefieren al catering tradicional, pero conseguir que te encuentren sigue siendo el cuello de botella. No todas las plataformas donde puedes publicarte funcionan igual: algunas cobran una suscripción para destacar, otras te hacen pagar por cada contacto desbloqueado, y otras no cobran nada. Esta comparativa resume qué paga tu food truck en cada una.
          </p>

          <BlogAnswerBox
            question="¿Dónde publico mi food truck para conseguir eventos en 2026?"
            answer="XPEAK no cobra cuota de visibilidad ni comisión por evento cerrado: publicas tu perfil, tarifa y zona de trabajo gratis, dentro de la categoría Catering. Foodtruckya es especializada en food trucks pero tiene planes de pago para destacar. Bodas.net/Bodas.com es gratis para el alta pero cobra por desbloquear cada contacto de pareja interesada."
          />

          <h2 className="text-xl font-black mb-4">Comparativa: coste y cobertura</h2>
          <p className="text-base mb-5 leading-relaxed" style={{ color: '#222' }}>
            Datos públicos de cada plataforma, revisados en septiembre de 2026:
          </p>
          <div className="overflow-x-auto mb-10 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {['Plataforma', 'Coste para el food truck', 'Contacto', 'Cobertura'].map(h => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: '#333', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p, i) => (
                  <tr key={p.name} style={{ background: p.destacado ? 'rgba(212,175,55,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td className="px-2 sm:px-4 py-3 font-black whitespace-nowrap" style={{ color: p.destacado ? '#D4AF37' : '#111', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      {p.name}{p.destacado && <span className="ml-1.5 text-[0.6rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>propia</span>}
                    </td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: '#222', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{p.coste}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: '#444', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{p.contacto}</td>
                    <td className="px-2 sm:px-4 py-3" style={{ color: '#444', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{p.cobertura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.65rem] mb-10" style={{ color: '#666' }}>
            Datos de coste y cobertura recogidos de la información pública de cada plataforma en septiembre de 2026. Las condiciones pueden cambiar: consulta siempre la fuente oficial antes de decidir.
          </p>

          <BlogEmailCapture variant="presupuestos" intent="general" articlePath="/blog/donde-publicar-food-truck-eventos" />

          <DJResourcesAffiliate role="catering" />

          <h2 className="text-xl font-black mb-4">Qué mirar antes de publicarte en una plataforma</h2>
          <ul className="space-y-3 mb-10">
            {[
              { label: 'Quién paga y cuándo', text: 'Distingue entre plataformas que cobran por aparecer (suscripción), por cada contacto (créditos/leads) o que no cobran nada. Ese coste, tarde o temprano, se refleja en tu margen.' },
              { label: 'Contacto directo o intermediado', text: 'Si tienes que pagar para ver los datos del organizador, cada presupuesto que envías tiene un coste fijo, cierres o no el evento.' },
              { label: 'Con quién compites por visibilidad', text: 'En plataformas especializadas solo en food trucks compites con otros food trucks. En un directorio multi-categoría, el organizador también te ve al buscar DJ o fotógrafo para el mismo evento.' },
              { label: 'Tarifa pública o "pide presupuesto"', text: 'Publicar tu rango de precio filtra de entrada a quien no encaja en tu presupuesto, y evita conversaciones que no van a ningún lado.' },
            ].map(item => (
              <li key={item.label} className="flex gap-3">
                <Star size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
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

          <div className="rounded-2xl overflow-hidden mb-2" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="p-8" style={{ background: 'linear-gradient(135deg,#0e0e14 0%,#181410 100%)', color: '#fff', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  ¿Tienes un food truck?
                </span>
              </div>
              <h2 className="text-xl font-black mb-2 leading-snug">
                Sin cuota de visibilidad, sin comisión
              </h2>
              <p className="text-base mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                A diferencia de otras plataformas, en XPEAK no pagas para aparecer ni por cada contacto. Perfil con tarifa pública, dentro de Catering, visible también para organizadores que buscan otros proveedores para el mismo evento.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {['Sin cuota de visibilidad', 'Sin pago por lead', 'Contacto directo'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: 'rgba(212,175,55,0.8)' }}>
                    <Check size={10} style={{ color: '#D4AF37' }} /> {f}
                  </span>
                ))}
              </div>
              <a href="/auth?mode=register&role=catering"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Crear mi perfil
              </a>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(0,0,0,0.02)' }}>
              <div>
                <p className="text-sm font-black mb-0.5">¿Buscas food truck para tu evento?</p>
                <p className="text-xs" style={{ color: '#333' }}>
                  Directorio con tarifas públicas · Contacto directo sin intermediarios
                </p>
              </div>
              <a href="/contratar-catering"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', whiteSpace: 'nowrap' }}>
                Ver food trucks disponibles →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-black mb-5" style={{ color: '#111' }}>Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/blog/cuanto-cuesta-un-food-truck-para-evento', tag: 'Catering', title: '¿Cuánto cuesta un food truck para tu evento?', desc: 'Precios reales 2026 por formato, persona y ciudad.' },
                { href: '/blog/catering-para-eventos-de-empresa', tag: 'Catering', title: 'Catering para eventos de empresa 2026', desc: 'Formatos, precios por persona y cómo elegir el servicio correcto.' },
                { href: '/blog/mejores-plataformas-contratar-dj-espana', tag: 'DJ', title: 'Mejores plataformas para contratar DJ', desc: 'Comparativa de coste y cobertura entre plataformas.' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="inline-block text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.18)' }}>{p.tag}</span>
                  <p className="text-sm font-black leading-snug mb-1">{p.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <BlogAuthor />
          <BlogShare />
          <DJResourcesAffiliate role="catering" />
        </article>
        <BlogRelatedPosts currentSlug='/blog/donde-publicar-food-truck-eventos' tag='Catering' />
        <FooterPublic />
      </div>
    </>
  );
}
