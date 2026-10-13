// Convierte un enlace corto de SoundCloud (on.soundcloud.com/...) en el largo
// (soundcloud.com/usuario/sesion). Es lo que da la app móvil al pulsar
// "Compartir → Copiar enlace", y el Concurso DJ XPEAK Madrid lo rechazaba
// (13 oct 2026). Desde el navegador no se puede: on.soundcloud.com no deja
// leer su redirección (CORS), así que se resuelve aquí.
//
// Solo acepta on.soundcloud.com y solo sigue redirecciones dentro de
// soundcloud.com: no sirve para pedir otras URLs desde nuestro servidor.

const ORIGENES = ['https://xpeak.es', 'https://www.xpeak.es', 'https://xpeak.site', 'http://localhost:5173'];

function cors(req: Request) {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ORIGENES.includes(origin) ? origin : ORIGENES[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };
}

const esSoundcloud = (host: string) => /^(www\.|m\.)?soundcloud\.com$/.test(host);

Deno.serve(async (req) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  const responder = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

  try {
    const { url } = await req.json();
    let actual = new URL(String(url ?? '').trim());
    if (actual.protocol !== 'https:' || actual.hostname !== 'on.soundcloud.com') return responder({ error: 'no_es_corto' }, 400);

    for (let i = 0; i < 4 && !esSoundcloud(actual.hostname); i++) {
      const r = await fetch(actual.toString(), { redirect: 'manual' });
      await r.body?.cancel();
      const destino = r.headers.get('location');
      if (!destino) break;
      const siguiente = new URL(destino, actual);
      if (siguiente.protocol !== 'https:' || !(siguiente.hostname === 'on.soundcloud.com' || esSoundcloud(siguiente.hostname))) break;
      actual = siguiente;
    }

    const partes = actual.pathname.split('/').filter(Boolean);
    if (!esSoundcloud(actual.hostname) || partes.length < 2) return responder({ error: 'no_resuelto' }, 422);
    return responder({ url: `https://soundcloud.com/${partes.join('/')}` });
  } catch {
    return responder({ error: 'invalido' }, 400);
  }
});
