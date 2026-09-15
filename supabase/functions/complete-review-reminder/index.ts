import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isDemoAccount } from './isDemoAccount.ts';

// Recordatorio para empresarios con reseñas anteriores al 16 sep 2026 que
// no tienen las 3 preguntas nuevas (llego_puntual / cumplio_acordado /
// volveria_contratar en null). Mismo patrón de deduplicación por
// email_logs que review-reminder. Nunca se envía a cuentas demo
// (demo.*@xpeak.es) — ver isDemoAccount.ts.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: incomplete, error: fetchError } = await admin
    .from('reviews')
    .select('id, reviewer_id, reviewed_user_id')
    .eq('approved', true)
    .or('llego_puntual.is.null,cumplio_acordado.is.null,volveria_contratar.is.null')
    .not('reviewer_id', 'is', null);

  if (fetchError) {
    console.error('[complete-review-reminder] fetch error', fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500, headers: corsHeaders });
  }

  if (!incomplete?.length) {
    return new Response(JSON.stringify({ sent: 0, message: 'No incomplete reviews' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const r of incomplete) {
    const logKey = `complete_review_reminder_${r.id}`;
    const { data: existingLog } = await admin
      .from('email_logs' as any)
      .select('id')
      .eq('user_id', r.reviewer_id)
      .eq('type', logKey)
      .maybeSingle();
    if (existingLog) continue;

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(r.reviewer_id as string);
    if (userError || !userData?.user?.email) continue;
    if (isDemoAccount(userData.user.email)) continue;

    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
      body: JSON.stringify({
        type: 'completar_valoracion',
        data: { email: userData.user.email, ref: r.reviewed_user_id },
      }),
    });

    if (!res.ok) {
      console.error('[complete-review-reminder] send failed for', r.reviewer_id, await res.text());
      errors.push(r.reviewer_id as string);
      continue;
    }

    await admin.from('email_logs' as any).insert({
      user_id: r.reviewer_id,
      type: logKey,
      sent_at: new Date().toISOString(),
    }).catch(() => { /* non-critical */ });

    sent++;
  }

  return new Response(JSON.stringify({ sent, errors: errors.length, checked: incomplete.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
