import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Finds calendar_events dated tomorrow for users who have the "24h antes del
// evento" alert enabled (localStorage key xpeak_alerts_<userId>, mirrored
// server-side in the alert_preferences table so this function can read it
// without a browser). Sends one reminder email per event, logs it in
// email_logs to avoid ever sending twice.
// Designed to be called daily via Supabase cron.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: events, error: eventsError } = await admin
    .from('calendar_events')
    .select('id, user_id, title, event_date, location')
    .eq('event_date', tomorrowStr);

  if (eventsError) {
    console.error('[bolo-reminder-24h] fetch error', eventsError);
    return new Response(JSON.stringify({ error: eventsError.message }), { status: 500, headers: corsHeaders });
  }

  if (!events || events.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No events tomorrow' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const ev of events) {
    try {
      const { data: pref } = await admin
        .from('alert_preferences' as any)
        .select('bolo_24h')
        .eq('user_id', ev.user_id)
        .maybeSingle();
      if (!pref || !(pref as any).bolo_24h) continue;

      const logKey = `bolo_reminder_24h_${ev.id}`;
      const { data: existing } = await admin
        .from('email_logs' as any)
        .select('id')
        .eq('user_id', ev.user_id)
        .eq('type', logKey)
        .maybeSingle();
      if (existing) continue;

      const { data: userData, error: userError } = await admin.auth.admin.getUserById(ev.user_id);
      if (userError || !userData?.user?.email) {
        console.warn('[bolo-reminder-24h] no email for', ev.user_id);
        continue;
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: 'bolo_reminder_24h',
          data: {
            email: userData.user.email,
            title: ev.title,
            date: ev.event_date,
            location: ev.location ?? '',
          },
        }),
      });

      if (!res.ok) {
        console.error('[bolo-reminder-24h] send failed for', ev.user_id, await res.text());
        errors.push(ev.user_id);
        continue;
      }

      try {
        await admin.from('email_logs' as any).insert({
          user_id: ev.user_id,
          type: logKey,
          sent_at: new Date().toISOString(),
        });
      } catch { /* non-critical */ }

      sent++;
    } catch (e) {
      console.error('[bolo-reminder-24h] unexpected error for', ev.user_id, e);
      errors.push(ev.user_id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: events.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
