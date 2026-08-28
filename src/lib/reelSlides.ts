// Slides de una tarjeta del feed swipe (ReelsFeed): primero la foto principal
// (con su overlay de info/CTAs), luego el resto de fotos del portfolio, luego
// el vídeo principal si es reproducible, luego cada sesión de vídeo — en ese
// orden fijo (fotos antes que vídeos). Función pura para poder testear la
// composición sin montar React ni Supabase.

const REPRODUCIBLE_VIDEO = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export interface ReelSlide {
  type: 'photo' | 'video';
  url: string | null;
}

// Uploads de XPEAK nombran el archivo en Storage como `{prefijo}-{timestamp}-{nombreOriginal.ext}`
// (ej. photo-1787846364925-IMG_8595.jpeg, portfolio/1787846558094-IMG_8595.jpeg).
// El nombre original sobrevive al final — comparar eso detecta "misma foto
// subida dos veces" (perfil + portfolio) sin pedir el archivo por red.
function originalFileName(url: string): string {
  const last = url.split('/').pop() ?? '';
  const match = last.match(/^(?:[a-z]+-)?\d{10,}-(.+)$/i);
  return (match ? match[1] : last).toLowerCase();
}

export function buildReelSlides(profile: {
  photo_url: string | null;
  portfolio_urls?: string[] | null;
  bio_video_url?: string | null;
  video_session_urls?: string[] | null;
}): ReelSlide[] {
  const slides: ReelSlide[] = [{ type: 'photo', url: profile.photo_url }];
  const seenFileNames = new Set(profile.photo_url ? [originalFileName(profile.photo_url)] : []);

  for (const url of profile.portfolio_urls ?? []) {
    if (!url || url === profile.photo_url) continue;
    const fileName = originalFileName(url);
    if (seenFileNames.has(fileName)) continue;
    seenFileNames.add(fileName);
    slides.push({ type: 'photo', url });
  }

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
