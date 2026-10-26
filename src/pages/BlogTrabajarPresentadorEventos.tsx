import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  "path": "/blog/como-trabajar-de-presentador-de-eventos",
  "titulo": "Cómo trabajar de presentador de eventos y maestro de ceremonias",
  "h1": "Cómo trabajar de presentador de eventos",
  "metaDesc": "Guía para presentadores, speakers y maestros de ceremonias que quieren trabajar en eventos en España: qué se espera de ti, cómo prepararte y cómo conseguir los primeros contratos.",
  "ogDesc": "Qué se espera de un presentador de eventos, cómo prepararte y cómo conseguir tus primeros contratos.",
  "migas": "Presentador de eventos",
  "eyebrow": "Para presentadores",
  "intro": "Galas de premios, congresos, presentaciones de producto, bodas con maestro de ceremonias. Todos necesitan a alguien que lleve el hilo, presente a cada persona a tiempo y salve los imprevistos sin que se note. Si hablas bien en público y no te pones nervioso cuando algo falla, esto te interesa.",
  "fecha": "2026-10-26",
  "fechaTexto": "26 octubre 2026",
  "tarifas": [],
  "fuentes": [],
  "secciones": [
    {
      "titulo": "Qué se espera de un presentador",
      "parrafos": [
        "Conocer el guion mejor que nadie, coordinarse con producción y con los ponentes, y llenar los huecos cuando algo se retrasa. El público solo ve la parte de hablar; el trabajo de verdad está antes.",
        "En bodas, el maestro de ceremonias conduce la ceremonia civil o los momentos clave del banquete. Pide un tono distinto, más cercano y emotivo."
      ]
    }
  ],
  "pasos": [
    {
      "paso": "Graba un vídeo presentando",
      "desc": "Aunque sea un evento pequeño. Que se vea cómo presentas a alguien, cómo das paso a un vídeo y cómo te mueves en el escenario."
    },
    {
      "paso": "Especialízate",
      "desc": "Corporativo, bodas, deportes, tecnología. Si conoces el sector del evento, el cliente confía más en ti."
    },
    {
      "paso": "Prepara cada evento a fondo",
      "desc": "Reunión previa con el cliente, guion con tiempos y nombres bien escritos y un plan para cuando algo se retrasa."
    },
    {
      "paso": "Ten los papeles en regla",
      "desc": "Si trabajas por tu cuenta tendrás que darte de alta como autónomo para poder facturar. Un presupuesto por escrito con fecha, horario, qué incluye y la señal evita malentendidos el día del evento."
    },
    {
      "paso": "Crea tu perfil donde buscan presentadores",
      "desc": "En XPEAK los organizadores piden presentadores para su fecha y su ciudad, y la solicitud llega a los de la zona. Pon tu vídeo, idiomas y tipos de evento."
    }
  ],
  "faqs": [
    {
      "q": "¿Qué diferencia hay entre presentador y speaker?",
      "a": "El presentador conduce el evento y da paso a los demás; el speaker o ponente da una charla propia sobre un tema. Algunas personas hacen las dos cosas."
    },
    {
      "q": "¿Hace falta experiencia en televisión o radio?",
      "a": "No es imprescindible. Ayuda, pero lo que convence al cliente es verte presentar un evento parecido al suyo."
    },
    {
      "q": "¿Cómo consigo mis primeros eventos como presentador?",
      "a": "Graba tus presentaciones, empieza por eventos de tu entorno o de tu sector y crea tu perfil en plataformas donde los organizadores buscan presentadores por ciudad, como XPEAK."
    }
  ],
  "relacionados": [
    {
      "href": "/blog/como-elegir-presentador-evento-empresa",
      "cat": "Speaker",
      "title": "Cómo elegir presentador para tu evento"
    },
    {
      "href": "/blog/cuanto-cobra-un-speaker-de-eventos",
      "cat": "Speaker",
      "title": "Cuánto cobra un speaker"
    }
  ],
  "ctaSlug": "speaker",
  "tag": "Speaker",
  "scrollRole": "speaker_pro",
  "storageKey": "xpeak_scrollcta_como_trabajar_de_presentador_de_eventos_v1"
};

export default function BlogTrabajarPresentadorEventos() {
  return <BlogGuiaTrabajar g={g} />;
}
