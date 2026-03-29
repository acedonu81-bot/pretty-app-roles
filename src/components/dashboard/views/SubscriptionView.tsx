import { useEffect, useMemo, useState } from 'react';
import { Crown, CheckCircle, Star, Zap, Eye, TrendingUp, Lock, Gift, PartyPopper, Truck } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { Switch } from '@/components/ui/switch';
import { ANNUAL_DISCOUNT, BillingCycle, getPlanPricing, getTrialDaysRemaining, isBirthdayToday, mapSubscriptionTierToPlan, subscriptionPlans } from '@/lib/subscriptions';
import CancellationModal from '@/components/dashboard/CancellationModal';

const SubscriptionView = () => {
  const profile = useProfile();
  const isEmpresario = profile.role === 'empresario';
  const [planCycles, setPlanCycles] = useState<Record<string, BillingCycle>>({
    pro: profile.annual_billing ? 'annual' : 'monthly',
    business: profile.annual_billing ? 'annual' : 'monthly',
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelPlanId, setCancelPlanId] = useState('');
  const [cancelPlanName, setCancelPlanName] = useState('');

  useEffect(() => {
    const cycle = profile.annual_billing ? 'annual' : 'monthly';
    setPlanCycles({ pro: cycle, business: cycle });
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Mi <span className="text-gradient">Suscripción</span>
        </h2>
        <p className="text-sm text-muted-foreground">Elige el plan que mejor se adapte a tu carrera profesional.</p>
      </div>

      {/* Hiring congratulations banners */}
      {!isEmpresario && (
        <div className="glass-panel p-5 mb-5 flex items-center gap-4"
          style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)', display: 'none' }}
          id="congrats-banner">
          <PartyPopper size={28} style={{ color: '#D4AF37' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>🎉 ¡Enhorabuena! ¡A reventarlo!</p>
            <p className="text-xs text-muted-foreground">Has sido contratado para un evento. Consulta tu calendario para más detalles.</p>
          </div>
        </div>
      )}

      {isEmpresario && (
        <div className="glass-panel p-5 mb-5 flex items-center gap-4"
          style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)', display: 'none' }}
          id="service-banner">
          <Truck size={28} style={{ color: '#D4AF37' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>🚀 Tu servicio va de camino...</p>
            <p className="text-xs text-muted-foreground">El profesional ha confirmado tu solicitud. Recibirás los detalles en breve.</p>
          </div>
        </div>
      )}

      <div className="glass-panel p-4 mb-6 flex items-center gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <Crown size={20} style={{ color: '#D4AF37' }} />
        <div>
          <p className="text-sm font-bold">Plan actual: <span style={{ color: '#8E8EA0' }}>{subscriptionPlans.find(plan => plan.id === currentPlan)?.name.toUpperCase() ?? 'PROMESA / BÁSICO'}</span></p>
          <p className="text-[0.6rem] text-muted-foreground">Los planes de pago estarán disponibles próximamente.</p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-5 flex items-center justify-between gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}>
        <div>
          <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Selector de ciclo</p>
          <p className="text-[0.65rem] text-muted-foreground">Activa anual para aplicar un {ANNUAL_DISCOUNT * 100}% de ahorro inmediato.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensual</span>
          <Switch checked={billingCycle === 'annual'} onCheckedChange={handleCycleChange} aria-label="Cambiar a facturación anual" />
          <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-primary' : 'text-muted-foreground'}`}>Anual</span>
        </div>
      </div>

      <div className="glass-panel p-4 mb-5 flex items-center gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.04)' }}>
        <Gift size={18} style={{ color: '#D4AF37' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>
            {trialDaysRemaining > 0
              ? `Te quedan ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'día' : 'días'} de acceso gratuito`
              : 'Tu periodo de prueba ha finalizado'}
          </p>
          <p className="text-[0.6rem] text-muted-foreground">
            {trialDaysRemaining > 0
              ? 'La prueba gratuita es de 15 días para todos los roles y planes de pago.'
              : 'Suscríbete ahora al plan anual y ahorra un 30% inmediato para mantener tu perfil activo.'}
          </p>
        </div>
      </div>

      {/* 15-day trial notice */}
      <div className="glass-panel p-4 mb-5 flex items-center gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.04)' }}>
        <Gift size={18} style={{ color: '#D4AF37' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Prueba gratuita de 15 días</p>
          <p className="text-[0.6rem] text-muted-foreground">
            Todos los planes de pago incluyen 15 días de prueba gratuita. Al finalizar, se cobrará automáticamente salvo que canceles antes.
            Recibirás un correo de aviso 1 día antes del cobro. Solo una prueba por usuario y plan.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-5 flex items-center gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.18)', background: 'rgba(212,175,55,0.03)' }}>
        <Gift size={18} style={{ color: '#D4AF37' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Descuento anual y cumpleaños</p>
          <p className="text-[0.6rem] text-muted-foreground">
            En modalidad anual obtienes un 30% de descuento. {birthdayDiscountActive
              ? 'Hoy tienes activo un 40% por cumpleaños en la modalidad anual.'
              : 'En tu cumpleaños se activará un 40% de descuento y recibirás el aviso cuando esté configurado el envío de emails.'}
          </p>
        </div>
      </div>

      {/* Locked notice */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3"
        style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.04)' }}>
        <Lock size={18} style={{ color: '#ffbc00' }} />
        <div>
          <p className="text-xs font-bold" style={{ color: '#ffbc00' }}>Plataforma de pagos en desarrollo</p>
          <p className="text-[0.6rem] text-muted-foreground">Los planes de pago se activarán cuando la pasarela de pagos esté operativa. Por ahora, todos los usuarios tienen acceso al plan básico gratuito.</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {subscriptionPlans.map(plan => {
          const isActive = plan.id === currentPlan;
          const isLocked = plan.id !== 'free';
          const pricing = getPlanPricing(plan, billingCycle, birthdayDiscountActive);
          return (
            <div key={plan.id} className={`glass-panel p-5 flex flex-col relative ${isLocked ? 'opacity-60' : ''}`}
              style={{ border: plan.popular ? '1px solid rgba(212,175,55,0.3)' : undefined }}>
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[0.55rem] font-bold whitespace-nowrap"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  MÁS POPULAR
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-bold" style={{ color: plan.textColor }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black" style={{ color: plan.textColor }}>
                    {pricing.finalPrice === 0 ? 'Gratis' : `€${pricing.finalPrice.toFixed(2)}`}
                  </span>
                  {pricing.finalPrice > 0 && <span className="text-[0.6rem] text-muted-foreground">{pricing.period}</span>}
                </div>
                {pricing.originalPrice && (
                  <p className="text-[0.55rem] text-muted-foreground line-through">€{pricing.originalPrice.toFixed(2)}</p>
                )}
                {pricing.discountPercent > 0 && (
                  <p className="text-[0.55rem] mt-1 font-bold" style={{ color: '#D4AF37' }}>
                    ✨ -{pricing.discountPercent}% · {pricing.helperText}
                  </p>
                )}
                {plan.trialDays > 0 && (
                  <p className="text-[0.55rem] mt-1 font-bold" style={{ color: '#D4AF37' }}>
                    🎁 {plan.trialDays} días gratis de prueba
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-2 mb-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle size={12} style={{ color: plan.textColor, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-[0.65rem]">{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled
                className="w-full py-2 rounded-lg text-xs font-bold transition-all cursor-not-allowed"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(212,175,55,0.08)',
                  color: isActive ? '#8E8EA0' : '#D4AF37',
                  border: '1px solid rgba(255,255,255,0.1)',
                  opacity: 0.6,
                }}>
                {isActive ? 'Plan Actual' : isLocked ? '🔒 Próximamente' : 'Plan Actual'}
              </button>
              {isActive && plan.id !== 'free' && (
                <button
                  onClick={() => {
                    setCancelPlanId(plan.id);
                    setCancelPlanName(plan.name);
                    setCancelModalOpen(true);
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg text-[0.65rem] font-medium transition-all hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20"
                >
                  Cancelar suscripción
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sector-specific visibility info */}
      <div className="glass-panel p-5 mb-6" style={{ border: '1px solid rgba(212,175,55,0.1)' }}>
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={14} style={{ color: '#D4AF37' }} />
          <span style={{ color: '#D4AF37' }}>Visibilidad por sector</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { sector: 'Música (DJs)', desc: 'Con Pase Weekend apareces primero los fines de semana con tu streaming en directo.' },
            { sector: 'Staff / Gastronomía', desc: 'En picos de demanda (Nochevieja, Ferias), los Sello de Oro reciben primero las alertas urgentes.' },
            { sector: 'Media (Foto/Vídeo)', desc: 'Con Pase Diario tu galería de alta resolución carga antes que la de los gratuitos.' },
            { sector: 'Diseño Gráfico', desc: 'Trabajo digital sin fronteras: con PRO activo apareces primero en búsquedas de toda España.' },
          ].map(s => (
            <div key={s.sector} className="p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}>
              <p className="text-xs font-bold mb-1" style={{ color: '#D4AF37' }}>{s.sector}</p>
              <p className="text-[0.6rem] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking explanation */}
      <div className="glass-panel p-5 mb-6" style={{ border: '1px solid rgba(212,175,55,0.1)' }}>
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Crown size={14} style={{ color: '#D4AF37' }} />
          <span style={{ color: '#D4AF37' }}>Orden de visibilidad en el directorio</span>
        </h4>
        <div className="space-y-2">
          {[
            { pos: '1º', label: 'Business', desc: 'Posición TOP absoluta con rotación horaria' },
            { pos: '2º', label: 'Pro / Pases activos', desc: 'Posicionamiento prioritario + streaming boost (+3 puestos)' },
            { pos: '3º', label: 'Promesas / Básico', desc: 'Visibilidad estándar gratuita' },
          ].map(r => (
            <div key={r.pos} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-sm font-black w-6 text-center" style={{ color: '#D4AF37' }}>{r.pos}</span>
              <div>
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[0.55rem] text-muted-foreground">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Star size={14} style={{ color: '#D4AF37' }} /> Ventajas de los planes de pago
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Eye, title: 'Más visibilidad', desc: 'Tu perfil aparece siempre en los primeros resultados.' },
            { icon: Crown, title: 'Sello dorado', desc: 'Distintivo visual que transmite confianza a empresarios.' },
            { icon: TrendingUp, title: 'Estadísticas', desc: 'Conoce cuántas veces ven y contactan con tu perfil.' },
            { icon: Zap, title: 'Prioridad Flash', desc: 'Recibe las ofertas Flash Booking antes que nadie.' },
          ].map(b => (
            <div key={b.title} className="p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <b.icon size={18} style={{ color: '#D4AF37' }} className="mb-2" />
              <p className="text-xs font-bold mb-0.5">{b.title}</p>
              <p className="text-[0.55rem] text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
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
