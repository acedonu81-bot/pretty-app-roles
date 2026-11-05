import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import WarmUpAcademyBanner from '@/components/WarmUpAcademyBanner';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogPrimerPaso from '@/components/BlogPrimerPaso';
import CalculadoraBoloNeto from '@/components/CalculadoraBoloNeto';
import { usePrecioReal } from '@/lib/precioReal';

// La URL se queda con "bolos" para no mover nada, pero nadie busca así: la gente
// escribe "trabajo de DJ" (Search Console, 5 nov 2026: 0 impresiones con "bolos").
const PATH = '/blog/como-conseguir-bolos-dj';
const TITULO = 'Cómo encontrar trabajo de DJ en España: dónde se contrata de verdad';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: TITULO, description: 'Salas, eventos privados y promotoras: los tres mercados donde se contrata a un DJ en España, cómo entra uno en cada uno, cuánto te queda por bolo y un plan de 30 días.', datePublished: '2026-06-02', dateModified: '2026-11-05', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: `https://xpeak.es${PATH}` };

const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Dónde se busca trabajo de DJ en España?', acceptedAnswer: { '@type': 'Answer', text: 'Hay tres sitios distintos. En salas y bares, escribiendo al programador o al dueño del local con un mix y yendo en persona. En eventos privados (bodas, comuniones, cumpleaños, empresas), siendo fácil de encontrar en Google, Instagram o plataformas como XPEAK y estando en la lista de proveedores de wedding planners, fincas y catering. En promotoras y festivales, por recomendación y con público demostrable. Para un primer bolo pagado, los eventos privados suelen ser el camino más corto.' } },
  { '@type': 'Question', name: '¿Necesito experiencia para empezar a trabajar de DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Para cumpleaños, comuniones y fiestas privadas pequeñas no hace falta un currículum largo, pero sí un escaparate: un mix de 30 a 45 minutos, un vídeo corto en una pista real y tu tarifa a la vista. Las salas valoran sobre todo que no la líes: puntualidad, ajustar el estilo a la noche y no vaciar la pista.' } },
  { '@type': 'Question', name: '¿Cuánto tardo en conseguir mi primer bolo pagado?', acceptedAnswer: { '@type': 'Answer', text: 'No hay un plazo garantizado: depende de tu ciudad, del mercado que elijas y de lo preparado que tengas el escaparate. Lo que sí se puede decir es que con perfil, mix, vídeo y tarifa listos y contactando cada semana, los eventos privados pequeños suelen responder antes que las salas.' } },
  { '@type': 'Question', name: '¿Tengo que ser autónomo para cobrar como DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Si cobras de forma habitual, sí: tienes que darte de alta en Hacienda y en la Seguridad Social y emitir factura. Las empresas y muchos organizadores no contratan sin factura. Tienes el paso a paso en nuestra guía de cómo darse de alta como DJ.' } },
  { '@type': 'Question', name: '¿Cuánto cobra un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del tipo de evento, las horas, el equipo y la ciudad, así que ninguna cifra única es fiable. En XPEAK cada DJ publica su tarifa en su perfil y en este artículo se muestra el rango real de los DJs que ya la han puesto. Antes de fijar la tuya, calcula cuánto te queda de cada bolo después de la cuota de autónomo y el IRPF.' } },
  { '@type': 'Question', name: '¿Sirve de algo tener perfil en una plataforma como XPEAK?', acceptedAnswer: { '@type': 'Answer', text: 'En XPEAK tu perfil reúne tus sets, fotos, reseñas y tarifa en un solo enlace, y quien organiza un evento puede encontrarte y pedirte presupuesto con contrato digital. No sustituye a moverte tú, pero te da un sitio fijo al que mandar a cualquiera que te pregunte.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Trabajo de DJ en España', item: `https://xpeak.es${PATH}` }] };

const MERCADOS = [
  {
    nombre: 'Salas, bares y residencias',
    decide: 'El programador o el dueño del local.',
    entras: 'Con un mix y un mensaje corto, y yendo en persona. Se empieza abriendo la noche.',
    miran: 'Que no la líes: puntualidad, ajustar el estilo, que la pista no se vacíe.',
    cobras: 'Noche cerrada, la paga el local.',
    nivel: 'Medio. La barrera es la confianza, no el equipo.',
  },
  {
    nombre: 'Eventos privados',
    decide: 'Quien organiza: novios, familia, la persona de empresa o el wedding planner.',
    entras: 'Te encuentran en Google, Instagram o una plataforma, o te recomienda un planner, una finca o un catering.',
    miran: 'Fotos y vídeo de eventos reales, reseñas, precio claro, que contestes rápido.',
    cobras: 'Señal al reservar y el resto el día del evento o con factura.',
    nivel: 'El más corto para un primer bolo pagado. Aquí compites con confianza, no solo con precio.',
  },
  {
    nombre: 'Promotoras y festivales',
    decide: 'El promotor o el agente.',
    entras: 'Por recomendación y con tracción que se pueda comprobar: residencias, sets que circulan, público propio.',
    miran: 'El público que traes y un dossier breve con tu trabajo.',
    cobras: 'Caché cerrado, normalmente con factura y a plazo.',
    nivel: 'Alto al empezar. Es un escalón al que se llega, no por el que se empieza.',
  },
];

const SEMANAS = [
  { n: '1', t: 'Deja listo el escaparate', d: 'Un perfil con tu foto, un mix de 30 a 45 minutos, un vídeo de un minuto en una pista con gente y tu tarifa a la vista. Un solo enlace que lo reúna todo. Sin esto, el resto de la semana no sirve de nada.' },
  { n: '2', t: 'Veinte mensajes personales', d: 'Diez a locales de tu ciudad (al programador, con tu enlace, sin adjuntos pesados) y diez a proveedores que ya trabajan con quien organiza: wedding planners, fincas, catering. Una frase sobre ellos y otra sobre ti. Nada de textos largos.' },
  { n: '3', t: 'Abre el mercado pequeño', d: 'Cumpleaños, comuniones y fiestas privadas. Publica tu disponibilidad en tu perfil y en tus redes con una fecha concreta, no con un "disponible para eventos". Contesta cada consulta el mismo día.' },
  { n: '4', t: 'Recoge lo aprendido', d: 'Pide una reseña a cada cliente. Mira qué mensajes recibieron respuesta y cuáles no, y duplica lo que funcionó. Si tu tarifa te hace perder dinero o espanta a todos, ajústala con la calculadora de arriba.' },
];

export default function BlogConseguirBolosDJ() {
  const precio = usePrecioReal(['dj', 'disco-movil']);

  return (
    <>
      <Helmet>
        <title>Trabajo de DJ en España 2026: cómo encontrarlo | XPEAK</title>
        <meta name="description" content="Dónde buscar trabajo de DJ: salas, eventos privados y promotoras. Cómo se contrata en cada mercado, cuánto te queda por bolo y un plan de 30 días." />
        <link rel="canonical" href={`https://xpeak.es${PATH}`} />
        <meta property="og:title" content="Cómo encontrar trabajo de DJ en España (2026) | XPEAK" />
        <meta property="og:description" content="Los tres mercados donde se contrata a un DJ, qué mira cada uno, una calculadora de lo que te queda por bolo y un plan de 30 días." />
        <meta property="og:url" content={`https://xpeak.es${PATH}`} />
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
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register&role=dj" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>Crear perfil DJ</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <header className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8B6A00' }}>Para DJs · XPEAK Blog</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5">Cómo encontrar trabajo de DJ en España: dónde se contrata de verdad</h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: '#3d3d4e' }}>
              Casi todo lo que se lee sobre esto dice lo mismo: sube mixes, mueve redes, sé constante. Vale. ¿Y a quién le escribes mañana por la mañana? Esta guía empieza por ahí. Hay tres mercados distintos, cada uno contrata de una forma, y elegir mal el primero es una de las maneras más comunes de perder meses sin un solo bolo pagado.
            </p>
            <time className="text-xs mt-4 block" style={{ color: '#666' }}>Actualizado el 5 de noviembre de 2026</time>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-black mb-2">Los tres mercados</h2>
              <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>No son tres niveles de lo mismo. Son tres formas distintas de que alguien te contrate.</p>
              <div className="grid gap-4 lg:grid-cols-3">
                {MERCADOS.map((m) => (
                  <article key={m.nombre} className="p-5 rounded-2xl" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
                    <h3 className="text-lg font-black mb-3" style={{ color: '#8B6A00' }}>{m.nombre}</h3>
                    <dl className="space-y-3 text-sm">
                      {([['Quién decide', m.decide], ['Cómo entras', m.entras], ['Qué miran', m.miran], ['Cómo cobras', m.cobras], ['Dificultad', m.nivel]] as const).map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-xs font-bold uppercase tracking-wider" style={{ color: '#3d3d4e' }}>{k}</dt>
                          <dd style={{ color: '#222' }}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
              <p className="text-sm leading-relaxed mt-5 max-w-3xl" style={{ color: '#222' }}>
                <strong>Mi recomendación si empiezas:</strong> los eventos privados primero. Decide una sola persona y está buscando activamente, así que es donde antes se cierra un primer bolo pagado. Las salas, en paralelo, para tocar y crecer. Las promotoras, cuando ya tengas con qué llamar a su puerta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">Lo que mira quien te va a contratar</h2>
              <p className="text-sm mb-5 max-w-3xl" style={{ color: '#3d3d4e' }}>Quien organiza un evento compara varios DJs en pocos minutos. Esto es lo que suele decidir quién se queda y quién no, y casi nadie lo tiene preparado.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Un solo enlace', 'Fotos, un mix, un vídeo y tu tarifa en el mismo sitio. Nadie va a perseguirte por cuatro canales distintos para hacerse una idea.'],
                  ['Un vídeo de un minuto en una pista real', 'Gente bailando, tu cabina, tu sonido. Dice más de ti que media hora de mix sin imagen, y es lo que más se comparte entre familiares y amigos de quien contrata.'],
                  ['Un precio a la vista', 'Quien compara cinco perfiles en diez minutos suele dejar fuera el que no enseña tarifa, por no complicarse. Poner precio te quita consultas que no iban a ninguna parte.'],
                  ['Respuesta el mismo día', 'En eventos privados, el primero que contesta con claridad gana muchas veces. No hace falta ser el más barato, hace falta ser el que no se hace esperar.'],
                ].map(([t, d]) => (
                  <div key={t} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-1.5">{t}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">Cuánto cobran los DJs de XPEAK</h2>
              {precio ? (
                <div className="p-5 rounded-2xl max-w-3xl" style={{ background: '#ECFDF5', border: '2px solid #059669' }}>
                  <p className="text-3xl sm:text-4xl font-black mb-1" style={{ color: '#065F46' }}>{precio.p25} a {precio.p75} €/hora</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#065F46' }}>
                    Es lo que cobra la mitad de los {precio.n} DJs con tarifa publicada en XPEAK. El precio mediano ronda los {precio.tipico} €/hora. Son tarifas que los propios DJs han escrito en su perfil, sin cuentas de prueba ni valores por defecto.
                  </p>
                </div>
              ) : (
                <p className="text-sm max-w-3xl" style={{ color: '#3d3d4e' }}>Todavía no hay bastantes DJs con tarifa publicada para dar un rango fiable. En cuanto los haya, aparecerá aquí con datos reales, no inventados.</p>
              )}
              <p className="text-sm mt-4 max-w-3xl" style={{ color: '#3d3d4e' }}>
                Para ver precios por tipo de evento, mira <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#2563EB', textDecoration: 'underline' }}>cuánto cobra un DJ en España</a>. Para saber cuánto te queda a ti, usa la calculadora.
              </p>
            </section>

            <CalculadoraBoloNeto articlePath={PATH} />

            <section>
              <h2 className="text-2xl font-black mb-2">Plan de 30 días</h2>
              <p className="text-sm mb-5 max-w-3xl" style={{ color: '#3d3d4e' }}>No te prometo un bolo en un mes. Sí que al acabarlo sabrás qué mercado te responde y cuál no, que es lo que de verdad te ahorra meses.</p>
              <ol className="space-y-3">
                {SEMANAS.map((s) => (
                  <li key={s.n} className="flex gap-4 p-5 rounded-2xl" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
                    <span className="text-xs font-black uppercase tracking-wider shrink-0 w-16 pt-1" style={{ color: '#8B6A00' }}>Semana {s.n}</span>
                    <div>
                      <p className="text-base font-black mb-1">{s.t}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">Empieza por el escaparate</h2>
              <p className="text-sm mb-2 max-w-3xl" style={{ color: '#3d3d4e' }}>Si tienes ya tarifa, mira dónde estás frente a otros DJs de XPEAK y crea tu perfil con ella.</p>
              <BlogPrimerPaso rol="dj" articlePath={PATH} soloPro />
            </section>

            <WarmUpAcademyBanner variante="tira" paraDJs origen="blog:como-conseguir-bolos-dj" />

            <section className="p-5 sm:p-6 rounded-2xl" style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.5)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8B6A00' }}>Antes de tu primer bolo cobrado</p>
              <h2 className="text-lg font-black mb-2">¿Ya sabes cómo darte de alta?</h2>
              <p className="text-sm leading-relaxed mb-3 max-w-3xl" style={{ color: '#3d3d4e' }}>Para cobrar de forma habitual necesitas Hacienda, Seguridad Social y facturas. Hay un detalle que casi nadie cuenta: la tarifa plana corre desde el día del alta, así que conviene hacerla en el momento justo.</p>
              <a href="/blog/darse-de-alta-como-dj-autonomo" className="inline-block px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>Cómo darse de alta como DJ →</a>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4">Preguntas frecuentes</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {faqStructured.mainEntity.map(f => (
                  <div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { href: '/blog/darse-de-alta-como-dj-autonomo', cat: 'Guía', title: 'Cómo darse de alta como DJ: autónomo, IAE, IVA y facturas' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-empezar-dj-eventos-principiante', cat: 'DJ', title: 'DJ principiante: cómo empezar en eventos y cuánto cobrar' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'Guía', title: 'Contrato DJ: qué debe incluir 2026' },
                  { href: '/blog/dj-residente-discoteca-precio', cat: 'DJ', title: 'DJ residente de discoteca: precio y contrato 2026' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#8B6A00', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>

            <div className="p-6 sm:p-8 rounded-2xl text-center" style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }}>
              <p className="text-xl font-black mb-2">Tu escaparate, en un solo enlace</p>
              <p className="text-sm mb-5 max-w-xl mx-auto" style={{ color: '#3d3d4e' }}>Crea tu perfil de DJ en XPEAK con tus sets, tus fotos y tu tarifa. Quien organiza un evento te encuentra, te escucha y te pide presupuesto con contrato digital.</p>
              <a href="/auth?mode=register&role=dj" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>Crear mi perfil de DJ →</a>
            </div>
          </div>

          <DJResourcesAffiliate role="dj" />
        </main>
        <BlogAuthor />
        <BlogShare />
        <BlogRelatedPosts currentSlug={PATH} tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj_pro" storageKey="xpeak_scrollcta_conseguir_bolos_dj" articlePath={PATH} />
      </div>
    </>
  );
}
