import Medalla, { METAL_FUERTE } from '@/components/Medalla';
import type { Puesto } from '@/lib/podio';

// Medalla del podio colgada de la esquina de la tarjeta del directorio, por
// fuera del borde (10 nov 2026, petición del usuario: "que se vea bien, incluso
// fuera de la tarjeta, algo elegante"; luego "más brillo, colores más fuertes").
// El contenedor de la tarjeta debe ser `relative` y SIN overflow-hidden; la
// tarjeta en sí puede seguir recortando.
const TEXTO: Record<Puesto, string> = { 1: 'Nº1 más escuchado', 2: 'Nº2 más escuchado', 3: 'Nº3 más escuchado' };

/** Filete del metal alrededor de la tarjeta de un DJ del podio, con halo. */
export const ANILLO_PODIO: Record<Puesto, string> = {
  1: '0 0 0 3px #E8A800, 0 0 0 5px rgba(255,216,77,0.45), 0 12px 34px rgba(232,168,0,0.45)',
  2: '0 0 0 3px #9AA6B4, 0 0 0 5px rgba(232,237,243,0.8), 0 12px 34px rgba(110,122,136,0.38)',
  3: '0 0 0 3px #C9701F, 0 0 0 5px rgba(242,167,102,0.45), 0 12px 34px rgba(201,112,31,0.42)',
};

const MedallaTarjeta = ({ puesto }: { puesto: Puesto }) => {
  const m = METAL_FUERTE[puesto];
  return (
    <div className="absolute -top-5 -right-2 sm:-right-3 z-30 flex flex-col items-center pointer-events-none select-none origin-top-right scale-[0.85] sm:scale-100">
      <div style={{ filter: `drop-shadow(0 6px 10px rgba(46,32,6,0.35)) drop-shadow(0 0 10px ${m.claro})` }}>
        <Medalla puesto={puesto} tam={58} brillante />
      </div>
      <span className="-mt-2 px-2.5 py-0.5 rounded-full text-[0.68rem] font-black whitespace-nowrap"
        style={{
          background: `linear-gradient(180deg, ${m.claro} 0%, ${m.medio} 100%)`,
          color: puesto === 2 ? '#2B3138' : '#fff',
          textShadow: puesto === 2 ? 'none' : `0 1px 1px ${m.borde}`,
          border: `1px solid ${m.borde}`,
          boxShadow: '0 3px 8px rgba(46,32,6,0.25)',
        }}>
        {TEXTO[puesto]}
      </span>
    </div>
  );
};

export default MedallaTarjeta;
