import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScarcitySignal {
  weeklyProfileViews: number;
  weeklyContactRequests: number;
  loading: boolean;
}

export const useScarcitySignal = (userId: string | undefined): ScarcitySignal => {
  const [weeklyProfileViews, setWeeklyProfileViews] = useState(0);
  const [weeklyContactRequests, setWeeklyContactRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    Promise.all([
      supabase.from('profile_business_views')
        .select('id', { count: 'exact', head: true })
        .eq('viewed_user_id', userId)
        .gte('created_at', sevenDaysAgo),
      supabase.from('flash_bookings' as any)
        .select('id', { count: 'exact', head: true })
        .eq('professional_user_id', userId)
        .gte('created_at', sevenDaysAgo),
    ]).then(([viewsRes, bookingsRes]) => {
      setWeeklyProfileViews(viewsRes.count ?? 0);
      setWeeklyContactRequests(bookingsRes.count ?? 0);
      setLoading(false);
    });
  }, [userId]);

  return { weeklyProfileViews, weeklyContactRequests, loading };
};
