import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo gestionar varios proveedores en un mismo evento sin perder el control (2026)',
  description: 'Coordinar DJ, catering, fotógrafo y staff a la vez sin liarte con mensajes cruzados y hojas de cálculo. Sistema práctico para organizadores.',
  datePublished: '2026-07-16',
  dateModified: '2026-07-16',
  author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
  image: 'https://xpeak.es/og-image.jpg',
  url: 'https://xpeak.es/blog/gestionar-varios-proveedores-evento',
};

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuántos proveedores suele tener un evento mediano?', acceptedAnswer: { '@type': 'Answer', text: 'Una boda de 100 invitados suele tener entre 6 y 10 proveedores: catering, DJ o música, fotógrafo, maquillaje, flores, espacio, transporte y a veces animación o photo booth. Un evento de empresa mediano suele tener entre 4 y 6.' } },
    { '@type': 'Question', name: '¿Cómo evitar mensajes duplicados o perdidos entre proveedores?', acceptedAnswer: { '@type': 'Answer', text: 'Centralizando toda la comunicación en un único canal por proveedor (no mezclar WhatsApp personal, email y llamadas para el mismo servicio) y teniendo un documento único con el estado de cada contratación: presupuesto pedido, confirmado, contrato firmado, pagado.' } },
    { '@type': 'Question', name: '¿Merece la pena usar una hoja de cálculo para controlar proveedores?', acceptedAnswer: { '@type': 'Answer', text: 'Es mejor que nada, pero tiene límites: no avisa de plazos, no centraliza contratos y se desactualiza si varias personas la editan. Una herramienta donde presupuesto, contrato y mensajería viven en el mismo sitio evita ese desajuste.' } },
    { '@type': 'Question', name: '¿Cómo controlar el presupuesto total cuando hay muchos proveedores?', acceptedAnswer: { '@type': 'Answer', text: 'Fijando un techo de gasto por partida desde el principio (ver reparto habitual: catering 35-40%, espacio 20-25%, entretenimiento 10-15%, staff 10%) y revisando el acumulado cada vez que confirmas un nuevo proveedor, no solo al final.' } },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Gestionar varios proveedores de un evento', item: 'https://xpeak.es/blog/gestionar-varios-proveedores-evento' },
  ],
};

export default function BlogGestionarVariosProveedoresEvento() {
  return (
    <>
      <Helmet>
        <title>Cómo gestionar varios proveedores en un evento sin perder el control (2026) | XPEAK</title>
        <meta name="description" content="Coordinar DJ, catering, fotógrafo y staff a la vez sin liarte con mensajes cruzados y hojas de cálculo sueltas." />
        <link rel="canonical" href="https://xpeak.es/blog/gestionar-varios-proveedores-evento" />
        <meta property="og:title" content="Cómo gestionar varios proveedores de un evento — XPEAK Blog" />
        <meta property="og:description" content="Sistema práctico para coordinar varios proveedores de un mismo evento sin perder el control." />
        <meta property="og:url" content="https://xpeak.es/blog/gestionar-varios-proveedores-evento" />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Organizadores · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo gestionar varios proveedores en un mismo evento sin perder el control</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Cuantos más proveedores tiene un evento, más fácil es que algo se descoordine: un mensaje sin responder, un pago que no se sabe si se hizo, un horario que cambió y nadie avisó. Así se evita.
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>16 julio 2026</time>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">El problema real: no es el número de proveedores, es la dispersión</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Gestionar 8 proveedores no es difícil en sí mismo. Lo que genera errores es tenerlos repartidos entre WhatsApp, email, notas del móvil y una hoja de cálculo que no siempre está actualizada. Cuando la información vive en cuatro sitios distintos, algo se pierde tarde o temprano.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Un sistema simple: estado por proveedor</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Para cada proveedor, en todo momento debes saber en qué fase está:
              </p>
              <div className="space-y-2">
                {[
                  'Presupuesto solicitado',
                  'Presupuesto recibido y comparado',
                  'Proveedor elegido y contactado',
                  'Contrato enviado',
                  'Contrato firmado y señal pagada',
                  'Confirmado para el día del evento',
                ].map((estado, i) => (
                  <div key={estado} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-xs font-black w-5 shrink-0" style={{ color: '#D4AF37' }}>{i + 1}</span>
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{estado}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>
                Con este estado claro por proveedor, en cualquier momento sabes qué falta por cerrar sin tener que revisar conversaciones antiguas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Un solo lugar, no cuatro</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                La mejora más grande no es un truco de productividad, es reducir el número de sitios donde vive la información. Si el presupuesto, la mensajería y el contrato de cada proveedor están en la misma plataforma, no hace falta cruzar datos entre aplicaciones distintas — y es mucho más difícil que algo se pierda.
              </p>
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
              <p className="text-sm font-black mb-2">Añade varios proveedores a un mismo evento y compáralos juntos</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>
                Con el carrito "Mi evento" de XPEAK contactas a todos tus proveedores con un único mensaje, sin perder el hilo.
              </p>
              <a href="/organizar-eventos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Ver panel de organización →
              </a>
            </div>
          </div>
        </main>

        <BlogRelatedPosts currentSlug='/blog/gestionar-varios-proveedores-evento' tag='Eventos' />
        <FooterPublic />
        <BlogScrollCTA role="empresario" storageKey="xpeak_scrollcta_gestionar_proveedores" />
      </div>
    </>
  );
}
