import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogTopCTA from '@/components/BlogTopCTA';

const slug = 'como-contratar-un-dj';
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Con cuánta antelación debo contratar un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Para bodas, reserva el DJ con 8-12 meses de antelación. Para eventos corporativos o fiestas privadas, 1-3 meses es suficiente. Los sábados de mayo, junio, septiembre y octubre se agotan muy rápido.' } },
  { '@type': 'Question', name: '¿Qué preguntas hacerle a un DJ antes de contratarlo?', acceptedAnswer: { '@type': 'Answer', text: '1) ¿Tienes experiencia en este tipo de evento? 2) ¿Qué equipo llevas incluido? 3) ¿Cuál es tu política de cancelación? 4) ¿Tienes seguro de responsabilidad civil? 5) ¿Puedes hacer una sesión de prueba o tienes mixes de referencia?' } },
  { '@type': 'Question', name: '¿Qué diferencia hay entre un DJ de bodas y un DJ de discoteca?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ de bodas sabe gestionar el flujo emocional del evento: música de ceremonia, ambiente de cóctel, cena y pista de baile para distintas generaciones. Un DJ de discoteca está especializado en una sola noche de baile continuo. Para bodas, necesitas un perfil mixto con experiencia de eventos.' } },
  { '@type': 'Question', name: '¿Qué incluye el precio de un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'El precio estándar incluye: equipo de sonido (altavoces, CDJs o controlador, micro), sesión completa según horas acordadas y desplazamiento hasta cierta distancia. No suele incluir: iluminación extra, fotocabina, percusionista en directo, equipo adicional o desplazamiento largo.' } },
] };

const PASOS = [
  { n: '1', t: 'Define el tipo de evento y presupuesto', d: 'Boda, cumpleaños, fiesta de empresa o evento público tienen necesidades muy distintas. Un DJ de boda cuesta 600-1.800€; uno para una fiesta privada, 300-700€.' },
  { n: '2', t: 'Busca referencias y escucha mixes', d: 'Pide que te envíen grabaciones de actuaciones anteriores similares a tu evento. Un DJ de bodas debe mostrar cómo gestiona la transición de ambient a pista de baile.' },
  { n: '3', t: 'Compara 3 presupuestos', d: 'No te quedes con el primero. Pide al menos 3 presupuestos con el mismo briefing (fecha, tipo de evento, horas, equipo requerido) para comparar en igualdad.' },
  { n: '4', t: 'Verifica el equipo incluido', d: 'Pregunta exactamente qué trae: CDJs o controlador, altavoces (marca y potencia), subwoofer, luces, micro inalámbrico. El equipo marca una diferencia enorme en el resultado.' },
  { n: '5', t: 'Firma un contrato con cláusulas de cancelación', d: 'Nunca contrates sin contrato. Debe incluir señal (30-50%), cláusula de cancelación, equipo detallado, hora de inicio y fin, y precio cerrado.' },
  { n: '6', t: 'Reunión previa al evento', d: 'Con 1-2 semanas de antelación, reúnete (presencial o videollamada) para hablar de la playlist, canciones prohibidas, momentos especiales y logística del venue.' },
];

export default function BlogComoContratarDJ() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Cómo contratar un DJ para tu evento: guía completa 2026",
    description: "Guía paso a paso para contratar un DJ en España. Qué preguntar, qué incluye el precio, cómo comparar presupuestos y qué contrato firmar. 2026.",
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-06-07',
    url: "https://xpeak.es/blog/como-contratar-un-dj",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/como-contratar-un-dj" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "Cómo contratar un DJ para tu evento: guía completa 2026", item: "https://xpeak.es/blog/como-contratar-un-dj" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Cómo contratar un DJ para tu evento: guía completa 2026 | XPEAK</title>
        <meta name="description" content="Guía paso a paso para contratar un DJ en España. Qué preguntar, qué incluye el precio, cómo comparar presupuestos y qué contrato firmar. 2026." />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content="Cómo contratar un DJ: guía completa 2026 — XPEAK" />
        <meta property="og:description" content="6 pasos para contratar el DJ perfecto para tu evento. Preguntas clave, precios y qué contrato firmar." />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'HowTo', name: 'Cómo contratar un DJ', step: PASOS.map(p => ({ '@type': 'HowToStep', position: parseInt(p.n), name: p.t, text: p.d })) })}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Guía · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Cómo contratar un DJ para tu evento: guía completa 2026</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>Contratar un DJ parece sencillo pero hay muchas variables que pueden arruinar tu evento si no las controlas. Esta guía te explica los 6 pasos exactos, qué preguntar y qué errores evitar.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>6 junio 2026</time>
          </div>

          <DJResourcesAffiliate role="dj" />

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Los 6 pasos para contratar un DJ</h2>
              <div className="space-y-4">
                {PASOS.map(p => (
                  <div key={p.n} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-black shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>{p.n}</span>
                      <div>
                        <p className="text-sm font-black mb-1">{p.t}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <BlogInlineCTA role="dj" variant="upgrade" />

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'DJ', title: 'Contrato para DJ: qué debe incluir' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa 2026' },
                  { href: '/plantilla-contrato-dj', cat: 'Recurso', title: 'Plantilla contrato DJ gratis — descarga Word' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Listo para contratar tu DJ?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Recibe 3 presupuestos de DJs verificados en 24h. Gratis y sin compromiso.</p>
              <a href="/auth?mode=register&intent=contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Solicitar presupuestos gratis →
              </a>
            </div>
          </div>
        </main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/como-contratar-un-dj' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_como_contratar_dj" />
      </div>
    </>
  );
}
