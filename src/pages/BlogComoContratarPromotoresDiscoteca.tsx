import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo contratar promotores para tu discoteca o sala',
  description: 'Guía práctica para salas y discotecas: cómo elegir promotores, qué acuerdo de pago conviene según el tipo de noche y errores comunes al gestionar un equipo de promotores.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/como-contratar-promotores-discoteca',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuántos promotores necesita una discoteca por noche?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del aforo y del tipo de noche. Para una sala mediana, entre 2 y 5 promotores suele ser suficiente en noches normales; eventos grandes o fechas señaladas pueden requerir un equipo más amplio coordinado por un promotor principal.' } },
    { '@type': 'Question', name: '¿Es mejor pagar fijo o a comisión?', acceptedAnswer: { '@type': 'Answer', text: 'El fijo da previsibilidad de coste pero no incentiva traer más público. La comisión incentiva el resultado pero puede disparar el coste en noches muy exitosas. Muchas salas combinan un fijo bajo con comisión por encima de un umbral de entradas.' } },
    { '@type': 'Question', name: '¿Cómo se controla que el promotor cumple con lo acordado?', acceptedAnswer: { '@type': 'Answer', text: 'Llevando un registro claro de la lista asociada a cada promotor (nombre o código identificable en la puerta) y revisando periódicamente el ratio de conversión entre invitados en lista y asistentes reales.' } },
    { '@type': 'Question', name: '¿Qué pasa si un promotor no cumple varias noches seguidas?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es dejar claro desde el principio un mínimo de aportación esperado y revisar el acuerdo si no se cumple de forma sostenida, en vez de esperar a que se acumule el problema durante meses.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo contratar promotores para tu discoteca', item: 'https://xpeak.es/blog/como-contratar-promotores-discoteca' },
  ],
};

const PASOS = [
  { paso: '1. Define el público objetivo de la noche', detalle: 'No es lo mismo un promotor especializado en universitarios que uno con red de contactos de público más adulto o VIP. Elige perfiles alineados con el tipo de evento.' },
  { paso: '2. Decide el modelo de pago', detalle: 'Fijo, comisión por entrada, o un mix de ambos. El modelo debe ser claro y estar por escrito antes de la primera noche.' },
  { paso: '3. Prueba con una noche de menor exigencia', detalle: 'Antes de dar fechas clave (fin de semana grande, evento especial) a un promotor nuevo, es razonable probar su rendimiento en una noche de menor presión.' },
  { paso: '4. Coordina con la puerta desde el primer día', detalle: 'El equipo de acceso debe saber identificar la lista de cada promotor para evitar conflictos y confusiones la noche del evento.' },
];

const ERRORES = [
  { error: 'No dejar el acuerdo de pago por escrito', consecuencia: 'Malentendidos sobre qué se cobra y cuándo, que generan fricción constante con el equipo de promotores.' },
  { error: 'Contratar solo por número de seguidores en redes', consecuencia: 'Seguidores no es lo mismo que red de contactos activa dispuesta a asistir a un evento concreto.' },
  { error: 'No revisar el ratio lista/asistencia real', consecuencia: 'Seguir pagando a un promotor que trae menos gente de la que factura en su lista.' },
];

export default function BlogComoContratarPromotoresDiscoteca() {
  return (
    <>
      <Helmet>
        <title>Cómo contratar promotores para tu discoteca (2026) | XPEAK</title>
        <meta name="description" content="Guía práctica para salas: cómo elegir promotores, qué modelo de pago conviene y errores comunes al gestionar un equipo de promotores." />
        <link rel="canonical" href="https://xpeak.es/blog/como-contratar-promotores-discoteca" />
        <meta property="og:title" content="Cómo contratar promotores para tu discoteca — XPEAK Blog" />
        <meta property="og:description" content="Guía práctica para salas: cómo elegir promotores y qué modelo de pago conviene." />
        <meta property="og:url" content="https://xpeak.es/blog/como-contratar-promotores-discoteca" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Promotores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo contratar promotores para tu discoteca</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Guía para salas y discotecas: cómo elegir perfiles, qué modelo de pago conviene según el tipo de noche y los errores que más fricción generan al gestionar un equipo de promotores.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Pasos para contratar bien</h2>
              <div className="space-y-3">
                {PASOS.map((p, i) => (
                  <div key={p.paso} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D4AF37' }}>{p.paso}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Errores más comunes</h2>
              <div className="space-y-3">
                {ERRORES.map((e, i) => (
                  <div key={e.error} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black mb-1">{e.error}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{e.consecuencia}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">Encuentra promotores verificados para tu sala</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles, tarifas públicas y contacta directamente. Gratis, sin comisión.
              </p>
              <a href="/directorio/promotores" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de promotores →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/como-contratar-promotores-discoteca' tag='Promotores' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_contratar_promotores" />
      </div>
    </>
  );
}
