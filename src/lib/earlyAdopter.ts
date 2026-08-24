// El aro azul / "early adopter" se calcula en tiempo real según si el perfil
// está de verdad completo (foto + bio + media). Si alguien borra su foto
// pierde el aro automáticamente; si la añade lo gana solo. Mismo criterio de
// "completo" que ya usaba el sort de DirectoryView (media > foto > bio,
// modelo GigSalad).
//
// Excepción: is_early_adopter_override en profiles permite a un admin forzar
// el aro manualmente desde el panel (p.ej. perfil casi completo al que le
// falta solo un requisito menor) sin cambiar el criterio automático general.
export interface EarlyAdopterCheck {
  photo_url?: string | null;
  bio?: string | null;
  audio_embed_url?: string | null;
  audio_session_urls?: string[] | null;
  portfolio_urls?: string[] | null;
  is_early_adopter_override?: boolean | null;
}

export function isEarlyAdopter(p: EarlyAdopterCheck): boolean {
  if (p.is_early_adopter_override) return true;
  const hasMedia = !!(p.audio_embed_url?.trim())
    || (Array.isArray(p.audio_session_urls) && p.audio_session_urls.length > 0)
    || (Array.isArray(p.portfolio_urls) && p.portfolio_urls.length > 0);
  const hasPhoto = !!p.photo_url;
  const hasBio = !!(p.bio && p.bio.trim().length > 0);
  return hasMedia && hasPhoto && hasBio;
}
