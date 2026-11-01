import { supabase } from '@/integrations/supabase/client';
import { compressImage, MAX_RAW_IMAGE_MB } from '@/lib/image';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Sube el banner o la foto del perfil de artista del DJ (cámaras de la
 * cabecera, 1 nov 2026) y devuelve la URL pública, o un mensaje de error.
 * Mismo bucket y carpeta por usuario que la foto del panel (ProfileView).
 */
export const subirImagenArtista = async (
  userId: string, file: File, tipo: 'banner' | 'foto',
): Promise<{ url: string } | { error: string }> => {
  if (!TIPOS.includes(file.type)) return { error: 'La imagen tiene que ser JPG, PNG o WebP.' };
  if (file.size > MAX_RAW_IMAGE_MB * 1024 * 1024) return { error: `La imagen no puede pasar de ${MAX_RAW_IMAGE_MB} MB.` };
  // El banner se ve a lo ancho de la página: más resolución que la foto.
  const comprimida = await compressImage(file, tipo === 'banner' ? 2400 : 1200);
  const ext = comprimida.type === 'image/png' ? 'png' : comprimida.type === 'image/webp' ? 'webp' : 'jpg';
  const path = tipo === 'banner' ? `${userId}/banner/${Date.now()}.${ext}` : `${userId}/photo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('audio-sessions').upload(path, comprimida, { contentType: comprimida.type });
  if (error) return { error: 'No se pudo subir la imagen. Inténtalo de nuevo.' };
  return { url: supabase.storage.from('audio-sessions').getPublicUrl(path).data.publicUrl };
};
