import { useState } from 'react';
import { Plus, X } from 'lucide-react';

/** Hoy en hora local como YYYY-MM-DD (toISOString daría el día en UTC). */
export const hoyLocalISO = (): string => {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};

interface Props {
  fechas: string[];
  onChange: (fechas: string[]) => void;
}

/**
 * Fechas del evento (varias jornadas). La fecha elegida en el selector se queda
 * en el campo y solo se añade a la lista al pulsar "Añadir día".
 *
 * Antes el input era `value=""` con alta en cada onChange: en iPhone el
 * selector emite cambios mientras se gira la rueda, cada uno añadía un día
 * (aparecía el de hoy sin pedirlo) y reiniciaba el campo, y la pantalla se
 * quedaba clavada hasta refrescar (13 oct 2026). No se pueden elegir días
 * pasados. Si se cierra el selector (pierde el foco) con una fecha elegida, se
 * añade sola: así quien pulsa «Publicar» sin «Añadir día» no pierde su fecha.
 */
const FechasEvento = ({ fechas, onChange }: Props) => {
  const [borrador, setBorrador] = useState('');

  const anadir = () => {
    if (!borrador) return;
    if (!fechas.includes(borrador)) onChange([...fechas, borrador].sort());
    setBorrador('');
  };

  return (
    <div>
      {fechas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {fechas.map(d => (
            <span key={d} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
              {new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              <button type="button" aria-label={`Quitar ${d}`}
                onClick={() => onChange(fechas.filter(x => x !== d))}
                className="opacity-60 hover:opacity-100">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input type="date" aria-label="Elegir día" value={borrador} min={hoyLocalISO()}
          onChange={e => setBorrador(e.target.value)}
          onBlur={anadir}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-base sm:text-sm focus:outline-none"
          style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
        <button type="button" onClick={anadir} disabled={!borrador}
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-40"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
          <Plus size={12} /> Añadir día
        </button>
      </div>
      <p className="text-[10px] mt-1" style={{ color: '#888' }}>
        Elige el día y pulsa «Añadir día». Repite si el evento dura varias jornadas.
      </p>
    </div>
  );
};

export default FechasEvento;
