import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cuánto cobra un promotor o RRPP en España (2026)',
  description: 'Precios reales de promotores y RRPP en España: tarifa por noche, comisión por entrada vendida y diferencias entre ciudades y tipo de sala.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/cuanto-cobra-un-promotor-rrpp',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Un promotor cobra fijo o a comisión?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del acuerdo con la sala. Los dos modelos más habituales son tarifa fija por noche (independientemente del público que traiga) y comisión por entrada vendida a través de su lista. Algunos promotores combinan ambos: una base fija más un incentivo por volumen.' } },
    { '@type': 'Question', name: '¿Cuánto cobra un promotor en una discoteca de ciudad mediana?', acceptedAnswer: { '@type': 'Answer', text: 'En ciudades medianas la tarifa fija suele moverse entre 40€ y 100€ por noche, más comisión variable si trabaja con lista de invitados o entrada con consumición.' } },
    { '@type': 'Question', name: '¿Cambia el precio entre temporada alta y baja?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. En zonas de costa y destinos de fiesta, la tarifa en temporada alta (junio-septiembre) puede subir un 30-50% respecto a temporada baja, por la mayor exigencia de captación de público y las noches consecutivas de trabajo.' } },
    { '@type': 'Question', name: '¿El promotor incluye gestión de redes sociales en su tarifa?', acceptedAnswer: { '@type': 'Answer', text: 'No siempre. Es un servicio adicional que algunos promotores ofrecen (creación de contenido, stories, difusión del evento) y que suele tener un coste aparte del trabajo de sala. Conviene preguntarlo explícitamente antes de cerrar el acuerdo.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuánto cobra un promotor o RRPP', item: 'https://xpeak.es/blog/cuanto-cobra-un-promotor-rrpp' },
  ],
};

const PRECIOS = [
  { concepto: 'Tarifa fija por noche (ciudad mediana)', precio: '40€ – 100€' },
  { concepto: 'Tarifa fija por noche (gran ciudad / temporada alta)', precio: '80€ – 200€' },
  { concepto: 'Comisión por entrada vendida', precio: '1€ – 5€ / entrada' },
  { concepto: 'Gestión de redes sociales (adicional)', precio: '50€ – 150€ / mes' },
];

const FACTORES = [
  { factor: 'Red de contactos', detalle: 'Cuantas más personas puede movilizar el promotor de forma recurrente, mayor es su tarifa o su peso en la comisión.' },
  { factor: 'Ciudad y temporada', detalle: 'Destinos de costa en temporada alta pagan más que ciudades del interior en temporada baja.' },
  { factor: 'Tipo de sala', detalle: 'Clubs grandes o de marca reconocida suelen pagar tarifas fijas más altas que salas pequeñas, que trabajan más a comisión.' },
  { factor: 'Servicios adicionales', detalle: 'Gestión de prensa, contenido para redes o coordinación de otros promotores incrementan la tarifa base.' },
];

export default function BlogCuantoCobraPromotorRRPP() {
  return (
    <>
      <Helmet>
        <title>Cuánto cobra un promotor o RRPP en España (2026) | XPEAK</title>
        <meta name="description" content="Precios reales de promotores y RRPP en España: tarifa por noche, comisión por entrada vendida y qué factores cambian el precio." />
        <link rel="canonical" href="https://xpeak.es/blog/cuanto-cobra-un-promotor-rrpp" />
        <meta property="og:title" content="Cuánto cobra un promotor o RRPP en España — XPEAK Blog" />
        <meta property="og:description" content="Tarifas reales: fijo por noche, comisión por entrada y factores que cambian el precio." />
        <meta property="og:url" content="https://xpeak.es/blog/cuanto-cobra-un-promotor-rrpp" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D97706' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=promotor" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D97706,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D97706' }}>Promotores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cuánto cobra un promotor o RRPP en España</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Tarifa fija, comisión por entrada o ambas: así se paga el trabajo de promotor en clubs y eventos, con precios reales y qué factores hacen subir o bajar el precio.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Precios orientativos</h2>
              <div className="space-y-2">
                {PRECIOS.map((row, i) => (
                  <div key={row.concepto} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-medium">{row.concepto}</p>
                    <span className="text-xs font-black ml-4 shrink-0" style={{ color: '#D97706' }}>{row.precio}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Qué hace subir o bajar el precio</h2>
              <div className="space-y-3">
                {FACTORES.map((f, i) => (
                  <div key={f.factor} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1">{f.factor}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map((f) => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-2">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(217,119,6,0.04)', border: '1px solid rgba(217,119,6,0.12)' }}>
              <p className="text-sm font-black mb-2">Publica tu tarifa como promotor</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Crea tu perfil verificado en XPEAK y consigue que salas y organizadores te contacten directamente. Gratis, sin comisión.
              </p>
              <a href="/auth?mode=register&role=promotor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D97706,#B8941E)', color: '#000' }}>
                Publicar mi perfil →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/cuanto-cobra-un-promotor-rrpp' tag='Promotores' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_promotor_precio" />
      </div>
    </>
  );
}
