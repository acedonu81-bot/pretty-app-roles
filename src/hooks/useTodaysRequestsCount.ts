import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useTodaysRequestsCount(): { count: number | null; loading: boolean } {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setCount(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc('flash_bookings_today_count', { p_professional_user_id: user.id });

    if (error) {
      console.error('[useTodaysRequestsCount] rpc error:', error);
      setCount(null);
      setLoading(false);
      return;
    }

    setCount(typeof data === 'number' ? data : null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { count, loading };
}
