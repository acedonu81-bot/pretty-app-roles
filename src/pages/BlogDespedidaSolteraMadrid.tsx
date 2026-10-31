import { Helmet } from 'react-helmet-async';
import { PartyPopper } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogAnswerBox from '@/components/BlogAnswerBox';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import BlogTopCTA from '@/components/BlogTopCTA';
import { usePrecioReal } from '@/lib/precioReal';
import { ventanaActiva } from '@/config/ventanasPrueba';

const SLUG = '/blog/despedida-de-soltera-madrid-cuanto-cuesta';
const URL = `https://xpeak.es${SLUG}`;
const TITLE = 'Despedida de soltera en Madrid: cuánto cuesta y cómo organizarla (2026)';
const DESC = 'Qué cuesta una despedida de soltera o de soltero en Madrid: local, actividades, DJ, comida y transporte, con precios publicados y su fuente, y qué preguntar antes de reservar.';

// Datos de las fichas de Venuu, leídas el 31 de octubre de 2026. Son precios "desde".
const LOCALES = [
  { nombre: 'TBC, bar de copas para fiestas privadas', zona: 'Madrid', desde: '15 € por persona' },
  { nombre: 'Pangea Restaurante', zona: 'Madrid', desde: '30 € por persona' },
  { nombre: 'Para Você', zona: 'Madrid', desde: '35 € por persona' },
  { nombre: 'Espacio Elite', zona: 'Casarrubios del Monte', desde: '445 € por día' },
  { nombre: 'SLEEP\'N Rooftop', zona: 'Madrid', desde: '500 € por día' },
  { nombre: 'Espacio Torrejón', zona: 'Pinto', desde: '533 € por día' },
];

const FAQ = [
  { q: '¿Cuánto cuesta una despedida de soltera en Madrid?', a: 'Depende de cuántas piezas sumes. Con las cifras publicadas: cada actividad cuesta de 30 a 100 € por persona (Consumoteca, enero de 2024), un local para fiesta privada arranca en 15 a 35 € por persona o en unos 445 a 533 € por día de alquiler (Venuu, octubre de 2026), y el DJ se paga por horas. El total sale de sumar lo que elijas y dividir entre el grupo.' },
  { q: '¿Quién paga la despedida?', a: 'Lo habitual es repartir el coste entre el grupo y que la homenajeada no pague, pero no hay una regla fija. Conviene acordarlo antes de reservar y dejar por escrito lo que cuesta cada cosa.' },
  { q: '¿Con cuánta antelación hay que reservar?', a: 'Cuanto antes mejor, sobre todo si la fecha es un fin de semana de primavera o verano, porque los locales y los profesionales suelen cerrar sus fechas con tiempo. Con la fecha ya decidida, puedes pedir presupuesto a varios a la vez.' },
  { q: '¿Cuánto cobra un DJ para una despedida?', a: 'Se cobra por horas y varía mucho según el DJ, el estilo y si lleva equipo. Mira la tarifa real de los DJ publicados en XPEAK más arriba y pide presupuesto para tu fecha.' },
  { q: '¿Puedo pedir todo en un mismo sitio?', a: 'Sí. En XPEAK cuentas la fecha y lo que necesitas (DJ, catering, camareros, sonido, fotos) y los profesionales de Madrid que encajan te contestan por el chat. Si necesitas transporte para el grupo, lo apuntas en las notas.' },
];

export default function BlogDespedidaSolteraMadrid() {
  const dj = usePrecioReal(['dj', 'disco-movil']);
  const hayFicha = ventanaActiva('despedidas');
  const destino = hayFicha ? '/despedidas-madrid' : '/contratar-dj/madrid';

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-10-31',
    dateModified: '2026-10-31',
    url: URL,
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
    image: 'https://xpeak.es/og-image.jpg',
  };
  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: 'Despedida de soltera en Madrid', item: URL },
    ],
  };

  const djTexto = dj
    ? `En XPEAK, ${dj.n} perfiles de DJ y disco móvil tienen su precio publicado: la mitad cobra entre ${dj.p25} y ${dj.p75} € por hora y el precio mediano ronda los ${dj.tipico} €.`
    : 'Cada DJ publica su tarifa por hora en su perfil de XPEAK. Todavía no hay suficientes perfiles con precio para dar un rango fiable, así que pide presupuesto para tu fecha.';

  return (
    <>
      <Helmet>
        <title>{`${TITLE} | XPEAK`}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth?mode=register"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse
          </a>
        </nav>

        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-5xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
        <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <BlogTopCTA href={destino} label="Pedir para mi fecha →" articlePath={SLUG} />

          <div className="flex items-center gap-2 mb-4">
            <PartyPopper size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Blog · Guía de precios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Despedida de soltera en Madrid: cuánto cuesta y cómo organizarla (2026)
          </h1>
          <p className="text-sm mb-8" style={{ color: '#555' }}>
            XPEAK · Publicado el 31 de octubre de 2026 · 6 min de lectura
          </p>

          <p className="text-base leading-relaxed mb-6" style={{ color: '#222' }}>
            Organizar una despedida suele caer en una sola persona, que acaba escribiendo a cuatro o cinco proveedores distintos para cuadrar fecha, local, música y comida. Esta guía junta los precios que hemos podido comprobar, con su fuente, para que sepas qué pedir y cuánto esperar antes de reservar. Sirve igual para una despedida de soltera que de soltero.
          </p>

          <BlogAnswerBox
            question="¿Cuánto cuesta una despedida de soltera en Madrid?"
            answer="No hay un precio único: es la suma de lo que elijas. Cada actividad cuesta entre 30 y 100 € por persona, un local para fiesta privada arranca en 15 a 35 € por persona o en 445 a 533 € por día de alquiler, y el DJ se paga por horas. Más abajo tienes cada cifra con su fuente."
          />

          <h2 className="text-xl font-black mb-4">Qué piezas tiene una despedida</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            Casi todas se montan con tres o cuatro de estas cosas. Cada una se contrata por separado y se paga de forma distinta:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-1.5 text-base" style={{ color: '#222' }}>
            <li><strong>Un sitio</strong>: un bar o restaurante con zona reservada, una terraza, un local por horas o tu propia casa.</li>
            <li><strong>Una actividad</strong>: taller, cata, juego, escape room o un plan de día.</li>
            <li><strong>Música</strong>: un DJ o un equipo de sonido si la fiesta es en un sitio sin música propia.</li>
            <li><strong>Comida y bebida</strong>: picoteo, cena o brunch, con camareros si no queréis servir vosotros.</li>
            <li><strong>Recuerdo</strong>: fotos o vídeo, para que no dependa de un móvil.</li>
            <li><strong>Transporte</strong>: solo si el grupo se mueve entre varios sitios.</li>
          </ul>

          <h2 className="text-xl font-black mb-4">El local: precios publicados, con su fuente</h2>
          <p className="text-base mb-5 leading-relaxed" style={{ color: '#222' }}>
            Estos son locales de Madrid y alrededores publicados para despedidas en <a href="https://venuu.com/es/despedidas-de-soltero-madrid" target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#2563EB' }}>Venuu</a>. Son precios «desde»: el total cambia con el día, el grupo y el consumo.
          </p>
          <div className="overflow-x-auto mb-4 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs min-w-[420px]">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {['Local', 'Zona', 'Precio desde'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOCALES.map((l, i) => (
                  <tr key={l.nombre} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td className="px-4 py-3 font-medium" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{l.nombre}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{l.zona}</td>
                    <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: '#8B6A00', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{l.desde}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mb-10 leading-relaxed" style={{ color: '#666' }}>
            Datos de las fichas de Venuu leídos el 31 de octubre de 2026. La página no aclara si los precios llevan IVA ni qué incluye cada «desde», y la capacidad de cada local no está indicada con claridad, así que pregúntala antes de reservar.
          </p>

          <h2 className="text-xl font-black mb-4">Las actividades</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            Según <a href="https://www.consumoteca.com/ocio/despedidas-en-2024/" target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#2563EB' }}>Consumoteca</a>, en Madrid cada actividad de una despedida cuesta entre <strong>30 y 100 € por persona</strong>, y el alojamiento entre 80 y 250 € por noche si hay que dormir fuera. Es un dato de enero de 2024, así que hoy puede ser algo más alto: úsalo como referencia, no como tarifa.
          </p>

          <h2 className="text-xl font-black mb-4">La música</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            El DJ se paga por horas, y lo que decide el precio es el estilo, si lleva equipo y la distancia. {djTexto} Cada perfil publica su precio, y el final depende de las horas y del tipo de evento.
          </p>
          <p className="text-base mb-10 leading-relaxed" style={{ color: '#222' }}>
            Un consejo práctico: di el estilo que queréis cuando pidas presupuesto. Una despedida de reggaetón y una de remember no se montan igual, y así solo te escriben los DJ que ponen esa música.
          </p>

          <h2 className="text-xl font-black mb-4">Cómo hacer la cuenta</h2>
          <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>
            Suma las piezas que quieras y divide entre las personas que van. Un ejemplo con las cifras de arriba, para un grupo de 10: una actividad de 30 a 100 € por persona más un local de 15 a 35 € por persona da entre 45 y 135 € por persona, sin contar música, comida de más ni transporte. Es solo aritmética con precios «desde»: con tu fecha y tu grupo saldrá otra cifra.
          </p>
          <p className="text-base mb-10 leading-relaxed" style={{ color: '#222' }}>
            Si necesitas bus o furgoneta para el grupo, no hemos podido comprobar un precio fiable para Madrid, así que no damos cifra: se pide presupuesto aparte con la ruta y las horas.
          </p>

          <h2 className="text-xl font-black mb-4">Qué preguntar antes de reservar</h2>
          <ul className="list-disc pl-6 mb-10 space-y-1.5 text-base" style={{ color: '#222' }}>
            <li>Qué incluye exactamente el precio y si lleva IVA.</li>
            <li>Cuánto hay que pagar para cerrar la fecha y qué pasa si cambia el grupo.</li>
            <li>Hasta qué hora se puede estar y si hay límite de ruido.</li>
            <li>Si el equipo, el montaje y el desmontaje están dentro del precio.</li>
            <li>Si hay consumo mínimo y cómo se reparte.</li>
          </ul>

          <div className="rounded-2xl p-6 mb-12" style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.35)' }}>
            <p className="text-lg font-black mb-1">Pídelo todo en un sitio</p>
            <p className="text-sm mb-4" style={{ color: '#374151' }}>
              Cuéntanos la fecha y lo que necesitas. Los profesionales de Madrid que encajan te contestan por el chat y cerráis el precio entre vosotros.
            </p>
            <a href={destino}
              className="inline-block px-5 py-3 rounded-xl text-sm font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Pedir para mi fecha
            </a>
          </div>

          <h2 className="text-xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4 mb-12">
            {FAQ.map(f => (
              <div key={f.q}>
                <h3 className="text-base font-black mb-1">{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{f.a}</p>
              </div>
            ))}
          </div>

          <BlogAuthor />
          <BlogShare />
        </article>
        <BlogRelatedPosts currentSlug={SLUG} tag="Eventos" />
        <FooterPublic />
      </div>
    </>
  );
}
