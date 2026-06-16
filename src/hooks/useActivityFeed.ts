import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  text: string;
}

const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista',
  media: 'Fotógrafo / Vídeo',
  makeup: 'Maquilladora',
  staff: 'Staff / Camarero',
  promotor: 'Promotor / RRPP',
  empresario: 'Empresario',
  event_manager: 'Encargada de Eventos',
  rookie: 'DJ Promesa',
  vestuario: 'Estilista',
  catering: 'Catering & Chef',
  ambassador: 'Embajador',
  design: 'Diseño',
  mago: 'Mago & Ilusionista',
  bailarin: 'Bailarín & Danza',
  humorista: 'Humorista & Cómico',
  monologo: 'Monólogo & Stand-Up',
  animador: 'Payaso & Animador',
  speaker: 'Speaker & Presentador',
};

const MIN_ITEMS = 3;
const POLL_INTERVAL_MS = 60_000;

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function toText(row: { display_name: string; role: string; zone: string | null }): string {
  const label = roleLabel(row.role);
  return row.zone
    ? `${row.display_name} (${label}) se unió desde ${row.zone}`
    : `${row.display_name} (${label}) se unió a XPEAK`;
}

async function fetchRecentProfiles(sinceIso: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, zone, created_at')
    .not('display_name', 'is', null)
    .neq('role', 'pending')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] fetch error:', error);
    return [];
  }
  return data ?? [];
}

export function useActivityFeed(): { items: ActivityItem[]; loading: boolean } {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    let rows = await fetchRecentProfiles(dayAgo);

    if (rows.length < MIN_ITEMS) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      rows = await fetchRecentProfiles(monthAgo);
    }

    if (rows.length < MIN_ITEMS) {
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(rows.map((row: any, i: number) => ({ id: `${row.created_at}-${i}`, text: toText(row) })));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { items, loading };
}
