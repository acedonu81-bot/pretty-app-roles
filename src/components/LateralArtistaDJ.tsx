import type { ReactNode } from 'react';
import { BadgeCheck, Calendar, Car, Clock, Disc3, Euro, ExternalLink, Headphones, Languages, MapPin, Star, UserCheck, Users } from 'lucide-react';
import type { EnlaceArtista } from '@/lib/enlacesArtista';

// Columna lateral del perfil de DJ, como la de Hearthis (1-2 nov 2026):
// cifras con icono (seguidores, siguiendo, escuchas de hoy/ayer/total),
// contratar, "Acerca de" y "Enlaces". Una cifra a 0 no se enseña (un
// "0 seguidores" se lee como señal negativa). Sin "Apoya a este artista":
// mover dinero fuera de la app no encaja con XPEAK.
const Fila = ({ icono, valor, texto, color = '#8B6A00', onClick }: { icono: ReactNode; valor?: ReactNode; texto: ReactNode; color?: string; onClick?: () => void }) => {
  const contenido = (
    <>
      <span className="w-5 flex justify-center flex-shrink-0" style={{ color }}>{icono}</span>
      <span className="text-sm" style={{ color: '#555' }}>
        {valor !== undefined && <b className="text-base font-black tabular-nums mr-1.5" style={{ color: '#111' }}>{valor}</b>}
        {texto}
      </span>
    </>
  );
  return (
    <li className="py-1.5">
      {onClick
        ? <button type="button" onClick={onClick} className="flex items-center gap-3 text-left hover:opacity-75">{contenido}</button>
        : <div className="flex items-center gap-3">{contenido}</div>}
    </li>
  );
};

const LateralArtistaDJ = ({
  seguidores, siguiendo = 0, sets, resenas, mediaResenas, precio, zona, estilos, antiguedad, verificado,
  escuchasHoy = 0, escuchasAyer = 0, escuchasTotal = 0, enlaces = [], llamadas, extra, onIrA,
  idiomas = [], radioKm = null, respuesta = null,
}: {
  seguidores: number | null;
  siguiendo?: number;
  sets: number;
  resenas: number;
  mediaResenas: number | null;
  precio: string | null;
  zona: string | null;
  estilos: string[];
  antiguedad: string | null;
  verificado: boolean;
  escuchasHoy?: number;
  escuchasAyer?: number;
  escuchasTotal?: number;
  enlaces?: EnlaceArtista[];
  /** Escríbele / Añadir a mi evento. */
  llamadas: ReactNode;
  /** Instagram u otros enlaces propios. */
  extra?: ReactNode;
  /** Pulsar "Seguidores" abre esa pestaña. */
  onIrA?: (p: 'seguidores') => void;
  idiomas?: string[];
  /** Km de desplazamiento sin coste (travel_free_km). */
  radioKm?: number | null;
  /** Texto de tiempo de respuesta; solo si hay dato real. */
  respuesta?: string | null;
}) => (
  <aside className="flex flex-col gap-6">
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.25)' }}>
      {precio
        ? <p className="text-2xl font-black" style={{ color: '#111' }}>{precio}</p>
        : <p className="text-sm font-semibold" style={{ color: '#555' }}>Precio a consultar</p>}
      <p className="text-xs mt-0.5" style={{ color: '#666' }}>Contrato directo · Pago acordado con el DJ</p>
      {respuesta && (
        <p className="text-xs mt-2 flex items-center gap-1.5 font-semibold" style={{ color: '#047857' }}><Clock size={13} /> {respuesta}</p>
      )}
      <div className="flex flex-col gap-2 mt-4">{llamadas}</div>
    </div>

    <ul>
      {!!seguidores && (
        <Fila icono={<Users size={17} />} color="#2563EB" valor={seguidores} texto={seguidores === 1 ? 'Seguidor' : 'Seguidores'}
          onClick={onIrA ? () => onIrA('seguidores') : undefined} />
      )}
      {siguiendo > 0 && <Fila icono={<UserCheck size={17} />} color="#2563EB" valor={siguiendo} texto="Siguiendo" />}
      {escuchasHoy > 0 && <Fila icono={<Headphones size={17} />} color="#2563EB" valor={escuchasHoy} texto={escuchasHoy === 1 ? 'escucha hoy' : 'escuchas hoy'} />}
      {escuchasAyer > 0 && <Fila icono={<Headphones size={17} />} color="#2563EB" valor={escuchasAyer} texto={escuchasAyer === 1 ? 'escucha ayer' : 'escuchas ayer'} />}
      {escuchasTotal > 0 && <Fila icono={<Headphones size={17} />} valor={escuchasTotal} texto={escuchasTotal === 1 ? 'escucha en total' : 'escuchas en total'} />}
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
        {idiomas.length > 0 && <Fila icono={<Languages size={17} />} texto={idiomas.join(', ')} />}
        {!!radioKm && radioKm > 0 && <Fila icono={<Car size={17} />} texto={`Se desplaza hasta ${radioKm} km sin coste`} />}
        {antiguedad && <Fila icono={<Calendar size={17} />} texto={antiguedad.charAt(0).toUpperCase() + antiguedad.slice(1)} />}
      </ul>
      {estilos.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {estilos.map(e => (
            <span key={e} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.1)', color: '#1D4ED8' }}>{e}</span>
          ))}
        </div>
      )}
    </div>

    {(enlaces.length > 0 || extra) && (
      <div>
        <h2 className="text-lg font-black mb-2" style={{ color: '#111' }}>Enlaces</h2>
        <ul className="flex flex-col gap-2">
          {extra && <li>{extra}</li>}
          {enlaces.map(e => (
            <li key={e.url}>
              <a href={e.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: '#333' }}>
                <ExternalLink size={15} style={{ color: '#8B6A00' }} /> {e.plataforma}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </aside>
);

export default LateralArtistaDJ;
