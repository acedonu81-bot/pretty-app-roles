import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { leerAcceso } from '../_shared/accesoParticular.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Cambia un enlace firmado de los correos por un enlace mágico recién generado
// (ver _shared/accesoParticular.ts). Solo para cuentas creadas por el
// formulario del particular: la firma prueba que el correo lo mandó XPEAK a esa
// cuenta, y el enlace mágico solo se devuelve a quien pulsa el botón.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  try {
    const { t } = await req.json();
    const d = typeof t === 'string' ? await leerAcceso(t) : null;
    if (!d) return json({ error: 'El enlace ha caducado' }, 400);

    const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: u } = await admin.auth.admin.getUserById(d.u);
    const email = u?.user?.email;
    if (!email || u?.user?.user_metadata?.particular !== 'true') return json({ error: 'El enlace no es válido' }, 400);

    const enlace = await admin.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo: `https://xpeak.es${d.d}` } });
    const url = enlace.data?.properties?.action_link;
    if (!url) { console.error('[acceso-particular] generateLink', enlace.error); return json({ error: 'No se pudo generar el acceso' }, 500); }
    return json({ ok: true, url });
  } catch (err) {
    console.error('[acceso-particular]', err);
    return json({ error: 'Error' }, 500);
  }
});
