import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  text: string;
  name: string;
  role: string;
  roleLabel: string;
  roleColor: string;
  zone: string | null;
  createdAt: string;
  kind: 'signup' | 'contact';
}

export const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista',
  media: 'Fotógrafo / Vídeo',
  makeup: 'Maquilladora',
  staff: 'Camarero',
  azafata: 'Azafata',
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

export const ROLE_COLORS: Record<string, string> = {
  dj: '#4285F4',
  rookie: '#60A5FA',
  staff: '#34D399',
  azafata: '#F472B6',
  event_manager: '#2DD4BF',
  makeup: '#F9A8D4',
  media: '#A78BFA',
  empresario: '#D4AF37',
  vestuario: '#FB923C',
  design: '#E879F9',
  promotor: '#38BDF8',
  catering: '#F59E0B',
  mago: '#8B5CF6',
  monologo: '#EF4444',
  bailarin: '#EC4899',
  humorista: '#F97316',
  animador: '#FBBF24',
  speaker: '#06B6D4',
};

const MIN_ITEMS = 1;
const POLL_INTERVAL_MS = 60_000;
const MAX_COMBINED_ITEMS = 20;

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function roleColor(role: string): string {
  return ROLE_COLORS[role] ?? '#D4AF37';
}

function signupText(row: { display_name: string; role: string; zone: string | null }): string {
  const label = roleLabel(row.role);
  return row.zone
    ? `${row.display_name} (${label}) se unió desde ${row.zone}`
    : `${row.display_name} (${label}) se unió a XPEAK`;
}

function contactText(row: { professional_role: string; professional_zone: string | null }): string {
  const label = roleLabel(row.professional_role);
  return row.professional_zone
    ? `Alguien contactó a un/a ${label} en ${row.professional_zone}`
    : `Alguien contactó a un/a ${label}`;
}

async function fetchRecentSignups(sinceIso: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, zone, created_at')
    .not('display_name', 'is', null)
    .neq('role', 'pending')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] signups fetch error:', error);
    return [];
  }
  return data ?? [];
}

async function fetchRecentContacts(sinceIso: string) {
  const { data, error } = await supabase
    .from('contact_events')
    .select('professional_role, professional_zone, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] contacts fetch error:', error);
    return [];
  }
  return data ?? [];
}

function buildCombinedItems(signups: any[], contacts: any[]): ActivityItem[] {
  const signupItems: ActivityItem[] = signups.map((row, i) => ({
    id: `signup-${row.created_at}-${i}`,
    text: signupText(row),
    name: row.display_name,
    role: row.role,
    roleLabel: roleLabel(row.role),
    roleColor: roleColor(row.role),
    zone: row.zone,
    createdAt: row.created_at,
    kind: 'signup' as const,
  }));

  const contactItems: ActivityItem[] = contacts.map((row, i) => ({
    id: `contact-${row.created_at}-${i}`,
    text: contactText(row),
    name: '',
    role: row.professional_role,
    roleLabel: roleLabel(row.professional_role),
    roleColor: roleColor(row.professional_role),
    zone: row.professional_zone,
    createdAt: row.created_at,
    kind: 'contact' as const,
  }));

  return [...signupItems, ...contactItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_COMBINED_ITEMS);
}

async function fetchCombined(sinceIso: string): Promise<ActivityItem[]> {
  const [signups, contacts] = await Promise.all([
    fetchRecentSignups(sinceIso),
    fetchRecentContacts(sinceIso),
  ]);
  return buildCombinedItems(signups, contacts);
}

export function useActivityFeed(): { items: ActivityItem[]; loading: boolean } {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    let combined = await fetchCombined(dayAgo);

    if (combined.length < MIN_ITEMS) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      combined = await fetchCombined(monthAgo);
    }

    if (combined.length >= MIN_ITEMS) {
      setItems(combined);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { items, loading };
}
