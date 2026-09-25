import { DEFAULT_ZONE } from '@/lib/constants';

// Extraído de ProfileView.tsx (25 sep 2026): la misma cuenta la necesita
// también el banner del dashboard y el email profile_incomplete_reminder
// (edge function, que mantiene su propia copia server-side porque no puede
// importar TS del cliente — si se cambia un criterio aquí, cambiarlo también
// en supabase/functions/profile-incomplete-reminder/index.ts::completeness).
export interface CompletenessStep {
  label: string;
  done: boolean;
  hint: string;
  bloqueante?: boolean;
}

// Subconjunto de ProfileData que necesita el cálculo — evita acoplar este
// hook al contexto completo de useProfile.
export interface CompletenessInput {
  photo_url: string | null;
  bio: string | null;
  zone: string | null;
  role: string;
  specialty: string | null;
  instagram: string | null;
  audio_embed_url: string | null;
  audio_session_urls: string[] | null;
  portfolio_urls: string[] | null;
}

export function computeProfileCompleteness(profile: CompletenessInput): { steps: CompletenessStep[]; percent: number } {
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.trim().length > 5 && !rawPhoto.endsWith("''") ? rawPhoto : null;

  const steps: CompletenessStep[] = [
    // "bloqueante": no es que sumen posición, es que SIN esto no apareces en
    // el sitio donde te buscan (ver ProfileView.tsx, medido 5 sep 2026).
    { label: 'Foto de perfil', done: !!photoUrl || !!profile.photo_url, hint: 'Sin foto no puedes aparecer en el directorio.', bloqueante: true },
    { label: 'Bio', done: !!(profile.bio && profile.bio.trim().length > 20), hint: 'Escribe al menos una frase sobre ti.' },
    { label: 'Ciudad', done: !!(profile.zone && profile.zone !== DEFAULT_ZONE), hint: 'Sin tu ciudad, nadie te encuentra al buscar en su zona.', bloqueante: true },
    ...(profile.role !== 'empresario' ? [
      { label: 'Especialidad', done: !!(profile.specialty && profile.specialty.trim().length > 0), hint: 'Añade tus géneros o especialidades.' },
    ] : []),
    { label: 'Instagram', done: !!(profile.instagram && profile.instagram.trim().length > 0), hint: 'Enlaza tu Instagram para que te contacten.' },
    ...(profile.role === 'dj' || profile.role === 'grupo-musical' ? [
      { label: 'Mix / Audio', done: !!(profile.audio_embed_url && profile.audio_embed_url.trim().length > 0) || !!(profile.audio_session_urls && profile.audio_session_urls.length > 0), hint: 'Añade un enlace a tu mix o sesión.' },
    ] : profile.role !== 'empresario' ? [
      { label: 'Portfolio', done: !!(profile.portfolio_urls && profile.portfolio_urls.length > 0), hint: 'Sube fotos o un vídeo corto de tu trabajo.' },
    ] : []),
  ];
  const done = steps.filter(s => s.done).length;
  return { steps, percent: Math.round((done / steps.length) * 100) };
}
