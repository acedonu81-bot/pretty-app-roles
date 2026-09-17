import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MIN_COMPARABLE_PEERS = 5;

interface MarketRateInsight {
  percentDiff: number | null;
  loading: boolean;
}

export const useMarketRateInsight = (userId: string | undefined): MarketRateInsight => {
  const [percentDiff, setPercentDiff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    const profilesTable = supabase.from('profiles');

    profilesTable
      .select('hourly_rate, category, zone')
      .eq('user_id', userId)
      .maybeSingle()
      .then(async ({ data: me }) => {
        const myRate = (me as { hourly_rate?: number } | null)?.hourly_rate;
        const category = (me as { category?: string } | null)?.category;
        const zone = (me as { zone?: string } | null)?.zone;

        if (!myRate || myRate <= 0 || !category || !zone) {
          setPercentDiff(null);
          setLoading(false);
          return;
        }

        const { data: peers } = await profilesTable
          .select('hourly_rate')
          .eq('category', category)
          .eq('zone', zone)
          .neq('user_id', userId)
          .gt('hourly_rate', 0)
          .not('email', 'ilike', '%xpeak.es%')
          .not('email', 'ilike', '%demo%');

        const peerRates = (peers ?? []).map((p: { hourly_rate: number }) => p.hourly_rate);

        if (peerRates.length < MIN_COMPARABLE_PEERS) {
          setPercentDiff(null);
          setLoading(false);
          return;
        }

        const avg = peerRates.reduce((sum, r) => sum + r, 0) / peerRates.length;
        setPercentDiff(Math.round(((myRate - avg) / avg) * 100));
        setLoading(false);
      });
  }, [userId]);

  return { percentDiff, loading };
};
