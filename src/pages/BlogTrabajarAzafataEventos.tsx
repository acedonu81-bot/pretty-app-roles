import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  path: '/blog/como-trabajar-de-azafata-de-eventos',
  titulo: 'Cómo trabajar de azafata de eventos en España (2026)',
  h1: 'Cómo trabajar de azafata de eventos: sueldo, requisitos y cómo empezar',
  metaDesc: 'Guía para trabajar de azafata o azafato de eventos en España: cuánto se cobra por hora según Jooble e Indeed, qué piden las agencias y cómo conseguir los primeros eventos.',
  ogDesc: 'Sueldo por hora con fuentes, qué piden las agencias y cómo empezar a trabajar en ferias, congresos y eventos de empresa.',
  migas: 'Azafata de eventos',
  eyebrow: 'Para azafatas',
  intro: 'Ferias, congresos, presentaciones de producto, bodas con protocolo. El trabajo de azafata o azafato de eventos es por días sueltos, con horarios que cambian cada semana, y suele ser una de las formas más rápidas de empezar a trabajar en eventos. Esto es lo que se cobra según las fuentes públicas y cómo dar los primeros pasos.',
  fecha: '2026-10-26',
  fechaTexto: '26 octubre 2026',
  tituloTarifas: 'Cuánto cobra una azafata de eventos',
  tarifas: [
    { perfil: 'Azafata de eventos en España, según Jooble', tarifa: '9,49 €/h' },
    { perfil: 'Lo mismo al mes, según Jooble', tarifa: '1.328 €/mes' },
    { perfil: 'Azafato/a en España, según Indeed', tarifa: '9,63 €/h' },
  ],
  notaTarifas: 'Son sueldos medios de personas contratadas, sobre todo a través de agencias, no tarifas de quien trabaja por su cuenta. Jooble se basa en 1.024 salarios (octubre 2026) e Indeed en 469 (actualizado el 19 de octubre de 2026). En XPEAK todavía no hay suficientes azafatas con precio publicado para dar un dato propio.',
  fuentes: [
    { nombre: 'Jooble', url: 'https://es.jooble.org/salary/azafata-eventos/Espa%C3%B1a', dato: 'salario medio de azafata de eventos en España, 9,49 € por hora o 1.328 € al mes, a partir de 1.024 salarios (21 de octubre de 2026).' },
    { nombre: 'Indeed', url: 'https://es.indeed.com/career/azafata-de-eventos/salaries', dato: 'salario medio de azafato/a en España, 9,63 € por hora, 469 salarios publicados (actualizado el 19 de octubre de 2026).' },
  ],
  secciones: [
    {
      titulo: 'Qué hace una azafata de eventos',
      parrafos: [
        'Recibir y acreditar a los asistentes, informar en un stand, acompañar a ponentes, repartir material, controlar accesos o atender a invitados en una boda o una cena de empresa. Cada evento es distinto y el organizador te explica qué necesita antes de empezar.',
        'Lo que más se valora es la puntualidad, el trato con la gente y la imagen cuidada. Los idiomas abren las ferias y congresos internacionales, que suelen ser los eventos de varios días seguidos.',
      ],
    },
  ],
  pasos: [
    { paso: 'Prepara un perfil con foto profesional', desc: 'Una foto de cuerpo entero y otra de cara, con buena luz y ropa formal. Es lo primero que mira quien te va a contratar.' },
    { paso: 'Apunta tus idiomas y tu experiencia', desc: 'Aunque solo hayas trabajado de cara al público en una tienda o un bar, cuenta. Di qué idiomas hablas y a qué nivel, sin exagerar: en un congreso se nota enseguida.' },
    { paso: 'Ten los papeles en regla', desc: 'Si te contrata una agencia, te hará un contrato por evento y necesitarás DNI o NIE y número de la Seguridad Social. Si trabajas por tu cuenta, tendrás que darte de alta como autónoma para poder facturar.' },
    { paso: 'Crea tu perfil donde buscan azafatas', desc: 'En XPEAK los organizadores piden azafatas para su fecha y su ciudad, y la solicitud llega a las profesionales de la zona. Con foto, idiomas y disponibilidad tienes más opciones de que te elijan.' },
    { paso: 'Di que sí a los primeros eventos', desc: 'Las primeras ferias y congresos son los que te dan contactos. Los organizadores repiten con quien llega a su hora y resuelve sin quejarse.' },
  ],
  faqs: [
    { q: '¿Cuánto cobra una azafata de eventos por hora?', a: 'Según Jooble, el salario medio de una azafata de eventos en España es de 9,49 € por hora (1.328 € al mes), con datos de octubre de 2026. Indeed da 9,63 € por hora para azafato/a en general. Son sueldos de personas contratadas, no tarifas de autónomas.' },
    { q: '¿Necesito experiencia para trabajar de azafata de eventos?', a: 'No siempre. Muchas agencias contratan a personas sin experiencia en eventos si tienen buen trato con el público. La experiencia y los idiomas te dan acceso a ferias y congresos más grandes.' },
    { q: '¿Hay azafatos además de azafatas?', a: 'Sí. Es un trabajo para cualquier persona y cada vez se piden más azafatos, sobre todo en ferias, eventos deportivos y control de accesos.' },
  ],
  relacionados: [
    { href: '/blog/precio-azafatas-eventos-espana', cat: 'Azafatas', title: 'Precio de azafatas para eventos en España' },
    { href: '/blog/como-trabajar-de-camarero-eventos', cat: 'Staff', title: 'Cómo trabajar de camarero en eventos' },
    { href: '/blog/como-trabajar-de-rrpp-discoteca', cat: 'Staff', title: 'Cómo trabajar de RRPP en discoteca' },
  ],
  ctaSlug: 'azafata',
  tag: 'Azafatas',
  scrollRole: 'azafata_pro',
  storageKey: 'xpeak_scrollcta_trabajar_azafata_v1',
};

export default function BlogTrabajarAzafataEventos() {
  return <BlogGuiaTrabajar g={g} />;
}
