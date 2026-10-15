import { X } from 'lucide-react';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

const dos = (n: number) => String(n).padStart(2, '0');

/** Hoy en hora local como YYYY-MM-DD (toISOString daría el día en UTC). */
export const hoyLocalISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};

// YYYY-MM-DD <-> Date local (new Date('2026-10-16') sería UTC y puede caer en el día anterior).
const aDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const aISO = (d: Date): string => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;

interface Props {
  fechas: string[];
  onChange: (fechas: string[]) => void;
}

/**
 * Fechas del evento (una o varias jornadas): un calendario siempre visible en
 * el que se tocan los días. Tocar un día lo añade; tocarlo otra vez lo quita.
 * No se pueden elegir días pasados.
 *
 * Antes era un <input type="date"> con value="" fijo y alta en cada onChange:
 * en iPhone el selector emite cambios al girar la rueda, cada uno añadía un
 * día (aparecía el de hoy sin pedirlo) y reiniciaba el campo, y la pantalla se
 * quedaba clavada hasta refrescar (13 oct 2026).
 */
const FechasEvento = ({ fechas, onChange }: Props) => {
  const seleccion = fechas.map(aDate);
  const hoy = aDate(hoyLocalISO());

  const alElegir = (dias: Date[] | undefined) => {
    onChange([...new Set((dias ?? []).map(aISO))].sort());
  };

  return (
    <div>
      <div className="rounded-xl flex justify-center" style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }}>
        <Calendar
          mode="multiple"
          selected={seleccion}
          onSelect={alElegir}
          disabled={{ before: hoy }}
          locale={es}
          weekStartsOn={1}
          defaultMonth={seleccion[0] ?? hoy}
          classNames={{
            day: 'h-10 w-10 p-0 font-medium rounded-lg hover:bg-[rgba(212,175,55,0.18)] aria-selected:opacity-100',
            day_selected: '!bg-[#D4AF37] !text-black hover:!bg-[#B8941E] focus:!bg-[#B8941E]',
            day_today: 'border border-[#D4AF37]',
            day_disabled: 'text-[#bbb] opacity-60 hover:bg-transparent',
            cell: 'h-10 w-10 text-center text-sm p-0 relative',
            head_cell: 'text-[#777] rounded-md w-10 font-bold text-[0.75rem]',
          }}
        />
      </div>

      {fechas.length > 0 ? (
        <div className="mt-2">
          <p className="text-[0.75rem] font-black mb-1" style={{ color: '#8A6D0F' }}>
            {fechas.length === 1 ? '1 día elegido' : `${fechas.length} días elegidos`}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fechas.map(d => (
              <span key={d} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
                {aDate(d).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })}
                <button type="button" aria-label={`Quitar ${d}`}
                  onClick={() => onChange(fechas.filter(x => x !== d))}
                  className="opacity-60 hover:opacity-100">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[0.75rem] mt-1.5" style={{ color: '#888' }}>
          Toca los días del evento en el calendario. Si dura varias jornadas, toca todos.
        </p>
      )}
    </div>
  );
};

export default FechasEvento;
