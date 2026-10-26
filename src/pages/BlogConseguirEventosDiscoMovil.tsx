import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  "path": "/blog/como-conseguir-eventos-disco-movil",
  "titulo": "Cómo conseguir eventos con tu disco móvil",
  "h1": "Cómo conseguir más eventos con tu disco móvil",
  "metaDesc": "Guía para disco móviles en España: cómo presentar tu equipo, qué eventos contratan (comuniones, bodas, verbenas) y cómo conseguir más fechas.",
  "ogDesc": "Cómo presentar tu equipo y conseguir más comuniones, bodas y verbenas con tu disco móvil.",
  "migas": "Disco móvil",
  "eyebrow": "Para disco móviles",
  "intro": "Una disco móvil vende algo muy concreto: llegar, montar y que haya fiesta, con música, sonido y luces incluidos. Comuniones, bodas, fiestas de pueblo y cumpleaños grandes son tu mercado. Esto es lo que ayuda a llenar el calendario.",
  "fecha": "2026-10-26",
  "fechaTexto": "26 octubre 2026",
  "tarifas": [],
  "fuentes": [],
  "secciones": [
    {
      "titulo": "Qué compra el cliente",
      "parrafos": [
        "Tranquilidad: no tener que buscar DJ, equipo de sonido e iluminación por separado. Cuanto más claro dejes qué incluye tu servicio, menos dudas tendrá.",
        "Cada tipo de evento pide algo distinto: en una comunión, música para todas las edades y juegos para los niños; en una verbena, potencia para un espacio abierto."
      ]
    }
  ],
  "pasos": [
    {
      "paso": "Enseña tu montaje",
      "desc": "Fotos y vídeos del equipo montado en eventos reales, de día y de noche. Que se vea la pista llena."
    },
    {
      "paso": "Describe bien qué incluye",
      "desc": "Sonido, luces, efectos, horas, montaje y desmontaje, desplazamiento. Un servicio claro se compara mejor."
    },
    {
      "paso": "Ten paquetes por tipo de evento",
      "desc": "Comunión, boda, fiesta privada, verbena. El cliente se reconoce en su paquete y decide más rápido."
    },
    {
      "paso": "Ten los papeles en regla",
      "desc": "Si trabajas por tu cuenta tendrás que darte de alta como autónomo para poder facturar. Un presupuesto por escrito con fecha, horario, qué incluye y la señal evita malentendidos el día del evento. Pregunta también al organizador si el espacio tiene permisos y horario límite de música."
    },
    {
      "paso": "Crea tu perfil donde buscan disco móvil",
      "desc": "En XPEAK los organizadores piden disco móvil para su fecha y su ciudad, y la solicitud llega a las de la zona. Pon fotos de tu montaje y qué incluye tu servicio."
    }
  ],
  "faqs": [
    {
      "q": "¿Qué diferencia hay entre DJ y disco móvil?",
      "a": "El DJ pone la música y a veces el equipo; la disco móvil llega con todo: DJ, sonido, luces y efectos, lista para montar la fiesta."
    },
    {
      "q": "¿Qué eventos contratan más disco móvil?",
      "a": "Comuniones, bodas, fiestas de pueblo y verbenas, y cumpleaños o fiestas privadas grandes."
    },
    {
      "q": "¿Cómo consigo más eventos?",
      "a": "Enseña tu montaje con fotos y vídeos reales, ofrece paquetes por tipo de evento y crea tu perfil en plataformas donde los organizadores buscan disco móvil por ciudad, como XPEAK."
    }
  ],
  "relacionados": [
    {
      "href": "/blog/disco-movil-para-comuniones",
      "cat": "DJ",
      "title": "Disco móvil para comuniones"
    },
    {
      "href": "/blog/disco-movil-verbenas-fiestas-pueblo",
      "cat": "DJ",
      "title": "Disco móvil para verbenas"
    }
  ],
  "ctaSlug": "disco-movil",
  "tag": "DJ",
  "scrollRole": "dj_pro",
  "storageKey": "xpeak_scrollcta_como_conseguir_eventos_disco_movil_v1"
};

export default function BlogConseguirEventosDiscoMovil() {
  return <BlogGuiaTrabajar g={g} />;
}
