import { Helmet } from 'react-helmet-async';
import { Sparkles, ArrowLeft } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogPrimerPaso from '@/components/BlogPrimerPaso';

const RUTA = '/blog/limpieza-despues-de-un-evento';
const TITULO = 'Limpieza después de un evento: qué incluye y cómo pedir presupuesto (2026)';

// Ninguna de estas fuentes publica precios de limpieza para bodas o eventos:
// miden limpieza general por horas. Se dice tal cual en el artículo y no se
// calcula ningún total. Páginas leídas enteras el 30 oct 2026 antes de citarlas.
const FUENTES = [
  { nombre: 'Trustlocal, coste de una empresa de limpieza por hora (actualizada el 17 de septiembre de 2026)', href: 'https://trustlocal.es/coste/empresa-de-limpieza-coste/', dato: 'De 18 a 25 € por hora de media; en Madrid y Barcelona, de 18 a 30 €', mide: 'Limpieza general por horas en 2026. No separa los eventos.' },
  { nombre: 'Limpieza.ai, precio de la hora de limpieza en 2026', href: 'https://limpieza.ai/blog/precio-hora-limpieza/', dato: 'De 17 a 22 € por hora una empresa con seguro de responsabilidad civil y productos', mide: 'Tarifa de una empresa profesional, hogar y oficinas. Su servicio exige un mínimo de 2 horas por visita.' },
  { nombre: 'Limpieza.ai, la misma página', href: 'https://limpieza.ai/blog/precio-hora-limpieza/', dato: 'Recargo del 15 al 20 % en algunos servicios de fin de semana o fuera de horario; productos aparte, de 2 a 3 € más por hora, en algunas empresas', mide: 'Lo que puede sumarse a la tarifa base. No todas las empresas lo aplican.' },
  { nombre: 'Habitissimo, perfil de una empresa de limpieza de Madrid que anuncia limpiezas post-evento', href: 'https://www.habitissimo.es/pro/master-clean-667c26d2127ae', dato: '15 € por hora; urgencias de 19:00 a 8:00, 20 € por hora', mide: 'Tarifas publicadas por una sola empresa. No dice precios por evento.' },
];

const MOMENTOS = [
  {
    cuando: 'Antes del evento',
    texto: 'El espacio llega al montaje limpio de verdad: suelos, baños, cristales y las zonas donde va a ir la decoración, el catering o la cabina. Se nota sobre todo en fincas y locales que llevan días sin usarse.',
  },
  {
    cuando: 'Durante el evento',
    texto: 'Alguien que repone los baños, retira vasos y basura, y mantiene la barra y la zona de comida presentables. No hace falta en una cena de dos horas. En una boda larga o con muchos invitados, sí que se agradece.',
  },
  {
    cuando: 'Después del evento',
    texto: 'La más pedida. Recogida de residuos, suelos, baños, cocina u office y los cristales, que se llenan de huellas. Y devolver el espacio como estaba, algo que importa mucho si el local te ha pedido fianza.',
  },
];

const DATOS_PRESUPUESTO = [
  'Dónde es: dirección o zona, y si hay ascensor o escaleras para sacar la basura.',
  'Metros cuadrados aproximados. No hace falta medirlos, pero sí un orden de magnitud.',
  'Cuántos invitados hay, porque de ellos depende la cantidad de residuos y de suciedad.',
  'A qué hora termina el evento y desde cuándo se puede entrar a limpiar.',
  'Qué hay que limpiar: salón, cocina u office, baños, terraza o jardín, cristales.',
  'Si la limpieza es antes, durante, después o varias a la vez.',
  'Si el local exige dejarlo de una forma concreta para devolver la fianza.',
];

const PREGUNTAR = [
  '¿Los productos y el material van incluidos en la tarifa, o se cobran aparte?',
  '¿Tienen seguro de responsabilidad civil? La mayoría dice que sí, pero confírmalo por escrito.',
  '¿Hay un mínimo de horas por servicio?',
  '¿Aplican recargo en fin de semana, festivo o de noche?',
  '¿Cuántas personas mandan, y cuántas horas calculan que necesitan?',
  '¿Se llevan los residuos o los dejan en bolsas en la puerta?',
];

const FAQS = [
  {
    q: '¿Cuánto cuesta limpiar un local después de una boda?',
    a: 'No hay un precio publicado fiable para limpiezas de bodas o eventos. Lo que sí publican las empresas es la tarifa por hora, que en las fuentes que hemos revisado va de 15 a 25 € por persona y hora, con diferencias según la ciudad. El total depende de cuántas personas y cuántas horas hagan falta, y eso lo calcula cada empresa con tus metros y tus invitados.',
  },
  {
    q: '¿Se cobra por metro cuadrado o por hora?',
    a: 'En limpieza general lo habitual es por hora. Una de las fuentes explica que la tarifa por hora suele ser la misma y que lo que cambia con el tamaño es el número de horas. Los precios por metro cuadrado que hemos encontrado son de limpieza de fin de obra, no de eventos, así que no los usamos.',
  },
  {
    q: '¿Es obligatorio contratar limpieza durante el evento?',
    a: 'No. Depende de la duración y del número de invitados. En un evento corto basta con limpiar antes y después. En uno largo, con muchos invitados o con baños muy usados, alguien durante el evento evita que el espacio se degrade a mitad de la fiesta.',
  },
  {
    q: '¿Cómo pido la limpieza de mi evento en XPEAK?',
    a: 'Con el botón de arriba, sin crear cuenta. Indicas tu fecha y lo que necesitas, y la solicitud llega a empresas de limpieza de XPEAK. Si ya estás armando tu evento, también puedes añadir la limpieza a Mi evento junto al resto de profesionales. En ambos casos el precio lo cierra la empresa con su presupuesto.',
  },
];

export default function BlogLimpiezaDespuesEvento() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: TITULO, item: `https://xpeak.es${RUTA}` },
    ],
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const articleStructured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITULO,
    datePublished: '2026-10-30',
    dateModified: '2026-10-30',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    description: 'Qué se limpia antes, durante y después de una boda o fiesta, cómo se cobra, qué datos dar y qué preguntar a la empresa para pedir presupuesto.',
  };

  return (
    <>
      <Helmet>
        <title>Limpieza después de un evento: qué incluye y cómo pedir presupuesto | XPEAK</title>
        <meta name="description" content="Qué se limpia antes, durante y después de una boda o fiesta, cómo se cobra (por hora y con mínimo), qué datos dar y qué preguntar a la empresa de limpieza." />
        <link rel="canonical" href={`https://xpeak.es${RUTA}`} />
        <meta property="og:title" content="Limpieza después de un evento: qué incluye y cómo pedir presupuesto | XPEAK" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://xpeak.es${RUTA}`} />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Limpieza después de un evento: qué incluye y cómo pedir presupuesto" />
        <meta name="twitter:description" content="Antes, durante y después de tu evento: qué se limpia, cómo se cobra y qué preguntar a la empresa." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(articleStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#2563EB' }}>XPEAK</a>
          <a href="/auth?mode=register"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>
            Unirse
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-5xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

        <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/directorio/limpieza" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(37,99,235,0.7)' }}>
            <ArrowLeft size={12} /> Empresas de limpieza para eventos
          </a>

          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ background: '#FBF3DD', color: '#8B6A00', border: '1px solid rgba(139,106,0,0.25)' }}>
              Guía práctica · 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{TITULO}</h1>
          <p className="text-base mb-6 leading-relaxed" style={{ color: '#333' }}>
            El evento sale bien, los invitados se van contentos y tú te quedas mirando un salón con vasos por todas partes. Y mañana hay que devolver las llaves. La limpieza es de lo último que se piensa al organizar una boda o una fiesta, y de lo primero que se echa de menos.
          </p>

          <BlogPrimerPaso rol="limpieza" articlePath={RUTA} />

          <section className="mt-10 mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Qué se limpia antes, durante y después</h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#333' }}>
              Una empresa de limpieza puede entrar en tres momentos distintos. Casi nadie contrata los tres, pero conviene saber cuál necesitas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOMENTOS.map(m => (
                <div key={m.cuando} className="p-4 rounded-xl" style={{ background: '#FBF3DD', border: '1px solid rgba(139,106,0,0.2)' }}>
                  <p className="text-sm font-black mb-2" style={{ color: '#8B6A00' }}>{m.cuando}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{m.texto}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Cómo se cobra la limpieza de un evento</h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#333' }}>
              Por horas, y por persona. Esa es la forma habitual, y la cuenta es sencilla: personas que mandan, por horas que tardan, por la tarifa de cada hora. A eso se le puede sumar un recargo si es fin de semana o de noche, y los productos si no van incluidos.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#333' }}>
              Por metro cuadrado no es lo normal. Los metros sirven para otra cosa: la empresa los usa para calcular cuánta gente y cuánto tiempo necesita. Por eso te los piden antes de dar un precio.
            </p>
            <p className="text-base leading-relaxed" style={{ color: '#333' }}>
              Y aquí va lo incómodo. Ninguna de las fuentes que hemos revisado publica precios de limpieza para bodas o eventos, y no vamos a inventarlos. Estas son las tarifas por hora que sí hay publicadas:
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Qué dicen las fuentes publicadas</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#FBF3DD', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <th className="text-left px-4 py-3 font-bold">Fuente</th>
                    <th className="text-left px-4 py-3 font-bold">Dato</th>
                    <th className="text-left px-4 py-3 font-bold">Qué mide</th>
                  </tr>
                </thead>
                <tbody>
                  {FUENTES.map((f, i) => (
                    <tr key={f.nombre} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="px-4 py-3 font-medium align-top"><a href={f.href} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#2563EB' }}>{f.nombre}</a></td>
                      <td className="px-4 py-3 font-bold align-top">{f.dato}</td>
                      <td className="px-4 py-3 align-top">{f.mide}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: '#666' }}>
              Revisado el 30 de octubre de 2026. Son tarifas de limpieza general, no de eventos, y las fuentes no coinciden del todo entre sí, así que tómalas como una referencia y no como un presupuesto. Una limpieza de boda suele ser más intensa que una de oficina.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Qué datos dar para que te presupuesten a la primera</h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#333' }}>
              Un presupuesto de limpieza que tarda tres mensajes en llegar es porque faltaban datos. Con esta lista, la empresa puede contestarte con precio en el primero:
            </p>
            <ul className="space-y-2">
              {DATOS_PRESUPUESTO.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                  <span style={{ color: '#8B6A00' }}>•</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Qué preguntar a la empresa antes de contratar</h2>
            <ul className="space-y-2 mb-4">
              {PREGUNTAR.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                  <span style={{ color: '#8B6A00' }}>•</span> {item}
                </li>
              ))}
            </ul>
            <p className="text-base leading-relaxed" style={{ color: '#333' }}>
              Sobre los productos y el seguro: las fuentes dicen que muchas empresas incluyen el material y que la mayoría tiene seguro de responsabilidad civil. Muchas no es todas. Pregúntalo antes, no cuando ya han roto algo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Tres errores que se repiten</h2>
            <div className="space-y-3">
              {[
                { t: 'Dejarlo para el día siguiente sin cerrar la hora de acceso', d: 'Si el local te quiere fuera a mediodía, la limpieza tiene que caber antes. Acuérdalo cuando contrates, no cuando acabe la fiesta.' },
                { t: 'Pedir precio sin decir los metros', d: 'Sin metros ni invitados, cualquier cifra es un número al azar. La empresa te lo dará igual, pero no te servirá para comparar.' },
                { t: 'Confundir la tarifa por hora con el total', d: 'Una tarifa baja por hora con muchas horas puede salir más cara que una más alta con menos. Compara el total, no la hora.' },
              ].map(e => (
                <div key={e.t} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <p className="text-sm font-bold mb-1">{e.t}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{e.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <p className="text-sm font-bold mb-2">{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
            <div className="space-y-2">
              {[
                { href: '/blog/comparar-presupuestos-proveedores-eventos', cat: 'Eventos', title: 'Cómo comparar presupuestos de proveedores de eventos (2026)' },
                { href: '/blog/gestionar-varios-proveedores-evento', cat: 'Eventos', title: 'Cómo gestionar varios proveedores en un evento sin perder el control (2026)' },
                { href: '/blog/organizar-evento-empresa-paso-a-paso', cat: 'Organizadores', title: 'Cómo organizar un evento de empresa paso a paso (2026)' },
                { href: '/blog/locales-para-eventos-madrid', cat: 'Eventos', title: 'Locales para eventos en Madrid: guía de salas, terrazas y fincas (2026)' },
              ].map(link => (
                <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                  <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: '#FBF3DD', color: '#8B6A00', border: '1px solid rgba(139,106,0,0.2)' }}>{link.cat}</span>
                  <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl p-7 text-center" style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }}>
            <h2 className="text-xl font-black mb-2">Que tu evento termine como empezó</h2>
            <p className="text-sm mb-5" style={{ color: '#333' }}>
              Mira las empresas de limpieza de XPEAK y pide presupuesto para tu fecha.
            </p>
            <a href="/directorio/limpieza"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>
              <Sparkles size={14} /> Ver empresas de limpieza
            </a>
          </div>

          <BlogAuthor />
          <BlogShare />
        </article>
        <BlogRelatedPosts currentSlug={RUTA} tag="Eventos" />
        <FooterPublic />
      </div>
    </>
  );
}
