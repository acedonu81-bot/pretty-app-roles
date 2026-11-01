import { supabase } from '@/integrations/supabase/client';
import { compressImage, MAX_RAW_IMAGE_MB } from '@/lib/image';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Sube el banner, la foto, o la carátula o el fondo de un set del perfil de
 * artista del DJ (cámaras del perfil, 1 nov 2026) y devuelve la URL pública, o un mensaje de error.
 * Mismo bucket y carpeta por usuario que la foto del panel (ProfileView).
 */
export const subirImagenArtista = async (
  userId: string, file: File, tipo: 'banner' | 'foto' | 'portada' | 'fondo',
): Promise<{ url: string } | { error: string }> => {
  if (!TIPOS.includes(file.type)) return { error: 'La imagen tiene que ser JPG, PNG o WebP.' };
  if (file.size > MAX_RAW_IMAGE_MB * 1024 * 1024) return { error: `La imagen no puede pasar de ${MAX_RAW_IMAGE_MB} MB.` };
  // Banner y fondo se ven a lo ancho: más resolución que foto y carátula.
  const comprimida = await compressImage(file, tipo === 'banner' || tipo === 'fondo' ? 2400 : 1200);
  const ext = comprimida.type === 'image/png' ? 'png' : comprimida.type === 'image/webp' ? 'webp' : 'jpg';
  const path = {
    banner: `${userId}/banner/${Date.now()}.${ext}`,
    foto: `${userId}/photo-${Date.now()}.${ext}`,
    portada: `${userId}/covers/${Date.now()}.${ext}`,
    fondo: `${userId}/fondos/${Date.now()}.${ext}`,
  }[tipo];
  const { error } = await supabase.storage.from('audio-sessions').upload(path, comprimida, { contentType: comprimida.type });
  if (error) return { error: 'No se pudo subir la imagen. Inténtalo de nuevo.' };
  return { url: supabase.storage.from('audio-sessions').getPublicUrl(path).data.publicUrl };
};
