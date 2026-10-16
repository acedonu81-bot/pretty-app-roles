// Cambiar la sesión inscrita en el Concurso DJ XPEAK Madrid (17 oct 2026).
// Solo se puede cambiar una sesión ROTA: si SoundCloud ya no la encuentra
// (borrada o privada). Cambiarla por gusto, con la sesión funcionando, no
// está permitido: con votos en juego se podría sustituir una sesión votada por
// otra cosa. La comprobación se hace AQUÍ, en el servidor (oEmbed de
// SoundCloud), no en el navegador, para que no se pueda saltar.
// La sesión nueva también tiene que existir, y vuelve a "pendiente" para que
// el admin la revise. Los me gusta se conservan (van ligados al DJ).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONCURSO = 'dj-madrid-2026';
const CIERRE = new Date('2026-11-02T23:00:00Z');
const ORIGENES = ['https://xpeak.es', 'https://www.xpeak.es', 'https://xpeak.site', 'http://localhost:5173'];
const SOUNDCLOUD_RE = /^https:\/\/(www\.|m\.)?soundcloud\.com\/[^/?#]+\/[^/?#]+/i;

function cors(req: Request) {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ORIGENES.includes(origin) ? origin : ORIGENES[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };
}

/** 'existe' | 'rota' (404/403) | 'desconocido' (red u otro error). */
async function estadoPista(url: string): Promise<'existe' | 'rota' | 'desconocido'> {
  try {
    const r = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    await r.body?.cancel();
    if (r.status === 404 || r.status === 403) return 'rota';
    return r.ok ? 'existe' : 'desconocido';
  } catch {
    return 'desconocido';
  }
}

Deno.serve(async (req) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  const responder = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: { user } } = await admin.auth.getUser(jwt);
    if (!user) return responder({ error: 'sin_sesion' }, 401);

    if (new Date() >= CIERRE) return responder({ error: 'cerrado' }, 409);

    const { url } = await req.json();
    const nueva = String(url ?? '').trim();
    if (nueva.length > 500 || !SOUNDCLOUD_RE.test(nueva)) return responder({ error: 'enlace_no_valido' }, 400);

    const { data: ins } = await admin.from('concurso_inscripciones').select('id, soundcloud_url')
      .eq('concurso', CONCURSO).eq('user_id', user.id).maybeSingle();
    if (!ins) return responder({ error: 'sin_inscripcion' }, 404);

    // Solo si la sesión actual está rota.
    const actual = await estadoPista(ins.soundcloud_url);
    if (actual === 'existe') return responder({ error: 'sesion_actual_funciona' }, 409);
    if (actual === 'desconocido') return responder({ error: 'no_se_pudo_comprobar' }, 503);

    if ((await estadoPista(nueva)) !== 'existe') return responder({ error: 'nueva_no_existe' }, 422);

    const { error } = await admin.from('concurso_inscripciones')
      .update({ soundcloud_url: nueva, estado: 'pendiente' }).eq('id', ins.id);
    if (error) return responder({ error: 'no_guardado' }, 500);
    return responder({ ok: true });
  } catch {
    return responder({ error: 'invalido' }, 400);
  }
});
