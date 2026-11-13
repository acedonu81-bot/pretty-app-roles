import { useEffect, useState } from 'react';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

// 31 oct 2026: la oferta nueva de un organizador solo avisaba dentro de Flash
// Booking y con un globo en el menú; el profesional que entraba al Inicio no
// la veía. Este aviso va arriba de todo en cualquier pantalla del panel, en
// verde parpadeante como el resto de "hay algo que hacer". Cuenta dos cosas:
// ofertas de organizadores sin ver (se apaga al abrir "Ofertas para ti") y
// solicitudes directas sin contestar, p. ej. de un particular (se apaga al
// contestarlas; mismo conteo que el globo de Flash Booking).
interface Props {
  userId?: string;
  isEmpresario: boolean;
  /** Dentro de Flash Booking ya hay un aviso propio con el mismo conteo. */
  oculto?: boolean;
  /** `solicitudes` si solo hay solicitudes directas, `ofertas` si hay ofertas de organizadores. */
  onVer: (destino: 'ofertas' | 'solicitudes') => void;
}

// Si el profesional ya ha visto el banner con este mismo número de avisos y han
// pasado 24 h sin actuar, se apaga solo (el globo del menú sigue). Si llegan
// avisos nuevos, vuelve a salir.
const HORAS_VISIBLE_MS = 24 * 3600 * 1000;
const claveBanner = (uid: string) => `xpeak_banner_oferta_${uid}`;
function yaCaducado(uid: string | undefined, total: number): boolean {
  if (!uid || total < 1) return false;
  try {
    const guardado = JSON.parse(localStorage.getItem(claveBanner(uid)) ?? 'null');
    if (!guardado || guardado.total !== total) {
      localStorage.setItem(claveBanner(uid), JSON.stringify({ total, desde: Date.now() }));
      return false;
    }
    return Date.now() - guardado.desde > HORAS_VISIBLE_MS;
  } catch { return false; }
}

const NuevaOfertaBanner = ({ userId, isEmpresario, oculto, onVer }: Props) => {
  const { demandaBadge, flashBadge } = useDashboardBadges(userId, isEmpresario);
  const total = demandaBadge + flashBadge;
  const [caducado, setCaducado] = useState(false);
  useEffect(() => { setCaducado(yaCaducado(userId, total)); }, [userId, total]);

  if (isEmpresario || oculto || total < 1 || caducado) return null;

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
          {total === 1 ? 'Nueva oferta disponible' : `${total} ofertas nuevas disponibles`}
        </p>
        <p className="text-xs" style={{ color: '#166534' }}>Atento a las notificaciones</p>
      </div>
      <button
        type="button"
        onClick={() => onVer(demandaBadge > 0 ? 'ofertas' : 'solicitudes')}
        className="px-3 py-2 rounded-lg text-xs font-black flex-shrink-0"
        style={{ background: '#15803d', color: '#fff' }}
      >
        Ver oferta
      </button>
    </div>
  );
};

export default NuevaOfertaBanner;
