// Páginas de DJ por ocasión para organizadores (25 nov 2026): /boda/contratar-dj,
// /evento-empresa/contratar-dj, /fiesta-privada/contratar-dj y /cumpleanos/contratar-dj.
//
// Antes eran la plantilla común de OccasionLanding: 485 palabras casi iguales entre
// ocasiones, sin un solo DJ en el HTML que ve Google, y sin enlaces que llevaran a
// ellas. Google las indexó en agosto y no volvió (Search Console, 25 nov: 0 o 1
// impresión en 90 días), mientras "dj para bodas" y "precio dj boda" sumaban unas
// 1.000 impresiones que contestaba la guía genérica en posición 15 a 70.
//
// Ahora siguen el modelo de /contratar-dj/madrid: los DJs reales de Madrid con su
// precio por hora y el precio de la ocasión calculado con sus tarifas (nada
// inventado: sin 5 tarifas válidas no se da cifra). El texto es propio de cada
// ocasión. Solo Madrid porque es donde hay oferta: 34 DJs, 22 con tarifa (25 nov).
//
// El prerender (scripts/prerender-content.mjs) inyecta los DJs de Madrid en estas
// rutas y prerender-meta.mjs lleva los mismos títulos: si se toca aquí, allí también.
import { lazy, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import { ProfGrid, useCityProfessionals } from '@/pages/CityLanding';
import { estadisticasPrecio, precioValido, usePrecioReal } from '@/lib/precioReal';

const ParticularRequestModal = lazy(() => import('@/components/ParticularRequestModal'));

const BUILD_DATE = new Date().toISOString().slice(0, 10);

type Faq = { q: string; a: string };
export type DjOcasion = {
  slug: string;              // segmento de la URL
  titulo: string;            // <title> sin " | XPEAK"
  desc: string;
  h1: string;
  intro: string;
  horas: number;             // horas de música habituales para el cálculo
  etiquetaHoras: string;     // "6 horas de fiesta"
  tipoEvento: string;        // valor del formulario de solicitud
  cta: string;
  preguntar: { t: string; d: string }[];
  momentos: { t: string; d: string }[];
  tituloMomentos: string;
  faqs: (precio: string | null) => Faq[];
};

const cifra = (precio: string | null, conPrecio: string, sinPrecio: string) => (precio ? conPrecio : sinPrecio);

export const DJ_OCASIONES: Record<string, DjOcasion> = {
  boda: {
    slug: 'boda',
    titulo: 'DJ para bodas en Madrid: precios reales y disponibilidad',
    desc: 'DJs para bodas en Madrid con su precio por hora, estilos y fotos. Mira cuánto cuesta un DJ de boda y pide presupuesto a los que tienen tu fecha libre.',
    h1: 'DJ para bodas en Madrid',
    intro: 'Elige el DJ de tu boda viendo antes lo que importa: su precio por hora, los estilos que pincha y sus fotos. Son DJs de Madrid y alrededores que trabajan en fincas, hoteles y salones.',
    horas: 6,
    etiquetaHoras: '6 horas de fiesta',
    tipoEvento: 'Boda',
    cta: 'Pide DJ para tu boda',
    preguntar: [
      { t: 'Qué momentos cubre', d: 'Solo la fiesta o también la ceremonia, el cóctel y la entrada al banquete. Cada momento suma horas y a veces un segundo equipo de sonido.' },
      { t: 'Si lleva equipo propio', d: 'Altavoces, mesa, luces para la pista y micrófono inalámbrico para los discursos. Si la finca ya tiene sonido, el precio baja.' },
      { t: 'Cómo prepara la música', d: 'Pregunta si hace una reunión previa, si acepta una lista de canciones imprescindibles y otra de prohibidas, y cómo maneja las peticiones de los invitados.' },
      { t: 'Horario y horas extra', d: 'Cuánto cobra por cada hora de más y hasta qué hora permite música la finca. Muchas tienen límite de ruido o de horario.' },
      { t: 'Desplazamiento', d: 'Si la finca está lejos de Madrid capital, pregunta si el desplazamiento va aparte y cuánto tiempo necesita para montar.' },
    ],
    tituloMomentos: 'La música de una boda, momento a momento',
    momentos: [
      { t: 'Ceremonia', d: 'Entrada, firmas y salida. Suele ir con micrófono para quien oficia y música tranquila.' },
      { t: 'Cóctel', d: 'Música de fondo para hablar, sin volumen alto. Una hora u hora y media.' },
      { t: 'Banquete', d: 'Entrada de los novios, discursos y música suave durante la comida.' },
      { t: 'Primer baile y fiesta', d: 'El momento fuerte: entre 4 y 6 horas de pista. Es lo que más pesa en el precio.' },
    ],
    faqs: (precio) => [
      { q: '¿Cuánto cuesta un DJ para una boda en Madrid?', a: cifra(precio, `Con las tarifas que publican los DJs de Madrid en XPEAK, 6 horas de fiesta salen por ${precio}. Si además pone la música de la ceremonia y el cóctel, suma esas horas y, a veces, un segundo equipo.`, 'Depende de las horas, del equipo que lleve y de los momentos que cubra. En cada perfil ves su tarifa por hora antes de pedir nada.') },
      { q: '¿Con cuánta antelación hay que reservar el DJ de la boda?', a: 'Para sábados de mayo a octubre, entre 6 y 12 meses: los DJs con más bodas llenan esas fechas pronto. Entre semana o en invierno suele haber hueco con menos margen.' },
      { q: '¿El DJ de la boda lleva su propio equipo?', a: 'La mayoría lleva altavoces, mesa y luces básicas para la pista. Confirma si incluye micrófono inalámbrico para los discursos y si la finca obliga a usar su equipo.' },
      { q: '¿Puedo darle una lista de canciones?', a: 'Sí, y es lo normal. Dale las imprescindibles (entrada, primer baile, tarta) y las que no quieres oír. Un buen DJ de boda lee la pista y mezcla el resto.' },
      { q: '¿Cómo contrato un DJ para mi boda con XPEAK?', a: 'Pulsa «Pide DJ para tu boda», di la fecha y dónde es y confirma tu email. Se lo mandamos a los DJs de Madrid que encajan y, cuando uno dice que sí, habláis por el chat de XPEAK.' },
    ],
  },
  'evento-empresa': {
    slug: 'evento-empresa',
    titulo: 'DJ para eventos de empresa en Madrid: precios y disponibilidad',
    desc: 'DJs para cenas de empresa, afterworks, presentaciones y fiestas de Navidad en Madrid, con su precio por hora. Pide presupuesto con factura.',
    h1: 'DJ para eventos de empresa en Madrid',
    intro: 'Cenas de Navidad, afterworks, inauguraciones y presentaciones de producto. Compara DJs de Madrid por su precio por hora y su estilo, y pide presupuesto para la fecha de tu evento.',
    horas: 4,
    etiquetaHoras: '4 horas de música',
    tipoEvento: 'Otro',
    cta: 'Pide DJ para tu evento',
    preguntar: [
      { t: 'Factura', d: 'Pide que facture como autónomo o empresa. En un evento corporativo es lo primero que te van a pedir en administración.' },
      { t: 'El tono del evento', d: 'No es lo mismo música de fondo en una presentación que una fiesta de Navidad con pista. Explícalo bien para que traiga el equipo adecuado.' },
      { t: 'Montaje con el local', d: 'Confirma con el local o el hotel a qué hora puede montar, dónde hay enchufes y si hay límite de volumen.' },
      { t: 'Micrófono', d: 'Si hay discursos, sorteos o entrega de premios, pide micrófono inalámbrico y que alguien lo pruebe antes.' },
    ],
    tituloMomentos: 'Tipos de evento de empresa',
    momentos: [
      { t: 'Cena de Navidad', d: 'Música suave durante la cena y pista después. Diciembre se llena pronto: reserva con margen.' },
      { t: 'Afterwork', d: 'Dos o tres horas, ambiente para hablar que sube al final. Suele ser entre semana.' },
      { t: 'Presentación o inauguración', d: 'Música de fondo cuidada, a veces con entrada y momentos marcados. Pide algo sobrio.' },
      { t: 'Fiesta de aniversario o team building', d: 'Pista como en una fiesta privada, con más peso en el micrófono para el equipo.' },
    ],
    faqs: (precio) => [
      { q: '¿Cuánto cuesta un DJ para un evento de empresa en Madrid?', a: cifra(precio, `Con las tarifas que publican los DJs de Madrid en XPEAK, 4 horas de música salen por ${precio}. Un afterwork corto cuesta menos y una cena de Navidad larga, más.`, 'Depende de las horas, del equipo y del tipo de evento. Cada DJ publica su tarifa por hora en su perfil.') },
      { q: '¿El DJ emite factura?', a: 'Pregúntalo antes de cerrar. Muchos DJs facturan como autónomos con IVA y, si aplica, retención de IRPF. Si tu empresa necesita factura, ponlo en la solicitud.' },
      { q: '¿Con cuánta antelación hay que reservar para la cena de Navidad?', a: 'Para viernes y jueves de diciembre, cuanto antes: muchas empresas cierran fecha en octubre. Para el resto del año suelen bastar dos o tres semanas.' },
      { q: '¿Puede poner música de fondo y después hacer fiesta?', a: 'Sí, es lo más habitual en cenas de empresa. Explícalo al pedir presupuesto para que lleve equipo que sirva para las dos cosas.' },
      { q: '¿Cómo pido DJ para mi empresa con XPEAK?', a: 'Pulsa «Pide DJ para tu evento», di la fecha, el lugar y qué necesitas. Se lo mandamos a los DJs de Madrid que encajan y habláis por el chat de XPEAK.' },
    ],
  },
  'fiesta-privada': {
    slug: 'fiesta-privada',
    titulo: 'DJ para fiestas privadas en Madrid: precios y disponibilidad',
    desc: 'DJs para fiestas privadas en Madrid: en casa, en finca, en un ático o en un local. Mira su precio por hora y estilos y pide presupuesto.',
    h1: 'DJ para fiestas privadas en Madrid',
    intro: 'Fiestas en casa, en finca, en un ático o en un local alquilado. Elige DJ de Madrid por su precio por hora y por la música que pincha, y pide presupuesto para tu fecha.',
    horas: 4,
    etiquetaHoras: '4 horas de fiesta',
    tipoEvento: 'Fiesta privada',
    cta: 'Pide DJ para tu fiesta',
    preguntar: [
      { t: 'El espacio', d: 'Cuéntale el tamaño, si es interior o exterior y cuánta gente va. Con eso sabe qué potencia de sonido llevar.' },
      { t: 'Vecinos y horario', d: 'En casa o en un ático, mira el límite de ruido. Hay DJs con equipo compacto para espacios pequeños.' },
      { t: 'Enchufes y montaje', d: 'Necesita un enchufe cerca y espacio para la mesa. En exterior, pregunta qué pasa si llueve.' },
      { t: 'Estilo de música', d: 'Dile qué os gusta y qué no. Si hay invitados de edades muy distintas, que lo sepa.' },
    ],
    tituloMomentos: 'Fiestas privadas más habituales',
    momentos: [
      { t: 'En casa o en un ático', d: 'Equipo compacto, volumen controlado y 3 o 4 horas.' },
      { t: 'En finca o chalet', d: 'Más potencia, luces y, a menudo, más horas. Pregunta por el desplazamiento.' },
      { t: 'En un local alquilado', d: 'Confirma si el local tiene sonido propio: si lo tiene, el DJ puede ir solo con su mesa.' },
      { t: 'Despedidas y aniversarios', d: 'Fiestas con un momento central. Pide micrófono si va a haber sorpresas o discursos.' },
    ],
    faqs: (precio) => [
      { q: '¿Cuánto cuesta un DJ para una fiesta privada en Madrid?', a: cifra(precio, `Con las tarifas que publican los DJs de Madrid en XPEAK, 4 horas de fiesta salen por ${precio}. El equipo y el desplazamiento son lo que más mueve el precio.`, 'Depende de las horas, del equipo que lleve y de dónde sea la fiesta. Cada DJ publica su tarifa por hora en su perfil.') },
      { q: '¿Necesito tener equipo de sonido?', a: 'No. La mayoría de los DJs lleva el suyo. Solo necesitas un enchufe cerca y espacio para montar.' },
      { q: '¿Se puede contratar un DJ para una fiesta en casa?', a: 'Sí. Hay DJs con equipo compacto pensado para pisos y áticos. Ten en cuenta el horario de ruido de tu comunidad.' },
      { q: '¿Con cuánta antelación hay que reservar?', a: 'Para un sábado, dos o tres semanas suelen bastar. En verano y en diciembre, mejor con más margen.' },
      { q: '¿Cómo pido DJ para mi fiesta con XPEAK?', a: 'Pulsa «Pide DJ para tu fiesta», di la fecha y dónde es y confirma tu email. Se lo mandamos a los DJs de Madrid que encajan y habláis por el chat de XPEAK.' },
    ],
  },
  cumpleanos: {
    slug: 'cumpleanos',
    titulo: 'DJ para cumpleaños en Madrid: precios y disponibilidad',
    desc: 'DJs para cumpleaños en Madrid: 18 años, 30, 40, 50 o fiesta familiar. Mira su precio por hora y estilos y pide presupuesto para tu fecha.',
    h1: 'DJ para cumpleaños en Madrid',
    intro: 'Un 18, un 30, un 40 o un cumpleaños familiar. Compara DJs de Madrid por su precio por hora y por la música que pinchan, y pide presupuesto para tu fiesta.',
    horas: 3,
    etiquetaHoras: '3 horas de fiesta',
    tipoEvento: 'Cumpleaños',
    cta: 'Pide DJ para tu cumpleaños',
    preguntar: [
      { t: 'La edad de los invitados', d: 'No se pincha igual en un 18 que en un 50. Cuéntale quién va para que acierte con la música.' },
      { t: 'Momentos especiales', d: 'Tarta, sorpresa, vídeo o discurso. Pide que lleve micrófono si hace falta.' },
      { t: 'Dónde es', d: 'En casa, en un local o en una finca cambia el equipo que necesita. Díselo al pedir presupuesto.' },
      { t: 'Horas', d: 'Suelen ser 3 o 4. Pregunta cuánto cobra por hora extra por si la fiesta se alarga.' },
    ],
    tituloMomentos: 'Cumpleaños más habituales',
    momentos: [
      { t: 'Fiesta de 18 años', d: 'Música actual y mucha pista. Pregunta si conoce lo que se escucha ahora.' },
      { t: '30, 40 y 50', d: 'Mezcla de la música de la época de quien cumple con éxitos de siempre.' },
      { t: 'Cumpleaños familiar', d: 'Invitados de todas las edades: hace falta un DJ que sepa leer la pista.' },
      { t: 'Sorpresa', d: 'Coordina con el DJ la entrada de quien cumple y el momento de la tarta.' },
    ],
    faqs: (precio) => [
      { q: '¿Cuánto cuesta un DJ para un cumpleaños en Madrid?', a: cifra(precio, `Con las tarifas que publican los DJs de Madrid en XPEAK, 3 horas de fiesta salen por ${precio}. Si es en una finca o con luces especiales, sube.`, 'Depende de las horas y del equipo. Cada DJ publica su tarifa por hora en su perfil.') },
      { q: '¿Cuántas horas de DJ hacen falta para un cumpleaños?', a: 'Lo habitual son 3 o 4 horas. Para un 18 o una fiesta grande, a veces 5.' },
      { q: '¿El DJ lleva luces?', a: 'Muchos llevan luces básicas para la pista. Si quieres algo más (humo, láser, pantalla), pídelo aparte.' },
      { q: '¿Con cuánta antelación hay que reservar?', a: 'Dos o tres semanas suelen bastar. Para sábados de temporada alta, mejor antes.' },
      { q: '¿Cómo pido DJ para un cumpleaños con XPEAK?', a: 'Pulsa «Pide DJ para tu cumpleaños», di la fecha y dónde es y confirma tu email. Se lo mandamos a los DJs de Madrid que encajan y habláis por el chat de XPEAK.' },
    ],
  },
  comunion: {
    slug: 'comunion',
    titulo: 'DJ y discomóvil para comuniones en Madrid: precios y disponibilidad',
    desc: 'DJs y discomóviles para comuniones en Madrid con su precio por hora, estilos y fotos. Mira cuánto cuesta y pide presupuesto para la fecha de la comunión.',
    h1: 'DJ y discomóvil para comuniones en Madrid',
    intro: 'Música para la comida y fiesta para los niños, con juegos y canciones que conocen. Compara DJs de Madrid por su precio por hora y pide presupuesto para la fecha de la comunión.',
    horas: 4,
    etiquetaHoras: '4 horas de música',
    tipoEvento: 'Comunión',
    cta: 'Pide DJ para la comunión',
    preguntar: [
      { t: 'Si hace animación para niños', d: 'En una comunión la pista es de los niños: juegos, bailes conocidos y concursos. Pregunta si lo hace él o si hay que contratar un animador aparte.' },
      { t: 'Música para la comida', d: 'Durante la comida, música suave para que los mayores puedan hablar. Que lo tenga claro antes de empezar.' },
      { t: 'Equipo y luces', d: 'Altavoces, micrófono y luces para la pista. Si el restaurante tiene sonido propio, puede salir más barato.' },
      { t: 'Horario del restaurante', d: 'Muchos restaurantes y salones dan un horario cerrado para la fiesta. Confírmalo con el local antes de cerrar las horas con el DJ.' },
    ],
    tituloMomentos: 'La música de una comunión',
    momentos: [
      { t: 'Llegada y aperitivo', d: 'Música de fondo mientras llegan los invitados.' },
      { t: 'Comida', d: 'Volumen bajo, para que la familia pueda hablar.' },
      { t: 'Tarta y regalos', d: 'Un momento marcado: micrófono y la canción que elija el niño o la niña.' },
      { t: 'Fiesta para los niños', d: 'Juegos, bailes y canciones que conocen. Suele ser la parte más larga.' },
    ],
    faqs: (precio) => [
      { q: '¿Cuánto cuesta un DJ para una comunión en Madrid?', a: cifra(precio, `Con las tarifas que publican los DJs de Madrid en XPEAK, 4 horas de música salen por ${precio}. Si añade animación para los niños o luces especiales, sube.`, 'Depende de las horas, del equipo y de si incluye animación para los niños. Cada DJ publica su tarifa por hora en su perfil.') },
      { q: '¿Qué diferencia hay entre DJ y discomóvil para una comunión?', a: 'La discomóvil suele llevar más luces y efectos y, a veces, animación. Un DJ se centra en la música. Para una comunión con muchos niños, pregunta qué incluye cada uno.' },
      { q: '¿Con cuánta antelación hay que reservar?', a: 'La temporada de comuniones (mayo y junio) se llena pronto: reserva con 2 a 4 meses de antelación, sobre todo para sábados.' },
      { q: '¿El DJ hace juegos para los niños?', a: 'Muchos sí: concursos, bailes y juegos de grupo. Pregúntalo antes, porque no todos lo hacen y a veces se cobra como animación aparte.' },
      { q: '¿Cómo pido DJ para la comunión con XPEAK?', a: 'Pulsa «Pide DJ para la comunión», di la fecha y dónde es y confirma tu email. Se lo mandamos a los DJs de Madrid que encajan y habláis por el chat de XPEAK.' },
    ],
  },
};

export const esDjOcasion = (ocasion: string, rol: string) => rol === 'dj' && !!DJ_OCASIONES[ocasion];

const caja = { background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' };

export default function DjOcasionMadrid({ ocasion }: { ocasion: string }) {
  const o = DJ_OCASIONES[ocasion];
  const [pedir, setPedir] = useState(false);
  const { profs, loaded } = useCityProfessionals('Madrid', 'dj');
  // Las tarifas salen de la función tarifas_publicas (sin cuentas propias ni demo).
  // En el prerender esa llamada no corre, así que el HTML lleva la cuenta hecha con
  // las tarifas de los mismos perfiles que se pintan; en el navegador manda la de la BD.
  const stBd = usePrecioReal(['dj'], loaded ? profs.map(p => p.id) : []);
  const st = stBd ?? estadisticasPrecio(profs.map(p => p.precioHora));
  const precio = st ? `${st.p25 * o.horas}-${st.p75 * o.horas} €` : null;
  const faqs = o.faqs(precio);
  // Primero los que tienen precio y estilos: es lo que vino a ver quien contrata.
  const djs = [...profs]
    .sort((a, b) => Number(precioValido(b.precioHora) && !!b.estilos?.length) - Number(precioValido(a.precioHora) && !!a.estilos?.length))
    .slice(0, 24);
  const canonical = `https://xpeak.es/${o.slug}/contratar-dj`;
  const titulo = `${o.titulo} | XPEAK`;
  const otras = Object.values(DJ_OCASIONES).filter(x => x.slug !== o.slug);

  const service = {
    '@context': 'https://schema.org', '@type': 'Service', name: o.h1,
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'City', name: 'Madrid' },
    description: o.desc, url: canonical, serviceType: o.h1, dateModified: BUILD_DATE,
    ...(st ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'EUR', lowPrice: st.min, highPrice: st.max, offerCount: st.n, unitText: 'hora' } } : {}),
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const migas = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Contratar DJ', item: 'https://xpeak.es/contratar-dj' },
      { '@type': 'ListItem', position: 3, name: o.h1, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{titulo}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={o.desc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={o.titulo} />
        <meta property="og:description" content={o.desc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(service)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        <script type="application/ld+json">{JSON.stringify(migas)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#FFFFFF', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#374151' }}>Blog</a>
            <a href="/contratar-dj/madrid" className="text-xs font-bold hidden sm:block" style={{ color: '#374151' }}>DJs de Madrid</a>
            <button type="button" onClick={() => setPedir(true)} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Pedir DJ
            </button>
          </div>
        </nav>

        <p className="max-w-5xl mx-auto px-4 sm:px-6 text-xs font-bold" style={{ color: '#666' }}>
          <a href="/">XPEAK</a> › <a href="/contratar-dj">Contratar DJ</a> › <a href="/contratar-dj/madrid">Madrid</a> › <span>{o.h1.replace(' en Madrid', '')}</span>
        </p>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{o.h1}</h1>
          <p className="text-base sm:text-lg mb-7 max-w-3xl leading-relaxed" style={{ color: '#374151' }}>{o.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => setPedir(true)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> {o.cta}
            </button>
            <a href="#djs" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ ...caja, color: '#111' }}>
              Ver DJs y precios <ArrowRight size={14} />
            </a>
          </div>
          <p className="text-xs mt-3" style={{ color: '#6b7280' }}>Pedirlo no te compromete a nada: te contestan los DJs que tienen la fecha libre.</p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-black mb-3">Cuánto cuesta un {o.h1.replace(' en Madrid', '')} en Madrid</h2>
          {st ? (
            <>
              <p className="text-sm sm:text-base mb-5 leading-relaxed max-w-3xl" style={{ color: '#374151' }}>
                Calculado con las tarifas reales de los {st.n} DJs de Madrid que publican su precio en XPEAK. Se actualiza solo cuando un DJ cambia la suya.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { l: 'La mitad cobra', v: `${st.p25}-${st.p75} €/h` },
                  { l: 'Precio más habitual', v: `${st.tipico} €/h` },
                  { l: o.etiquetaHoras, v: precio! },
                ].map(x => (
                  <div key={x.l} className="p-5 rounded-xl" style={caja}>
                    <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#6b7280' }}>{x.l}</p>
                    <p className="text-2xl font-black" style={{ color: '#8B6A00' }}>{x.v}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: '#4b5563' }}>
                Van de {st.min} € a {st.max} € la hora. Lo que más cambia el precio: las horas, si lleva equipo propio, el desplazamiento y la experiencia.
                Para comparar con el resto de España, mira <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#8B6A00', fontWeight: 700 }}>cuánto cobra un DJ</a>.
              </p>
            </>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: '#374151' }}>
              Cada DJ publica su tarifa por hora en su perfil. El precio final depende de las horas, del equipo y del desplazamiento.
            </p>
          )}
        </section>

        <section id="djs" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-black mb-2">DJs de Madrid con su precio</h2>
          <p className="text-sm mb-6" style={{ color: '#4b5563' }}>Toca un DJ para ver sus sets, fotos y reseñas. Habláis por el chat de XPEAK.</p>
          {djs.length > 0 ? <ProfGrid profs={djs} detalle /> : <p className="text-sm" style={{ color: '#6b7280' }}>Cargando DJs…</p>}
          <div className="text-center mt-6">
            <a href="/contratar-dj/madrid" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ ...caja, color: '#111' }}>
              Ver todos los DJs de Madrid <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-black mb-6">Qué preguntar antes de contratar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {o.preguntar.map(x => (
              <div key={x.t} className="p-5 rounded-xl" style={caja}>
                <h3 className="text-base font-black mb-2 flex items-center gap-2"><CheckCircle size={15} style={{ color: '#8B6A00' }} /> {x.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-black mb-6">{o.tituloMomentos}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {o.momentos.map(x => (
              <div key={x.t} className="p-5 rounded-xl" style={caja}>
                <h3 className="text-base font-black mb-2 flex items-center gap-2"><Clock size={15} style={{ color: '#8B6A00' }} /> {x.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{x.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-7">
            <button type="button" onClick={() => setPedir(true)} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> {o.cta}
            </button>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-black mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="p-5 rounded-xl" style={caja}>
                <h3 className="text-sm sm:text-base font-bold mb-2">{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
          <h2 className="text-xl sm:text-2xl font-black mb-5">También te puede servir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otras.map(x => (
              <a key={x.slug} href={`/${x.slug}/contratar-dj`} className="p-4 rounded-xl font-bold text-sm" style={{ ...caja, color: '#111' }}>{x.h1} →</a>
            ))}
            <a href="/blog/cuanto-cobra-un-dj-en-espana" className="p-4 rounded-xl font-bold text-sm" style={{ ...caja, color: '#111' }}>Cuánto cobra un DJ en España →</a>
            <a href="/plantilla-contrato-dj" className="p-4 rounded-xl font-bold text-sm" style={{ ...caja, color: '#111' }}>Plantilla de contrato con un DJ →</a>
          </div>
        </section>

        <FooterPublic />
      </div>

      {pedir && (
        <Suspense fallback={null}>
          <ParticularRequestModal onClose={() => setPedir(false)} inicial={{ service: 'DJ', location: 'Madrid', eventType: o.tipoEvento }} />
        </Suspense>
      )}
    </>
  );
}
