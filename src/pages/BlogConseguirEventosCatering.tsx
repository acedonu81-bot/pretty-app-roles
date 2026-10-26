import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  "path": "/blog/como-conseguir-eventos-catering",
  "titulo": "Cómo conseguir más eventos con tu catering",
  "h1": "Cómo conseguir más eventos con tu catering",
  "metaDesc": "Guía para empresas de catering en España: la formación obligatoria del personal, cómo presentar tus menús y cómo conseguir bodas, comuniones y eventos de empresa.",
  "ogDesc": "Formación obligatoria del personal, cómo presentar tus menús y cómo conseguir más eventos con tu catering.",
  "migas": "Catering",
  "eyebrow": "Para caterings",
  "intro": "Un catering no compite solo por la comida: compite por que el organizador se olvide de todo lo que tiene que ver con comer y beber ese día. Bodas, comuniones y eventos de empresa son tu mercado. Esto es lo que ayuda a conseguir más fechas.",
  "fecha": "2026-10-26",
  "fechaTexto": "26 octubre 2026",
  "tarifas": [],
  "fuentes": [
    {
      "nombre": "Govern de les Illes Balears, Seguridad Alimentaria",
      "url": "https://www.caib.es/sites/seguretatalimentaria/es/manipulador_daliments_-43796/",
      "dato": "ya no existe el carné de manipulador; la formación del personal es obligatoria por el Reglamento (CE) 852/2004 (anexo II, capítulo XII) y es responsabilidad de la empresa alimentaria."
    }
  ],
  "secciones": [
    {
      "titulo": "La formación del personal es obligatoria",
      "parrafos": [
        "El carné de manipulador ya no existe como tal, pero quien manipula alimentos tiene que estar formado en higiene alimentaria. La obligación viene del Reglamento (CE) 852/2004 y la responsable de que el personal esté formado es la empresa alimentaria, según explica la Consejería de Salud del Govern balear.",
        "Ten esa formación documentada. Es lo primero que conviene poder enseñar si un cliente o una inspección lo pide."
      ]
    }
  ],
  "pasos": [
    {
      "paso": "Presenta menús cerrados y claros",
      "desc": "Cóctel, buffet, menú sentado. Qué incluye cada uno, qué bebida, cuánto personal de sala. El cliente necesita comparar sin llamar diez veces."
    },
    {
      "paso": "Enseña tus eventos",
      "desc": "Fotos reales de montajes y platos en eventos, no solo de cocina. Que se vea cómo queda una mesa o una barra."
    },
    {
      "paso": "Ofrece degustación",
      "desc": "Para bodas, la prueba de menú es casi obligatoria. Explica cuándo se hace y en qué condiciones."
    },
    {
      "paso": "Ten los papeles en regla",
      "desc": "Registro sanitario de tu actividad según tu comunidad autónoma, formación del personal y presupuestos por escrito con número de invitados, menú y condiciones de pago."
    },
    {
      "paso": "Crea tu perfil donde buscan catering",
      "desc": "En XPEAK los organizadores piden catering para su fecha y su ciudad, y la solicitud llega a los de la zona. Pon tus formatos, la zona que cubres y fotos de eventos."
    }
  ],
  "faqs": [
    {
      "q": "¿Sigue existiendo el carné de manipulador de alimentos?",
      "a": "No como tal. Lo que es obligatorio es la formación en higiene alimentaria del personal, según el Reglamento (CE) 852/2004, y la empresa es responsable de que su personal la tenga."
    },
    {
      "q": "¿Qué eventos contratan más catering?",
      "a": "Bodas, comuniones, eventos y cenas de empresa y celebraciones privadas en espacios sin cocina propia."
    },
    {
      "q": "¿Cómo consigo más eventos con mi catering?",
      "a": "Presenta menús claros, enseña fotos de eventos reales y crea tu perfil en plataformas donde los organizadores buscan catering por ciudad, como XPEAK."
    }
  ],
  "relacionados": [
    {
      "href": "/blog/catering-boda-precio-por-persona",
      "cat": "Catering",
      "title": "Catering boda: precio por persona"
    },
    {
      "href": "/blog/catering-para-eventos-de-empresa",
      "cat": "Catering",
      "title": "Catering para eventos de empresa"
    }
  ],
  "ctaSlug": "catering",
  "tag": "Catering",
  "scrollRole": "profesional_pro",
  "storageKey": "xpeak_scrollcta_como_conseguir_eventos_catering_v1"
};

export default function BlogConseguirEventosCatering() {
  return <BlogGuiaTrabajar g={g} />;
}
