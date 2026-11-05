import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogPrimerPaso from '@/components/BlogPrimerPaso';
import CalculadoraBoloNeto from '@/components/CalculadoraBoloNeto';

const PATH = '/blog/darse-de-alta-como-dj-autonomo';
const TITULO = 'Cómo darse de alta como DJ en España (2026): autónomo, IAE, IVA y facturas';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: TITULO, description: 'Paso a paso para darte de alta como DJ: Hacienda, Seguridad Social, tarifa plana de 80 euros, IVA, retención de IRPF, qué lleva una factura y cuánto te queda por bolo.', datePublished: '2026-11-05', dateModified: '2026-11-05', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: `https://xpeak.es${PATH}` };

const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Es obligatorio ser autónomo para trabajar de DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Si cobras de forma habitual por pinchar, sí: hay que darse de alta en Hacienda (modelo 036 o 037) y en el Régimen de Autónomos de la Seguridad Social, y emitir factura por cada trabajo. Si es algo puntual y muy esporádico, la situación es distinta y conviene consultarlo con una gestoría antes de cobrar.' } },
  { '@type': 'Question', name: '¿Cuánto se paga de autónomo el primer año?', acceptedAnswer: { '@type': 'Answer', text: 'Con la tarifa plana, 80 euros al mes durante los primeros 12 meses, más un pequeño recargo por el Mecanismo de Equidad Intergeneracional que cambia cada año. Se puede ampliar otros 12 meses si tus ingresos netos son inferiores al salario mínimo. Después cotizas según tus ingresos reales.' } },
  { '@type': 'Question', name: '¿Qué IVA lleva la factura de un DJ?', acceptedAnswer: { '@type': 'Answer', text: 'Lo habitual es el tipo general del 21 %. Hay casos en los que se aplica otro tipo, por ejemplo según quién contrate o el tipo de espectáculo, así que si facturas a una promotora o a una sala confírmalo con tu gestoría la primera vez.' } },
  { '@type': 'Question', name: '¿Tengo que aplicar retención de IRPF en mis facturas?', acceptedAnswer: { '@type': 'Answer', text: 'Cuando facturas a una empresa o a un profesional, normalmente sí: el 15 % con carácter general, y el 7 % durante el año de inicio de la actividad y los dos siguientes. Cuando facturas a un particular no se aplica retención. Las retenciones que te aplican se descuentan después de lo que debes a Hacienda.' } },
  { '@type': 'Question', name: '¿Cuándo hay que presentar los impuestos?', acceptedAnswer: { '@type': 'Answer', text: 'Cada trimestre, el IVA (modelo 303) y el pago fraccionado del IRPF (modelo 130), hasta el día 20 de abril, julio y octubre y hasta el 30 de enero para el cuarto trimestre. Comprueba siempre el calendario vigente en la Agencia Tributaria.' } },
  { '@type': 'Question', name: '¿Cuándo me conviene darme de alta si todavía no tengo bolos?', acceptedAnswer: { '@type': 'Answer', text: 'Cuando tengas el primer trabajo cerrado o a punto de cerrarse. La tarifa plana de 12 meses corre desde la fecha de alta, y no se puede pedir con alta retroactiva, así que darte de alta meses antes de ingresar nada consume meses de tarifa sin ingresos.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'Darse de alta como DJ', item: `https://xpeak.es${PATH}` }] };

const PASOS = [
  { n: '1', t: 'Decide tu actividad', d: 'Hacienda te pide un epígrafe del IAE, que es la etiqueta de lo que haces. Según Infoautónomos, los DJs entran en la sección tercera (actividades artísticas), grupo 039, "otras actividades relacionadas con la música". Otras guías dan códigos distintos, así que confírmalo con tu gestoría o en la sede de la Agencia Tributaria antes de presentar nada.' },
  { n: '2', t: 'Alta en Hacienda', d: 'Con el modelo 036, o con el 037 simplificado si cumples sus condiciones. Se hace en la sede electrónica de la Agencia Tributaria con certificado digital o Cl@ve. Aquí eliges tus obligaciones: IVA, pagos fraccionados de IRPF y retenciones.' },
  { n: '3', t: 'Alta en la Seguridad Social', d: 'En el Régimen de Autónomos (RETA), con el formulario TA.0521. Si quieres la tarifa plana, hay que marcar la casilla de bonificación en esa misma solicitud. Piénsalo antes de enviarla.' },
  { n: '4', t: 'Prepara cómo vas a facturar', d: 'Una serie de numeración correlativa y una plantilla o programa de facturas. Empezar con un Excel desordenado es la manera más rápida de liarte en el primer trimestre.' },
  { n: '5', t: 'Pon el calendario trimestral', d: 'Cuatro veces al año tienes que presentar el IVA y el pago fraccionado del IRPF. Apuntar las fechas el día del alta evita los recargos de los primeros meses.' },
];

const ERRORES = [
  ['Cobrar en mano de forma regular', 'Funciona hasta que contratas con una empresa, una finca o un evento con contrato: todos piden factura. Y si trabajas de forma habitual, te expone a problemas con Hacienda.'],
  ['Gastarte el IVA y el IRPF', 'El 21 % que cobras de IVA no es tuyo, y una parte de lo que ganas tampoco. Aparta ese dinero el mismo día que cobras, en otra cuenta si hace falta.'],
  ['Darte de alta demasiado pronto', 'La tarifa plana de 12 meses empieza a contar el día del alta. Si te das de alta tres meses antes de tu primer bolo, has pagado tres meses sin ingresos.'],
  ['No mirar qué pasará cuando acabe la tarifa plana', 'Después cotizas según tus ingresos reales y la cuota mínima ronda los 200 euros al mes según las guías. Consulta la tabla vigente en la Seguridad Social para tus ingresos y calcula tus tarifas pensando en eso.'],
  ['Cerrar un bolo sin señal ni contrato', 'No es un tema fiscal, pero te protege del cliente que cancela dos días antes. Mira qué debe incluir un contrato de DJ antes de tu primera reserva.'],
];

// Ejemplo ilustrativo con base 500 €, IVA 21 %. Se calcula, no se teclea, para que no se descuadre.
const BASE = 500;
const IVA = BASE * 0.21;
const filas = [
  { cliente: 'Particular (boda, cumpleaños)', ret: 0 },
  { cliente: 'Empresa, año de alta y los 2 siguientes', ret: BASE * 0.07 },
  { cliente: 'Empresa, con carácter general', ret: BASE * 0.15 },
].map(f => ({ ...f, total: BASE + IVA - f.ret }));
const e = (n: number) => `${n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;

export default function BlogDarseDeAltaDJ() {
  return (
    <>
      <Helmet>
        <title>Darse de alta como DJ autónomo 2026: paso a paso | XPEAK</title>
        <meta name="description" content="Cómo darte de alta como DJ: Hacienda, Seguridad Social, tarifa plana de 80 €, IVA, retención de IRPF, qué lleva una factura y cuánto te queda por bolo." />
        <link rel="canonical" href={`https://xpeak.es${PATH}`} />
        <meta property="og:title" content="Cómo darse de alta como DJ en España (2026) | XPEAK" />
        <meta property="og:description" content="Paso a paso con Hacienda y Seguridad Social, tarifa plana, IVA, IRPF, facturas y una calculadora de lo que te queda por bolo." />
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
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5">Cómo darse de alta como DJ en España: autónomo, IAE, IVA y facturas</h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: '#3d3d4e' }}>
              Antes de cobrar tu primer bolo hay un trámite que casi nadie explica con claridad. No es difícil, pero hay un par de decisiones que te cuestan dinero si las tomas mal. Aquí va el recorrido entero, con las cifras de 2026 y las dudas que las guías no resuelven.
            </p>
            <time className="text-xs mt-4 block" style={{ color: '#666' }}>Actualizado el 5 de noviembre de 2026</time>
          </header>

          <div className="space-y-12">
            <section className="p-5 sm:p-6 rounded-2xl" style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8B6A00' }}>En 30 segundos</p>
              <ul className="space-y-2 text-sm sm:text-base" style={{ color: '#222' }}>
                <li><strong>Si cobras de forma habitual, sí:</strong> necesitas alta en Hacienda y en la Seguridad Social, y facturar cada trabajo.</li>
                <li><strong>Tarifa plana:</strong> 80 € al mes durante los primeros 12 meses, más un pequeño recargo del MEI.</li>
                <li><strong>IVA:</strong> lo habitual es el 21 %. Lo cobras al cliente y lo ingresas tú, no es tuyo.</li>
                <li><strong>IRPF:</strong> si facturas a una empresa, retención del 15 %, o del 7 % el año de alta y los dos siguientes. A particulares, sin retención.</li>
                <li><strong>Cada trimestre:</strong> modelo 303 (IVA) y modelo 130 (IRPF). Hasta el 20 de abril, julio y octubre, y el 30 de enero.</li>
                <li><strong>El truco:</strong> date de alta cuando tengas el primer bolo cerrado, no antes. La tarifa plana corre desde el alta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">¿De verdad tengo que ser autónomo?</h2>
              <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: '#222' }}>
                Si pinchas de forma habitual y cobras por ello, sí. Si fue un favor puntual y no lo vas a repetir, es otra conversación, y ahí lo más sensato es preguntarlo a una gestoría antes de cobrar. Lo que no funciona es la zona gris de ir cobrando en mano mes tras mes: las empresas, las fincas y cualquier evento con contrato piden factura, y sin ella te quedas fuera de los clientes que mejor pagan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-5">El alta, paso a paso</h2>
              <ol className="space-y-3">
                {PASOS.map((p) => (
                  <li key={p.n} className="flex gap-4 p-5 rounded-2xl" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
                    <span className="text-3xl font-black shrink-0 leading-none" style={{ color: '#D4AF37' }}>{p.n}</span>
                    <div>
                      <p className="text-base font-black mb-1">{p.t}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">La tarifa plana, con sus condiciones</h2>
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                {[
                  ['80 € al mes', 'Los primeros 12 meses, más un pequeño recargo anual del MEI. Se puede ampliar otros 12 meses si tus ingresos netos son inferiores al salario mínimo.'],
                  ['Quién puede', 'Quien se da de alta por primera vez, o quien lleva al menos 2 años sin ser autónomo (3 si ya disfrutó de la tarifa plana). Hay que estar al corriente con Hacienda y la Seguridad Social.'],
                  ['Cómo se pide', 'Marcando la casilla de bonificación en el TA.0521 al darte de alta. No vale con alta retroactiva, por eso importa elegir bien la fecha.'],
                ].map(([t, d]) => (
                  <div key={t} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-lg font-black mb-1.5" style={{ color: '#8B6A00' }}>{t}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">Una factura, con números</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-5 max-w-3xl" style={{ color: '#222' }}>
                Ejemplo ilustrativo: un bolo de {e(BASE)} más IVA del 21 %. Lo que acaba cobrando el DJ en el banco cambia según quién le contrata.
              </p>
              <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(212,175,55,0.45)' }}>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FBF3DD', textAlign: 'left' }}>
                      <th className="p-3 font-black">Quién contrata</th>
                      <th className="p-3 font-black">Base</th>
                      <th className="p-3 font-black">IVA 21 %</th>
                      <th className="p-3 font-black">Retención IRPF</th>
                      <th className="p-3 font-black">Cobras en el banco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((f) => (
                      <tr key={f.cliente} style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                        <td className="p-3 font-bold">{f.cliente}</td>
                        <td className="p-3">{e(BASE)}</td>
                        <td className="p-3">{e(IVA)}</td>
                        <td className="p-3">{f.ret ? `-${e(f.ret)}` : 'No se aplica'}</td>
                        <td className="p-3 font-black">{e(f.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3 max-w-3xl" style={{ color: '#3d3d4e' }}>
                Del dinero que entra, el IVA ({e(IVA)}) lo ingresas tú a Hacienda cada trimestre, y la retención que te aplican es un adelanto de tu IRPF, no un coste extra. Una factura correcta lleva: número correlativo, fecha, tus datos y tu NIF, los del cliente, la descripción del servicio con fecha y lugar del evento, la base, el IVA, la retención si procede y el total.
              </p>
            </section>

            <CalculadoraBoloNeto articlePath={PATH} />

            <section>
              <h2 className="text-2xl font-black mb-5">Cinco errores que salen caros</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {ERRORES.map(([t, d]) => (
                  <div key={t} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-sm font-black mb-1.5">{t}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">¿Y la SGAE?</h2>
              <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: '#222' }}>
                Cuando pinchas música de otros, la licencia de comunicación pública normalmente la gestiona el local o quien organiza el evento, no tú. Si además publicas música propia, es otro tema y ahí sí puede interesarte asociarte. En caso de duda, pregúntalo al organizador antes del evento.
              </p>
            </section>

            <section className="p-5 sm:p-6 rounded-2xl" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
              <h2 className="text-base font-black mb-2">Dónde confirmarlo</h2>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: '#333' }}>
                Esta guía es orientativa y está al día a noviembre de 2026, pero no es asesoría fiscal. Los datos oficiales están en la <a href="https://sede.agenciatributaria.gob.es" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }}>sede electrónica de la Agencia Tributaria</a> y en la <a href="https://www.seg-social.es" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }}>Seguridad Social</a>. Una gestoría para el alta y la primera declaración suele compensar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-2">Con papeles en regla, falta que te encuentren</h2>
              <p className="text-sm mb-2 max-w-3xl" style={{ color: '#3d3d4e' }}>Mira dónde está tu tarifa frente a otros DJs de XPEAK y crea tu perfil con ella.</p>
              <BlogPrimerPaso rol="dj" articlePath={PATH} soloPro />
              <p className="text-sm mt-3 max-w-3xl" style={{ color: '#3d3d4e' }}>
                Si aún estás buscando dónde conseguir tus primeros trabajos, empieza por <a href="/blog/como-conseguir-bolos-dj" style={{ color: '#2563EB', textDecoration: 'underline' }}>los tres mercados donde se contrata a un DJ</a>.
              </p>
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
                  { href: '/blog/como-conseguir-bolos-dj', cat: 'Guía', title: 'Cómo encontrar trabajo de DJ en España' },
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'Guía', title: 'Contrato DJ: qué debe incluir 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-empezar-dj-eventos-principiante', cat: 'DJ', title: 'DJ principiante: cómo empezar en eventos y cuánto cobrar' },
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
        <BlogScrollCTA role="dj_pro" storageKey="xpeak_scrollcta_alta_dj" articlePath={PATH} />
      </div>
    </>
  );
}
