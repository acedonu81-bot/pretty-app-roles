import { useEffect, useMemo, useState } from 'react';
import { Crown, CheckCircle, Gift, Lock, Shield, Sparkles, Trophy, Radio, ChevronDown } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { Switch } from '@/components/ui/switch';
import {
  BillingCycle, getPlanPricing, getTrialDaysRemaining, isBirthdayToday,
  mapSubscriptionTierToPlan, subscriptionPlans, STREAMING_PACKS,
  STREAMING_HOURS_BUSINESS, STREAMING_HOURS_AGENCY,
} from '@/lib/subscriptions';
import CancellationModal from '@/components/dashboard/CancellationModal';
import CheckoutModal from '@/components/dashboard/CheckoutModal';
import { ROLE_FEATURES, FALLBACK_ROLE, type PlanFeatures } from './subscription/roleFeatures';

const SubscriptionView = () => {
  const profile = useProfile();
  const roleKey = (profile.role ?? FALLBACK_ROLE) as keyof typeof ROLE_FEATURES;
  const roleConfig = ROLE_FEATURES[roleKey] ?? ROLE_FEATURES[FALLBACK_ROLE];

  const [planCycles, setPlanCycles] = useState<Record<string, BillingCycle>>({
    starter: 'monthly', business: 'monthly', agency: 'monthly',
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelPlanId, setCancelPlanId] = useState('');
  const [cancelPlanName, setCancelPlanName] = useState('');
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; description: string } | null>(null);
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    const cycle = profile.annual_billing ? 'annual' : 'monthly';
    setPlanCycles({ starter: cycle, business: cycle, agency: cycle });
  }, [profile.annual_billing]);

  const currentPlan = useMemo(() => mapSubscriptionTierToPlan(profile.subscription_tier), [profile.subscription_tier]);
  const trialDaysRemaining = useMemo(() => getTrialDaysRemaining(profile.trial_started_at), [profile.trial_started_at]);
  const birthdayDiscountActive = useMemo(() => isBirthdayToday(profile.birthday), [profile.birthday]);

  const handlePlanCycleChange = async (planId: string, checked: boolean) => {
    setPlanCycles(prev => ({ ...prev, [planId]: checked ? 'annual' : 'monthly' }));
    await profile.updateField({ annual_billing: checked });
  };

  const featuresForPlan = (planId: string): string[] => {
    if (planId === 'free') return roleConfig.free;
    return roleConfig.plans[planId as keyof PlanFeatures] ?? [];
  };

  const isStreamingEligible = ['starter', 'business', 'agency'].includes(currentPlan);
  const includedHours = currentPlan === 'agency'
    ? STREAMING_HOURS_AGENCY
    : currentPlan === 'business'
    ? STREAMING_HOURS_BUSINESS
    : 0;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <CheckoutModal open={!!checkoutItem} onClose={() => setCheckoutItem(null)} item={checkoutItem} />
      <CancellationModal open={cancelModalOpen} onOpenChange={setCancelModalOpen} planId={cancelPlanId} planName={cancelPlanName} />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Mi <span className="text-gradient">Suscripción</span></h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            {roleConfig.icon} {roleConfig.label}
          </span>
          <p className="text-sm text-muted-foreground">— ventajas adaptadas a tu perfil profesional.</p>
        </div>
      </div>

      {/* Current plan + trial */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="glass-panel p-4 flex-1 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
          <Crown size={20} style={{ color: '#D4AF37' }} />
          <div>
            <p className="text-sm font-bold">Plan actual: <span style={{ color: '#D4AF37' }}>{subscriptionPlans.find(p => p.id === currentPlan)?.name.toUpperCase() ?? 'GRATIS'}</span></p>
            <p className="text-[0.65rem] text-muted-foreground">La activación de planes estará disponible muy pronto.</p>
          </div>
        </div>
        {currentPlan !== 'free' && trialDaysRemaining === null && (
          <div className="glass-panel p-4 flex-1 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)' }}>
            <Gift size={18} style={{ color: 'rgba(212,175,55,0.5)' }} />
            <div>
              <p className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.7)' }}>Prueba de 15 días pendiente</p>
              <p className="text-[0.65rem] text-muted-foreground">Activa Flash Booking, sube una sesión o conecta un stream para empezar.</p>
            </div>
          </div>
        )}
        {currentPlan !== 'free' && trialDaysRemaining !== null && trialDaysRemaining > 0 && (
          <div className="glass-panel p-4 flex-1 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.04)' }}>
            <Gift size={18} style={{ color: '#D4AF37' }} />
            <div>
              <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Te quedan {trialDaysRemaining} {trialDaysRemaining === 1 ? 'día' : 'días'} de prueba</p>
              <p className="text-[0.65rem] text-muted-foreground">Activa plan anual y ahorra un 30% al terminar.</p>
            </div>
          </div>
        )}
      </div>

      {/* Locked notice */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3" style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.04)' }}>
        <Lock size={18} style={{ color: '#ffbc00' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#ffbc00' }}>Pasarela de pagos en desarrollo</p>
          <p className="text-[0.65rem] text-muted-foreground">Los planes se activarán en breve. Puedes ver lo que incluye cada uno para tu rol.</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {subscriptionPlans.map(plan => {
          const isActive = plan.id === currentPlan;
          const cardCycle = plan.annualEligible ? (planCycles[plan.id] ?? 'monthly') : 'monthly';
          const pricing = getPlanPricing(plan, cardCycle, birthdayDiscountActive);
          const features = featuresForPlan(plan.id);

          return (
            <div key={plan.id} className="glass-panel p-6 flex flex-col relative"
              style={{
                border: isActive ? '1px solid rgba(212,175,55,0.5)' : plan.popular ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isActive ? '0 0 20px rgba(212,175,55,0.08)' : undefined,
              }}>
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.6rem] font-black tracking-wider"
                  style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>TU PLAN</div>
              )}
              {!isActive && plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.6rem] font-black tracking-wider"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>RECOMENDADO</div>
              )}
              {!isActive && plan.badge && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.6rem] font-black tracking-wider"
                  style={{ background: 'linear-gradient(90deg,#A8C5DA,#7aafc7)', color: '#000' }}>{plan.badge}</div>
              )}

              <div className="mb-4">
                <h3 className="text-base font-bold mb-1" style={{ color: plan.textColor }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: plan.textColor }}>
                    {pricing.finalPrice === 0 ? 'Gratis' : `€${pricing.finalPrice.toFixed(2).replace('.', ',')}`}
                  </span>
                  {pricing.finalPrice > 0 && <span className="text-xs text-muted-foreground">{pricing.period}</span>}
                </div>
                {pricing.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">€{pricing.originalPrice.toFixed(2).replace('.', ',')}</p>
                )}
                {pricing.discountPercent > 0 && (
                  <p className="text-[0.65rem] mt-0.5 font-bold" style={{ color: '#22c55e' }}>
                    -{pricing.discountPercent}% · {pricing.helperText}
                  </p>
                )}
                {plan.trialDays > 0 && (
                  <p className="text-[0.65rem] mt-0.5 font-bold" style={{ color: '#D4AF37' }}>
                    {plan.trialDays} días gratis
                  </p>
                )}
              </div>

              {plan.annualEligible && (
                <div className="mb-4 p-2.5 rounded-lg flex items-center justify-between gap-2"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <span className={`text-[0.65rem] font-bold ${cardCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensual</span>
                  <Switch checked={cardCycle === 'annual'} onCheckedChange={(checked) => handlePlanCycleChange(plan.id, checked)}
                    aria-label={`Cambiar ${plan.name} a facturación anual`} />
                  <span className={`text-[0.65rem] font-bold ${cardCycle === 'annual' ? 'text-primary' : 'text-muted-foreground'}`}>Anual -30%</span>
                </div>
              )}

              <div className="flex-1 space-y-2 mb-5">
                {features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle size={13} style={{ color: plan.id === 'free' ? '#8E8EA0' : plan.textColor, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs leading-snug" style={{ color: plan.id === 'free' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <button disabled className="w-full py-2.5 rounded-lg text-sm font-bold cursor-default"
                style={{
                  background: isActive ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${isActive ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                {isActive ? '✓ Plan Actual' : 'Próximamente'}
              </button>

              {isActive && plan.id !== 'free' && (
                <button onClick={() => { setCancelPlanId(plan.id); setCancelPlanName(plan.name); setCancelModalOpen(true); }}
                  className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20">
                  Cancelar suscripción
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── STREAMING PACKS ── visible para Starter/Business/Agency */}
      {isStreamingEligible && (
        <div className="glass-panel p-4 mb-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio size={13} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-bold">Horas de Streaming en Vivo</span>
              <span className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
                AMAZON IVS
              </span>
            </div>
            {includedHours > 0 && (
              <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
                {includedHours}h/mes incluida{includedHours > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {includedHours === 0 && (
            <p className="text-[0.6rem] text-muted-foreground mb-3">
              Sin hora incluida en tu plan — compra las que necesites. Válidas <span className="font-bold text-primary">6 meses</span>.
            </p>
          )}
          {includedHours > 0 && (
            <p className="text-[0.6rem] text-muted-foreground mb-3">
              Tu plan incluye <span className="font-bold" style={{ color: '#22c55e' }}>{includedHours}h/mes</span>. Compra packs para emitir más.
            </p>
          )}

          {/* Packs — horizontal scroll en móvil, grid en desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STREAMING_PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setCheckoutItem({
                  name: pack.label,
                  price: pack.price,
                  description: `${pack.hours}h de streaming en vivo (Amazon IVS). Válidas 6 meses.`,
                })}
                className="relative flex flex-col items-start gap-0.5 p-3 rounded-lg text-left transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: pack.highlight ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)',
                  border: pack.highlight ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                {pack.badge && (
                  <span className="absolute top-1.5 right-1.5 text-[0.42rem] font-black px-1.5 py-0.5 rounded"
                    style={{
                      background: pack.highlight ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)',
                      color: pack.highlight ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                      border: pack.highlight ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.08)',
                    }}>{pack.badge}</span>
                )}
                <span className="text-[0.6rem] font-bold pr-6" style={{ color: pack.highlight ? '#D4AF37' : 'rgba(255,255,255,0.7)' }}>
                  {pack.hours}h
                </span>
                <span className="text-lg font-black leading-tight" style={{ color: pack.highlight ? '#D4AF37' : 'white' }}>
                  €{pack.price}
                </span>
                <span className="text-[0.5rem] text-muted-foreground">€{pack.pricePerHour.toFixed(2)}/h</span>
              </button>
            ))}
          </div>
          <p className="text-[0.5rem] text-muted-foreground text-center mt-2">
            Alta calidad garantizada · Horas válidas 6 meses desde la compra
          </p>
        </div>
      )}

      {/* ── MÁS OPCIONES — colapsable ── */}
      <button
        onClick={() => setShowExtras(v => !v)}
        className="w-full flex flex-col items-center gap-1 py-4 mb-3 transition-all group"
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em] transition-colors"
          style={{ color: showExtras ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}>
          {showExtras ? 'Ocultar opciones' : 'Más opciones'}
        </span>
        {!showExtras && (
          <div className="flex flex-col items-center gap-0.5">
            <ChevronDown size={13} className="animate-bounce" style={{ color: 'rgba(212,175,55,0.5)' }} />
            <ChevronDown size={13} className="animate-bounce" style={{ color: 'rgba(212,175,55,0.25)', animationDelay: '150ms' }} />
          </div>
        )}
        {showExtras && (
          <ChevronDown size={14} className="rotate-180 transition-transform duration-200" style={{ color: '#D4AF37' }} />
        )}
      </button>

      {showExtras && (
        <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
          {/* Top Weekend */}
          <div className="glass-panel p-5 relative overflow-hidden"
            style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.03)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,148,30,0.1))', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Trophy size={22} style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <p className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>TOP WEEKEND</p>
                  <p className="text-[0.6rem] text-muted-foreground">Posición destacada</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-1">¿Quieres aparecer primero este fin de semana?</p>
                <p className="text-xs text-muted-foreground">
                  Top Weekend coloca tu perfil en la primera posición del directorio durante el fin de semana.
                  Los perfiles TOP generan <strong style={{ color: '#D4AF37' }}>3× más contactos</strong> que el resto.
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <p className="text-xl font-black" style={{ color: '#D4AF37' }}>9,99€</p>
                <p className="text-[0.55rem] text-muted-foreground text-center">por fin de semana</p>
                <button disabled className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed mt-1"
                  style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  Próximamente
                </button>
              </div>
            </div>
          </div>

          {/* Commission info */}
          <div className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start gap-3">
              <Sparkles size={15} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Flash Booking · 5% por trabajo confirmado</p>
                <p className="text-[0.6rem] text-muted-foreground">Solo pagas si consigues el trabajo. XPEAK retiene un 5% del cachet una vez confirmado.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown size={15} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Fan Club · 12% de comisión (tú te quedas el 88%)</p>
                <p className="text-[0.6rem] text-muted-foreground">OnlyFans cobra un 20%. En XPEAK retienes más. Disponible desde plan Business.</p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="glass-panel p-6 flex flex-col sm:flex-row items-center gap-5"
            style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.04)' }}>
            <div className="flex items-center gap-3 shrink-0">
              <Shield size={32} style={{ color: '#D4AF37' }} />
              <Sparkles size={20} style={{ color: '#D4AF37', opacity: 0.6 }} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold mb-1" style={{ color: '#D4AF37' }}>Verificación de Identidad · Sello de Oro</h4>
              <p className="text-sm text-muted-foreground">
                Revisión manual de tu perfil. Genera confianza inmediata con empresarios y salas.
                {roleKey === 'empresario' && ' Incluye verificación de sala con NIF de empresa.'}
              </p>
              <p className="text-lg font-black mt-2" style={{ color: '#D4AF37' }}>
                19,99€ <span className="text-xs font-normal text-muted-foreground">pago único · para siempre en tu perfil</span>
              </p>
            </div>
            <button disabled className="shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', opacity: 0.6 }}>
              Próximamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionView;
