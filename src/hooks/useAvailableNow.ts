import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_LABELS, ROLE_COLORS } from './useActivityFeed';

export interface AvailableProfessional {
  userId: string;
  roleLabel: string;
  roleColor: string;
  zone: string | null;
}

const POLL_INTERVAL_MS = 60_000;
const LIMIT = 5;

export function useAvailableNow(): { professionals: AvailableProfessional[]; loading: boolean } {
  const [professionals, setProfessionals] = useState<AvailableProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, role, zone, updated_at')
      .eq('is_flash_active', true)
      .neq('role', 'pending')
      .order('updated_at', { ascending: false })
      .limit(LIMIT);

    if (error) {
      console.error('[useAvailableNow] fetch error:', error);
      setProfessionals([]);
      setLoading(false);
      return;
    }

    setProfessionals((data ?? []).map((row: any) => ({
      userId: row.user_id,
      roleLabel: ROLE_LABELS[row.role] ?? row.role,
      roleColor: ROLE_COLORS[row.role] ?? '#D4AF37',
      zone: row.zone,
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { professionals, loading };
}
