// El aro azul / "early adopter" ya no es un campo manual (is_early_adopter en
// profiles) — se calcula en tiempo real según si el perfil está de verdad
// completo. Si alguien borra su foto pierde el aro automáticamente; si la
// añade lo gana solo. Mismo criterio de "completo" que ya usaba el sort de
// DirectoryView (media > foto > bio, modelo GigSalad).
export interface EarlyAdopterCheck {
  photo_url?: string | null;
  bio?: string | null;
  audio_embed_url?: string | null;
  audio_session_urls?: string[] | null;
  portfolio_urls?: string[] | null;
}

export function isEarlyAdopter(p: EarlyAdopterCheck): boolean {
  const hasMedia = !!(p.audio_embed_url?.trim())
    || (Array.isArray(p.audio_session_urls) && p.audio_session_urls.length > 0)
    || (Array.isArray(p.portfolio_urls) && p.portfolio_urls.length > 0);
  const hasPhoto = !!p.photo_url;
  const hasBio = !!(p.bio && p.bio.trim().length > 0);
  return hasMedia && hasPhoto && hasBio;
}
