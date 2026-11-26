import { useEffect, useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { isNative } from '@/lib/capacitor';
import { cobrosActivos, leerMiSuscripcion } from '@/lib/pagos';
import { esBlackFriday } from '@/lib/subscriptions';
import { oficiosDe } from '@/lib/ventajasPlan';
import { logEvent } from '@/lib/track';

// 25 nov 2026: en una semana nadie ajeno al equipo entró en Mi plan. Este aviso lleva
// los planes a donde el profesional ya está (cualquier pantalla del panel, también justo
// después de registrarse). Solo a profesionales sin plan de pago y con los cobros
// activos; no sale en la app nativa. Se puede cerrar y vuelve a las 24 h.
// La oferta de Black Friday es solo para la primera suscripción (como crear-checkout):
// quien ya tuvo plan ve el aviso sin la oferta.
const OCULTO_MS = 24 * 3600 * 1000;
const clave = (id: string) => `xpeak_banner_planes_${id}`;

const BannerPlanes = ({ onVer, activeView }: { onVer: () => void; activeView: string }) => {
  const { id, role, roles, subscription_tier, loading } = useProfile();
  const [yaTuvoPlan, setYaTuvoPlan] = useState<boolean | null>(null);
  const [oculto, setOculto] = useState(() => {
    try { return Date.now() - Number(localStorage.getItem(clave(id ?? '')) ?? 0) < OCULTO_MS; } catch { return false; }
  });

  const aplica = !loading && !!id && !isNative && cobrosActivos() && (subscription_tier ?? 'free') === 'free'
    && oficiosDe([role, ...(roles ?? [])]).profesional;

  useEffect(() => {
    if (!aplica) return;
    leerMiSuscripcion().then(s => setYaTuvoPlan(!!s?.estado)).catch(() => setYaTuvoPlan(false));
  }, [aplica]);

  useEffect(() => {
    try { setOculto(Date.now() - Number(localStorage.getItem(clave(id ?? '')) ?? 0) < OCULTO_MS); } catch { /* sin storage */ }
  }, [id]);

  if (!aplica || oculto || yaTuvoPlan === null || activeView === 'subscription') return null;
  const oferta = esBlackFriday() && !yaTuvoPlan;

  return (
    <div role="note" aria-label="Planes de XPEAK"
      className="mx-4 mt-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
      style={{ background: 'linear-gradient(110deg,#FFF3C4 0%,#F3D774 60%,#D4AF37 100%)', border: '1.5px solid #B8941E', color: '#2a2108' }}>
      <Crown size={18} className="shrink-0" style={{ color: '#7a5c00' }} />
      <button type="button" className="flex-1 min-w-0 text-left"
        onClick={() => { void logEvent('cta_click', '/dashboard', `banner_planes abrir bf=${oferta ? 1 : 0}`); onVer(); }}>
        {oferta ? (
          <span><strong>Black Friday: 35 % menos el primer año del plan anual.</strong> Hasta el 30 de noviembre. Ver planes</span>
        ) : (
          <span><strong>Que te encuentren antes y te contraten más.</strong> Mira los planes de XPEAK</span>
        )}
      </button>
      <button type="button" aria-label="Cerrar aviso de planes" className="shrink-0 p-1 rounded-full hover:bg-black/10"
        onClick={() => { try { localStorage.setItem(clave(id!), String(Date.now())); } catch { /* sin storage */ } setOculto(true); }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default BannerPlanes;
