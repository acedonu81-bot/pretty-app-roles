import { useTodaysRequestsCount } from '@/hooks/useTodaysRequestsCount';
import { useProfile } from '@/hooks/useProfile';

const TodaysRequestsLine = () => {
  const { role } = useProfile();
  const { count } = useTodaysRequestsCount();

  if (role === 'empresario' || count === null || count < 1) return null;

  const text = count === 1
    ? '1 solicitud de presupuesto recibida hoy'
    : `${count} solicitudes de presupuesto recibidas hoy`;

  return (
    <p className="mx-4 md:mx-6 mt-2 text-xs font-semibold" style={{ color: '#22c55e' }}>
      ⚡ {text}
    </p>
  );
};

export default TodaysRequestsLine;
