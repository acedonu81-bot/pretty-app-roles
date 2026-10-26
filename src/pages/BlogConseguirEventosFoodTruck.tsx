import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  "path": "/blog/como-conseguir-eventos-food-truck",
  "titulo": "Cómo conseguir eventos con tu food truck",
  "h1": "Cómo conseguir más eventos con tu food truck",
  "metaDesc": "Guía para food trucks en España: formación obligatoria en higiene alimentaria, qué preguntar sobre permisos y cómo conseguir bodas, festivales y eventos de empresa.",
  "ogDesc": "Formación obligatoria, permisos y cómo conseguir más bodas, festivales y eventos de empresa con tu food truck.",
  "migas": "Food truck",
  "eyebrow": "Para food trucks",
  "intro": "Los food trucks han pasado de los festivales a las bodas, los eventos de empresa y las fiestas privadas. El organizador busca algo distinto a un catering clásico y que funcione sin cocina en el espacio. Esto es lo que ayuda a conseguir más fechas.",
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
      "titulo": "Papeles y permisos",
      "parrafos": [
        "Quien manipula alimentos tiene que estar formado en higiene alimentaria: lo exige el Reglamento (CE) 852/2004, y el carné de manipulador como tal ya no existe, según la Consejería de Salud del Govern balear.",
        "Los permisos para vender en la calle o en espacios públicos dependen de cada ayuntamiento. En eventos privados, pregunta siempre al organizador si el espacio permite vehículos, si hay toma de corriente y si hace falta algún permiso."
      ]
    }
  ],
  "pasos": [
    {
      "paso": "Define tu formato para eventos",
      "desc": "Menú cerrado por invitado, barra libre de tu producto o venta directa al público. Cada evento pide uno distinto."
    },
    {
      "paso": "Enseña el camión en eventos reales",
      "desc": "Fotos del food truck montado, con gente y con tu producto. Que el organizador se lo imagine en su evento."
    },
    {
      "paso": "Aclara la logística",
      "desc": "Medidas del vehículo, acceso que necesitas, si llevas generador o necesitas corriente, agua y tiempo de montaje."
    },
    {
      "paso": "Ten los papeles en regla",
      "desc": "Formación del personal, registro sanitario según tu comunidad autónoma y presupuestos por escrito."
    },
    {
      "paso": "Crea tu perfil donde buscan food trucks",
      "desc": "En XPEAK los organizadores piden food trucks para su fecha y su ciudad, y la solicitud llega a los de la zona. Pon tu menú, fotos y qué necesitas en el espacio."
    }
  ],
  "faqs": [
    {
      "q": "¿Qué necesito para llevar mi food truck a un evento privado?",
      "a": "Personal formado en higiene alimentaria, tu registro sanitario y confirmar con el organizador el acceso del vehículo, la corriente y si el espacio necesita algún permiso."
    },
    {
      "q": "¿Hace falta carné de manipulador?",
      "a": "El carné como tal ya no existe. Lo obligatorio es la formación en higiene alimentaria del personal, según el Reglamento (CE) 852/2004."
    },
    {
      "q": "¿Cómo consigo más eventos con mi food truck?",
      "a": "Enseña tu camión en eventos reales, deja clara la logística y crea tu perfil en plataformas donde los organizadores buscan food trucks por ciudad, como XPEAK."
    }
  ],
  "relacionados": [
    {
      "href": "/blog/cuanto-cuesta-un-food-truck-para-evento",
      "cat": "Eventos",
      "title": "Cuánto cuesta un food truck para un evento"
    },
    {
      "href": "/blog/donde-publicar-food-truck-eventos",
      "cat": "Eventos",
      "title": "Dónde publicar tu food truck para eventos"
    }
  ],
  "ctaSlug": "food-truck",
  "tag": "Eventos",
  "scrollRole": "profesional_pro",
  "storageKey": "xpeak_scrollcta_como_conseguir_eventos_food_truck_v1"
};

export default function BlogConseguirEventosFoodTruck() {
  return <BlogGuiaTrabajar g={g} />;
}
