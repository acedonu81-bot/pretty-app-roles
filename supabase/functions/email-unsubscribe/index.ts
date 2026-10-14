import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Baja de emails. La llaman dos sitios:
// - la página /baja-emails (enlace del pie de cada correo), con { email, token };
// - Gmail/Yahoo directamente, con el botón "Cancelar suscripción": POST
//   one-click (RFC 8058) a la URL de la cabecera List-Unsubscribe, sin sesión
//   ni apikey (por eso esta función va con verify_jwt = false).
//
// Arreglado el 14 oct 2026, antes:
// - no comprobaba la firma: cualquiera daba de baja cualquier email;
// - buscaba con listUsers() sin paginar (50 por página, había 105 cuentas):
//   a partir de la 51 respondía "ok" sin guardar nada;
// - la cabecera apuntaba a la página de la web, que contesta 405 al POST.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Misma firma que signEmail() en send-email.
async function firma(email: string): Promise<string> {
  const key = Deno.env.get('UNSUB_SECRET');
  if (!key) throw new Error('UNSUB_SECRET not configured');
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST' && req.method !== 'GET') return json({ error: 'Método no permitido' }, 405);

  try {
    const url = new URL(req.url);
    let email = url.searchParams.get('e') ?? url.searchParams.get('email') ?? '';
    let token = url.searchParams.get('token') ?? '';
    // La página manda JSON; el one-click de Gmail manda un formulario
    // (List-Unsubscribe=One-Click) y los datos van en la URL.
    if (req.method === 'POST' && (req.headers.get('content-type') ?? '').includes('application/json')) {
      const body = await req.json().catch(() => ({}));
      email = body.email ?? email;
      token = body.token ?? token;
    }

    if (!email || !email.includes('@') || !token) return json({ error: 'Enlace no válido' }, 400);
    // send-email firma la dirección tal cual se envió; se prueba también en
    // minúsculas por si el cliente de correo la cambió.
    const valida = iguales(token, await firma(email)) || iguales(token, await firma(email.toLowerCase()));
    if (!valida) return json({ error: 'Enlace no válido' }, 403);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Recorre todas las páginas de usuarios (listUsers devuelve como mucho
    // perPage por llamada).
    const objetivo = email.toLowerCase();
    let userId: string | null = null;
    for (let page = 1; page <= 50 && !userId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      const u = data.users.find((x) => x.email?.toLowerCase() === objetivo);
      if (u) userId = u.id;
      if (data.users.length < 1000) break;
    }

    // Sin cuenta (p. ej. un cliente que solo pidió presupuesto) no hay perfil
    // donde guardar la baja; se responde ok igualmente para no revelar si el
    // email está registrado.
    if (userId) {
      const { error } = await admin.from('profiles').update({ email_opt_out: true }).eq('user_id', userId);
      if (error) throw error;
    }

    return json({ ok: true });
  } catch (e) {
    console.error('[email-unsubscribe]', e);
    return json({ error: 'No se pudo completar la baja' }, 500);
  }
});
