import { Star } from 'lucide-react';

/**
 * ¿Ya terminó el evento? Compara la ÚLTIMA fecha (un evento de varios días no
 * ha acabado hasta el último) con hoy; `hoy` en YYYY-MM-DD. Sin fecha válida
 * no se puede afirmar que haya ocurrido.
 */
export function eventoYaOcurrio(fechas: (string | null | undefined)[], hoy: string): boolean {
  const validas = fechas.filter((f): f is string => typeof f === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f))
    .map(f => f.slice(0, 10)).sort();
  if (validas.length === 0) return false;
  return validas[validas.length - 1] <= hoy;
}

interface Props {
  nombre: string;
  yaOcurrio: boolean;
  valorado: boolean;
  onValorar: () => void;
}

/**
 * Bloque de valoración bajo el profesional contratado en la tarjeta de la
 * oferta. Antes el botón solo existía en Empresario > Historial y el organizador
 * no lo encontraba (13 oct 2026, caso Gonzalo DJ): ahora está a la vista, con el
 * nombre, y antes del evento explica cuándo se podrá valorar.
 */
const ValorarContratado = ({ nombre, yaOcurrio, valorado, onValorar }: Props) => {
  if (valorado) {
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs font-bold"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#15803d' }}>
        <Star size={14} fill="#16a34a" color="#16a34a" />
        <span>Ya has valorado a {nombre}. ¡Gracias!</span>
      </div>
    );
  }
  if (!yaOcurrio) {
    return (
      <p className="mt-2 px-3 py-2 rounded-xl text-[11px]"
        style={{ background: 'rgba(0,0,0,0.03)', border: '1px dashed rgba(0,0,0,0.15)', color: '#555' }}>
        Podrás valorar a {nombre} cuando termine el evento.
      </p>
    );
  }
  return (
    <div className="mt-2 p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.45)' }}>
      <div className="flex items-center gap-1.5 mb-1" aria-hidden>
        {[1, 2, 3, 4, 5].map(n => <Star key={n} size={16} color="#D4AF37" />)}
      </div>
      <p className="text-sm font-black" style={{ color: '#111' }}>¿Cómo fue con {nombre}?</p>
      <p className="text-[11px] mt-0.5 mb-2.5" style={{ color: '#555' }}>
        Tu valoración ayuda a otros organizadores a elegir bien. Son 3 preguntas rápidas y un comentario.
      </p>
      <button type="button" onClick={onValorar}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
        <Star size={13} /> Valorar a {nombre}
      </button>
    </div>
  );
};

export default ValorarContratado;
