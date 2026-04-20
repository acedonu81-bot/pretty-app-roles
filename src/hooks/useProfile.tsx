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

interface ProfileCtx extends ProfileData {
  loading: boolean;
  refresh: () => Promise<void>;
  updateField: (fields: Partial<ProfileData>) => Promise<boolean>;
  /** Activates the 15-day trial on first premium feature use. No-op if already started or on free plan. */
  activateTrial: () => Promise<void>;
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
  refresh: async () => {},
  updateField: async () => false,
  activateTrial: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData>(defaults);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data: row } = await supabase
      .from('profiles')
      .select('display_name, birthday, photo_url, zone, hourly_rate, role, subscription_tier, stream_url, stream_title, trial_started_at, annual_billing, is_live, is_flash_active, phone, specialty, instagram, bio, audio_embed_url, languages, genres, category, tiktok, bio_video_url, bg_music_url')
      .eq('user_id', user.id)
      .maybeSingle();
    if (row) setData(row as unknown as ProfileData);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateField = useCallback(async (fields: Partial<ProfileData>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase
      .from('profiles')
      .update(fields as any)
      .eq('user_id', user.id);
    if (error) {
      console.error('[useProfile] updateField error:', error);
      toast.error('Error al guardar: ' + error.message);
      return false;
    }
    setData(prev => ({ ...prev, ...fields }));
    return true;
  }, [user]);

  const activateTrial = useCallback(async () => {
    if (!user || data.subscription_tier === 'free' || data.trial_started_at) return;
    const now = new Date().toISOString();
    const ok = await updateField({ trial_started_at: now });
    if (ok) {
      toast.success('¡Prueba de 15 días iniciada! Disfruta de todas las funciones premium.');
    }
  }, [user, data.subscription_tier, data.trial_started_at, updateField]);

  return (
    <ProfileContext.Provider value={{ ...data, loading, refresh, updateField, activateTrial }}>
      {children}
    </ProfileContext.Provider>
  );
};
