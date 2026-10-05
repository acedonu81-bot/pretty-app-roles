import { useState } from 'react';
import { Star } from 'lucide-react';
import { usePendingReviewsCount } from '@/hooks/usePendingReviewsCount';

// Visible en el dashboard (no solo en la campana) mientras haya una
// contratación cerrada sin valorar — pedido por el usuario el 3 oct 2026
// tras no encontrar el botón "Valorar", enterrado en Flash Booking →
// Solicitudes / Empresario → Historial. Se cierra por sesión (no hay campo
// en BD para "descartado"): reaparece la próxima vez que entre mientras
// siga pendiente, a propósito — es más importante que el aviso de perfil
// incompleto, que si se puede silenciar del todo.
const PendingReviewsBanner = ({ onGoToReviews }: { onGoToReviews: () => void }) => {
  const { count, loading } = usePendingReviewsCount();
  const [dismissed, setDismissed] = useState(false);

  if (loading || dismissed || count < 1) return null;

  const text = count === 1
    ? 'Tienes 1 colaboración pendiente de valorar'
    : `Tienes ${count} colaboraciones pendientes de valorar`;

  return (
    <div className="mx-4 mt-3 mb-0 flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
      <Star size={16} className="flex-shrink-0" style={{ color: '#D4AF37' }} fill="#D4AF37" />
      <span className="flex-1" style={{ color: '#222' }}>
        {text}
        <span className="hidden sm:inline"> · ayuda a que la comunidad confíe en quién contrata</span>
      </span>
      <button onClick={onGoToReviews}
        className="flex-shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all hover:scale-105"
        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
        Valorar
      </button>
      <button onClick={() => setDismissed(true)} className="flex-shrink-0 text-lg leading-none transition-opacity hover:opacity-60"
        style={{ color: '#333' }}>×</button>
    </div>
  );
};

export default PendingReviewsBanner;
