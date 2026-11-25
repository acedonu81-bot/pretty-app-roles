// Aviso de la oferta de Black Friday (25 al 30 nov 2026, hora de Madrid).
// Solo se pinta dentro de esas fechas (esBlackFriday). Paleta XPEAK: dorado y
// crema, sin fondos negros.
import { BadgePercent } from 'lucide-react';
import { esBlackFriday, PRECIOS_ANUALES, PRECIOS_BLACK_FRIDAY } from '@/lib/subscriptions';

const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const AvisoBlackFriday = ({ ahora = new Date(), className = '' }: { ahora?: Date; className?: string }) => {
  if (!esBlackFriday(ahora)) return null;
  return (
    <div role="note" aria-label="Oferta especial Black Friday"
      className={`relative overflow-hidden rounded-2xl px-5 py-4 flex items-center gap-4 ${className}`}
      style={{ background: 'linear-gradient(110deg,#FFF3C4 0%,#F3D774 45%,#D4AF37 100%)', border: '1.5px solid #B8941E', boxShadow: '0 14px 30px -16px rgba(120,90,0,.7)' }}>
      <div className="shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center"
        style={{ background: '#FFFDF7', border: '2px solid #B8941E', color: '#7a5c00' }}>
        <span className="font-black text-lg leading-none">-35%</span>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest" style={{ color: '#5a4300' }}>
          <BadgePercent size={14} /> Oferta especial Black Friday
        </p>
        <p className="font-black text-base md:text-lg leading-snug" style={{ color: '#2a2108' }}>
          35 % menos el primer año del plan anual
        </p>
        <p className="text-xs md:text-sm font-semibold" style={{ color: '#4a3a0a' }}>
          Profesional {euros(PRECIOS_BLACK_FRIDAY.starter)} <s className="opacity-60">{euros(PRECIOS_ANUALES.starter)}</s>
          {' · '}Premium {euros(PRECIOS_BLACK_FRIDAY.business)} <s className="opacity-60">{euros(PRECIOS_ANUALES.business)}</s>
          {' · '}Hasta el 30 de noviembre a las 23:59
        </p>
      </div>
    </div>
  );
};

export default AvisoBlackFriday;
