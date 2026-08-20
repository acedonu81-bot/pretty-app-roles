import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Software para organizar eventos: qué debe tener y cómo elegirlo (2026)',
  description: 'Qué funciones debe tener una herramienta de gestión de eventos: directorio de proveedores, contratos, presupuesto y comunicación centralizada.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/software-para-organizar-eventos',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Necesito un software para organizar un solo evento pequeño?', acceptedAnswer: { '@type': 'Answer', text: 'Para un evento único y pequeño (menos de 30 personas), una hoja de cálculo puede ser suficiente. A partir de eventos con 4-5 proveedores distintos, o si organizas eventos de forma recurrente, una herramienta dedicada ahorra tiempo real.' } },
    { '@type': 'Question', name: '¿Qué diferencia hay entre un directorio de proveedores y un software de gestión?', acceptedAnswer: { '@type': 'Answer', text: 'Un directorio solo te ayuda a encontrar proveedores. Un software de gestión completo además centraliza la comunicación, genera contratos, controla el presupuesto y guarda el historial de cada evento organizado.' } },
    { '@type': 'Question', name: '¿Cuánto cuesta un software de gestión de eventos?', acceptedAnswer: { '@type': 'Answer', text: 'Varía mucho: desde herramientas gratuitas con funciones básicas hasta software empresarial de varios cientos de euros al mes para agencias grandes. Para organizadores particulares o empresas medianas, existen opciones gratuitas sin comisión sobre la contratación.' } },
    { '@type': 'Question', name: '¿Sirve lo mismo para bodas que para eventos de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Las necesidades base son las mismas (comparar proveedores, contratar, controlar presupuesto), pero conviene que la herramienta tenga categorías específicas de cada sector: catering y DJ para bodas, staff y producción audiovisual para eventos corporativos.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Software para organizar eventos', item: 'https://xpeak.es/blog/software-para-organizar-eventos' },
  ],
};

export default function BlogSoftwareGestionEventos() {
  return (
    <>
      <Helmet>
        <title>Software para organizar eventos: qué debe tener y cómo elegirlo (2026) | XPEAK</title>
        <meta name="description" content="Qué funciones debe tener una herramienta de gestión de eventos: directorio de proveedores, contratos, presupuesto y comunicación centralizada." />
        <link rel="canonical" href="https://xpeak.es/blog/software-para-organizar-eventos" />
        <meta property="og:title" content="Software para organizar eventos: qué debe tener — XPEAK Blog" />
        <meta property="og:description" content="Cómo elegir una herramienta de gestión de eventos: funciones clave y qué evitar." />
        <meta property="og:url" content="https://xpeak.es/blog/software-para-organizar-eventos" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#0D9488' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=empresario" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0D9488' }}>Organizadores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Software para organizar eventos: qué debe tener y cómo elegirlo</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              No todas las herramientas de "gestión de eventos" hacen lo mismo. Esto es lo que de verdad marca la diferencia entre una app útil y una que añade trabajo extra.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">5 funciones que debe tener sí o sí</h2>
              <div className="space-y-3">
                {[
                  { func: 'Directorio con precios públicos', desc: 'Poder comparar profesionales sin tener que preguntar el precio a cada uno por privado.' },
                  { func: 'Mensajería centralizada', desc: 'Hablar con cada proveedor desde la misma plataforma, con historial por evento — no mezclado con WhatsApp personal.' },
                  { func: 'Contratos digitales', desc: 'Generar y firmar contratos sin depender de plantillas de Word sueltas ni imprimir papel.' },
                  { func: 'Control de presupuesto', desc: 'Ver el gasto acumulado por evento y por partida, no solo la suma final al terminar.' },
                  { func: 'Sin comisión sobre la contratación', desc: 'Que el coste de usar la herramienta no encarezca artificialmente lo que pagas a cada proveedor.' },
                ].map((row, i) => (
                  <div key={row.func} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-black mb-1">{row.func}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{row.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Lo que hay que evitar</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Cuidado con las plataformas que cobran comisión por cada contratación cerrada: ese coste, aunque no lo pagues tú directamente, suele repercutirse en el precio final que ofrece el proveedor. También conviene evitar herramientas genéricas de gestión de proyectos adaptadas a eventos, que no tienen categorías ni flujos específicos del sector (contratos con cláusulas de cancelación típicas del sector, por ejemplo).
              </p>
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

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-sm font-black mb-2">Directorio, contratos y presupuesto en un solo panel</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                XPEAK es gratuito para organizadores, sin comisión sobre la contratación.
              </p>
              <a href="/organizar-eventos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#0D9488,#B8941E)', color: '#000' }}>
                Ver panel de organización →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/software-para-organizar-eventos' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_software_gestion" />
      </div>
    </>
  );
}
