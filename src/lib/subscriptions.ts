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
export const FAN_COMMISSION = 0.12;       // 12% sobre ingresos fan club
export const FLASH_COMMISSION = 0.05;    // 5% comisión Flash Booking confirmado

// Streaming (Amazon IVS)
export const STREAMING_HOURS_BUSINESS = 1;   // horas/mes incluidas en Business
export const STREAMING_HOURS_AGENCY = 3;     // horas/mes incluidas en Agency (pool 5 perfiles)
export const STREAMING_OVERAGE_PRICE = 2.99; // €/hora adicional

export interface StreamingPack {
  id: string;
  label: string;
  hours: number;
  price: number;
  pricePerHour: number;
  badge?: string;
  highlight?: boolean;
}

export const STREAMING_PACKS: StreamingPack[] = [
  {
    id: 'single',
    label: '1 hora',
    hours: 1,
    price: 5.99,
    pricePerHour: 5.99,
  },
  {
    id: 'pack_s',
    label: 'Pack S — 5 horas',
    hours: 5,
    price: 19.99,
    pricePerHour: 4.00,
    badge: 'POPULAR',
    highlight: true,
  },
  {
    id: 'pack_m',
    label: 'Pack M — 15 horas',
    hours: 15,
    price: 54.99,
    pricePerHour: 3.67,
  },
  {
    id: 'pack_l',
    label: 'Pack L — 30 horas',
    hours: 30,
    price: 99.99,
    pricePerHour: 3.33,
    badge: 'MEJOR PRECIO',
  },
];

// Planes que pueden comprar packs de streaming
export const STREAMING_PACK_ELIGIBLE_PLANS = ['starter', 'business', 'agency'] as const;

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
      'Géneros / especialidades ilimitados',
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
      'Aparición en búsquedas mejorada',
      'Compra packs de streaming (1h, 5h, 15h, 30h)',
      '15 días gratis al usar una función',
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
      '1h streaming en vivo/mes incluida (+ €2.99/h extra)',
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
      '3h streaming/mes en pool de 5 perfiles (+ €2.49/h extra)',
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

/**
 * Returns:
 *   null   → trial not started yet (user hasn't used a premium feature)
 *   number → days remaining (0 means expired)
 */
export const getTrialDaysRemaining = (trialStartedAt?: string | null): number | null => {
  if (!trialStartedAt) return null;
  const start = new Date(trialStartedAt);
  if (Number.isNaN(start.getTime())) return null;
  const elapsedMs = Date.now() - start.getTime();
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
  promoDiscount = 0,        // 0–1 fraction from a promo code
) => {
  if (plan.monthlyPrice === 0) {
    return { finalPrice: 0, originalPrice: null, period: plan.defaultPeriod, discountPercent: 0, helperText: 'Acceso básico gratuito' };
  }

  // Promo code takes priority over birthday/annual if higher
  if (promoDiscount > 0) {
    const best = Math.max(promoDiscount, billingCycle === 'annual' && plan.annualEligible ? ANNUAL_DISCOUNT : 0);
    const discountedMonthly = plan.monthlyPrice * (1 - best);
    return {
      finalPrice: discountedMonthly,
      originalPrice: plan.monthlyPrice,
      period: billingCycle === 'annual' && plan.annualEligible ? '/mes' : plan.defaultPeriod,
      discountPercent: Math.round(best * 100),
      helperText: `Código promo aplicado${billingCycle === 'annual' && plan.annualEligible ? ` · Facturado €${(discountedMonthly * 12).toFixed(2)}/año` : ''}`,
    };
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

  // Promo en modo mensual
  if (birthdayDiscountActive) {
    const discountedMonthly = plan.monthlyPrice * (1 - BIRTHDAY_DISCOUNT);
    return {
      finalPrice: discountedMonthly,
      originalPrice: plan.monthlyPrice,
      period: plan.defaultPeriod,
      discountPercent: BIRTHDAY_DISCOUNT * 100,
      helperText: '¡Feliz cumpleaños! Descuento de 1 mes aplicado',
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
