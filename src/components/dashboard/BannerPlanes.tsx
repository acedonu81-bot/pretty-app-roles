import { useEffect, useState } from 'react';
import { ArrowRight, Crown, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { isNative } from '@/lib/capacitor';
import { cobrosActivos, leerMiSuscripcion } from '@/lib/pagos';
import { diasRestantesBlackFriday, esBlackFriday } from '@/lib/subscriptions';
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
      className="mx-4 mt-3 flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-3 md:gap-4 rounded-2xl py-3 pl-3 pr-3 md:pr-4 shrink-0 relative"
      style={{ background: '#FBF3DC', border: '1px solid #E6D08A', borderLeft: '4px solid #16a34a', color: '#2a2108', boxShadow: '0 10px 22px -16px rgba(90,66,0,.55)' }}>
      {/* Sello tipo estampa: doble aro, el interior discontinuo. */}
      <div aria-hidden="true" className="relative shrink-0 w-12 h-12 md:w-[54px] md:h-[54px] rounded-full flex items-center justify-center font-black text-sm tracking-tight"
        style={{ background: '#FFFDF7', border: '2px solid #16a34a', color: '#15803d' }}>
        <span className="absolute rounded-full" style={{ inset: 3, border: '1px dashed rgba(22,163,74,.6)' }} />
        {oferta ? '-35%' : <Crown size={22} />}
      </div>
      <button type="button" className="flex-1 min-w-0 text-left"
        onClick={() => { void logEvent('cta_click', '/dashboard', `banner_planes abrir bf=${oferta ? 1 : 0}`); onVer(); }}>
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-extrabold text-[15px] leading-snug">{oferta ? 'Black Friday en el plan anual' : 'Haz que te encuentren antes'}</span>
          {oferta && (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap"
              style={{ background: '#2a1f05', color: '#FFFDF7' }}>{diasRestantesBlackFriday()}</span>
          )}
        </span>
        <span className="block text-[13px] mt-0.5" style={{ color: '#5b4a1a' }}>
          {oferta ? '35 % menos el primer año. Hasta el 30 de noviembre.' : (<>Perfil verificado, estadísticas y todo sin tope desde <b style={{ color: '#15803d' }}>6,99 €/mes</b>.</>)}
        </span>
      </button>
      <button type="button" className="order-3 md:order-2 basis-full md:basis-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-4 md:px-[18px] py-2.5 text-sm font-bold transition-transform hover:scale-[1.03]"
        style={{ background: '#2563EB', color: '#FFFFFF', boxShadow: '0 8px 16px -10px rgba(37,99,235,.8)' }}
        onClick={() => { void logEvent('cta_click', '/dashboard', `banner_planes abrir bf=${oferta ? 1 : 0}`); onVer(); }}>
        Ver planes <ArrowRight size={16} />
      </button>
      <button type="button" aria-label="Cerrar aviso de planes" className="order-2 md:order-3 shrink-0 p-1 rounded-full hover:bg-black/10" style={{ color: '#6b5a1e' }}
        onClick={() => { try { localStorage.setItem(clave(id!), String(Date.now())); } catch { /* sin storage */ } setOculto(true); }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default BannerPlanes;
