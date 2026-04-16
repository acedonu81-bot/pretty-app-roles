import { useState } from 'react';
import { Zap, Clock, TrendingUp, Lock } from 'lucide-react';
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
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <Lock size={18} style={{ color: 'rgba(212,175,55,0.35)' }} />
        </div>
        <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Streaming disponible desde el plan Starter
        </p>
        <p className="text-[0.6rem] text-muted-foreground max-w-[200px]">
          Activa Starter para comprar horas de streaming, o Business para incluir 1h/mes gratis.
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
            <Zap size={14} style={{ color: '#D4AF37' }} />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider">Horas de Streaming</span>
          </div>
          {includedHours > 0 && (
            <div className="flex items-center gap-1 text-[0.55rem] font-bold px-2 py-0.5 rounded"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
              <Clock size={9} />
              {includedHours}h incluida{includedHours > 1 ? 's' : ''}/mes
            </div>
          )}
        </div>

        {/* Included hours info */}
        {includedHours > 0 && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-[0.6rem] text-muted-foreground"
            style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
            Tu plan {isBusiness ? 'Business' : 'Agency'} incluye{' '}
            <span className="font-bold" style={{ color: '#22c55e' }}>
              {includedHours}h{isAgency ? ' en pool compartido' : ''} cada mes
            </span>
            {' '}— sin coste adicional. Compra packs para emitir más.
          </div>
        )}

        {/* Starter: no free hours */}
        {isStarter && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-[0.6rem]"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <span className="text-muted-foreground">
              Las horas que compras son tuyas — sin caducidad mensual, válidas <span className="font-bold text-primary">6 meses</span>.
            </span>
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
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {pack.badge && (
                <span className="absolute top-2 right-2 text-[0.45rem] font-black px-1.5 py-0.5 rounded"
                  style={{
                    background: pack.highlight ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)',
                    color: pack.highlight ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                    border: pack.highlight ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {pack.badge}
                </span>
              )}
              <span className="text-[0.6rem] font-bold pr-8" style={{ color: pack.highlight ? '#D4AF37' : 'rgba(255,255,255,0.8)' }}>
                {pack.hours}h
              </span>
              <span className="text-base font-black" style={{ color: pack.highlight ? '#D4AF37' : 'white' }}>
                €{pack.price}
              </span>
              <span className="text-[0.5rem] text-muted-foreground">
                €{pack.pricePerHour.toFixed(2)}/h
              </span>
            </button>
          ))}
        </div>

        <p className="text-[0.52rem] text-muted-foreground text-center">
          Horas válidas 6 meses · Streaming vía Amazon IVS · Alta calidad garantizada
        </p>

        {/* Starter conversion nudge */}
        {isStarter && purchaseCount >= 2 && (
          <div className="mt-3 px-3 py-2.5 rounded-lg animate-[fadeIn_0.4s_ease]"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-start gap-2">
              <TrendingUp size={13} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-[0.6rem] font-bold" style={{ color: '#D4AF37' }}>
                  Ya llevas {purchaseCount} compras de horas
                </p>
                <p className="text-[0.55rem] text-muted-foreground mt-0.5">
                  Con Business (€14.99/mes) tienes 1h incluida cada mes y todo el directorio mejorado.
                  Si usas streaming regularmente, ya te sale más barato.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StreamingPacksSection;
