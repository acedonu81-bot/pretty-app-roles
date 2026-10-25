/**
 * "Precio solo por pinchar o con equipo propio": va en los artículos de
 * precios de DJ (25 oct). Las tarifas de los perfiles no dicen si el DJ lleva
 * equipo, y en la mayoría de eventos lo lleva: esto avisa de que el
 * presupuesto cambia y da las preguntas para comparar.
 *
 * Un componente para todos, pero con texto propio por tipo de evento: el mismo
 * párrafo repetido en 8 artículos sería contenido duplicado. NO va en los
 * "DJ para bodas en (ciudad)", que ya son casi iguales entre sí.
 */
type Contexto = 'general' | 'cumpleanos' | 'comunion' | 'corporativo' | 'empresa' | 'fiesta-privada' | 'boda-civil' | 'residente';

const TEXTOS: Record<Contexto, { intro: string; preguntas: string[] }> = {
  general: {
    intro: 'Una cosa es contratar a un DJ solo para pinchar, con el sonido ya montado por la sala o el organizador, y otra que traiga su propio equipo. En bodas y eventos suele ser lo segundo, y el presupuesto cambia: además de las horas de música entran los altavoces, la controladora, las luces y el montaje.',
    preguntas: ['¿Lleva altavoces y controladora, o usa los de la sala?', '¿Incluye luces y micrófono para los discursos?', '¿El montaje y el desplazamiento van aparte?'],
  },
  cumpleanos: {
    intro: 'En un cumpleaños en casa, en un local alquilado o en un jardín casi nunca hay sonido montado, así que el DJ suele llevarlo todo. Si el local ya tiene equipo y el DJ solo va a pinchar, el precio baja; si tiene que traer altavoces y luces, sube.',
    preguntas: ['¿El local tiene equipo de sonido o lo pone el DJ?', '¿Incluye micrófono para los juegos y la tarta?', '¿Cobra aparte el montaje si la fiesta es en casa o al aire libre?'],
  },
  comunion: {
    intro: 'Muchos restaurantes de comuniones tienen su propio equipo y el DJ solo va a pinchar; en una finca o en casa, el DJ tiene que llevarlo todo. Esa diferencia cambia el presupuesto más que las horas de música.',
    preguntas: ['¿El restaurante deja usar su equipo o lo trae el DJ?', '¿Incluye micrófono para animar juegos con los niños?', '¿Hay límite de volumen o de horario en el local?'],
  },
  corporativo: {
    intro: 'En hoteles y espacios de eventos lo habitual es que la sala o la productora aporte el sonido y el DJ vaya solo a pinchar. Si el evento es en una oficina, una terraza o un espacio sin instalación, el DJ tiene que traer el equipo y el presupuesto sube.',
    preguntas: ['¿El espacio tiene equipo técnico o hay que llevarlo?', '¿Incluye micrófono inalámbrico para las intervenciones?', '¿El montaje se hace fuera del horario del evento y tiene coste aparte?'],
  },
  empresa: {
    intro: 'En una cena de empresa en restaurante o salón, a veces el local tiene sonido y el DJ solo va a pinchar. En una fiesta en la oficina o en un espacio vacío, el DJ trae altavoces, controladora y luces, y eso se nota en el precio.',
    preguntas: ['¿El sitio tiene equipo de sonido o lo pone el DJ?', '¿Incluye micrófono para el discurso o los premios?', '¿El transporte y el montaje van incluidos?'],
  },
  'fiesta-privada': {
    intro: 'En una fiesta en casa, en una finca o en un local alquilado lo normal es que no haya nada montado y el DJ lo lleve todo. Si el local ya tiene equipo y el DJ va solo a pinchar, el presupuesto es bastante menor.',
    preguntas: ['¿El sitio tiene sonido o hay que llevarlo?', '¿Incluye luces o es solo música?', '¿El montaje y la recogida van aparte?'],
  },
  'boda-civil': {
    intro: 'En una boda civil la música suele ir en varios sitios: la ceremonia, el cóctel y la fiesta. Si la finca tiene equipo en cada zona, el DJ puede ir solo a pinchar; si no, tiene que llevar y mover su equipo, y el precio sube.',
    preguntas: ['¿La finca tiene sonido en la ceremonia, el cóctel y la fiesta?', '¿Incluye micrófono para el oficiante y las lecturas?', '¿Cobra aparte mover el equipo entre zonas?'],
  },
  residente: {
    intro: 'Un DJ residente casi siempre pincha con el equipo de la sala, así que su tarifa es solo por pinchar. Si la sala pide que traiga su propia controladora o cabina, conviene acordarlo por escrito porque cambia el precio.',
    preguntas: ['¿La cabina tiene el equipo que usa el DJ?', '¿Quién paga una avería del equipo durante la sesión?', '¿Hay que traer algo propio, como controladora o auriculares?'],
  },
};

const BlogDJEquipoPrecio = ({ contexto = 'general', tituloClass = 'text-xl font-black mb-4', className = 'mb-10' }: {
  contexto?: Contexto;
  /** Cada artículo usa su tamaño de h2 (text-lg o text-xl). */
  tituloClass?: string;
  className?: string;
}) => {
  const { intro, preguntas } = TEXTOS[contexto];
  return (
    <section className={className}>
      <h2 className={tituloClass}>Precio solo por pinchar o con equipo propio</h2>
      <p className="text-base mb-4 leading-relaxed" style={{ color: '#222' }}>{intro}</p>
      <div className="p-5 rounded-xl" style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.18)' }}>
        <p className="text-sm font-bold mb-2" style={{ color: '#8B6A00' }}>Antes de comparar presupuestos, pregunta:</p>
        <ul className="text-base leading-relaxed list-disc pl-5 space-y-1" style={{ color: '#222' }}>
          {preguntas.map(q => <li key={q}>{q}</li>)}
        </ul>
      </div>
    </section>
  );
};

export default BlogDJEquipoPrecio;
