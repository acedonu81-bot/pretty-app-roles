export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: 'free' | 'daily' | 'weekend' | 'pro' | 'business';
  name: string;
  monthlyPrice: number;
  annualEligible: boolean;
  defaultPeriod: string;
  features: string[];
  color: string;
  textColor: string;
  popular?: boolean;
  trialDays: number;
}

export const TRIAL_DAYS = 15;
export const ANNUAL_DISCOUNT = 0.3;
export const BIRTHDAY_DISCOUNT = 0.4;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Promesa / Básico',
    monthlyPrice: 0,
    defaultPeriod: 'Gratis',
    features: ['Perfil visible en directorio', 'Contacto por WhatsApp', 'Flash Booking (recibir ofertas)', 'Etiqueta Promesa o Básico'],
    color: 'rgba(255,255,255,0.1)',
    textColor: '#8E8EA0',
    annualEligible: false,
    trialDays: 0,
  },
  {
    id: 'daily',
    name: 'Pase Diario',
    monthlyPrice: 4.99,
    defaultPeriod: '/día',
    features: ['Posición prioritaria durante 24h', 'Perfil destacado con borde dorado', 'Ideal para eventos puntuales', 'Indicador "Posicionamiento Activo"'],
    color: 'rgba(212,175,55,0.08)',
    textColor: '#D4AF37',
    annualEligible: false,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'weekend',
    name: 'Pase Weekend',
    monthlyPrice: 8.99,
    defaultPeriod: '/fin de semana',
    features: ['Posición TOP viernes a domingo', 'Streaming de perfil en directo', 'Borde dorado + sello Weekend', 'Notificaciones prioritarias de Flash Booking'],
    color: 'rgba(212,175,55,0.12)',
    textColor: '#D4AF37',
    annualEligible: false,
    popular: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 29.99,
    defaultPeriod: '/mes',
    features: ['Todo lo de los Pases', 'Sello PRO dorado permanente', 'Acceso a Streaming 24/7', 'Estadísticas avanzadas de visitas', 'Prioridad sobre Pases y gratuitos'],
    color: 'rgba(212,175,55,0.15)',
    textColor: '#D4AF37',
    annualEligible: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 59.99,
    defaultPeriod: '/mes',
    features: ['Todo lo del plan Pro', 'Gestión multiperfil para agencias', 'Posición TOP con rotación horaria', 'Sello BUSINESS exclusivo', 'Soporte prioritario'],
    color: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,148,30,0.1))',
    textColor: '#D4AF37',
    annualEligible: true,
    trialDays: TRIAL_DAYS,
  },
];

export const mapSubscriptionTierToPlan = (tier?: string | null): SubscriptionPlan['id'] => {
  switch (tier) {
    case 'daily':
    case 'weekend':
    case 'pro':
    case 'business':
    case 'free':
      return tier;
    case 'premium':
      return 'pro';
    case 'elite':
      return 'business';
    default:
      return 'free';
  }
};

export const getTrialDaysRemaining = (trialStartedAt?: string | null) => {
  if (!trialStartedAt) return TRIAL_DAYS;

  const start = new Date(trialStartedAt);
  const now = new Date();

  if (Number.isNaN(start.getTime())) return TRIAL_DAYS;

  const elapsedMs = now.getTime() - start.getTime();
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

  return Math.max(TRIAL_DAYS - elapsedDays, 0);
};

export const isBirthdayToday = (birthday?: string | null) => {
  if (!birthday) return false;

  const date = new Date(birthday);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return now.getDate() === date.getDate() && now.getMonth() === date.getMonth();
};

export const getPlanPricing = (
  plan: SubscriptionPlan,
  billingCycle: BillingCycle,
  birthdayDiscountActive = false,
) => {
  if (plan.monthlyPrice === 0) {
    return {
      finalPrice: 0,
      originalPrice: null,
      period: plan.defaultPeriod,
      discountPercent: 0,
      helperText: 'Acceso básico gratuito',
    };
  }

  if (billingCycle === 'annual' && plan.annualEligible) {
    const annualBase = plan.monthlyPrice * 12;
    const discountPercent = birthdayDiscountActive ? BIRTHDAY_DISCOUNT : ANNUAL_DISCOUNT;
    const finalPrice = annualBase * (1 - discountPercent);

    return {
      finalPrice,
      originalPrice: annualBase,
      period: '/año',
      discountPercent: discountPercent * 100,
      helperText: birthdayDiscountActive ? 'Descuento de cumpleaños aplicado' : 'Ahorro anual inmediato',
    };
  }

  return {
    finalPrice: plan.monthlyPrice,
    originalPrice: null,
    period: plan.defaultPeriod,
    discountPercent: 0,
    helperText: billingCycle === 'annual' && !plan.annualEligible ? 'Este pase no tiene modalidad anual' : 'Pago recurrente estándar',
  };
};