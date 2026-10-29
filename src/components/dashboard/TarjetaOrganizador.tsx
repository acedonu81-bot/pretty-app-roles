import { Building2, MapPin, Handshake, MessageSquare } from 'lucide-react';

// Ficha corta de una empresa que ha elegido mostrarse a los profesionales
// (29 oct 2026). La usan la sección "Organizadores" de los profesionales y la
// vista previa del empresario, para que vea exactamente lo que se enseña.
// Nunca lleva teléfono ni email: el contacto es por el chat de la app.

export interface Organizador {
  user_id: string;
  nombre: string;
  logo: string | null;
  ciudad: string | null;
  descripcion: string | null;
  contrataciones: number | string;
}

interface Props {
  org: Organizador;
  /** Si se pasa, aparece el botón de escribir (solo en la vista del profesional). */
  onEscribir?: (userId: string, nombre: string) => void;
}

export const textoContrataciones = (n: number) =>
  n === 0 ? 'Aún sin contrataciones en XPEAK' : `${n} ${n === 1 ? 'contratación' : 'contrataciones'} en XPEAK`;

export default function TarjetaOrganizador({ org, onEscribir }: Props) {
  const n = Number(org.contrataciones);
  return (
    <div className="rounded-2xl p-4 bg-white border flex flex-col gap-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="flex items-center gap-3">
        {org.logo ? (
          <img src={org.logo} alt={`Logo de ${org.nombre}`} loading="lazy" className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
        ) : (
          <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black"
            style={{ background: 'rgba(212,175,55,0.14)', color: '#8A6D0F' }} aria-hidden>
            {org.nombre.trim().charAt(0).toUpperCase() || <Building2 size={18} />}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-extrabold truncate" style={{ color: '#111' }}>{org.nombre}</p>
          {org.ciudad && (
            <p className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}><MapPin size={11} />{org.ciudad}</p>
          )}
        </div>
      </div>
      {org.descripcion && <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{org.descripcion}</p>}
      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: n > 0 ? '#047857' : '#6b7280' }}>
        <Handshake size={13} />{textoContrataciones(n)}
      </p>
      {onEscribir && (
        <button type="button" onClick={() => onEscribir(org.user_id, org.nombre)}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
          <MessageSquare size={13} /> Escribir por el chat
        </button>
      )}
    </div>
  );
}
