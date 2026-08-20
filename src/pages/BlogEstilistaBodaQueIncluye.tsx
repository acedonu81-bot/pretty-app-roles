import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Estilista de boda: qué incluye el servicio y cuándo contratarlo',
  description: 'Qué hace un estilista de boda, con cuánta antelación contratarlo y qué diferencia hay entre asesoramiento de imagen y personal shopper.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/estilista-de-boda-que-incluye',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Con cuánta antelación hay que contratar al estilista de boda?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es contactar con el estilista entre 3 y 6 meses antes de la boda, sobre todo si el servicio incluye búsqueda y prueba de vestido o traje, que requiere varias visitas previas.' } },
    { '@type': 'Question', name: '¿El estilista acompaña a comprar el vestido o el traje?', acceptedAnswer: { '@type': 'Answer', text: 'Muchos servicios de estilismo integral incluyen acompañamiento a tiendas para elegir vestido, traje y complementos, además del asesoramiento de imagen general para toda la ceremonia.' } },
    { '@type': 'Question', name: '¿Qué incluye el estilismo del séquito (padrinos, damas de honor)?', acceptedAnswer: { '@type': 'Answer', text: 'Suele incluir coordinación de colores y estilos entre todo el grupo, para que el conjunto sea armónico sin que cada persona vaya por libre, además de recomendaciones individuales según el tipo de cuerpo.' } },
    { '@type': 'Question', name: '¿Se puede contratar solo para el día de la boda?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, hay estilistas que ofrecen solo ajustes de última hora el día del evento (revisar el ajuste del vestido, retoques de última hora) sin el proceso completo de asesoramiento previo.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Estilista de boda: qué incluye', item: 'https://xpeak.es/blog/estilista-de-boda-que-incluye' },
  ],
};

const SERVICIOS = [
  { servicio: 'Asesoramiento de imagen', detalle: 'Recomendaciones de estilo, colores y siluetas adaptadas al tipo de cuerpo y al estilo de la boda.' },
  { servicio: 'Acompañamiento en compras', detalle: 'El estilista acude a las pruebas de vestido/traje y ayuda a decidir entre las opciones de la tienda.' },
  { servicio: 'Coordinación del séquito', detalle: 'Armoniza colores y estilos entre padrinos, damas de honor y demás acompañantes principales.' },
  { servicio: 'Ajustes el día del evento', detalle: 'Retoques de última hora: planchado, ajustes de tela, solución de imprevistos con el vestuario.' },
];

export default function BlogEstilistaBodaQueIncluye() {
  return (
    <>
      <Helmet>
        <title>Estilista de boda: qué incluye el servicio (2026) | XPEAK</title>
        <meta name="description" content="Qué hace un estilista de boda, con cuánta antelación contratarlo y qué diferencia hay entre asesoramiento y personal shopper." />
        <link rel="canonical" href="https://xpeak.es/blog/estilista-de-boda-que-incluye" />
        <meta property="og:title" content="Estilista de boda: qué incluye el servicio — XPEAK Blog" />
        <meta property="og:description" content="Qué hace un estilista de boda y con cuánta antelación contratarlo." />
        <meta property="og:url" content="https://xpeak.es/blog/estilista-de-boda-que-incluye" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#BE185D' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=vestuario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#BE185D,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#BE185D' }}>Vestuario · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Estilista de boda: qué incluye el servicio</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Desde el asesoramiento de imagen hasta los ajustes de última hora: así se reparten en la práctica los servicios de un estilista de boda.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Qué puede incluir el servicio</h2>
              <div className="space-y-3">
                {SERVICIOS.map((s, i) => (
                  <div key={s.servicio} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#BE185D' }}>{s.servicio}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{s.detalle}</p>
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

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(190,24,93,0.04)', border: '1px solid rgba(190,24,93,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas estilista para tu boda?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/vestuario" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#BE185D,#B8941E)', color: '#000' }}>
                Ver directorio de estilistas →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/estilista-de-boda-que-incluye' tag='Vestuario' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_estilista_boda" />
      </div>
    </>
  );
}
