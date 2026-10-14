import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { comprobarEmail } from '../_shared/comprobarEmail.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// El formulario de registro la llama justo antes de supabase.auth.signUp para
// avisar con un mensaje claro si el email es desechable o el dominio no
// recibe correo. El trigger block_disposable_email frena igualmente en la BD
// a quien se la salte; la comprobación de dominio solo vive aquí y en
// signup-inapp (ver _shared/comprobarEmail.ts).

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const { email } = await req.json();
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return json({ ok: false, error: 'Email no válido' });
    }
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    return json(await comprobarEmail(admin, email));
  } catch (e) {
    console.error('[check-email]', e);
    // Fallo propio: no bloquear el alta.
    return json({ ok: true });
  }
});
