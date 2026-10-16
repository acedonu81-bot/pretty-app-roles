import { supabase } from '@/integrations/supabase/client';
import { logEvent } from '@/lib/track';
import { leerEnlaceSoundcloud, pistaSoundcloudExiste } from '@/lib/soundcloudEnlace';

/**
 * Inscripción al Concurso DJ XPEAK Madrid, compartida por el formulario de la
 * página del concurso y por el aviso "Presentarla al concurso" que sale en las
 * sesiones del perfil (14 oct 2026). Quien llama debe haber recogido antes la
 * aceptación de las bases: aquí se guarda como acepta_bases = true.
 */
export const CONCURSO = 'dj-madrid-2026';
const SOUNDCLOUD_RE = /^https:\/\/(www\.|m\.)?soundcloud\.com\/[^/?#]+\/[^/?#]+/i;

// Los tipos generados de Supabase no incluyen todavía la tabla del concurso.
type SbLoose = {
  from: (t: string) => {
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string; code?: string } | null }>;
  };
};
const sb = supabase as unknown as SbLoose;

// Sin unión discriminada: el proyecto compila sin strictNullChecks y ahí no se estrecha.
export type ResultadoInscripcion = { ok: boolean; mensaje?: string };

type Enlace = { url: string } | { mensaje: string };

/** Valida el enlace pegado: SoundCloud de una sesión, corto resuelto y pista existente. */
async function prepararEnlace(texto: string, origen: string): Promise<Enlace> {
  const enlace = leerEnlaceSoundcloud(texto);
  if (!enlace) {
    return { mensaje: 'Pega el enlace de tu sesión de SoundCloud, del tipo soundcloud.com/tu-nombre/tu-sesion. El de tu perfil no vale: tiene que ser el de la sesión.' };
  }
  // El enlace corto de la app (on.soundcloud.com) se convierte en el largo.
  let limpia = enlace.url;
  if (enlace.tipo === 'corto') {
    const { data: res } = await supabase.functions.invoke('soundcloud-enlace', { body: { url: enlace.url } });
    const larga = (res as { url?: string } | null)?.url;
    if (!larga || !SOUNDCLOUD_RE.test(larga)) {
      void logEvent('cta_click', origen, 'concurso_enlace_corto_fallido');
      return { mensaje: 'No hemos podido abrir ese enlace. Abre tu sesión en soundcloud.com desde el navegador y copia la dirección de arriba.' };
    }
    limpia = larga;
  }
  // La pista tiene que existir y ser pública: una privada o borrada se inscribía y
  // luego sonaba "enlace no válido" a todo el que la abría (17 oct 2026).
  if (!(await pistaSoundcloudExiste(limpia))) {
    return { mensaje: 'SoundCloud no encuentra esa sesión. Comprueba que está en público (no privada) y que has copiado bien el enlace.' };
  }
  return { url: limpia };
}

export async function inscribirSesion(userId: string, texto: string, origen: string): Promise<ResultadoInscripcion> {
  const prep = await prepararEnlace(texto, origen);
  if ('mensaje' in prep) return { ok: false, mensaje: prep.mensaje };
  const limpia = prep.url;
  const { error } = await sb.from('concurso_inscripciones').insert({
    concurso: CONCURSO, user_id: userId, soundcloud_url: limpia, acepta_bases: true,
  });
  if (error) {
    return { ok: false, mensaje: error.code === '23505' ? 'Ya tienes una sesión inscrita en este concurso.' : 'No se ha podido guardar la inscripción. Inténtalo de nuevo en un momento.' };
  }
  void logEvent('cta_click', origen, 'concurso_inscripcion');
  // Aviso al admin para que la revise. La función comprueba que la
  // inscripción existe y saca los datos de la BD.
  void supabase.functions.invoke('send-email', { body: { type: 'concurso_inscripcion', data: {} } });
  window.dispatchEvent(new Event('concurso:inscrito'));
  return { ok: true };
}

/**
 * Cambia la sesión ya inscrita por otra (la anterior dejó de existir o el DJ
 * quiere poner otra). La nueva vuelve a "pendiente" y la revisa el admin.
 */
export async function cambiarSesion(texto: string, origen: string): Promise<ResultadoInscripcion> {
  const prep = await prepararEnlace(texto, origen);
  if ('mensaje' in prep) return { ok: false, mensaje: prep.mensaje };
  const { error } = await (supabase.rpc as unknown as (f: string, a: Record<string, unknown>) => Promise<{ error: { message: string } | null }>)(
    'cambiar_sesion_concurso', { p_url: prep.url },
  );
  if (error) {
    const m = error.message;
    return { ok: false, mensaje: /cerrado/.test(m) ? 'El concurso ya ha cerrado.' : /no tienes/.test(m) ? 'No tienes ninguna sesión inscrita.' : 'No se ha podido cambiar la sesión. Inténtalo de nuevo.' };
  }
  void logEvent('cta_click', origen, 'concurso_sesion_cambiada');
  void supabase.functions.invoke('send-email', { body: { type: 'concurso_inscripcion', data: {} } });
  window.dispatchEvent(new Event('concurso:inscrito'));
  return { ok: true };
}
