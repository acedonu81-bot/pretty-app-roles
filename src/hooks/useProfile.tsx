import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  trial_started_at: string;
  annual_billing: boolean;
  is_live: boolean;
}

interface ProfileCtx extends ProfileData {
  loading: boolean;
  refresh: () => Promise<void>;
  updateField: (fields: Partial<ProfileData>) => Promise<void>;
}

const defaults: ProfileData = {
  display_name: '',
  birthday: null,
  photo_url: null,
  zone: 'Madrid Centro',
  hourly_rate: 40,
  role: 'dj',
  subscription_tier: 'free',
  stream_url: null,
  stream_title: null,
  trial_started_at: new Date().toISOString(),
  annual_billing: false,
  is_live: false,
};

const ProfileContext = createContext<ProfileCtx>({
  ...defaults,
  loading: true,
  refresh: async () => {},
  updateField: async () => {},
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
      .select('display_name, birthday, photo_url, zone, hourly_rate, role, subscription_tier, stream_url, stream_title, trial_started_at, annual_billing')
      .eq('user_id', user.id)
      .maybeSingle();
    if (row) setData(row as unknown as ProfileData);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateField = useCallback(async (fields: Partial<ProfileData>) => {
    if (!user) return;
    await (supabase.from('profiles').update(fields as any) as any).eq('user_id', user.id);
    setData(prev => ({ ...prev, ...fields }));
  }, [user]);

  return (
    <ProfileContext.Provider value={{ ...data, loading, refresh, updateField }}>
      {children}
    </ProfileContext.Provider>
  );
};
