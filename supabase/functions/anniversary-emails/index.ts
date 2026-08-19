import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Finds users who registered exactly ~6 months ago (within ±1 day window)
// and sends them an anniversary email via the send-email function.
// Designed to be called daily via Supabase cron.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  const admin = createClient(supabaseUrl, serviceKey);

  // 6 months ago window: today ±12h
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const from = new Date(sixMonthsAgo);
  from.setHours(0, 0, 0, 0);
  const to = new Date(sixMonthsAgo);
  to.setHours(23, 59, 59, 999);

  // Fetch profiles created in that window
  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('user_id, display_name, role, score, created_at')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString());

  if (profilesError) {
    console.error('[anniversary] profiles fetch error', profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: corsHeaders });
  }

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No anniversaries today' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    try {
      // Resolve email from auth.users
      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.user_id);
      if (userError || !userData?.user?.email) {
        console.warn('[anniversary] no email for user', profile.user_id);
        continue;
      }

      // Check we haven't already sent this anniversary (avoid duplicate on retry)
      const { data: existing } = await admin
        .from('email_logs' as any)
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('type', 'six_months_anniversary')
        .maybeSingle();

      if (existing) {
        console.log('[anniversary] already sent for', profile.user_id);
        continue;
      }

      // Call the send-email function
      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          type: 'six_months_anniversary',
          data: {
            email: userData.user.email,
            name: profile.display_name ?? 'Profesional',
            role: profile.role ?? 'profesional',
            views: profile.score ?? 0,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error('[anniversary] send failed for', profile.user_id, body);
        errors.push(profile.user_id);
        continue;
      }

      // Log the send to avoid duplicates. try/catch explícito, no
      // .insert().catch() encadenado — esa forma lanza TypeError en la
      // versión de supabase-js usada aquí (confirmado el 18 ago 2026 al
      // depurar el mismo patrón en chat-ai), lo que haría caer al catch
      // externo y contar un envío ya realizado como error, con riesgo de
      // reintentarlo y duplicar el email al día siguiente.
      try {
        await admin.from('email_logs' as any).insert({
          user_id: profile.user_id,
          type: 'six_months_anniversary',
          sent_at: new Date().toISOString(),
        });
      } catch { /* non-critical */ }

      sent++;
    } catch (e) {
      console.error('[anniversary] unexpected error for', profile.user_id, e);
      errors.push(profile.user_id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: profiles.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
