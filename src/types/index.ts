/**
 * Tipo canónico que representa un perfil tal como lo devuelve Supabase.
 * Es la fuente de verdad para todos los componentes que consultan la tabla `profiles`.
 *
 * NOTA: `Profile` en src/data/profiles.ts es datos mock estáticos con campos
 * frontend adicionales (gradient, badges, rating) — se mantiene separado por diseño.
 */
export interface DBProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  hourly_rate: number;
  specialty: string | null;
  is_verified: boolean;
  is_flash_active?: boolean;
  is_live?: boolean;
  instagram: string | null;
  subscription_tier: string;
  photo_url: string | null;
  genres: string[] | null;
  bio: string | null;
  tiktok?: string | null;
  languages?: string[] | null;
  category?: string | null;
  audio_url?: string | null;
  score?: number;
  validation_submitted_at?: string;
  user_id?: string;
}

/** Alias semántico para el contexto del panel empresario */
export type Pro = DBProfile;
