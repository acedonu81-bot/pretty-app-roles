import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogTopCTA from '@/components/BlogTopCTA';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Contrato para DJ: qué debe incluir y cómo redactarlo (2026)', description: 'Guía completa sobre qué cláusulas debe tener un contrato de DJ para eventos. Checklist legal, errores frecuentes y cómo protegerte antes del evento.', datePublished: '2026-05-27', dateModified: '2026-05-27', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/contrato-dj-que-debe-incluir' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Es obligatorio hacer un contrato con el DJ?', acceptedAnswer: { '@type': 'Answer', text: 'No es obligatorio legalmente, pero sí es muy recomendable. Un contrato protege a ambas partes: al organizador le garantiza que el DJ cumple lo acordado, y al DJ le protege ante cancelaciones de última hora. Sin contrato, cualquier incumplimiento es mucho más difícil de reclamar.' } },
  { '@type': 'Question', name: '¿Qué señal o anticipo se paga al contratar un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es pagar una señal del 30-50% del caché total al firmar el contrato, y el resto 48-72 horas antes del evento o al terminar la actuación. La señal sirve para reservar la fecha y cubre los costes de preparación del DJ.' } },
  { '@type': 'Question', name: '¿Qué pasa si tengo que cancelar la actuación del DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Depende de lo que diga el contrato. Lo estándar en España: cancelación con más de 30 días de antelación — sin coste o pérdida de la señal. Entre 15 y 30 días — 50% del caché. Menos de 15 días — 100% del caché. Siempre debe estar especificado en el contrato antes de firmar.' } },
  { '@type': 'Question', name: '¿El contrato debe incluir el IVA e IRPF?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Si el DJ actúa como autónomo, debe emitir factura con IVA al 21% y retención de IRPF al 15% (o 7% si es su primer año). El precio del contrato debe especificar si es antes o después de impuestos. XPEAK genera automáticamente el contrato con todos los datos fiscales correctos.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Contrato DJ qué debe incluir', item: 'https://xpeak.es/blog/contrato-dj-que-debe-incluir' }] };

const CLAUSULAS = [
  { clausula: 'Datos de las partes', detalle: 'Nombre completo o razón social, DNI/NIF y domicilio del DJ y del organizador' },
  { clausula: 'Fecha, hora y lugar', detalle: 'Dirección exacta del evento, hora de inicio y hora de fin — incluyendo montaje y desmontaje' },
  { clausula: 'Duración del servicio', detalle: 'Horas exactas de actuación. ¿Qué pasa si el evento se alarga? ¿Hay coste por hora extra?' },
  { clausula: 'Caché total e impuestos', detalle: 'Precio base, IVA (21%) e IRPF (15%). Forma de pago: señal y resto' },
  { clausula: 'Equipo incluido', detalle: 'Lista del material que lleva el DJ: CDJs, altavoces, subwoofer, luces, micro inalámbrico, etc.' },
  { clausula: 'Cláusula de cancelación', detalle: 'Porcentaje del caché según días de antelación: >30 días, 15-30 días, <15 días' },
  { clausula: 'Lista negra / preferencias', detalle: 'Canciones que no se quieren bajo ningún concepto y canciones obligatorias' },
  { clausula: 'Fuerza mayor', detalle: 'Qué pasa si el DJ no puede actuar por causas ajenas: enfermedad, accidente, etc.' },
  { clausula: 'Rider técnico', detalle: 'Requerimientos del DJ: enchufes, espacio de montaje, iluminación, temperatura de la sala' },
];

const ERRORES = [
  { error: 'No especificar las horas de montaje', consecuencia: 'El DJ llega 2h antes y tú pagas por ese tiempo — o no llega con tiempo suficiente y hay retrasos' },
  { error: 'Precio "cerrado" sin especificar IVA', consecuencia: 'Al facturar, el DJ añade el 21% y el precio real sube un 21%' },
  { error: 'No incluir equipo de luces en el contrato', consecuencia: 'El día del evento el DJ llega sin iluminación porque "no estaba acordado"' },
  { error: 'Sin cláusula de horas extra', consecuencia: 'La fiesta se alarga, el DJ para en seco o exige un pago no acordado en el momento' },
  { error: 'Sin cláusula de sustitución', consecuencia: 'El DJ enferma y no hay obligación de buscar reemplazo' },
];

export default function BlogContratoDJ() {
  return (
    <>
      <Helmet>
        <title>Contrato DJ: qué debe incluir 2026 | XPEAK</title>
        <meta name="description" content="Qué cláusulas debe tener un contrato de DJ para eventos. Checklist legal completo, errores frecuentes y cómo protegerte antes de firmar. Guía 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/contrato-dj-que-debe-incluir" />
        <meta property="og:title" content="Contrato DJ: qué debe incluir 2026 — XPEAK Blog" />
        <meta property="og:description" content="Checklist legal para contratos de DJ. Cláusulas obligatorias y errores que cuestan dinero." />
        <meta property="og:url" content="https://xpeak.es/blog/contrato-dj-que-debe-incluir" />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Contrato para DJ: qué debe incluir y cómo redactarlo (2026)</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>Un contrato mal redactado es la causa número uno de conflictos entre DJs y organizadores. Esta guía cubre todas las cláusulas que deben estar y los errores que cuestan dinero.</p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>27 mayo 2026</time>
            <BlogAnswerBox
              question="¿Qué debe incluir un contrato de DJ?"
              answer="Un contrato de DJ debe incluir: fecha, horario y lugar del evento; equipo de sonido e iluminación detallado; precio total y forma de pago con señal (30-50%); cláusula de cancelación para ambas partes; y penalizaciones por retraso o no presentación. Sin estos elementos el contrato no protege a ninguna de las dos partes."
            />
            <picture>
              <source srcSet="/images/blog/contrato-dj-clausulas-modelo.webp" type="image/webp" />
              <img
                src="/images/blog/contrato-dj-clausulas-modelo.jpg"
                alt="Controladora de DJ profesional en evento — modelo de contrato DJ con cláusulas legales 2026"
                className="w-full rounded-xl my-6 object-cover"
                style={{ maxHeight: 320, filter: 'brightness(0.9)' }}
                loading="lazy"
                width={800}
                height={450}
              />
            </picture>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Cláusulas obligatorias en un contrato de DJ</h2>
              <div className="space-y-3">
                {CLAUSULAS.map((c, i) => (
                  <div key={c.clausula} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start gap-2 mb-1">
                      <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '0.75rem', marginTop: 1 }}>{i + 1}.</span>
                      <p className="text-xs font-bold">{c.clausula}</p>
                    </div>
                    <p className="text-xs pl-4" style={{ color: '#3d3d4e' }}>{c.detalle}</p>
                  </div>
                ))}
              </div>
            </section>

            <DJResourcesAffiliate role="dj" />

            <BlogEmailCapture variant="plantilla" intent="contratar-dj" articlePath="/blog/contrato-dj-que-debe-incluir" />
            <BlogInlineCTA role="dj" variant="upgrade" />

            <section>
              <h2 className="text-lg font-black mb-4">Errores frecuentes que cuestan dinero</h2>
              <div className="space-y-3">
                {ERRORES.map((e, i) => (
                  <div key={e.error} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex items-start gap-2 mb-1">
                      <span style={{ color: '#ff5f56', fontWeight: 900, fontSize: '0.75rem', marginTop: 1 }}>✗</span>
                      <p className="text-xs font-bold" style={{ color: '#111' }}>{e.error}</p>
                    </div>
                    <p className="text-xs pl-4" style={{ color: '#444' }}>{e.consecuencia}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">Cómo funciona el contrato digital de XPEAK</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Cuando contratas un DJ a través de XPEAK, el contrato se genera automáticamente con todos los datos fiscales correctos: nombre, NIF, fecha, duración, caché, señal, IVA e IRPF. Ambas partes lo firman digitalmente desde el móvil. Sin PDFs, sin imprimir, sin ir al notario.
                Si quieres una plantilla editable en Word para usar fuera de la plataforma, descarga nuestra{' '}
                <a href="/plantilla-contrato-dj" style={{ color: '#D4AF37' }}>plantilla de contrato DJ gratis</a>.
                Antes de firmar cualquier contrato, asegúrate de conocer{' '}
                <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#D4AF37' }}>cuánto cobra un DJ en España</a>{' '}
                para no pagar de más.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { paso: '1. Solicita', desc: 'Envías la oferta al DJ. El sistema genera el contrato automáticamente.' },
                  { paso: '2. Firma digital', desc: 'Ambas partes firman desde el móvil. Queda registro con fecha y hora.' },
                  { paso: '3. Pago protegido', desc: 'La señal queda retenida hasta el evento. Si algo falla, está cubierto.' },
                ].map(p => (
                  <div key={p.paso} className="p-4 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D4AF37' }}>{p.paso}</p>
                    <p className="text-xs" style={{ color: '#333' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 mb-8">
              <h2 className="text-base font-black mb-3">Contratar DJ por ciudad</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'DJ Madrid', href: '/contratar-dj/madrid' },
                  { label: 'DJ Barcelona', href: '/contratar-dj/barcelona' },
                  { label: 'DJ Valencia', href: '/contratar-dj/valencia' },
                  { label: 'DJ Sevilla', href: '/contratar-dj/sevilla' },
                  { label: 'DJ Ibiza', href: '/contratar-dj/ibiza' },
                  { label: 'DJ Málaga', href: '/contratar-dj/malaga' },
                ].map(c => (
                  <a key={c.href} href={c.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                    {c.label}
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/10-errores-contratar-dj-boda', cat: 'Guía', title: '10 errores al contratar DJ para tu boda' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/dj-para-bodas-vs-discoteca', cat: 'DJ', title: 'DJ bodas vs discoteca: diferencias 2026' },
                  { href: '/blog/musica-para-bodas-guia', cat: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026' },
                  { href: '/blog/dj-boda-civil-precio-canciones', cat: 'Bodas', title: 'DJ boda civil: precio y canciones 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">Contrata con contrato digital automático</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>En XPEAK el contrato se genera solo: fechas, precio, IVA, IRPF y cláusulas de cancelación. Firma digital desde el móvil. Sin papeleo.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Contratar DJ con contrato digital →</a>
            </div>
          </div>
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/contrato-dj-que-debe-incluir' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_contrato_dj" />
      </div>
    </>
  );
}
