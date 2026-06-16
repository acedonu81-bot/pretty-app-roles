import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RecentBusinessView {
  zone: string | null;
  createdAt: string;
}

const WINDOW_DAYS = 7;

export function useRecentBusinessView(): { view: RecentBusinessView | null; loading: boolean } {
  const { user } = useAuth();
  const [view, setView] = useState<RecentBusinessView | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setView(null);
      setLoading(false);
      return;
    }

    const sinceIso = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('profile_business_views')
      .select('viewer_zone, created_at')
      .eq('viewed_user_id', user.id)
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[useRecentBusinessView] fetch error:', error);
      setView(null);
      setLoading(false);
      return;
    }

    const row = (data ?? [])[0];
    setView(row ? { zone: row.viewer_zone, createdAt: row.created_at } : null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { view, loading };
}
