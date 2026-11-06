import { supabase } from '@/integrations/supabase/client';

/** Tope del bucket audio-sessions (150 MB, migración 20260819). El cliente nunca debe prometer más. */
export const MAX_VIDEO_MB = 150;
export const MAX_VIDEO_S = 60;

export const sanitizeName = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

/** Devuelve el motivo en claro si el vídeo no vale, o null si es válido. */
export async function validarVideo(file: File): Promise<string | null> {
  const okTipo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
  if (!okTipo) return 'Ese archivo no es un vídeo. Usa MP4, MOV o WebM.';
  if (file.size > MAX_VIDEO_MB * 1048576) {
    return `El vídeo pesa ${(file.size / 1048576).toFixed(0)} MB y el máximo es ${MAX_VIDEO_MB} MB. Grábalo más corto o en calidad menor.`;
  }
  try {
    const url = URL.createObjectURL(file);
    const dur: number = await new Promise((res, rej) => {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => { URL.revokeObjectURL(url); res(v.duration); };
      v.onerror = () => { URL.revokeObjectURL(url); rej(new Error('meta')); };
      v.src = url;
    });
    if (dur > MAX_VIDEO_S) return `El vídeo dura ${Math.round(dur)} s y el máximo es ${MAX_VIDEO_S} s. Recórtalo en tu móvil y vuelve a subirlo.`;
  } catch {
    return 'No se pudo leer el vídeo. Prueba con otro en formato MP4 o MOV.';
  }
  return null;
}

/** Sube a Storage con barra de progreso (el SDK no la da). Devuelve la URL pública o lanza Error con mensaje claro. */
export async function subirConProgreso(path: string, file: File, onProgress?: (pct: number) => void): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Tu sesión ha caducado. Vuelve a entrar y repite la subida.');
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${base}/storage/v1/object/audio-sessions/${path.split('/').map(encodeURIComponent).join('/')}`);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', key);
    xhr.setRequestHeader('x-upsert', 'true');
    if (file.type) xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve()
      : reject(new Error(xhr.status === 413 ? `El archivo es demasiado grande (máx. ${MAX_VIDEO_MB} MB).` : 'No se pudo subir el archivo. Inténtalo de nuevo.')));
    xhr.onerror = () => reject(new Error('Se cortó la conexión. Comprueba tu cobertura y vuelve a intentarlo.'));
    xhr.send(file);
  });
  return supabase.storage.from('audio-sessions').getPublicUrl(path).data.publicUrl;
}

/** Recalcula profiles.video_session_urls desde Storage. Devuelve false si no se pudo guardar. */
export async function sincronizarSesionesVideo(userId: string): Promise<boolean> {
  const { data } = await supabase.storage.from('audio-sessions').list(`${userId}/video-sessions`);
  const urls = (data ?? []).map(f => supabase.storage.from('audio-sessions').getPublicUrl(`${userId}/video-sessions/${f.name}`).data.publicUrl);
  const { error } = await supabase.from('profiles').update({ video_session_urls: urls } as any).eq('user_id', userId);
  return !error;
}

/** Formatos de imagen que el bucket acepta. HEIC/HEIF no. */
export function esImagenAdmitida(file: File): boolean {
  return /^image\/(jpeg|png|webp|gif)$/.test(file.type);
}
export const MENSAJE_HEIC = 'Esa foto está en formato HEIC y no se puede subir. En el iPhone: Ajustes > Cámara > Formatos > "Más compatible", o elige otra foto (JPG/PNG).';
