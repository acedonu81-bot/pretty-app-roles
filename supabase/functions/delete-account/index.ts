import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Completa el borrado de cuenta iniciado en SettingsView.tsx: para entonces
// los datos personales ya están suprimidos y el OTP ya se verificó en el
// cliente. Esta función solo da de baja auth.users, algo que requiere
// service_role y por eso no puede hacerse desde el cliente.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401, headers: cors });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: userData, error: userError } = await admin.auth.getUser(jwt);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Sesión inválida' }), { status: 401, headers: cors });
    }

    // Modo "cuenta vacía recién creada" (aviso de Google en /auth): el servidor no se fía
    // del cliente y solo borra si la cuenta nació hace menos de 3 minutos y nunca ha
    // tenido actividad propia (sin mensajes, reseñas ni favoritos).
    let body: { solo_si_nueva?: boolean } = {};
    try { body = await req.json(); } catch { /* sin cuerpo: borrado normal desde Ajustes */ }
    if (body?.solo_si_nueva) {
      const creada = new Date(userData.user.created_at).getTime();
      if (Date.now() - creada > 3 * 60_000) {
        return new Response(JSON.stringify({ error: 'La cuenta no es nueva' }), { status: 403, headers: cors });
      }
      const uid = userData.user.id;
      for (const [tabla, col] of [['messages', 'sender_id'], ['reviews', 'reviewer_id'], ['favorites', 'user_id']] as const) {
        const { count, error: errCuenta } = await admin.from(tabla).select('*', { count: 'exact', head: true }).eq(col, uid);
        if (errCuenta || (count ?? 0) > 0) {
          return new Response(JSON.stringify({ error: 'La cuenta ya tiene actividad' }), { status: 403, headers: cors });
        }
      }
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[delete-account]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
