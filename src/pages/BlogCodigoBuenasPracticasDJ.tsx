import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Código de buenas prácticas del DJ profesional (2026)', description: 'Las normas de conducta profesional que todo DJ de eventos debería seguir, basadas en el decálogo de AEDYP y estándares de asociaciones internacionales como USDJA.', datePublished: '2026-10-06', dateModified: '2026-10-06', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/codigo-buenas-practicas-dj' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Existe un código de buenas prácticas oficial para DJs en España?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. La Asociación Española de DJs y Productores (AEDYP) publica un Decálogo de Buenas Prácticas que cubre uso legal de música, derechos de autor, fiscalidad, respeto entre profesionales y condiciones de trabajo. No es de obligado cumplimiento fuera de sus asociados, pero es la referencia más citada del sector en España.' } },
  { '@type': 'Question', name: '¿Es obligatorio estar asociado a AEDYP para ser DJ profesional?', acceptedAnswer: { '@type': 'Answer', text: 'No. Ejercer de DJ no requiere colegiación ni asociación obligatoria en España. AEDYP es una asociación voluntaria: sus normas son un estándar de referencia del sector, no una exigencia legal para trabajar.' } },
  { '@type': 'Question', name: '¿Qué pasa si un DJ no cumple con las buenas prácticas del sector?', acceptedAnswer: { '@type': 'Answer', text: 'No hay sanción legal directa salvo que se incumplan obligaciones fiscales o de derechos de autor, que sí son exigibles por ley. Pero el incumplimiento de buenas prácticas básicas (puntualidad, trato al cliente, uso de equipo) afecta directamente a la reputación y a las reseñas del profesional.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Código de buenas prácticas del DJ', item: 'https://xpeak.es/blog/codigo-buenas-practicas-dj' }] };

const REGLAS = [
  {
    titulo: 'Usa música con los derechos en regla',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (puntos 1 y 2)',
    detalle: 'El Decálogo de AEDYP establece que todo DJ que reproduzca una obra musical ajena, en privado o en público, debe haberla adquirido legalmente. Esto incluye entender qué derechos tienen las producciones propias y las ajenas, tanto en estudio como en directo.',
  },
  {
    titulo: 'Usa software y equipo en regla',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (punto 4)',
    detalle: 'Software con licencia y equipo propio o alquilado, cuidado y devuelto en condiciones. Llegar a un evento con equipo pirata o mal mantenido no es solo un riesgo legal: es un riesgo de que la actuación falle a mitad de fiesta.',
  },
  {
    titulo: 'Cumple con tus obligaciones fiscales',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (puntos 6 y 7)',
    detalle: 'AEDYP es explícita: "como trabajadores, debemos exigir la declaración legal del trabajo realizado y el pago oficial del mismo". Facturar en regla protege al DJ ante impagos y cancelaciones, y evita la economía sumergida que daña al sector entero.',
  },
  {
    titulo: 'Sé puntual y llega con margen para montar',
    fuente: 'USDJA (United States Disc Jockey Association) y códigos de conducta DJ-cliente',
    detalle: 'Las asociaciones internacionales insisten en el montaje con antelación suficiente, nunca al límite. Llegar justo a la hora de inicio no deja margen de error: un atasco, un fallo técnico o un problema de acceso al local convierte un pequeño imprevisto en un evento arrancando tarde.',
  },
  {
    titulo: 'Comunícate con el cliente antes, durante y después',
    fuente: 'Códigos de conducta DJ-cliente (estándar en asociaciones de EE.UU. y Australia)',
    detalle: 'Responder llamadas y mensajes en un plazo razonable, confirmar detalles del evento con antelación, y respetar la lista de peticiones y canciones prohibidas que haya acordado el cliente. No cambiar de DJ el día del evento sin avisar.',
  },
  {
    titulo: 'Respeta a los demás profesionales del sector',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (punto 5)',
    detalle: '"El socio de AEDYP mantendrá una actitud cívica y de respeto absoluto hacia todos sus compañeros de profesión". Desprestigiar a otro DJ para conseguir un bolo, o hablar mal de la competencia delante del cliente, no es una buena práctica aceptada en ningún código del sector.',
  },
  {
    titulo: 'Trabaja en condiciones físicas y mentales adecuadas',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (puntos 8 y 9)',
    detalle: 'El decálogo pide mantener condiciones de higiene y salubridad apropiadas, y "una actitud seria y profesional, que se realice siempre en unas condiciones mentales correctas". Un DJ no está en condiciones de trabajar si ha consumido alcohol o sustancias antes o durante el servicio.',
  },
  {
    titulo: 'Fírmalo todo por escrito, nunca de palabra',
    fuente: 'Estándar compartido entre AEDYP, USDJA y prácticamente toda asociación del sector',
    detalle: 'Fecha, horario, equipo incluido, precio, señal y condiciones de cancelación, por escrito antes del evento. Es el punto en el que más coinciden todos los códigos consultados: la palabra no protege a nadie cuando algo sale mal.',
  },
  {
    titulo: 'Mantente formado y actualizado',
    fuente: 'AEDYP, Decálogo de Buenas Prácticas (punto 10) y estándares USDJA',
    detalle: 'AEDYP pide a sus socios mantenerse al día de "las novedades tecnológicas para ofrecer servicios eficientes". USDJA, en sus estándares para miembros acreditados, exige participación demostrable en formación continua del sector.',
  },
];

export default function BlogCodigoBuenasPracticasDJ() {
  return (
    <>
      <Helmet>
        <title>Código de buenas prácticas del DJ profesional 2026 | XPEAK</title>
        <meta name="description" content="Las normas de conducta que todo DJ de eventos debería seguir: uso legal de música, fiscalidad, puntualidad y trato al cliente. Basado en el decálogo de AEDYP y estándares internacionales." />
        <link rel="canonical" href="https://xpeak.es/blog/codigo-buenas-practicas-dj" />
        <meta property="og:title" content="Código de buenas prácticas del DJ profesional | XPEAK Blog" />
        <meta property="og:description" content="Normas de conducta profesional para DJs de eventos, basadas en fuentes reales del sector." />
        <meta property="og:url" content="https://xpeak.es/blog/codigo-buenas-practicas-dj" />
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
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Código de buenas prácticas del DJ profesional</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>
              No existe un colegio profesional obligatorio para DJs en España, pero sí hay un estándar de referencia:
              el Decálogo de Buenas Prácticas de la{' '}
              <a href="https://aedyp.es/decalogo/" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37' }}>
                Asociación Española de DJs y Productores (AEDYP)
              </a>, complementado con los estándares de asociaciones internacionales como la{' '}
              <a href="https://www.usdja.org/standards" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37' }}>
                United States Disc Jockey Association (USDJA)
              </a>. Esta guía reúne las 9 normas en las que coinciden.
            </p>
            <time className="text-xs mt-3 block" style={{ color: '#666' }}>6 octubre 2026</time>
            <BlogAnswerBox
              question="¿Qué es el código de buenas prácticas de un DJ?"
              answer="Es el conjunto de normas de conducta profesional que rigen el trabajo de un DJ de eventos: uso legal de música y equipo, cumplimiento fiscal, puntualidad, trato al cliente, respeto entre profesionales y condiciones de trabajo adecuadas. En España, la referencia más citada es el Decálogo de Buenas Prácticas de AEDYP."
            />
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Las 9 normas de un DJ profesional</h2>
              <div className="space-y-3">
                {REGLAS.map((r, i) => (
                  <div key={r.titulo} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start gap-2 mb-1">
                      <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '0.75rem', marginTop: 1 }}>{i + 1}.</span>
                      <p className="text-xs font-bold">{r.titulo}</p>
                    </div>
                    <p className="text-xs pl-4 mb-1.5" style={{ color: '#3d3d4e' }}>{r.detalle}</p>
                    <p className="text-[0.65rem] pl-4 font-bold uppercase tracking-wide" style={{ color: '#9a9a9a' }}>Fuente: {r.fuente}</p>
                  </div>
                ))}
              </div>
            </section>

            <DJResourcesAffiliate role="dj" />

            <BlogEmailCapture variant="plantilla" intent="contratar-dj" articlePath="/blog/codigo-buenas-practicas-dj" />
            <BlogInlineCTA role="dj" variant="upgrade" articlePath="/blog/codigo-buenas-practicas-dj" />

            <section>
              <h2 className="text-lg font-black mb-3">Por qué importa esto si contratas un DJ</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#222' }}>
                Estas normas no son solo para el DJ: son la señal que distingue a un profesional serio de uno que
                improvisa. Un DJ que factura en regla, llega con margen y pone todo por escrito antes del evento es,
                en la práctica, el mismo que cumple el resto del decálogo. Si quieres saber qué debe llevar ese
                acuerdo por escrito, revisa{' '}
                <a href="/blog/contrato-dj-que-debe-incluir" style={{ color: '#D4AF37' }}>qué debe incluir un contrato de DJ</a>{' '}
                y, si vas a cerrar el precio, conviene saber antes{' '}
                <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#D4AF37' }}>cuánto cobra un DJ en España</a>.
              </p>
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
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'DJ', title: 'Contrato para DJ: qué debe incluir 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'DJ', title: 'Cómo conseguir bolos como DJ' },
                  { href: '/blog/dj-para-bodas-vs-discoteca', cat: 'DJ', title: 'DJ bodas vs discoteca: diferencias 2026' },
                  { href: '/blog/10-errores-contratar-dj-boda', cat: 'Guía', title: '10 errores al contratar DJ para tu boda' },
                  { href: '/blog/calculadora-tarifa-dj', cat: 'DJ', title: 'Calculadora de tarifa DJ' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">Contrata DJs verificados en XPEAK</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Perfiles con reseñas reales, contrato digital automático y pago protegido. Sin sorpresas el día del evento.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Buscar DJ en XPEAK →</a>
            </div>
          </div>
</main>
        <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/codigo-buenas-practicas-dj' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_codigo_buenas_practicas_dj" articlePath="/blog/codigo-buenas-practicas-dj" />
      </div>
    </>
  );
}
