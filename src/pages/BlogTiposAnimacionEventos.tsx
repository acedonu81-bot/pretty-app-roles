import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tipos de animación para eventos: cuál elegir según el público',
  description: 'Animación infantil, de circo, mimo o team building: qué tipo de animador encaja mejor según el evento y el público al que va dirigido.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/tipos-de-animacion-para-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué tipo de animación funciona mejor en un cumpleaños infantil?', acceptedAnswer: { '@type': 'Answer', text: 'Para niños pequeños (hasta 8 años), lo más habitual es magia sencilla, globoflexia y juegos participativos. Para niños más mayores funcionan bien los talleres y las gymkanas.' } },
    { '@type': 'Question', name: '¿Qué es la animación de circo?', acceptedAnswer: { '@type': 'Answer', text: 'Incluye zancudos, malabaristas, acróbatas y artistas de fuego. Es habitual en eventos corporativos, festivales y bodas que buscan un componente visual llamativo.' } },
    { '@type': 'Question', name: '¿Puedo contratar animación para un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Los formatos más demandados en eventos corporativos son team building dinamizado, animación de circo y mimos o actores de calle para recibir a los invitados.' } },
    { '@type': 'Question', name: '¿Cuánto dura una sesión de animación infantil?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual son sesiones de 60 a 90 minutos, aunque para eventos largos (bodas, comuniones con sobremesa extensa) se puede contratar por bloques de varias horas.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Tipos de animación para eventos', item: 'https://xpeak.es/blog/tipos-de-animacion-para-eventos' },
  ],
};

const TIPOS = [
  { tipo: 'Animación infantil', detalle: 'Magia sencilla, globoflexia, cuentacuentos y juegos participativos. El formato más habitual en cumpleaños y comuniones.' },
  { tipo: 'Animación de circo', detalle: 'Zancudos, malabaristas, acróbatas y artistas de fuego. Aporta un componente visual fuerte, habitual en festivales y bodas.' },
  { tipo: 'Mimo y estatuas humanas', detalle: 'Personajes que interactúan sin hablar, ideales para recibir invitados o ambientar espacios durante eventos corporativos y bodas.' },
  { tipo: 'Team building dinamizado', detalle: 'Juegos y dinámicas de grupo diseñadas para eventos de empresa, con un animador que guía la actividad de principio a fin.' },
];

export default function BlogTiposAnimacionEventos() {
  return (
    <>
      <Helmet>
        <title>Tipos de animación para eventos: cuál elegir (2026) | XPEAK</title>
        <meta name="description" content="Animación infantil, de circo, mimo o team building: qué tipo de animador encaja mejor según el evento y el público." />
        <link rel="canonical" href="https://xpeak.es/blog/tipos-de-animacion-para-eventos" />
        <meta property="og:title" content="Tipos de animación para eventos — XPEAK Blog" />
        <meta property="og:description" content="Qué tipo de animador elegir según el evento y el público objetivo." />
        <meta property="og:url" content="https://xpeak.es/blog/tipos-de-animacion-para-eventos" />
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
            <a href="/auth?mode=register&role=animador" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Animador · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Tipos de animación para eventos</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Infantil, circo, mimo o team building: cada formato encaja con un tipo de evento y público distinto. Así se elige el adecuado.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Formatos de animación</h2>
              <div className="space-y-3">
                {TIPOS.map((t, i) => (
                  <div key={t.tipo} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D4AF37' }}>{t.tipo}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.detalle}</p>
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
              <p className="text-sm font-black mb-2">¿Buscas animador para tu evento?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Compara perfiles verificados y tarifas públicas. Gratis, sin comisión.
              </p>
              <a href="/directorio/animador" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver directorio de animadores →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/tipos-de-animacion-para-eventos' tag='Animador' />
        <FooterPublic />
        <BlogScrollCTA role="general" storageKey="xpeak_scrollcta_tipos_animacion" />
      </div>
    </>
  );
}
