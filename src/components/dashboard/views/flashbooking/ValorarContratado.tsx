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
  yaOcurrio: boolean;
  valorado: boolean;
  onValorar: () => void;
}

/**
 * Acceso a valorar desde la tarjeta de la oferta, junto a "Contratado" y
 * "Contrato". Antes el botón solo existía en Empresario > Historial y el
 * organizador no lo encontraba (13 oct 2026, caso Gonzalo DJ).
 */
const ValorarContratado = ({ yaOcurrio, valorado, onValorar }: Props) => {
  if (!yaOcurrio) return null;
  if (valorado) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-black" style={{ color: '#16a34a' }}>
        <Star size={10} fill="#16a34a" /> Valorado
      </span>
    );
  }
  return (
    <button type="button" onClick={onValorar}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black transition-all hover:scale-105"
      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
      <Star size={10} /> Valorar
    </button>
  );
};

export default ValorarContratado;
