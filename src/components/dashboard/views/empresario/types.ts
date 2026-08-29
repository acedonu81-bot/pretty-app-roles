export type { Pro } from '@/types';
export { ZONES } from '@/lib/constants';

export const PAYMENT_BENCHMARK = [
  { role: 'DJ',     avg: 320, min: 150, max: 900, pct_cash: 42, pct_transfer: 51, pct_platform: 7  },
  { role: 'Staff',  avg: 85,  min: 50,  max: 200, pct_cash: 65, pct_transfer: 30, pct_platform: 5  },
  { role: 'Makeup', avg: 180, min: 80,  max: 450, pct_cash: 35, pct_transfer: 55, pct_platform: 10 },
];
