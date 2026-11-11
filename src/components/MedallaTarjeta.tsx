import Medalla, { METAL_FUERTE } from '@/components/Medalla';
import type { Puesto } from '@/lib/podio';

// Medalla del podio colgada de la esquina de la tarjeta del directorio, por
// fuera del borde (10 nov 2026, petición del usuario: "que se vea bien, incluso
// fuera de la tarjeta, algo elegante"; luego "más brillo, colores más fuertes").
// El contenedor de la tarjeta debe ser `relative` y SIN overflow-hidden; la
// tarjeta en sí puede seguir recortando.
const TEXTO: Record<Puesto, string> = { 1: 'Nº1 más escuchado', 2: 'Nº2 más escuchado', 3: 'Nº3 más escuchado' };

/** Filete del metal alrededor de la tarjeta de un DJ del podio, con halo (el usuario lo quiere así). */
export const ANILLO_PODIO: Record<Puesto, string> = {
  1: '0 0 0 3px #E8A800, 0 0 0 5px rgba(255,216,77,0.45), 0 12px 34px rgba(232,168,0,0.45)',
  2: '0 0 0 3px #9AA6B4, 0 0 0 5px rgba(232,237,243,0.8), 0 12px 34px rgba(110,122,136,0.38)',
  3: '0 0 0 3px #C9701F, 0 0 0 5px rgba(242,167,102,0.45), 0 12px 34px rgba(201,112,31,0.42)',
};

// 11 nov 2026: la medalla colgada de la esquina pisaba las etiquetas de la foto
// (Nuevo, Disponible, Seguir). Ahora es una pestaña fina de una sola línea,
// apoyada sobre el aro del podio, fuera de la foto. Hay que dejar ~38 px de
// hueco encima de la tarjeta (gap-y / mt en la rejilla).
const MedallaTarjeta = ({ puesto }: { puesto: Puesto }) => {
  const m = METAL_FUERTE[puesto];
  return (
    <div className="absolute right-4 sm:right-5 z-30 pointer-events-none select-none"
      style={{ bottom: 'calc(100% + 4px)' }}>
      <div className="flex items-center gap-1.5 pl-1 pr-3 rounded-t-xl"
        style={{
          background: `linear-gradient(180deg, ${m.luz} 0%, ${m.claro} 100%)`,
          border: `1px solid ${m.borde}`,
          borderBottom: 'none',
          boxShadow: '0 -3px 8px rgba(46,32,6,0.18)',
        }}>
        <div className="-my-0.5" style={{ filter: 'drop-shadow(0 2px 3px rgba(46,32,6,0.3))' }}>
          <Medalla puesto={puesto} tam={30} brillante />
        </div>
        <span className="text-[0.68rem] font-black whitespace-nowrap" style={{ color: m.hundido }}>
          {TEXTO[puesto]}
        </span>
      </div>
    </div>
  );
};

export default MedallaTarjeta;
