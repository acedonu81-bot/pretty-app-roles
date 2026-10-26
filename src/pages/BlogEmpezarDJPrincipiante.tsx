import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  path: '/blog/como-empezar-dj-eventos-principiante',
  titulo: 'DJ principiante: cómo empezar en eventos y cuánto cobrar (2026)',
  h1: 'Cómo empezar a pinchar en eventos y cuánto cobrar siendo DJ principiante',
  metaDesc: 'Guía para el DJ que empieza: cuánto cobran por hora los DJs de XPEAK, qué equipo hace falta, cómo conseguir los primeros eventos y qué papeles necesitas para facturar.',
  ogDesc: 'Precios reales de 24 DJs de XPEAK, qué equipo hace falta y cómo conseguir tus primeros eventos en bodas, cumpleaños y fiestas privadas.',
  migas: 'DJ principiante',
  eyebrow: 'Para DJs',
  intro: 'Sabes mezclar en casa y quieres que te paguen por hacerlo. El salto de la habitación a una boda o a una fiesta de empresa da más miedo que la técnica: no sabes cuánto pedir, qué equipo llevar ni de dónde salen los primeros eventos. Aquí va lo que importa para empezar, con los precios que tienen publicados los DJs que ya trabajan en XPEAK.',
  fecha: '2026-10-26',
  fechaTexto: '26 octubre 2026',
  tituloTarifas: 'Cuánto cobran por hora los DJs de XPEAK',
  tarifas: [
    { perfil: 'DJs con precio por hora publicado', tarifa: '24' },
    { perfil: 'Precio más bajo y más alto', tarifa: '30-150 €/h' },
    { perfil: 'La mitad de ellos cobra entre', tarifa: '60-100 €/h' },
    { perfil: 'Precio mediano', tarifa: '77,5 €/h' },
  ],
  notaTarifas: 'Fuente: perfiles de DJ de XPEAK a 26 de octubre de 2026. Solo cuentan los DJs que han escrito su precio; se excluyen cuentas de prueba y perfiles con el precio por defecto sin tocar. Si empiezas, lo normal es situarte en la parte baja del rango e ir subiendo con cada evento que puedas enseñar.',
  fuentes: [
    { nombre: 'XPEAK', url: 'https://xpeak.es/directorio/dj', dato: 'precio por hora publicado por 24 DJs, 26 de octubre de 2026.' },
    { nombre: 'Agencia Tributaria, Orden HAC/1526/2024', url: 'https://sede.agenciatributaria.gob.es/', dato: 'desde el 3 de febrero de 2025 el alta censal de autónomos se hace con el modelo 036; el 037 ya no existe.' },
  ],
  secciones: [
    {
      titulo: 'El error más común: cobrar demasiado poco',
      parrafos: [
        'Muchos DJs que empiezan pinchan gratis o casi gratis para "hacer currículum". Funciona una o dos veces. A partir de ahí te encasillas como el DJ barato y cuesta subir. Es mejor cobrar poco pero cobrar, y explicar qué incluye tu precio: horas, equipo, desplazamiento y si pones luces o no.',
        'Una boda no se cobra igual que un cumpleaños. En una boda hay ceremonia, cóctel, baile y barra libre, y tú eres responsable de que nadie se aburra durante horas. Ese trabajo extra se paga.',
      ],
    },
    {
      titulo: 'Qué equipo necesitas de verdad',
      parrafos: [
        'Para empezar basta con una controladora con la que te sientas cómodo, unos buenos auriculares y un portátil o reproductor fiable. Los altavoces y las luces se pueden alquilar para cada evento hasta que tengas claro qué te compensa comprar.',
        'Lo que nunca debe faltar: cable de repuesto, un plan B si falla el portátil (un pendrive con una sesión preparada) y un micrófono para los avisos. En eventos privados el micro se usa más de lo que crees.',
      ],
    },
  ],
  pasos: [
    { paso: 'Prepara una sesión que puedas enseñar', desc: 'Graba una sesión del estilo que quieres pinchar en eventos, no solo del que te gusta a ti. Si buscas bodas, que haya clásicos que todo el mundo baila. Súbela a Mixcloud o SoundCloud y ten el enlace siempre a mano.' },
    { paso: 'Empieza por eventos que conoces', desc: 'Cumpleaños de amigos, fiestas de empresa de algún conocido, bares del barrio. Cobra algo aunque sea poco y pide siempre una foto o un vídeo corto pinchando: es lo que te va a abrir los siguientes.' },
    { paso: 'Pon un precio claro', desc: 'Decide tu precio por hora y qué incluye. Un precio público y sencillo da confianza: el organizador sabe a qué atenerse antes de escribirte.' },
    { paso: 'Ten los papeles en orden', desc: 'Si vas a cobrar de forma habitual tienes que poder facturar, y eso pasa por darte de alta como autónomo en Hacienda (modelo 036) y en la Seguridad Social. Un contrato sencillo con fecha, horas, precio y señal evita el evento que luego no te pagan.' },
    { paso: 'Crea tu perfil donde buscan DJ', desc: 'En XPEAK los organizadores piden DJ para su fecha y su ciudad, y la solicitud llega a los DJs de la zona. Con foto, precio, estilos y una sesión enlazada, tu perfil trabaja por ti aunque no tengas contactos.' },
    { paso: 'Cuida cada evento como si fuera el último', desc: 'Puntualidad, prueba de sonido antes de que llegue la gente y preguntar al organizador qué música no quiere. Las reseñas de tus primeros clientes valen más que cualquier anuncio.' },
  ],
  faqs: [
    { q: '¿Cuánto cobra un DJ principiante por hora?', a: 'En XPEAK, los 24 DJs con precio publicado cobran entre 30 y 150 € por hora, la mitad entre 60 y 100 €, y el precio mediano es 77,5 € (octubre 2026). Quien empieza suele situarse en la parte baja de ese rango.' },
    { q: '¿Necesito equipo propio para empezar a pinchar en eventos?', a: 'No es imprescindible. Con una controladora, auriculares y un portátil puedes empezar, y alquilar altavoces y luces para cada evento. Muchos locales ya tienen equipo instalado.' },
    { q: '¿Tengo que ser autónomo para cobrar como DJ?', a: 'Si cobras de forma habitual tienes que poder facturar. El alta en Hacienda se hace con el modelo 036 (el 037 se eliminó en febrero de 2025) y hay que darse de alta también en la Seguridad Social con la misma fecha de inicio.' },
    { q: '¿Cómo consigo mis primeros eventos como DJ?', a: 'Empieza por tu entorno (cumpleaños, fiestas de empresa, bares de tu zona), graba una sesión que puedas enseñar y crea tu perfil en plataformas donde los organizadores buscan DJ por ciudad, como XPEAK.' },
  ],
  relacionados: [
    { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España 2026' },
    { href: '/blog/como-conseguir-bolos-dj', cat: 'Para DJs', title: 'Cómo conseguir bolos como DJ' },
    { href: '/blog/calculadora-tarifa-dj', cat: 'DJ', title: 'Calculadora de tarifa DJ' },
    { href: '/blog/contrato-dj-que-debe-incluir', cat: 'DJ', title: 'Contrato DJ: qué debe incluir' },
  ],
  ctaSlug: 'dj',
  tag: 'DJ',
  scrollRole: 'dj_pro',
  storageKey: 'xpeak_scrollcta_dj_principiante_v1',
};

export default function BlogEmpezarDJPrincipiante() {
  return <BlogGuiaTrabajar g={g} />;
}
