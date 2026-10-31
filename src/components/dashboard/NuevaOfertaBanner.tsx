import { useDashboardBadges } from '@/hooks/useDashboardBadges';

// 31 oct 2026: la oferta nueva de un organizador solo avisaba dentro de Flash
// Booking y con un globo en el menú; el profesional que entraba al Inicio no
// la veía. Este aviso va arriba de todo en cualquier pantalla del panel, en
// verde parpadeante como el resto de "hay algo que hacer", y se apaga solo al
// abrir "Ofertas para ti" (marcarOfertasVistas lee las notificaciones).
interface Props {
  userId?: string;
  isEmpresario: boolean;
  /** Dentro de Flash Booking ya hay un aviso propio con el mismo conteo. */
  oculto?: boolean;
  onVer: () => void;
}

const NuevaOfertaBanner = ({ userId, isEmpresario, oculto, onVer }: Props) => {
  const { demandaBadge } = useDashboardBadges(userId, isEmpresario);

  if (isEmpresario || oculto || demandaBadge < 1) return null;

  return (
    <div
      role="status"
      className="mx-3 md:mx-6 mt-3 flex items-center gap-3 p-3 md:p-4 rounded-xl"
      style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid #16a34a' }}
    >
      <span
        className="w-4 h-4 rounded-full flex-shrink-0 motion-safe:[animation:ofertaParpadeo_1.3s_ease-in-out_infinite]"
        style={{ background: '#16a34a' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm md:text-base font-black" style={{ color: '#15803d' }}>
          {demandaBadge === 1 ? 'Nueva oferta disponible' : `${demandaBadge} ofertas nuevas disponibles`}
        </p>
        <p className="text-xs" style={{ color: '#166534' }}>Atento a las notificaciones</p>
      </div>
      <button
        type="button"
        onClick={onVer}
        className="px-3 py-2 rounded-lg text-xs font-black flex-shrink-0"
        style={{ background: '#15803d', color: '#fff' }}
      >
        Ver oferta
      </button>
    </div>
  );
};

export default NuevaOfertaBanner;
