import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { DEFAULT_ZONE } from '@/lib/constants';

interface ProfileData {
  display_name: string;
  birthday: string | null;
  photo_url: string | null;
  zone: string | null;
  hourly_rate: number;
  role: string;
  subscription_tier: string;
  stream_url: string | null;
  stream_title: string | null;
  trial_started_at: string | null;
  annual_billing: boolean;
  is_live: boolean;
  is_flash_active: boolean;
  phone: string | null;
  specialty: string | null;
  instagram: string | null;
  bio: string | null;
  audio_embed_url: string | null;
  languages: string[] | null;
  genres: string[] | null;
  category: string | null;
  tiktok: string | null;
  bio_video_url: string | null;
  bg_music_url: string | null;
}

export interface ProfileSummary {
  id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  is_primary: boolean;
}

const PLAN_PROFILE_LIMITS: Record<string, number> = {
  free: 1,
  starter: 2,
  business: 3,
  agency: 5,
};

interface ProfileCtx extends ProfileData {
  loading: boolean;
  profileId: string | null;
  allProfiles: ProfileSummary[];
  refresh: () => Promise<void>;
  updateField: (fields: Partial<ProfileData>) => Promise<boolean>;
  activateTrial: () => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
  createProfile: (data: { display_name: string; role: string; zone: string; hourly_rate: number }) => Promise<boolean>;
  maxProfiles: number;
}

const defaults: ProfileData = {
  display_name: '',
  birthday: null,
  photo_url: null,
  zone: DEFAULT_ZONE,
  hourly_rate: 40,
  role: 'dj',
  subscription_tier: 'free',
  stream_url: null,
  stream_title: null,
  trial_started_at: null,
  annual_billing: false,
  is_live: false,
  is_flash_active: false,
  phone: null,
  specialty: null,
  instagram: null,
  bio: null,
  audio_embed_url: null,
  languages: null,
  genres: null,
  category: null,
  tiktok: null,
  bio_video_url: null,
  bg_music_url: null,
};

const ProfileContext = createContext<ProfileCtx>({
  ...defaults,
  loading: true,
  profileId: null,
  allProfiles: [],
  refresh: async () => {},
  updateField: async () => false,
  activateTrial: async () => {},
  switchProfile: async () => {},
  createProfile: async () => false,
  maxProfiles: 1,
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData>(defaults);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [allProfiles, setAllProfiles] = useState<ProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;

    // Load all profiles for this user
    const { data: rows } = await supabase
      .from('profiles')
      .select('id, display_name, role, photo_url, is_primary, subscription_tier, birthday, zone, hourly_rate, stream_url, stream_title, trial_started_at, annual_billing, is_live, is_flash_active, phone, specialty, instagram, bio, audio_embed_url, languages, genres, category, tiktok, bio_video_url, bg_music_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!rows || rows.length === 0) { setLoading(false); return; }

    // Find primary, fallback to first
    const primary = (rows.find((r: any) => r.is_primary) ?? rows[0]) as any;
    setProfileId(primary.id);
    setData(primary as unknown as ProfileData);
    setAllProfiles(rows.map((r: any) => ({
      id: r.id,
      display_name: r.display_name ?? '',
      role: r.role ?? 'dj',
      photo_url: r.photo_url ?? null,
      is_primary: r.is_primary ?? false,
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateField = useCallback(async (fields: Partial<ProfileData>): Promise<boolean> => {
    if (!user || !profileId) return false;
    const { error } = await supabase
      .from('profiles')
      .update(fields as any)
      .eq('id', profileId);
    if (error) {
      console.error('[useProfile] updateField error:', error);
      toast.error('Error al guardar: ' + error.message);
      return false;
    }
    setData(prev => ({ ...prev, ...fields }));
    return true;
  }, [user, profileId]);

  const switchProfile = useCallback(async (id: string) => {
    if (!user) return;
    // Set is_primary on selected profile (trigger in DB handles unsetting others)
    const { error } = await supabase
      .from('profiles')
      .update({ is_primary: true } as any)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) { toast.error('No se pudo cambiar de perfil'); return; }
    await refresh();
    toast.success('Perfil cambiado');
  }, [user, refresh]);

  const createProfile = useCallback(async (newData: { display_name: string; role: string; zone: string; hourly_rate: number }): Promise<boolean> => {
    if (!user) return false;
    const limit = PLAN_PROFILE_LIMITS[data.subscription_tier] ?? 1;
    if (allProfiles.length >= limit) {
      toast.error(`Tu plan ${data.subscription_tier} permite hasta ${limit} perfil${limit > 1 ? 'es' : ''}. Actualiza tu plan para añadir más.`);
      return false;
    }
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name: newData.display_name,
        role: newData.role,
        zone: newData.zone,
        hourly_rate: newData.hourly_rate,
        is_primary: false,
        subscription_tier: data.subscription_tier,
        category: 'professional',
      } as any);
    if (error) { toast.error('Error al crear perfil: ' + error.message); return false; }
    await refresh();
    toast.success('Perfil creado');
    return true;
  }, [user, data.subscription_tier, allProfiles.length, refresh]);

  const activateTrial = useCallback(async () => {
    if (!user || data.subscription_tier === 'free' || data.trial_started_at) return;
    const now = new Date().toISOString();
    const ok = await updateField({ trial_started_at: now });
    if (ok) toast.success('¡Prueba de 15 días iniciada! Disfruta de todas las funciones premium.');
  }, [user, data.subscription_tier, data.trial_started_at, updateField]);

  const maxProfiles = PLAN_PROFILE_LIMITS[data.subscription_tier] ?? 1;

  return (
    <ProfileContext.Provider value={{ ...data, loading, profileId, allProfiles, refresh, updateField, activateTrial, switchProfile, createProfile, maxProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};
