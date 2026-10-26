import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  path: '/blog/como-trabajar-de-tecnico-de-sonido-eventos',
  titulo: 'Cómo trabajar de técnico de sonido en eventos (2026)',
  h1: 'Cómo trabajar de técnico de sonido en eventos: formación, sueldo y primeros pasos',
  metaDesc: 'Guía para trabajar de técnico de sonido en eventos en España: qué formación oficial existe, cuánto se cobra según Indeed y cómo conseguir los primeros bolos.',
  ogDesc: 'Formación oficial, sueldo con fuente y cómo empezar a trabajar de técnico de sonido en bodas, conciertos y eventos de empresa.',
  migas: 'Técnico de sonido',
  eyebrow: 'Para técnicos',
  intro: 'Detrás de cada boda que suena bien, de cada concierto y de cada presentación de empresa hay alguien que monta, prueba y vigila el sonido. Es un trabajo técnico, con mucha carga y descarga, y con demanda los fines de semana. Esto es lo que necesitas saber para empezar.',
  fecha: '2026-10-26',
  fechaTexto: '26 octubre 2026',
  tituloTarifas: 'Cuánto cobra un técnico de sonido',
  tarifas: [
    { perfil: 'Técnico/a de sonido en España, según Indeed', tarifa: '20.761 €/año' },
  ],
  notaTarifas: 'Sueldo medio de personas contratadas, basado solo en 13 salarios publicados en Indeed (actualizado el 11 de octubre de 2026), así que tómalo como una referencia aproximada. No es la tarifa de quien trabaja por su cuenta en eventos. En XPEAK todavía no hay suficientes técnicos con precio publicado para dar un dato propio.',
  fuentes: [
    { nombre: 'Indeed', url: 'https://es.indeed.com/career/t%C3%A9cnico-de-sonido/salaries', dato: 'salario medio de técnico/a de sonido en España, 20.761 € al año, 13 salarios publicados (actualizado el 11 de octubre de 2026).' },
    { nombre: 'Real Decreto 1682/2011', url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-19601', dato: 'título de Técnico Superior en Sonido para Audiovisuales y Espectáculos, Formación Profesional de grado superior de 2.000 horas, familia Imagen y Sonido.' },
  ],
  secciones: [
    {
      titulo: 'Qué formación existe',
      parrafos: [
        'La vía oficial es el ciclo de grado superior de Técnico Superior en Sonido para Audiovisuales y Espectáculos (Real Decreto 1682/2011), de 2.000 horas, dentro de la familia de Imagen y Sonido. Entre sus módulos están control de sonido en directo, instalaciones de sonido, ajustes de sistemas de sonorización y electroacústica.',
        'No es obligatorio para trabajar en eventos, pero ayuda mucho cuando quieres entrar en empresas de sonido o en producciones grandes. Muchos técnicos empiezan como auxiliares de montaje y aprenden en el propio trabajo.',
      ],
    },
  ],
  pasos: [
    { paso: 'Aprende con el equipo que se usa en eventos', desc: 'Mesas digitales, sistemas de altavoces, microfonía inalámbrica. Si puedes, entra como auxiliar en una empresa de sonido: verás muchos eventos distintos en poco tiempo.' },
    { paso: 'Guarda pruebas de lo que haces', desc: 'Fotos del montaje, el tipo de evento y el número de asistentes. A quien te contrata le da confianza ver que ya has sacado adelante eventos parecidos.' },
    { paso: 'Ten los papeles en regla', desc: 'Si trabajas por tu cuenta tendrás que darte de alta como autónomo para facturar. Si te contrata una empresa de sonido, lo normal es un contrato por evento o por temporada.' },
    { paso: 'Crea tu perfil donde buscan técnicos', desc: 'En XPEAK los organizadores piden profesionales para su fecha y su ciudad, y la solicitud llega a los de la zona. Indica si llevas equipo propio o solo tu trabajo: es lo primero que preguntan.' },
    { paso: 'Cuida las pruebas de sonido', desc: 'Llegar con tiempo, probar antes de que entre el público y tener un plan B si falla algo. En sonido, lo que se recuerda es el fallo, así que la fiabilidad es tu mejor carta.' },
  ],
  faqs: [
    { q: '¿Cuánto gana un técnico de sonido en España?', a: 'Según Indeed, el salario medio de técnico/a de sonido en España es de 20.761 € al año, aunque se basa solo en 13 salarios publicados (octubre 2026). Es el sueldo de personas contratadas, no la tarifa de un técnico autónomo en eventos.' },
    { q: '¿Qué hay que estudiar para ser técnico de sonido?', a: 'La formación oficial es el ciclo de grado superior de Técnico Superior en Sonido para Audiovisuales y Espectáculos (Real Decreto 1682/2011). No es obligatorio para trabajar en eventos, pero facilita entrar en empresas de sonido.' },
    { q: '¿Necesito equipo propio?', a: 'No para empezar. Muchas empresas de sonido contratan técnicos para manejar su equipo. Tener equipo propio te permite ofrecer el servicio completo a organizadores de eventos pequeños.' },
  ],
  relacionados: [
    { href: '/blog/tecnico-de-sonido-para-eventos', cat: 'Técnica', title: 'Técnico de sonido para eventos: precios' },
    { href: '/blog/como-empezar-dj-eventos-principiante', cat: 'Para DJs', title: 'Cómo empezar a pinchar en eventos' },
    { href: '/blog/como-trabajar-de-camarero-eventos', cat: 'Staff', title: 'Cómo trabajar de camarero en eventos' },
  ],
  ctaSlug: 'tecnico-sonido',
  tag: 'Eventos',
  scrollRole: 'profesional_pro',
  storageKey: 'xpeak_scrollcta_trabajar_tecnico_sonido_v1',
};

export default function BlogTrabajarTecnicoSonido() {
  return <BlogGuiaTrabajar g={g} />;
}
