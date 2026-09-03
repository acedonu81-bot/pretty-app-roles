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
  roles: string[];
  subscription_tier: string;
  stream_url: string | null;
  stream_title: string | null;
  trial_started_at: string | null;
  annual_billing: boolean;
  // user_id hace falta para escribir en profiles desde componentes sueltos
  // (MisCondicionesSection). Sin él, un .eq('user_id', profile.user_id) se
  // serializa como la cadena "undefined" y Postgres rechaza el UPDATE.
  user_id: string;
  is_live: boolean;
  is_flash_active: boolean;
  // "Mis condiciones" — el profesional fija sus reglas. Todas opcionales.
  min_hours: number | null;
  overtime_after_hours: number | null;
  overtime_surcharge_pct: number | null;
  night_surcharge_pct: number | null;
  holiday_surcharge_pct: number | null;
  payment_days_max: number | null;
  travel_free_km: number | null;
  travel_fee: number | null;
  excluded_services: string[] | null;
  uniform_provided_by: string | null;
  available_weekdays: number[] | null;
  blocked_dates: string[] | null;
  min_notice_hours: number | null;
  conditions_note: string | null;
  phone: string | null;
  specialty: string | null;
  instagram: string | null;
  bio: string | null;
  audio_embed_url: string | null;
  audio_session_urls: string[] | null;
  languages: string[] | null;
  genres: string[] | null;
  category: string | null;
  tiktok: string | null;
  bio_video_url: string | null;
  bg_music_url: string | null;
  portfolio_urls: string[] | null;
  referral_code: string | null;
  priority_badge_until: string | null;
  offers_classes: boolean;
  class_styles: string[] | null;
  class_price: number | null;
  seeking_dance_partner: boolean;
  dance_level: string | null;
  dance_role: string | null;
  // Privacidad (migración 20260829b). Opcionales en el tipo para que la app
  // siga funcionando aunque la migración todavía no esté aplicada en el
  // proyecto Supabase: se leen con fallback y no rompen Ajustes.
  is_public?: boolean;
  show_online?: boolean;
  email_opt_out?: boolean;
}

export interface ProfileSummary {
  id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  is_primary: boolean;
}

const MAX_PROFILES_PER_USER = 20;

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
  roles: ['dj'],
  subscription_tier: 'free',
  stream_url: null,
  stream_title: null,
  trial_started_at: null,
  annual_billing: false,
  is_live: false,
  user_id: '',
  is_flash_active: false,
  min_hours: null, overtime_after_hours: null, overtime_surcharge_pct: null,
  night_surcharge_pct: null, holiday_surcharge_pct: null, payment_days_max: null,
  travel_free_km: null, travel_fee: null, excluded_services: null,
  uniform_provided_by: null, available_weekdays: null, blocked_dates: null,
  min_notice_hours: null, conditions_note: null,
  is_public: true,
  show_online: true,
  email_opt_out: false,
  phone: null,
  specialty: null,
  instagram: null,
  bio: null,
  audio_embed_url: null,
  audio_session_urls: null,
  languages: null,
  genres: null,
  category: null,
  tiktok: null,
  bio_video_url: null,
  bg_music_url: null,
  portfolio_urls: null,
  referral_code: null,
  priority_badge_until: null,
  offers_classes: false,
  class_styles: null,
  class_price: null,
  seeking_dance_partner: false,
  dance_level: null,
  dance_role: null,
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

    // Load all profiles for this user.
    // Las columnas de privacidad (migración 20260829b) van en un select aparte:
    // si la migración aún no está aplicada, Postgres rechaza TODA la consulta y
    // el perfil no cargaría para nadie. Se pide primero con ellas y, si falla,
    // se reintenta sin ellas usando los defaults.
    const BASE_COLS = 'id, user_id, display_name, role, roles, photo_url, is_primary, subscription_tier, birthday, zone, hourly_rate, stream_url, stream_title, trial_started_at, annual_billing, is_live, is_flash_active, phone, specialty, instagram, bio, audio_embed_url, audio_session_urls, languages, genres, category, tiktok, bio_video_url, bg_music_url, portfolio_urls, referral_code, priority_badge_until, offers_classes, class_styles, class_price, seeking_dance_partner, dance_level, dance_role, created_at, min_hours, overtime_after_hours, overtime_surcharge_pct, night_surcharge_pct, holiday_surcharge_pct, payment_days_max, travel_free_km, travel_fee, excluded_services, uniform_provided_by, available_weekdays, blocked_dates, min_notice_hours, conditions_note';
    const PRIVACY_COLS = 'is_public, show_online, email_opt_out';

    let { data: rows, error: rowsError } = await supabase
      .from('profiles')
      .select(`${BASE_COLS}, ${PRIVACY_COLS}`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (rowsError) {
      ({ data: rows } = await supabase
        .from('profiles')
        .select(BASE_COLS)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }));
    }

    if (!rows || rows.length === 0) { setLoading(false); return; }

    // Find primary, fallback to first
    const primary = (rows.find((r: any) => r.is_primary) ?? rows[0]) as any;
    setProfileId(primary.id);
    setData({
      ...primary,
      roles: (primary.roles?.length ? primary.roles : [primary.role]),
      // Fallback si la migración de privacidad aún no está aplicada.
      is_public: primary.is_public ?? true,
      show_online: primary.show_online ?? true,
      email_opt_out: primary.email_opt_out ?? false,
    } as unknown as ProfileData);
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
    if (!user) return false;
    if (!profileId) {
      toast.error('Tu perfil aún se está cargando. Espera unos segundos y vuelve a intentarlo.');
      return false;
    }
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
    // Optimista: si ya tenemos el resumen de este perfil en memoria, lo mostramos
    // de inmediato mientras el UPDATE + refresh completan en segundo plano.
    const target = allProfiles.find(p => p.id === id);
    if (target) {
      setProfileId(id);
      setData(prev => ({ ...prev, display_name: target.display_name, role: target.role, photo_url: target.photo_url }));
      setAllProfiles(prev => prev.map(p => ({ ...p, is_primary: p.id === id })));
    }
    toast.success('Perfil cambiado');

    // Set is_primary on selected profile (trigger in DB handles unsetting others)
    const { error } = await supabase
      .from('profiles')
      .update({ is_primary: true } as any)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) { toast.error('No se pudo cambiar de perfil'); await refresh(); return; }
    await refresh();
  }, [user, refresh, allProfiles]);

  const createProfile = useCallback(async (newData: { display_name: string; role: string; zone: string; hourly_rate: number }): Promise<boolean> => {
    if (!user) return false;
    if (allProfiles.length >= MAX_PROFILES_PER_USER) {
      toast.error(`Máximo ${MAX_PROFILES_PER_USER} perfiles por cuenta.`);
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
  }, [user, allProfiles.length, refresh]);

  const activateTrial = useCallback(async () => {
    if (!user || data.subscription_tier === 'free' || data.trial_started_at) return;
    const now = new Date().toISOString();
    const ok = await updateField({ trial_started_at: now });
    if (ok) toast.success('¡Prueba de 15 días iniciada! Disfruta de todas las funciones premium.');
  }, [user, data.subscription_tier, data.trial_started_at, updateField]);

  const maxProfiles = MAX_PROFILES_PER_USER;

  return (
    <ProfileContext.Provider value={{ ...data, loading, profileId, allProfiles, refresh, updateField, activateTrial, switchProfile, createProfile, maxProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};
