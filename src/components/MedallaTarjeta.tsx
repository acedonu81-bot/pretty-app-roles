import Medalla from '@/components/Medalla';
import type { Puesto } from '@/lib/podio';

// Medalla del podio colgada de la esquina de la tarjeta del directorio, por
// fuera del borde (10 nov 2026, petición del usuario: "que se vea bien, incluso
// fuera de la tarjeta, algo elegante"). El contenedor de la tarjeta debe ser
// `relative` y SIN overflow-hidden; la tarjeta en sí puede seguir recortando.
const TEXTO: Record<Puesto, string> = { 1: 'Nº1 más escuchado', 2: 'Nº2 más escuchado', 3: 'Nº3 más escuchado' };

/** Filete del metal alrededor de la tarjeta de un DJ del podio. */
export const ANILLO_PODIO: Record<Puesto, string> = {
  1: '0 0 0 2px #D4AF37, 0 10px 28px rgba(184,148,30,0.28)',
  2: '0 0 0 2px #B9BEC6, 0 10px 28px rgba(125,131,140,0.22)',
  3: '0 0 0 2px #C9875A, 0 10px 28px rgba(162,96,44,0.22)',
};

const MedallaTarjeta = ({ puesto }: { puesto: Puesto }) => (
  <div className="absolute -top-4 -right-2 sm:-right-3 z-30 flex flex-col items-center pointer-events-none select-none origin-top-right scale-[0.8] sm:scale-100"
    title={`${TEXTO[puesto]} de XPEAK (últimos 30 días)`}>
    <div className="rounded-full" style={{ filter: 'drop-shadow(0 6px 12px rgba(46,32,6,0.28))' }}>
      <Medalla puesto={puesto} tam={52} />
    </div>
    <span className="-mt-2 px-2 py-0.5 rounded-full text-[0.65rem] font-black whitespace-nowrap"
      style={{ background: '#FFFDF7', color: '#8B6A00', border: '1px solid rgba(212,175,55,0.55)', boxShadow: '0 2px 6px rgba(46,32,6,0.12)' }}>
      {TEXTO[puesto]}
    </span>
  </div>
);

export default MedallaTarjeta;
