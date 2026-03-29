import { useEffect, useMemo, useState } from 'react';
import { Crown, CheckCircle, Gift, Lock, Shield, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { Switch } from '@/components/ui/switch';
import { BillingCycle, getPlanPricing, getTrialDaysRemaining, isBirthdayToday, mapSubscriptionTierToPlan, subscriptionPlans } from '@/lib/subscriptions';
import CancellationModal from '@/components/dashboard/CancellationModal';

const SubscriptionView = () => {
  const profile = useProfile();
  const [planCycles, setPlanCycles] = useState<Record<string, BillingCycle>>({
    business: profile.annual_billing ? 'annual' : 'monthly',
    agency: profile.annual_billing ? 'annual' : 'monthly',
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelPlanId, setCancelPlanId] = useState('');
  const [cancelPlanName, setCancelPlanName] = useState('');

  useEffect(() => {
    const cycle = profile.annual_billing ? 'annual' : 'monthly';
    setPlanCycles({ business: cycle, agency: cycle });
  }, [profile.annual_billing]);

  const currentPlan = useMemo(() => mapSubscriptionTierToPlan(profile.subscription_tier), [profile.subscription_tier]);
  const trialDaysRemaining = useMemo(() => getTrialDaysRemaining(profile.trial_started_at), [profile.trial_started_at]);
  const birthdayDiscountActive = useMemo(() => isBirthdayToday(profile.birthday), [profile.birthday]);

  const handlePlanCycleChange = async (planId: string, checked: boolean) => {
    setPlanCycles(prev => ({ ...prev, [planId]: checked ? 'annual' : 'monthly' }));
    await profile.updateField({ annual_billing: checked });
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">
          Mi <span className="text-gradient">Suscripción</span>
        </h2>
        <p className="text-sm text-muted-foreground">Elige el plan que impulse tu carrera.</p>
      </div>

      {/* Current plan + trial */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="glass-panel p-4 flex-1 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
          <Crown size={20} style={{ color: '#D4AF37' }} />
          <div>
            <p className="text-sm font-bold">Plan actual: <span className="text-muted-foreground">{subscriptionPlans.find(p => p.id === currentPlan)?.name.toUpperCase() ?? 'GRATIS'}</span></p>
            <p className="text-[0.65rem] text-muted-foreground">Los planes de pago estarán disponibles próximamente.</p>
          </div>
        </div>

        {currentPlan !== 'free' && (
          <div className="glass-panel p-4 flex-1 flex items-center gap-3" style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.04)' }}>
            <Gift size={18} style={{ color: '#D4AF37' }} />
            <div>
              <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                {trialDaysRemaining > 0
                  ? `Te quedan ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'día' : 'días'} de prueba gratuita`
                  : 'Tu periodo de prueba ha finalizado'}
              </p>
              <p className="text-[0.65rem] text-muted-foreground">
                {trialDaysRemaining > 0
                  ? '15 días gratis en todos los planes de pago.'
                  : 'Suscríbete con plan anual y ahorra un 30%.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Locked notice */}
      <div className="glass-panel p-4 mb-8 flex items-center gap-3" style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.04)' }}>
        <Lock size={18} style={{ color: '#ffbc00' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#ffbc00' }}>Plataforma de pagos en desarrollo</p>
          <p className="text-[0.65rem] text-muted-foreground">Los planes de pago se activarán cuando la pasarela esté operativa.</p>
        </div>
      </div>

      {/* Plans grid — 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {subscriptionPlans.map(plan => {
          const isActive = plan.id === currentPlan;
          const isLocked = plan.id !== 'free';
          const cardCycle = plan.annualEligible ? (planCycles[plan.id] ?? 'monthly') : 'monthly';
          const pricing = getPlanPricing(plan, cardCycle, birthdayDiscountActive);

          return (
            <div
              key={plan.id}
              className={`glass-panel p-6 flex flex-col relative ${isLocked ? 'opacity-70' : ''}`}
              style={{ border: plan.popular ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.06)' }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.6rem] font-black tracking-wider"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  RECOMENDADO
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-base font-bold" style={{ color: plan.textColor }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black" style={{ color: plan.textColor }}>
                    {pricing.finalPrice === 0 ? 'Gratis' : `€${pricing.finalPrice.toFixed(2)}`}
                  </span>
                  {pricing.finalPrice > 0 && <span className="text-xs text-muted-foreground">{pricing.period}</span>}
                </div>
                {pricing.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through mt-0.5">€{pricing.originalPrice.toFixed(2)}</p>
                )}
                {pricing.discountPercent > 0 && (
                  <p className="text-xs mt-1 font-bold" style={{ color: '#D4AF37' }}>
                    ✨ -{pricing.discountPercent}% · {pricing.helperText}
                  </p>
                )}
                {plan.trialDays > 0 && (
                  <p className="text-xs mt-1 font-bold" style={{ color: '#D4AF37' }}>
                    🎁 {plan.trialDays} días gratis
                  </p>
                )}
              </div>

              {/* Billing toggle */}
              {plan.annualEligible && (
                <div className="mb-5 p-3 rounded-lg flex items-center justify-between"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <span className={`text-xs font-bold ${cardCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensual</span>
                  <Switch
                    checked={cardCycle === 'annual'}
                    onCheckedChange={(checked) => handlePlanCycleChange(plan.id, checked)}
                    aria-label={`Cambiar ${plan.name} a facturación anual`}
                  />
                  <span className={`text-xs font-bold ${cardCycle === 'annual' ? 'text-primary' : 'text-muted-foreground'}`}>Anual -30%</span>
                </div>
              )}

              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle size={14} style={{ color: plan.textColor, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-lg text-sm font-bold cursor-not-allowed"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(212,175,55,0.08)',
                  color: isActive ? '#8E8EA0' : '#D4AF37',
                  border: '1px solid rgba(255,255,255,0.1)',
                  opacity: 0.6,
                }}>
                {isActive ? 'Plan Actual' : '🔒 Próximamente'}
              </button>

              {isActive && plan.id !== 'free' && (
                <button
                  onClick={() => {
                    setCancelPlanId(plan.id);
                    setCancelPlanName(plan.name);
                    setCancelModalOpen(true);
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20"
                >
                  Cancelar suscripción
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification banner */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center gap-5"
        style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.04)' }}>
        <div className="flex items-center gap-3 shrink-0">
          <Shield size={32} style={{ color: '#D4AF37' }} />
          <Sparkles size={20} style={{ color: '#D4AF37', opacity: 0.6 }} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold mb-1" style={{ color: '#D4AF37' }}>
            Verificación de Identidad · Sello de Oro
          </h4>
          <p className="text-sm text-muted-foreground">
            Protege tu cuenta y genera confianza inmediata con una revisión manual de tu perfil.
          </p>
          <p className="text-lg font-black mt-2" style={{ color: '#D4AF37' }}>14,99 € <span className="text-xs font-normal text-muted-foreground">pago único</span></p>
        </div>
        <button
          disabled
          className="shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed"
          style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', opacity: 0.6 }}>
          🔒 Próximamente
        </button>
      </div>

      <CancellationModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        planId={cancelPlanId}
        planName={cancelPlanName}
      />
    </div>
  );
};

export default SubscriptionView;
