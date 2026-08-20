import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un saxofonista para eventos y bodas en España 2026',
  description: 'Precios reales de saxofonistas para bodas, cócteles y eventos en España 2026. Tarifas por tipo de actuación y qué incluye el servicio.',
  datePublished: '2026-06-01',
  dateModified: '2026-06-01',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: {
    '@type': 'Organization',
    name: 'XPEAK',
    url: 'https://xpeak.es',
    logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' },
  },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/saxofonista-precio-espana',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cobra un saxofonista para una boda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un saxofonista para boda en España cobra entre 400€ y 1.000€ por servicio completo (ceremonia + cóctel). Si solo se contrata para el cóctel, el rango habitual es 400–700€. Para bodas de alto nivel en grandes ciudades los precios pueden superar los 1.000€ si el músico va acompañado de DJ o backing track profesional.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto dura la actuación de un saxofonista en un cóctel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lo habitual es que un saxofonista actúe entre 60 y 90 minutos en el cóctel, con un pequeño descanso a mitad. Algunos ofrecen sets continuos de hasta 2 horas con backing tracks o acompañamiento de DJ en directo. Más de 2 horas suele conllevar suplemento económico.',
      },
    },
    {
      '@type': 'Question',
      name: '¿El saxofonista lleva su propio equipo de sonido?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende del profesional. La mayoría incluye micrófono para el saxo y altavoz de pequeño formato para espacios de hasta 80–100 personas. Para eventos más grandes, es recomendable contratar sonorización aparte o verificar que el espacio dispone de PA propio. Consúltalo siempre antes de cerrar contrato.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Se puede contratar un saxofonista junto a un DJ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, es una de las combinaciones más populares en bodas y eventos de empresa. El DJ pone la base electrónica o el backing track y el saxofonista improvisa encima en directo. Este formato suele tener un coste de 700–1.500€ dependiendo de la duración y los dos perfiles por separado.',
      },
    },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Saxofonista precio España', item: 'https://xpeak.es/blog/saxofonista-precio-espana' },
  ],
};

const PRECIOS = [
  { tipo: 'Ceremonia civil o religiosa (solo saxo)', precio: '300–500€' },
  { tipo: 'Cóctel (60–90 min)', precio: '400–700€' },
  { tipo: 'Ceremonia + cóctel (paquete boda completo)', precio: '600–1.000€' },
  { tipo: 'Tarifa por hora (para eventos corporativos)', precio: '80–150€/hora' },
  { tipo: 'Saxofonista + DJ en directo (combo)', precio: '700–1.500€' },
  { tipo: 'Gala corporativa o evento premium', precio: '800–1.800€' },
];

export default function BlogSaxofonistaEventosPrecio() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un saxofonista para eventos y bodas en España 2026 | XPEAK</title>
        <meta
          name="description"
          content="Precios reales de saxofonistas para bodas y eventos en España 2026. Tarifas por ceremonia, cóctel y boda completa. Qué incluye y cómo contratar."
        />
        <link rel="canonical" href="https://xpeak.es/blog/saxofonista-precio-espana" />
        <meta property="og:title" content="Cuánto cobra un saxofonista para eventos y bodas en España 2026 — XPEAK Blog" />
        <meta property="og:description" content="Tarifas reales de saxofonistas en España. Ceremonia, cóctel, boda completa y tarifa por hora." />
        <meta property="og:url" content="https://xpeak.es/blog/saxofonista-precio-espana" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#6D28D9' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a
              href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}
            >
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6D28D9' }}>Música · Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Cuánto cobra un saxofonista para eventos y bodas en España 2026
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              El saxofón es uno de los instrumentos más solicitados en bodas y eventos de empresa en España. Su sonido cálido y versátil lo convierte en la opción perfecta para cócteles, ceremonias y galas corporativas. En esta guía encontrarás los precios reales para 2026 y todo lo que necesitas saber antes de contratar.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>1 junio 2026</time>
          </div>

          <div className="space-y-10">
            {/* TIPOS DE ACTUACIÓN */}
            <section>
              <h2 className="text-lg font-black mb-4">Tipos de actuación de un saxofonista</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#222' }}>
                El saxofonista puede integrarse en distintos momentos de un evento. Los más habituales en España son tres: la ceremonia civil o religiosa, el cóctel de bienvenida y la actuación en gala o evento corporativo. Cada formato tiene una duración y una dinámica diferente que afecta directamente al precio.
              </p>
              <div className="space-y-3">
                {[
                  { tipo: 'Ceremonia civil o religiosa', desc: 'El saxofonista ameniza la entrada, el intercambio de anillos y la salida de los novios. Duración habitual: 30–45 minutos. Repertorio suave, baladas y temas instrumentales.' },
                  { tipo: 'Cóctel de bienvenida', desc: 'La actuación más frecuente. El músico toca en directo mientras los invitados picotean. Duración: 60–90 min. Repertorio más dinámico: lounge, jazz, versiones pop instrumentales.' },
                  { tipo: 'Saxofonista + DJ en directo', desc: 'Combinación muy demandada en bodas modernas y eventos de empresa. El DJ pone la base y el saxo improvisa encima. Resultado: sonido electrónico con presencia de instrumento en vivo.' },
                  { tipo: 'Gala corporativa o show', desc: 'Actuación preparada de 30–60 minutos con escenografía, backing tracks y posible vestuario especial. Habitual en cenas de empresa, presentaciones de producto y premios.' },
                ].map((item, i) => (
                  <div
                    key={item.tipo}
                    className="p-4 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <p className="text-xs font-black mb-1">{item.tipo}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PRECIOS */}
            <section>
              <h2 className="text-lg font-black mb-4">Precios de saxofonista por tipo de evento (España 2026)</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div
                    key={row.tipo}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <p className="text-xs font-medium">{row.tipo}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#6D28D9' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>
                Precios orientativos sin IVA para España 2026. Las ciudades grandes (Madrid, Barcelona, Sevilla) suelen ser un 15–25% más caras.
              </p>
            </section>

            {/* QUÉ INCLUYE */}
            <section>
              <h2 className="text-lg font-black mb-4">Qué incluye el precio de un saxofonista</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                En la mayoría de los casos, la tarifa de un saxofonista profesional cubre la actuación en sí, el desplazamiento dentro de un radio razonable (50–80 km del domicilio del músico), el saxo y sus accesorios, y un sistema de amplificación básico para espacios de hasta 80–100 personas.
              </p>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Lo que habitualmente no está incluido: desplazamientos de larga distancia (más de 100 km), alojamiento si el evento requiere pernocta, equipo de sonido para grandes espacios o festivales, y las horas de ensayo previo si el cliente pide un repertorio muy específico.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Antes de firmar contrato, confirma siempre: qué equipo de sonido lleva, cuánto espacio necesita para instalarse, si tiene repertorio definido o acepta peticiones, y si exige señal de reserva (habitualmente 30% del total).
              </p>
            </section>

            {/* CÓMO CONTRATAR */}
            <section>
              <h2 className="text-lg font-black mb-4">Cómo contratar un saxofonista para tu evento</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                El primer paso es definir para qué momento del evento lo necesitas (ceremonia, cóctel, show) y cuántos invitados habrá. Eso determina el tamaño del equipo de sonido necesario y el presupuesto aproximado.
              </p>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Pide siempre un vídeo de actuación real, no solo grabaciones de estudio. La calidad en directo puede variar mucho y es el mejor indicador del nivel del músico. Busca perfiles con reseñas de bodas o eventos similares al tuyo.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#222' }}>
                Reserva con al menos 3–4 meses de antelación para bodas en temporada alta (mayo–junio, septiembre–octubre). Para eventos de empresa con menos urgencia en la fecha, 4–6 semanas suelen ser suficientes.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div
                    key={f.name}
                    className="p-5 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ARTÍCULOS RELACIONADOS */}
            <section>
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/musica-para-bodas-guia', cat: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026' },
                  { href: '/eventos-empresa', cat: 'Hub', title: 'Contratar profesionales para eventos de empresa' },
                  { href: '/blog/mago-precio-eventos-espana', cat: 'Entretenimiento', title: 'Cuánto cobra un mago para eventos 2026' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}
                  >
                    <span
                      className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
                      style={{ background: 'rgba(109,40,217,0.1)', color: '#6D28D9', border: '1px solid rgba(109,40,217,0.15)' }}
                    >
                      {link.cat}
                    </span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* CTA FINAL */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{ background: 'rgba(109,40,217,0.04)', border: '1px solid rgba(109,40,217,0.12)' }}
            >
              <p className="text-sm font-black mb-2">Ver saxofonistas disponibles en tu zona</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                XPEAK tiene músicos verificados con vídeos reales de actuación. Solicita presupuesto gratis y recibe propuestas en 24h.
              </p>
              <a
                href="/directorio/grupo-musical"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#6D28D9,#B8941E)', color: '#000' }}
              >
                Ver saxofonistas disponibles →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/saxofonista-precio-espana' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_saxofonista_eventos_precio" />
      </div>
    </>
  );
}
