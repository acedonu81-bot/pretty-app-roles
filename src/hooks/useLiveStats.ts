import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveStats {
  activeProfessionals: number;
  availableNow: number;
  cities: number;
}

const POLL_INTERVAL_MS = 60_000;

async function countActiveProfessionals(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('user_id', { count: 'exact', head: true })
    .neq('role', 'pending');
  if (error) {
    console.error('[useLiveStats] activeProfessionals error:', error);
    return 0;
  }
  return count ?? 0;
}

async function countAvailableNow(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('user_id', { count: 'exact', head: true })
    .eq('is_flash_active', true)
    .neq('role', 'pending');
  if (error) {
    console.error('[useLiveStats] availableNow error:', error);
    return 0;
  }
  return count ?? 0;
}

async function countDistinctCities(): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('zone')
    .neq('role', 'pending')
    .not('zone', 'is', null);
  if (error) {
    console.error('[useLiveStats] cities error:', error);
    return 0;
  }
  return new Set((data ?? []).map((r: any) => r.zone)).size;
}

export function useLiveStats(): { stats: LiveStats | null; loading: boolean } {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [activeProfessionals, availableNow, cities] = await Promise.all([
      countActiveProfessionals(),
      countAvailableNow(),
      countDistinctCities(),
    ]);

    if (activeProfessionals === 0) {
      setStats(null);
      setLoading(false);
      return;
    }

    setStats({ activeProfessionals, availableNow, cities });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { stats, loading };
}
