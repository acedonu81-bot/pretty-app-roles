import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email') ?? (await req.json().catch(() => ({}))).email;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email requerido' }), { status: 400, headers: cors });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Find the user by email through auth.users
    const { data: users } = await admin.auth.admin.listUsers();
    const user = users?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Return success anyway to avoid email enumeration
      return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const { error } = await admin
      .from('profiles')
      .update({ email_opt_out: true })
      .eq('user_id', user.id);

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[email-unsubscribe]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
