import type { ReactNode } from 'react';
import { BadgeCheck, Calendar, Disc3, Euro, MapPin, Star, Users } from 'lucide-react';

// Columna lateral del perfil de DJ, como la de Hearthis (1 nov 2026): cifras
// con icono, botones de contratar y "Acerca de". Una cifra a 0 no se enseña
// (un "0 seguidores" se lee como señal negativa).
const Fila = ({ icono, valor, texto, color = '#8B6A00' }: { icono: ReactNode; valor?: ReactNode; texto: ReactNode; color?: string }) => (
  <li className="flex items-center gap-3 py-1.5">
    <span className="w-5 flex justify-center flex-shrink-0" style={{ color }}>{icono}</span>
    <span className="text-sm" style={{ color: '#555' }}>
      {valor !== undefined && <b className="text-base font-black tabular-nums mr-1.5" style={{ color: '#111' }}>{valor}</b>}
      {texto}
    </span>
  </li>
);

const LateralArtistaDJ = ({ seguidores, sets, resenas, mediaResenas, precio, zona, estilos, antiguedad, verificado, llamadas, extra }: {
  seguidores: number | null;
  sets: number;
  resenas: number;
  mediaResenas: number | null;
  precio: string | null;
  zona: string | null;
  estilos: string[];
  antiguedad: string | null;
  verificado: boolean;
  /** Escríbele / Añadir a mi evento. */
  llamadas: ReactNode;
  /** Instagram u otros enlaces. */
  extra?: ReactNode;
}) => (
  <aside className="flex flex-col gap-6">
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.25)' }}>
      <p className="text-2xl font-black" style={{ color: '#111' }}>{precio ?? 'Precio a consultar'}</p>
      <p className="text-xs mt-0.5" style={{ color: '#666' }}>Contrato directo · Pago acordado con el DJ</p>
      <div className="flex flex-col gap-2 mt-4">{llamadas}</div>
    </div>

    <ul>
      {!!seguidores && <Fila icono={<Users size={17} />} color="#2563EB" valor={seguidores} texto={seguidores === 1 ? 'Seguidor' : 'Seguidores'} />}
      {sets > 0 && <Fila icono={<Disc3 size={17} />} valor={sets} texto={sets === 1 ? 'Set' : 'Sets'} />}
      {resenas > 0 && (
        <Fila icono={<Star size={17} />} color="#059669" valor={mediaResenas !== null ? mediaResenas.toFixed(1) : resenas}
          texto={`${resenas} ${resenas === 1 ? 'reseña' : 'reseñas'} de clientes`} />
      )}
      {precio && <Fila icono={<Euro size={17} />} texto={precio} />}
    </ul>

    <div>
      <h2 className="text-lg font-black mb-2" style={{ color: '#111' }}>Acerca de</h2>
      <ul>
        {verificado && <Fila icono={<BadgeCheck size={17} />} color="#059669" texto={<span className="font-semibold" style={{ color: '#047857' }}>Verificado por XPEAK</span>} />}
        {zona && <Fila icono={<MapPin size={17} />} texto={zona} />}
        {antiguedad && <Fila icono={<Calendar size={17} />} texto={antiguedad.charAt(0).toUpperCase() + antiguedad.slice(1)} />}
      </ul>
      {estilos.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {estilos.map(e => (
            <span key={e} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.1)', color: '#1D4ED8' }}>{e}</span>
          ))}
        </div>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  </aside>
);

export default LateralArtistaDJ;
