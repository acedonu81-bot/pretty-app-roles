import { useTodaysRequestsCount } from '@/hooks/useTodaysRequestsCount';
import { useProfile } from '@/hooks/useProfile';

// Antes era un <p> sin acción: el usuario veía "1 solicitud recibida hoy" y
// no tenía forma de ir a verla ni de descartar el aviso — lo pidió el
// usuario el 2 oct 2026. No hay estado leído/no-leído en BD (la RPC cuenta
// solicitudes de las últimas 24h sin más), así que no hay un "marcar visto":
// el aviso deja de salir solo cuando pasan 24h desde la última, igual que
// antes. Lo que faltaba era que el texto llevara a donde se gestiona.
const TodaysRequestsLine = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { role } = useProfile();
  const { count } = useTodaysRequestsCount();

  if (role === 'empresario' || count === null || count < 1) return null;

  const text = count === 1
    ? '1 solicitud de presupuesto recibida hoy'
    : `${count} solicitudes de presupuesto recibidas hoy`;

  return (
    <button
      type="button"
      onClick={onNavigate}
      className="mx-4 md:mx-6 mt-2 text-xs font-semibold text-left underline-offset-2 hover:underline transition-opacity hover:opacity-80"
      style={{ color: '#22c55e' }}
    >
      {text} · Ver →
    </button>
  );
};

export default TodaysRequestsLine;
