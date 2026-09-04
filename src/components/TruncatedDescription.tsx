import { useState } from 'react';

// Tarjetas en grid (CSS grid = align-items: stretch): una descripción larga
// sin tope estira TODA la fila a su altura, no solo su propia tarjeta.
// line-clamp por sí solo ya corta el texto, pero no da forma de leerlo entero
// sin salir de la tarjeta — este componente añade ese "Leer más" inline.
const TruncatedDescription = ({ text, className, style }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [expanded, setExpanded] = useState(false);
  // A ~35 caracteres por línea a este tamaño de tarjeta, 2 líneas caben
  // sobradas hasta ~90 caracteres — por debajo de eso no hay nada que
  // truncar y el botón "Leer más" no debe aparecer.
  const isLong = text.length > 90;

  return (
    <p className={className} style={style}>
      <span className={expanded || !isLong ? undefined : 'line-clamp-2'} style={{ display: expanded ? 'inline' : undefined }}>
        "{text}"
      </span>{isLong && (
        <>
          {' '}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            className="font-bold underline underline-offset-2 whitespace-nowrap"
          >
            {expanded ? 'Leer menos' : 'Leer más'}
          </button>
        </>
      )}
    </p>
  );
};

export default TruncatedDescription;
