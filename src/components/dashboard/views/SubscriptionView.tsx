import { useState } from 'react';
import { Crown, CheckCircle, Star, Zap, Eye, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Básico',
    price: 0,
    period: 'Gratis',
    features: ['Perfil visible en directorio', 'Contacto por WhatsApp', 'Flash Booking (recibir ofertas)'],
    color: 'rgba(255,255,255,0.1)',
    textColor: '#8E8EA0',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14.95,
    period: '/mes',
    features: ['Todo lo del plan Básico', 'Badge PREMIUM en perfil', 'Estadísticas de visitas', 'Posición mejorada en directorio', 'Filtros avanzados de búsqueda'],
    color: 'rgba(212,175,55,0.15)',
    textColor: '#D4AF37',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 24.95,
    period: '/mes',
    features: ['Todo lo del plan Premium', 'Badge ELITE dorado', 'Posición TOP con rotación horaria', 'Distintivo PREMIUM dorado permanente', 'Soporte prioritario', 'Estadísticas avanzadas de clics'],
    color: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,148,30,0.1))',
    textColor: '#D4AF37',
  },
];

const SubscriptionView = () => {
  const [currentPlan] = useState('free');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) return;
    setProcessing(planId);
    setTimeout(() => {
      setProcessing(null);
      toast.success(`Plan ${planId.toUpperCase()} activado. ¡Bienvenido!`);
    }, 2000);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Mi <span className="text-gradient">Suscripción</span>
        </h2>
        <p className="text-sm text-muted-foreground">Elige el plan que mejor se adapte a tu carrera profesional.</p>
      </div>

      {/* Current plan banner */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <Crown size={20} style={{ color: '#D4AF37' }} />
        <div>
          <p className="text-sm font-bold">Plan actual: <span style={{ color: '#D4AF37' }}>{currentPlan.toUpperCase()}</span></p>
          <p className="text-[0.6rem] text-muted-foreground">Actualiza para destacar en el directorio y conseguir más contrataciones.</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map(plan => {
          const isActive = plan.id === currentPlan;
          const isProcessing = processing === plan.id;
          return (
            <div key={plan.id} className="glass-panel p-6 flex flex-col relative"
              style={{ border: plan.popular ? '1px solid rgba(212,175,55,0.3)' : undefined }}>
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[0.55rem] font-bold"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  MÁS POPULAR
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold" style={{ color: plan.textColor }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black" style={{ color: plan.textColor }}>
                    {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle size={13} style={{ color: plan.textColor, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isActive || !!processing}
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, #D4AF37, #B8941E)',
                  color: isActive ? '#8E8EA0' : '#000',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                {isActive ? 'Plan Actual' : isProcessing ? 'Procesando...' : `Activar ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Premium benefits */}
      <div className="glass-panel p-6">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Star size={14} style={{ color: '#D4AF37' }} /> Ventajas del distintivo Premium
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Eye, title: 'Más visibilidad', desc: 'Tu perfil aparece siempre en los primeros resultados.' },
            { icon: Crown, title: 'Badge dorado', desc: 'Distintivo visual que transmite confianza a empresarios.' },
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
    </div>
  );
};

export default SubscriptionView;
