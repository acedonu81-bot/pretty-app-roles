// Healthy Zone: ocio de día y consciente (tardeo, afterwork, sin alcohol,
// bienestar). Fase 1 = página /healthy-zone + estas guías, para medir si hay
// demanda antes de meter la zona en el producto (distintivo y filtro en el
// directorio solo si llegan >= 5 solicitudes reales en 6 semanas).
//
// La demanda se mide en la tabla leads: source = 'healthy_zone' y
// article_path = página desde la que se envió el formulario.
//
// Añadir una guía: una entrada aquí + su página fina en src/pages + ruta en
// App.tsx + fila en blogPosts.ts y en prerender-meta.mjs.

export type HZTone = 'sun' | 'sky' | 'leaf' | 'lilac';

export const HZ_PLANES = ['Tardeo', 'Afterwork', 'Evento sin alcohol', 'Jornada de bienestar', 'Otro'] as const;
export type HZPlan = (typeof HZ_PLANES)[number];

import type { HZMatchRole } from './healthyZoneMatches';

export interface HZSection {
  h2: string;
  paragraphs?: string[];
  items?: { title: string; text: string; precio?: string; matchRole?: HZMatchRole }[];
  matchRole?: HZMatchRole; // muestra una tarjeta "esto podría encajar" al final de la sección
}

export interface HZGuide {
  slug: string;
  title: string; // <title> sin el sufijo "| XPEAK"
  desc: string;
  h1: string;
  short: string; // nombre corto en tarjetas y menú
  cardText: string; // una línea para la tarjeta de la página de la zona
  tone: HZTone;
  plan: HZPlan; // valor preseleccionado en el formulario
  intro: string;
  date: string; // ISO
  dateLabel: string;
  answer: { question: string; answer: string };
  sections: HZSection[];
  faq: { q: string; a: string }[];
  directorio: { href: string; label: string }[];
  formTitle: string;
}

export const HZ_TAG = 'Healthy Zone';
export const HZ_PATH = '/healthy-zone';

export const HZ_GUIDES: HZGuide[] = [
  {
    slug: '/blog/tardeo-privado-madrid',
    title: 'Tardeo privado en Madrid: horario, DJ y cuánto cuesta (2026)',
    desc: 'Cómo montar un tardeo privado en Madrid: qué horario funciona, cuánto cobra un DJ de tarde, qué local buscar y qué música poner para que la gente no se vaya a las ocho.',
    h1: 'Tardeo privado en Madrid: cómo montarlo y cuánto cuesta',
    short: 'Tardeo',
    cardText: 'De 17:00 a 22:00, DJ que sube poco a poco y a casa a cenar.',
    tone: 'sun',
    plan: 'Tardeo',
    intro: 'El tardeo ha dejado de ser solo lo del domingo en La Latina. Ahora se celebran así cumpleaños de 40, despedidas, aniversarios de empresa y hasta preboda. Empieza a las 14:00 o a las 17:00, termina antes de la cena y al día siguiente nadie está muerto. Así se monta uno bien.',
    date: '2026-09-24',
    dateLabel: '24 septiembre 2026',
    answer: {
      question: '¿Qué hace falta para un tardeo privado?',
      answer: 'Un local o terraza con permiso para música a esa hora, un DJ que sepa tocar de tarde (volumen moderado y subida progresiva), algo de comer que no sea una cena formal y un horario cerrado, normalmente de 4 a 5 horas.',
    },
    sections: [
      {
        h2: 'El horario que funciona',
        paragraphs: [
          'Hay dos franjas clásicas. La de comida, de 14:00 a 19:00, y la de tarde, de 17:00 a 22:00. La primera encaja mejor con familias y gente mayor; la segunda con grupos de amigos que quieren que se parezca más a una fiesta.',
          'Lo importante es poner hora de fin y respetarla. El tardeo funciona precisamente porque se acaba pronto. Si se alarga hasta la una, ya es otra cosa (y otro presupuesto).',
        ],
      },
      {
        h2: 'El DJ de tarde no es el DJ de noche',
        matchRole: 'dj',
        paragraphs: [
          'Aquí es donde más se falla. Un tardeo arranca con conversación, así que las dos primeras horas piden música de fondo: nu disco, funk, house suave, clásicos que la gente reconoce. La pista se abre sola hacia la mitad, y es entonces cuando el DJ sube.',
          'Para un tardeo de 4 a 5 horas con equipo propio, un DJ en Madrid suele cobrar entre 300€ y 700€, según experiencia y si tiene que llevar sonido para exterior. Pregunta siempre si incluye equipo y cuánto tarda en montar.',
        ],
      },
      {
        h2: 'Qué local buscar',
        items: [
          { title: 'Terraza o azotea', text: 'Lo más buscado de abril a octubre. Revisa si tienen límite de decibelios o de hora para música, porque en zonas residenciales es habitual.' },
          { title: 'Sala privada de restaurante', text: 'Resuelve la comida y el espacio a la vez. Pregunta si dejan meter DJ propio o si obligan al suyo.' },
          { title: 'Finca en las afueras', text: 'Para grupos grandes o si queréis piscina. Hay que sumar transporte, así que el horario de comida encaja mejor.' },
          { title: 'Sala de ocio nocturno por la tarde', text: 'Muchas salas alquilan en horario de tarde, que para ellas es tiempo muerto. Suele salir más barato que en noche y ya tienen sonido.' },
        ],
      },
      {
        h2: 'Comida y bebida',
        matchRole: 'staff',
        paragraphs: [
          'Picoteo que se pueda comer de pie: raciones, mini bocadillos, algo de fruta si hace calor. Y una barra con opciones sin alcohol que no sean solo refrescos, porque en un tardeo hay más gente que conduce o que simplemente prefiere no beber a las cinco de la tarde.',
          'Si sois más de 40 personas, un camarero de barra hace que todo fluya mucho mejor que el autoservicio.',
        ],
      },
    ],
    faq: [
      { q: '¿Cuánto cuesta un DJ para un tardeo en Madrid?', a: 'Entre 300€ y 700€ por 4 a 5 horas con equipo propio es lo habitual. El precio sube si hay que sonorizar exterior o si el DJ es muy conocido.' },
      { q: '¿Cuántas horas dura un tardeo?', a: 'Entre 4 y 5 horas. Más de 6 empieza a pesar, sobre todo si se empieza a la hora de comer.' },
      { q: '¿Se puede hacer un tardeo en casa o en un chalet?', a: 'Sí, pero ojo con el volumen y los vecinos. Un DJ con experiencia en eventos privados sabe ajustar el sonido para eso.' },
    ],
    directorio: [
      { href: '/directorio/dj', label: 'DJs' },
      { href: '/directorio/staff', label: 'Camareros' },
      { href: '/directorio/grupo-musical', label: 'Grupos en directo' },
    ],
    formTitle: '¿Tienes un tardeo en mente?',
  },
  {
    slug: '/blog/afterwork-empresa-madrid',
    title: 'Afterwork de empresa en Madrid: horario, DJ y cuánto cuesta (2026)',
    desc: 'Cómo organizar un afterwork de empresa en Madrid: a qué hora empezar, qué local elegir, cuánto cuesta un DJ y qué servir para que vaya todo el equipo y no solo los de siempre.',
    h1: 'Afterwork de empresa en Madrid: cómo organizarlo y cuánto cuesta',
    short: 'Afterwork',
    cardText: 'El equipo junto al salir de la oficina, sin la cena hasta las tantas.',
    tone: 'sky',
    plan: 'Afterwork',
    intro: 'La cena de empresa hasta las tantas sigue existiendo, pero cada vez más equipos la cambian, o la complementan, por un afterwork: se empieza al salir de la oficina y a las nueve y media todo el mundo está camino de casa. Llega a más gente, cuesta menos y deja mejor recuerdo. Así se organiza uno que funcione.',
    date: '2026-09-24',
    dateLabel: '24 septiembre 2026',
    answer: {
      question: '¿Cómo se organiza un afterwork de empresa?',
      answer: 'Se elige una franja corta al salir del trabajo (de 18:00 a 21:00 es lo habitual), un espacio cerca de la oficina, picoteo en lugar de cena, una barra con buenas opciones sin alcohol y música que acompañe: un DJ con volumen de tarde o un grupo acústico.',
    },
    sections: [
      {
        h2: 'Horario: corto y cerca',
        paragraphs: [
          'La clave del afterwork es que no se come la tarde entera. Empezar entre las 17:30 y las 18:30 y cerrar a las 21:00 o 21:30 permite que venga gente con hijos, gente que vive lejos y gente que al día siguiente madruga.',
          'Y cerca de la oficina. Si hay que coger un taxi para llegar, la mitad del equipo desaparece por el camino.',
        ],
      },
      {
        h2: 'Qué contratar',
        items: [
          { title: 'Espacio', text: 'Terraza, sala privada de un bar o la propia oficina si tiene una zona abierta. En la oficina es más barato, pero cuesta más desconectar.', precio: 'Según local; muchos cobran solo consumo mínimo' },
          { title: 'Música', text: 'Un DJ que empiece suave y suba cuando la gente ya ha picado algo. Un dúo acústico también funciona si el espacio es pequeño.', precio: '300-700€ por 3 horas con equipo', matchRole: 'dj' },
          { title: 'Picoteo', text: 'Raciones y cosas que se coman de pie. No hace falta cena: el afterwork termina justo cuando la gente se va a cenar a casa.', precio: '15-35€ por persona' },
          { title: 'Barra', text: 'Un camarero de barra con cócteles, también sin alcohol. Hace que la gente se quede y que nadie se sienta raro por no beber.', precio: '25-45€ por hora de camarero', matchRole: 'staff' },
        ],
      },
      {
        h2: 'Para que vaya todo el equipo',
        paragraphs: [
          'Avisar con tiempo, dos o tres semanas. Ponerlo un jueves mejor que un viernes, porque el viernes mucha gente ya tiene planes. Y que haya algo que hacer aparte de beber: un quiz rápido, un pequeño reconocimiento a alguien del equipo o simplemente buena música y sitio para hablar.',
          'Si hay equipos que teletrabajan, el afterwork es muchas veces la única vez al trimestre que se ven en persona. Merece la pena cuidarlo.',
        ],
      },
    ],
    faq: [
      { q: '¿A qué hora se hace un afterwork?', a: 'Lo más habitual es empezar entre las 17:30 y las 18:30 y terminar a las 21:00 o 21:30, para que la gente pueda cenar en casa.' },
      { q: '¿Cuánto cuesta un afterwork de empresa para 30 personas?', a: 'Depende mucho del local, pero con picoteo, barra y DJ suele moverse entre 1.200€ y 2.500€ en Madrid. Hacerlo en la propia oficina baja bastante el coste.' },
      { q: '¿Es mejor jueves o viernes?', a: 'El jueves suele tener más asistencia: el viernes mucha gente ya tiene planes o se va de fin de semana.' },
    ],
    directorio: [
      { href: '/directorio/dj', label: 'DJs' },
      { href: '/directorio/staff', label: 'Camareros' },
      { href: '/directorio/catering', label: 'Catering' },
    ],
    formTitle: '¿Preparas un afterwork para tu equipo?',
  },
  {
    slug: '/blog/eventos-sin-alcohol',
    title: 'Eventos sin alcohol: cómo organizarlos y qué servir (2026)',
    desc: 'Cómo organizar un evento sin alcohol, o con poco alcohol, que no sea aburrido: cócteles sin alcohol, bartender, horario, música y qué poner en la invitación.',
    h1: 'Eventos sin alcohol: cómo organizarlos para que no sean aburridos',
    short: 'Sin alcohol',
    cardText: 'Coctelería de verdad, sin resaca. Para que nadie se quede fuera.',
    tone: 'leaf',
    plan: 'Evento sin alcohol',
    intro: 'Cada vez hay más gente que no bebe o que bebe mucho menos que hace diez años, y no solo por salud. Conducir, entrenar al día siguiente, estar embarazada o simplemente no apetecer. Un evento sin alcohol (o con alcohol como opción secundaria) ya no es raro. Lo raro es hacerlo bien.',
    date: '2026-09-24',
    dateLabel: '24 septiembre 2026',
    answer: {
      question: '¿Cómo se hace un evento sin alcohol que funcione?',
      answer: 'Cuidando la barra igual que si hubiera alcohol: cócteles sin alcohol de verdad (no zumo con hielo), un bartender que los prepare delante de la gente, música pensada para el horario y una actividad que dé motivo para quedarse.',
    },
    sections: [
      {
        h2: 'La barra es lo primero',
        matchRole: 'staff',
        paragraphs: [
          'El error más común es poner refrescos, agua y un zumo, y ya. La gente lo nota y se va antes. Un bartender con carta de cócteles sin alcohol (con sirope casero, hierbas, fruta fresca, tónicas buenas, versiones sin alcohol de vermut o ginebra) cambia completamente la percepción.',
          'Un bartender para eventos cobra en Madrid entre 25€ y 45€ por hora, según experiencia y si trae material propio. Para 50 a 80 personas, uno suele bastar.',
        ],
      },
      {
        h2: 'Formatos donde encaja muy bien',
        items: [
          { title: 'Eventos de empresa de día', text: 'Presentaciones, desayunos, jornadas. Nadie espera alcohol a las 11 de la mañana, pero sí algo mejor que café de máquina.' },
          { title: 'Cumpleaños infantiles con adultos', text: 'Una barra de cócteles sin alcohol hace que los padres también se lo pasen bien sin que nadie tenga que conducir con dos copas.' },
          { title: 'Eventos deportivos o de bienestar', text: 'Después de una carrera, una clase o una jornada de bienestar, el alcohol pega poco.' },
          { title: 'Bodas y celebraciones con muchos invitados que no beben', text: 'No hace falta que toda la boda sea sin alcohol. Basta con que la opción sin alcohol esté a la altura.' },
        ],
      },
      {
        h2: 'Música y ambiente',
        paragraphs: [
          'Sin alcohol, la gente tarda más en soltarse, así que el DJ o el grupo tiene que construir el ambiente con más cuidado. Funcionan bien los formatos de tarde, las actividades con algo que hacer (taller, juego, clase de baile) y los horarios que no se alargan.',
        ],
      },
      {
        h2: 'Qué poner en la invitación',
        paragraphs: [
          'Nada de disculparse. Algo tipo "habrá coctelería sin alcohol" suena a plan, no a restricción. Si va a haber alcohol como opción, se puede decir igual de natural.',
        ],
      },
    ],
    faq: [
      { q: '¿Cuánto cobra un bartender para un evento?', a: 'En Madrid, entre 25€ y 45€ por hora es lo habitual. Algunos cobran por servicio cerrado, que incluye diseño de carta y material.' },
      { q: '¿Qué cócteles sin alcohol se sirven en eventos?', a: 'Los más pedidos son versiones sin alcohol de mojito, spritz y gin tonic, limonadas de hierbas, y cócteles con kombucha o tónicas premium.' },
      { q: '¿Un evento sin alcohol sale más barato?', a: 'En bebida sí, aunque si se quiere que la barra esté a la altura hay que invertir en bartender y buenos ingredientes. El ahorro real suele estar en seguridad y transporte.' },
    ],
    directorio: [
      { href: '/directorio/staff', label: 'Camareros y bartenders' },
      { href: '/directorio/catering', label: 'Catering' },
      { href: '/directorio/dj', label: 'DJs' },
    ],
    formTitle: '¿Organizas un evento sin alcohol?',
  },
  {
    slug: '/blog/jornada-bienestar-empresa',
    title: 'Jornada de bienestar para empresas: qué incluir y precios (2026)',
    desc: 'Cómo organizar una jornada de bienestar o wellness day para el equipo: yoga, pausas activas, masajes, charlas y comida sana. Qué profesionales contratar y precio orientativo.',
    h1: 'Jornada de bienestar para empresas: qué incluir y cuánto cuesta',
    short: 'Bienestar',
    cardText: 'Una mañana para moverse, comer bien y hablar sin prisa.',
    tone: 'lilac',
    plan: 'Jornada de bienestar',
    intro: 'Una jornada de bienestar no es poner una esterilla en la sala de reuniones y ya. Bien hecha, es una mañana o un día en el que el equipo para, se mueve un poco, come bien y escucha algo útil sobre cómo trabajar sin quemarse. Mal hecha, es una hora de yoga a la que no va casi nadie.',
    date: '2026-09-24',
    dateLabel: '24 septiembre 2026',
    answer: {
      question: '¿Qué se hace en una jornada de bienestar de empresa?',
      answer: 'Lo habitual es combinar una actividad física suave (yoga, estiramientos, paseo), una charla o taller (sueño, estrés, ergonomía), una comida saludable y algo de tiempo libre. Suele durar media jornada o una jornada completa, dentro del horario laboral.',
    },
    sections: [
      {
        h2: 'Bloques que suelen funcionar',
        items: [
          { title: 'Actividad física suave', text: 'Yoga, pilates, estiramientos o una clase de baile tranquila. Mejor algo que pueda hacer cualquiera, sin ropa especial ni nivel previo.', precio: '100-300€ la sesión con instructor' },
          { title: 'Charla o taller práctico', text: 'Sueño, gestión del estrés, ergonomía en el puesto o nutrición. Que sea práctico: la gente quiere salir con dos o tres cosas que pueda aplicar el lunes.', precio: '300-1.200€ según ponente' },
          { title: 'Masajes express', text: 'Sesiones de 10 a 15 minutos en silla. Muy agradecido y fácil de montar en la oficina.', precio: '60-90€ por hora de masajista' },
          { title: 'Comida saludable', text: 'Catering de comida ligera, bowls, fruta de temporada, agua con sabores. Se nota mucho la diferencia con el típico catering de bandejas.', precio: '15-35€ por persona', matchRole: 'catering' },
          { title: 'Música en directo tranquila', text: 'Un dúo acústico o un DJ con sesión chill durante la comida cambia el ambiente sin molestar.', precio: '250-600€', matchRole: 'grupo-musical' },
        ],
      },
      {
        h2: 'Errores habituales',
        paragraphs: [
          'Hacerla fuera del horario laboral. Si es en sábado o después de salir, la asistencia cae en picado y el mensaje que llega es justo el contrario al que se quería dar.',
          'Llenar la agenda. Una jornada de bienestar con ocho actividades seguidas estresa. Mejor tres cosas bien hechas y huecos para hablar.',
          'Hacerla una vez y no volver a hablar del tema. Funciona mucho mejor como algo trimestral, aunque sea más corto, que como un gran evento anual.',
        ],
      },
      {
        h2: '¿En la oficina o fuera?',
        paragraphs: [
          'En la oficina es más barato y más fácil de organizar, pero cuesta desconectar con el portátil a diez metros. Fuera (un espacio con jardín, una finca cerca, un centro de yoga que alquile sala) cambia mucho la sensación. Si el presupuesto da, una vez al año fuera y el resto en la oficina es un buen equilibrio.',
        ],
      },
    ],
    faq: [
      { q: '¿Cuánto cuesta una jornada de bienestar para 30 personas?', a: 'Una media jornada en la oficina con instructor, charla y comida saludable puede rondar los 1.200€ a 2.500€. Si se hace fuera y con más actividades, sube bastante por el espacio y el transporte.' },
      { q: '¿Cada cuánto se debería hacer?', a: 'Mejor algo corto cada trimestre que un único evento grande al año. La constancia es lo que la gente percibe como un cuidado real.' },
      { q: '¿Es obligatorio asistir?', a: 'No debería serlo. Si se hace en horario laboral y con un plan atractivo, la asistencia suele ser alta sin necesidad de obligar.' },
    ],
    directorio: [
      { href: '/directorio/bailarin', label: 'Instructores y bailarines' },
      { href: '/directorio/catering', label: 'Catering' },
      { href: '/directorio/grupo-musical', label: 'Música en directo' },
    ],
    formTitle: '¿Quieres montar una jornada de bienestar?',
  },
];

export function getHZGuide(slug: string): HZGuide {
  const g = HZ_GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`Guía de Healthy Zone no encontrada: ${slug}`);
  return g;
}
