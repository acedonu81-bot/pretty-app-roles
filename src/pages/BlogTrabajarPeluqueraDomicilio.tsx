import BlogGuiaTrabajar, { type GuiaTrabajar } from '@/components/BlogGuiaTrabajar';

const g: GuiaTrabajar = {
  "path": "/blog/como-trabajar-de-peluquera-a-domicilio-en-bodas",
  "titulo": "Cómo trabajar de peluquera a domicilio en bodas y eventos",
  "h1": "Cómo trabajar de peluquera a domicilio en bodas y eventos",
  "metaDesc": "Guía para peluqueras y peluqueros que quieren trabajar a domicilio en bodas y eventos en España: sueldo de referencia según Indeed, qué material llevar y cómo conseguir novias.",
  "ogDesc": "Sueldo de referencia con fuente, qué material llevar y cómo conseguir clientes de bodas a domicilio.",
  "migas": "Peluquera a domicilio",
  "eyebrow": "Para peluqueras",
  "intro": "Cada vez más novias, madrinas e invitadas prefieren que la peluquera vaya a casa o al hotel la mañana de la boda. Para quien ya trabaja en un salón, es una forma de tener ingresos propios los fines de semana. Esto es lo que necesitas para empezar.",
  "fecha": "2026-10-26",
  "fechaTexto": "26 octubre 2026",
  "tituloTarifas": "Sueldo de referencia",
  "tarifas": [
    {
      "perfil": "Peluquero/a en España, según Indeed",
      "tarifa": "2.471 €/mes"
    }
  ],
  "notaTarifas": "Es el sueldo medio de una persona contratada en peluquería (Indeed, 1.400 salarios publicados, actualizado el 19 de octubre de 2026), no la tarifa de un servicio a domicilio. En XPEAK todavía no hay suficientes peluqueras con precio publicado para dar un dato propio.",
  "fuentes": [
    {
      "nombre": "Indeed",
      "url": "https://es.indeed.com/career/peluquero/salaries",
      "dato": "salario medio de peluquero/a en España, 2.471 € al mes, 1.400 salarios publicados (actualizado el 19 de octubre de 2026)."
    }
  ],
  "secciones": [
    {
      "titulo": "Qué cambia al trabajar a domicilio",
      "parrafos": [
        "Trabajas en el espacio de otra persona, con la luz y los enchufes que haya, y con el reloj de la boda encima. La organización pesa tanto como la técnica.",
        "Cuenta los desplazamientos y el tiempo de cada peinado cuando aceptes varios servicios en la misma mañana. Llegar tarde a una novia no tiene arreglo."
      ]
    }
  ],
  "pasos": [
    {
      "paso": "Prepara un maletín completo",
      "desc": "Herramientas, productos, horquillas, alargador y espejo. Mejor que sobre que tener que pedir algo en casa de la novia."
    },
    {
      "paso": "Haz fotos de tus peinados",
      "desc": "Recogidos, semirrecogidos y peinados de invitada, con buena luz y desde varios ángulos. Es tu escaparate."
    },
    {
      "paso": "Ofrece prueba previa",
      "desc": "La novia quiere ver el peinado antes del día. Explica si la prueba se cobra aparte o va incluida."
    },
    {
      "paso": "Ten los papeles en regla",
      "desc": "Si trabajas por tu cuenta tendrás que darte de alta como autónomo para poder facturar. Un presupuesto por escrito con fecha, horario, qué incluye y la señal evita malentendidos el día del evento."
    },
    {
      "paso": "Crea tu perfil donde buscan peluqueras",
      "desc": "En XPEAK los organizadores piden peluqueras para su fecha y su ciudad, y la solicitud llega a las de la zona. Pon fotos de tus trabajos y la zona en la que te mueves."
    }
  ],
  "faqs": [
    {
      "q": "¿Cuánto gana una peluquera en España?",
      "a": "Según Indeed, el sueldo medio de un peluquero/a contratado en España es de 2.471 € al mes (octubre 2026). Los servicios a domicilio para bodas se cobran aparte y cada profesional pone su precio."
    },
    {
      "q": "¿Qué necesito para ir a domicilio?",
      "a": "Un maletín completo con herramientas y productos, medio de transporte y una buena organización de horarios si haces varios servicios la misma mañana."
    },
    {
      "q": "¿Cómo consigo novias como peluquera a domicilio?",
      "a": "Haz fotos de tus peinados, colabora con maquilladoras y fotógrafos y crea tu perfil en plataformas donde los organizadores buscan peluqueras por ciudad, como XPEAK."
    }
  ],
  "relacionados": [
    {
      "href": "/blog/peluqueria-domicilio-eventos-precio",
      "cat": "Bodas",
      "title": "Peluquería a domicilio para eventos: precios"
    },
    {
      "href": "/blog/maquilladora-conseguir-clientes",
      "cat": "Maquillaje",
      "title": "Cómo conseguir clientes como maquilladora"
    }
  ],
  "ctaSlug": "peluqueria",
  "tag": "Bodas",
  "scrollRole": "profesional_pro",
  "storageKey": "xpeak_scrollcta_como_trabajar_de_peluquera_a_domicilio_en_bodas_v1"
};

export default function BlogTrabajarPeluqueraDomicilio() {
  return <BlogGuiaTrabajar g={g} />;
}
