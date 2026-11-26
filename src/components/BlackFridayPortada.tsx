// Black Friday en la portada (26 nov 2026): la oferta solo se veía en /precios y dentro
// del panel, y a /precios no llegaba nadie. Pastilla para profesionales en el hero,
// enlazada a /precios. Se apaga sola al acabar (esBlackFriday). No sale en la app
// nativa: Apple y Google no permiten anunciar pagos fuera de su sistema de cobro.
import { Link } from 'react-router-dom';
import { cobrosActivos } from '@/lib/pagos';
import { esBlackFriday } from '@/lib/subscriptions';
import { logEvent } from '@/lib/track';

const esNativa = () => {
  try { return !!(window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.(); }
  catch { return false; }
};

const BlackFridayPortada = ({ ahora = new Date() }: { ahora?: Date }) => {
  if (!cobrosActivos() || !esBlackFriday(ahora) || esNativa()) return null;
  return (
    <Link to="/precios" onClick={() => { void logEvent('cta_click', '/', 'bf_portada ver_planes'); }}
      className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 max-w-2xl mx-auto mb-5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]"
      style={{ background: 'linear-gradient(110deg,#FFF3C4 0%,#F3D774 55%,#D4AF37 100%)', border: '1.5px solid #B8941E', color: '#2a2108', boxShadow: '0 10px 24px -12px rgba(0,0,0,.6)' }}>
      <span className="rounded-full px-2 py-0.5 text-[11px] font-black" style={{ background: '#FFFDF7', color: '#7a5c00', border: '1px solid #B8941E' }}>-35 %</span>
      <span><strong>¿Eres profesional?</strong> Black Friday: 35 % menos el primer año del plan anual, hasta el 30 de noviembre.</span>
      <span className="font-black underline">Ver planes</span>
    </Link>
  );
};

export default BlackFridayPortada;
