import { useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import {
  STREAMING_PACKS,
  STREAMING_PACK_ELIGIBLE_PLANS,
  STREAMING_HOURS_BUSINESS,
  STREAMING_HOURS_AGENCY,
  mapSubscriptionTierToPlan,
  type StreamingPack,
} from '@/lib/subscriptions';
import CheckoutModal from '@/components/dashboard/CheckoutModal';

const StreamingPacksSection = () => {
  const profile = useProfile();
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const planId = mapSubscriptionTierToPlan(profile.subscription_tier);
  const isEligible = (STREAMING_PACK_ELIGIBLE_PLANS as readonly string[]).includes(planId);
  const isBusiness = planId === 'business';
  const isAgency = planId === 'agency';
  const isStarter = planId === 'starter';

  const includedHours = isAgency
    ? STREAMING_HOURS_AGENCY
    : isBusiness
    ? STREAMING_HOURS_BUSINESS
    : 0;

  const handleBuy = (pack: StreamingPack) => {
    setCheckoutItem({
      name: pack.label,
      price: pack.price,
      description: `${pack.hours} horas de streaming en vivo (Amazon IVS). Válidas 6 meses desde la compra.`,
    });
  };

  const handleCheckoutClose = () => {
    // Track purchase count for Starter conversion nudge
    if (checkoutItem && isStarter) setPurchaseCount(c => c + 1);
    setCheckoutItem(null);
  };

  if (!isEligible) {
    return (
      <div className="glass-panel p-5 flex flex-col items-center justify-center gap-3 text-center"
        style={{ border: '1px solid rgba(212,175,55,0.08)' }}>
        <p className="text-xs font-bold" style={{ color: '#333' }}>
          Packs de streaming próximamente
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          La compra de horas adicionales de streaming estará disponible pronto.
        </p>
      </div>
    );
  }

  return (
    <>
      <CheckoutModal open={!!checkoutItem} onClose={handleCheckoutClose} item={checkoutItem} />

      <div className="glass-panel p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: '#8A6D0F' }} />
            <span className="text-xs font-bold uppercase tracking-wider">Horas de Streaming</span>
          </div>
          {includedHours > 0 && (
            <div className="flex items-center gap-1 text-[0.75rem] font-bold px-2 py-0.5 rounded"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
              <Clock size={9} />
              {includedHours}h incluida{includedHours > 1 ? 's' : ''}/mes
            </div>
          )}
        </div>

        {/* Hours included info */}
        {includedHours > 0 && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-xs text-muted-foreground"
            style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
            Tienes{' '}
            <span className="font-bold" style={{ color: '#22c55e' }}>
              {includedHours}h{isAgency ? ' en pool compartido' : ''} incluidas al mes
            </span>
            {' '}— sin coste adicional. Compra packs para emitir más.
          </div>
        )}

        {/* Packs grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {STREAMING_PACKS.map(pack => (
            <button
              key={pack.id}
              onClick={() => handleBuy(pack)}
              className="relative flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: pack.highlight
                  ? 'rgba(212,175,55,0.07)'
                  : 'rgba(255,255,255,0.02)',
                border: pack.highlight
                  ? '1px solid rgba(212,175,55,0.25)'
                  : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {pack.badge && (
                <span className="absolute top-2 right-2 text-xs font-black px-1.5 py-0.5 rounded"
                  style={{
                    background: pack.highlight ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.05)',
                    color: pack.highlight ? '#D4AF37' : '#333',
                    border: pack.highlight ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(0,0,0,0.08)',
                  }}>
                  {pack.badge}
                </span>
              )}
              <span className="text-xs font-bold pr-8" style={{ color: pack.highlight ? '#D4AF37' : '#333' }}>
                {pack.hours}h
              </span>
              <span className="text-base font-black" style={{ color: pack.highlight ? '#D4AF37' : 'white' }}>
                €{pack.price}
              </span>
              <span className="text-[0.7rem] text-muted-foreground">
                €{pack.pricePerHour.toFixed(2)}/h
              </span>
            </button>
          ))}
        </div>

        <p className="text-[0.7rem] text-muted-foreground text-center">
          Horas válidas 6 meses · Streaming vía Amazon IVS · Alta calidad garantizada
        </p>

      </div>
    </>
  );
};

export default StreamingPacksSection;
