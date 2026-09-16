import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeeklyProfileViews {
  count: number;
  delta: number;
}

// Solo tiene sentido pedirlo para el propio perfil (RLS de
// profile_business_views ya lo restringe a auth.uid() = viewed_user_id) —
// ver ProfileCard.tsx, que solo llama a este hook cuando la card es la del
// usuario logueado. Reutiliza los RPCs de profile_views_last_7_days /
// profile_views_previous_week (20260818 / 20260917), ya usados en
// PublicProfile.tsx para el badge "👀 N vistas esta semana".
export function useWeeklyProfileViews(userId: string | null): WeeklyProfileViews | null {
  const [data, setData] = useState<WeeklyProfileViews | null>(null);

  useEffect(() => {
    if (!userId) { setData(null); return; }
    let cancelled = false;
    Promise.all([
      supabase.rpc('profile_views_last_7_days', { p_viewed_user_id: userId }),
      supabase.rpc('profile_views_previous_week', { p_viewed_user_id: userId }),
    ]).then(([current, previous]) => {
      if (cancelled) return;
      if (current.error || previous.error) {
        console.error('[useWeeklyProfileViews] rpc error:', current.error || previous.error);
        setData(null);
        return;
      }
      const count = current.data ?? 0;
      const delta = count - (previous.data ?? 0);
      setData({ count, delta });
    });
    return () => { cancelled = true; };
  }, [userId]);

  return data;
}
