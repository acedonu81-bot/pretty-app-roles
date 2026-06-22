import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveStats {
  activeProfessionals: number;
  availableNow: number;
  cities: number;
}

export interface AvailableProfessional {
  userId: string;
  roleLabel: string;
  roleColor: string;
  zone: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista', media: 'Fotógrafo / Vídeo', makeup: 'Maquilladora',
  staff: 'Staff / Camarero', promotor: 'Promotor / RRPP', empresario: 'Empresario',
  event_manager: 'Encargada de Eventos', rookie: 'DJ Promesa', vestuario: 'Estilista',
  catering: 'Catering & Chef', ambassador: 'Embajador', design: 'Diseño',
  mago: 'Mago & Ilusionista', bailarin: 'Bailarín & Danza', humorista: 'Humorista & Cómico',
  monologo: 'Monólogo & Stand-Up', animador: 'Payaso & Animador', speaker: 'Speaker & Presentador',
};
const ROLE_COLORS: Record<string, string> = {
  dj: '#4285F4', rookie: '#60A5FA', staff: '#34D399', event_manager: '#2DD4BF',
  makeup: '#F9A8D4', media: '#A78BFA', empresario: '#D4AF37', vestuario: '#FB923C',
  design: '#E879F9', promotor: '#38BDF8', catering: '#F59E0B', mago: '#8B5CF6',
  monologo: '#EF4444', bailarin: '#EC4899', humorista: '#F97316', animador: '#FBBF24', speaker: '#06B6D4',
};

const POLL_INTERVAL_MS = 120_000;

export function useLiveStats(): { stats: LiveStats | null; availableNow: AvailableProfessional[]; loading: boolean } {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [availableNow, setAvailableNow] = useState<AvailableProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, role, zone, is_flash_active')
      .neq('role', 'pending');

    if (error || !data || data.length === 0) {
      setStats(null);
      setAvailableNow([]);
      setLoading(false);
      return;
    }

    const flashActive = data.filter(r => r.is_flash_active);

    setStats({
      activeProfessionals: data.length,
      availableNow: flashActive.length,
      cities: new Set(data.map(r => r.zone).filter(Boolean)).size,
    });

    setAvailableNow(flashActive.slice(0, 5).map(r => ({
      userId: r.user_id,
      roleLabel: ROLE_LABELS[r.role] ?? r.role,
      roleColor: ROLE_COLORS[r.role] ?? '#D4AF37',
      zone: r.zone,
    })));

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { stats, availableNow, loading };
}
