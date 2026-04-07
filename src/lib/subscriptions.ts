export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: 'free' | 'starter' | 'business' | 'agency';
  name: string;
  monthlyPrice: number;
  annualEligible: boolean;
  defaultPeriod: string;
  features: string[];
  textColor: string;
  popular?: boolean;
  trialDays: number;
  badge?: string;
}

export const TRIAL_DAYS = 15;
export const ANNUAL_DISCOUNT = 0.30;
export const BIRTHDAY_DISCOUNT = 0.40;
export const FAN_COMMISSION = 0.12;     // 12% sobre ingresos fan club
export const FLASH_COMMISSION = 0.05;  // 5% comisión Flash Booking confirmado

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    monthlyPrice: 0,
    defaultPeriod: 'Gratis',
    features: [
      'Perfil visible en el directorio',
      'Mensajería interna XPEAK',
      'Recibir ofertas Flash Booking',
      'Hasta 2 géneros / especialidades',
      'Etiqueta Promesa o Básico',
    ],
    textColor: '#8E8EA0',
    annualEligible: false,
    trialDays: 0,
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 4.99,
    defaultPeriod: '/mes',
    badge: 'NUEVO',
    features: [
      'Badge verificado en tu ficha',
      'Estadísticas básicas (visitas, mensajes)',
      'Géneros / especialidades ilimitados',
      'Aparición en búsquedas mejorada',
      '15 días gratis al activar',
    ],
    textColor: '#A8C5DA',
    annualEligible: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 14.99,
    defaultPeriod: '/mes',
    features: [
      'Posicionamiento prioritario #1–48',
      'Estadísticas avanzadas + exportar',
      'Streaming ilimitado',
      'Sello Business dorado',
      'Notificaciones Flash antes que nadie',
      'Soporte prioritario 24/7',
      'Fan Club activado',
    ],
    textColor: '#D4AF37',
    annualEligible: true,
    popular: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'agency',
    name: 'Agencia',
    monthlyPrice: 44.99,
    defaultPeriod: '/mes',
    features: [
      'Gestión de hasta 5 perfiles',
      'Analíticas de toda la agencia',
      'Streaming 24/7 en todos los perfiles',
      'Visibilidad máxima garantizada',
      'Sello Agencia exclusivo',
      'API de integración (próximamente)',
      'Todo lo incluido en Business',
    ],
    textColor: '#D4AF37',
    annualEligible: true,
    trialDays: TRIAL_DAYS,
  },
];

export const mapSubscriptionTierToPlan = (tier?: string | null): SubscriptionPlan['id'] => {
  switch (tier) {
    case 'starter': return 'starter';
    case 'business': return 'business';
    case 'agency':
    case 'pro':
    case 'elite':
      return 'agency';
    case 'free':
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
    return { finalPrice: 0, originalPrice: null, period: plan.defaultPeriod, discountPercent: 0, helperText: 'Acceso básico gratuito' };
  }

  if (billingCycle === 'annual' && plan.annualEligible) {
    const discountPercent = birthdayDiscountActive ? BIRTHDAY_DISCOUNT : ANNUAL_DISCOUNT;
    const discountedMonthly = plan.monthlyPrice * (1 - discountPercent);
    return {
      finalPrice: discountedMonthly,
      originalPrice: plan.monthlyPrice,
      period: '/mes',
      discountPercent: discountPercent * 100,
      helperText: birthdayDiscountActive ? 'Descuento de cumpleaños aplicado' : `Facturado €${(discountedMonthly * 12).toFixed(2)}/año`,
    };
  }

  return {
    finalPrice: plan.monthlyPrice,
    originalPrice: null,
    period: plan.defaultPeriod,
    discountPercent: 0,
    helperText: 'Pago recurrente estándar',
  };
};
