import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista', media: 'Fotógrafo / Vídeo', makeup: 'Maquilladora',
  staff: 'Camarero', azafata: 'Azafata', promotor: 'Promotor / RRPP', empresario: 'Empresario',
  event_manager: 'Encargada de Eventos', rookie: 'DJ Promesa', vestuario: 'Estilista',
  catering: 'Catering & Chef', ambassador: 'Embajador', design: 'Diseño',
  mago: 'Mago & Ilusionista', bailarin: 'Bailarín & Danza', humorista: 'Humorista & Cómico',
  monologo: 'Monólogo & Stand-Up', animador: 'Payaso & Animador', speaker: 'Speaker & Presentador',
};
const ROLE_COLORS: Record<string, string> = {
  dj: '#4285F4', rookie: '#60A5FA', staff: '#34D399', azafata: '#F472B6', event_manager: '#2DD4BF',
  makeup: '#F9A8D4', media: '#A78BFA', empresario: '#D4AF37', vestuario: '#FB923C',
  design: '#E879F9', promotor: '#38BDF8', catering: '#F59E0B', mago: '#8B5CF6',
  monologo: '#EF4444', bailarin: '#EC4899', humorista: '#F97316', animador: '#FBBF24', speaker: '#06B6D4',
};

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
