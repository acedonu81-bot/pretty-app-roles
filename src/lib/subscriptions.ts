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
export const ANNUAL_DISCOUNT = 0.10;
// Precios con IVA incluido (decisión 13 nov 2026).
export const IVA_INCLUIDO = true;
// Anual = 10 mensualidades: ahorras 2 meses, el primer año y en las renovaciones
// (23 nov 2026, sustituye al 15 % / 10 %).
export const PRECIOS_ANUALES: Record<'starter' | 'business', number> = { starter: 69.90, business: 149.90 };
// Black Friday 2026: 35 % sobre el anual, solo el primer año (cupón de importe fijo en Stripe).
export const PRECIOS_BLACK_FRIDAY: Record<'starter' | 'business', number> = { starter: 45.44, business: 97.44 };
export const INICIO_BLACK_FRIDAY = new Date('2026-11-26T23:00:00Z'); // 27 nov 00:00 Madrid
export const FIN_BLACK_FRIDAY = new Date('2026-11-30T23:00:00Z');    // 30 nov 23:59 Madrid
export const esBlackFriday = (ahora = new Date()) => ahora >= INICIO_BLACK_FRIDAY && ahora < FIN_BLACK_FRIDAY;
const MENSUAL: Record<'starter' | 'business', number> = { starter: 6.99, business: 14.99 };
/** Lo que se ahorra al año pagando anual frente a 12 meses: 2 mensualidades. */
export const ahorroAnual = (p: 'starter' | 'business') => Math.round((MENSUAL[p] * 12 - PRECIOS_ANUALES[p]) * 100) / 100;
export const BIRTHDAY_DISCOUNT = 0.40;

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
    label: 'Pack S: 5 horas',
    hours: 5,
    price: 19.99,
    pricePerHour: 4.00,
    badge: 'POPULAR',
    highlight: true,
  },
  {
    id: 'pack_m',
    label: 'Pack M: 15 horas',
    hours: 15,
    price: 54.99,
    pricePerHour: 3.67,
  },
  {
    id: 'pack_l',
    label: 'Pack L: 30 horas',
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
    id: 'starter',
    name: 'Profesional',
    monthlyPrice: 6.99,
    defaultPeriod: '/mes',
    badge: 'NUEVO',
    features: [], // las ventajas viven en src/lib/ventajasPlan.ts
    textColor: '#A8C5DA',
    annualEligible: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'business',
    name: 'Premium',
    monthlyPrice: 14.99,
    defaultPeriod: '/mes',
    features: [], // las ventajas viven en src/lib/ventajasPlan.ts
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
    features: [], // las ventajas viven en src/lib/ventajasPlan.ts
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
      return 'starter'; // no hay plan gratuito: sin suscripción de pago cuenta como Profesional
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
