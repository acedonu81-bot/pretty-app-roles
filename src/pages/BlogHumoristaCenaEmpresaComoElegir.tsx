import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo elegir humorista para la cena de empresa',
  description: 'Qué preguntar antes de contratar un humorista para un evento corporativo: tono del humor, personalización del guion y duración recomendada.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/humorista-cena-empresa-como-elegir',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué tono de humor es adecuado para una cena de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de la cultura de la empresa y de si asisten directivos o clientes externos. Es buena práctica pedir al humorista ver un vídeo de una actuación similar antes de confirmar, para valorar si el tono encaja.' } },
    { '@type': 'Question', name: '¿Qué información debo darle al humorista antes del evento?', acceptedAnswer: { '@type': 'Answer', text: 'El sector de la empresa, anécdotas internas conocidas por todos, nombres de personas que se puedan mencionar (con su consentimiento) y cualquier tema sensible que se deba evitar.' } },
    { '@type': 'Question', name: '¿Cuánto debe durar el show para no hacerse largo?', acceptedAnswer: { '@type': 'Answer', text: 'Para cenas de empresa, 20-30 minutos suele ser la duración óptima: suficiente para generar el efecto pero sin agotar la atención del público tras la cena.' } },
    { '@type': 'Question', name: '¿Puedo pedir que el humorista no mencione ciertos temas?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, es recomendable acordar de antemano qué temas están fuera de guión (política, situaciones internas delicadas, personas concretas) para evitar sorpresas el día del evento.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cómo elegir humorista para la cena de empresa', item: 'https://xpeak.es/blog/humorista-cena-empresa-como-elegir' },
  ],
};

const PASOS = [
  { paso: '1. Define el tono adecuado', detalle: 'Un humor más contenido para eventos con clientes externos o directivos; más desenfadado si es una cena solo de equipo interno.' },
  { paso: '2. Pide referencias en vídeo', detalle: 'Ver una actuación anterior similar ayuda a confirmar que el estilo de humor encaja con la cultura de la empresa.' },
  { paso: '3. Facilita contexto para personalizar', detalle: 'Sector, anécdotas conocidas por todos y nombres que se puedan mencionar hacen que el show conecte mucho mejor con el público.' },
  { paso: '4. Acuerda los límites del guion', detalle: 'Deja claro de antemano qué temas evitar para que no haya sorpresas incómodas delante de todo el equipo.' },
];

export default function BlogHumoristaCenaEmpresaComoElegir() {
  return (
    <>
      <Helmet>
        <title>Cómo elegir humorista para la cena de empresa (2026) | XPEAK</title>
        <meta name="description" content="Qué preguntar antes de contratar un humorista para un evento corporativo: tono, personalización y duración recomendada." />
        <link rel="canonical" href="https://xpeak.es/blog/humorista-cena-empresa-como-elegir" />
        <meta property="og:title" content="Cómo elegir humorista para la cena de empresa — XPEAK Blog" />
        <meta property="og:description" content="Qué preguntar antes de contratar un humorista para tu evento corporativo." />
        <meta property="og:url" content="https://xpeak.es/blog/humorista-cena-empresa-como-elegir" />
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
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D97706,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D97706' }}>Humorista · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo elegir humorista para la cena de empresa</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              Tono, personalización del guion y duración: los detalles que marcan la diferencia entre un show que conecta y uno que no encaja con el público.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Pasos para elegir bien</h2>
              <div className="space-y-3">
                {PASOS.map((p, i) => (
                  <div key={p.paso} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D97706' }}>{p.paso}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.detalle}</p>
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
              <p className="text-sm font-black mb-2">¿Buscas humorista para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/humorista" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D97706,#B8941E)', color: '#000' }}>
                Ver directorio de humoristas →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/humorista-cena-empresa-como-elegir' tag='Humorista' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_humorista_cena_empresa" />
      </div>
    </>
  );
}
