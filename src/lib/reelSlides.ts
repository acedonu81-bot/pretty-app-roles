// Slides de una tarjeta del feed swipe (ReelsFeed): primero la foto (con su
// overlay de info/CTAs), luego el vídeo principal si es reproducible, luego
// cada sesión de vídeo — en ese orden fijo. Función pura para poder testear
// la composición sin montar React ni Supabase.

const REPRODUCIBLE_VIDEO = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export interface ReelSlide {
  type: 'photo' | 'video';
  url: string | null;
}

export function buildReelSlides(profile: {
  photo_url: string | null;
  bio_video_url?: string | null;
  video_session_urls?: string[] | null;
}): ReelSlide[] {
  const slides: ReelSlide[] = [{ type: 'photo', url: profile.photo_url }];

  const bioVideo = profile.bio_video_url ?? '';
  if (REPRODUCIBLE_VIDEO.test(bioVideo)) {
    slides.push({ type: 'video', url: bioVideo });
  }

  for (const url of profile.video_session_urls ?? []) {
    if (REPRODUCIBLE_VIDEO.test(url)) {
      slides.push({ type: 'video', url });
    }
  }

  return slides;
}
