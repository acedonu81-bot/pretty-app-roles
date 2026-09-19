import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Digest semanal para el admin: quién sigue sin foto 7+ días después de que
// se le avisara con profile_incomplete_reminder. A diferencia de ese aviso
// (automático) y de photo_last_call (amenaza con ocultar el perfil), este
// no se manda al usuario — decide el admin cuándo disparar photo_last_call
// a mano, no un cron. Dedupe semanal vía email_logs (type con la semana ISO
// incrustada) para no repetir el mismo digest si el cron se reintenta.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('user_id, display_name, role, zone, created_at')
    .eq('is_seed', false)
    .neq('role', 'pending')
    .or('photo_url.is.null,photo_url.eq.');

  if (profilesError) {
    console.error('[photo-missing-digest] fetch profiles error', profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: corsHeaders });
  }

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ found: 0, message: 'No profiles without photo' }), { headers: corsHeaders });
  }

  const userIds = profiles.map((p) => p.user_id);
  const { data: reminders } = await admin
    .from('email_logs' as any)
    .select('user_id, sent_at')
    .eq('type', 'profile_incomplete_reminder')
    .in('user_id', userIds)
    .lte('sent_at', sevenDaysAgo);

  const remindedIds = new Set((reminders ?? []).map((r: any) => r.user_id));
  const overdue = profiles.filter((p) => remindedIds.has(p.user_id));

  if (overdue.length === 0) {
    return new Response(JSON.stringify({ found: 0, message: 'None overdue 7+ days' }), { headers: corsHeaders });
  }

  // ISO week key — evita mandar el mismo digest dos veces si el cron se
  // reintenta el mismo día, pero permite uno nuevo cada semana.
  const now = new Date();
  const isoWeek = `${now.getUTCFullYear()}-W${String(Math.ceil((((+now - +new Date(Date.UTC(now.getUTCFullYear(), 0, 1))) / 86400000) + new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).getUTCDay() + 1) / 7)).padStart(2, '0')}`;
  const logType = `photo_missing_digest_${isoWeek}`;
  // email_logs.user_id es uuid NOT NULL — no hay usuario "admin" real, así
  // que se usa el nil UUID como marcador reservado para logs sin usuario.
  const ADMIN_LOG_MARKER = '00000000-0000-0000-0000-000000000000';

  const { data: existing } = await admin
    .from('email_logs' as any)
    .select('id')
    .eq('user_id', ADMIN_LOG_MARKER)
    .eq('type', logType)
    .maybeSingle();
  if (existing) {
    return new Response(JSON.stringify({ found: overdue.length, sent: 0, message: 'Digest already sent this week' }), { headers: corsHeaders });
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
    body: JSON.stringify({
      type: 'photo_missing_digest',
      data: {
        count: overdue.length,
        profiles: overdue.map((p) => ({
          name: p.display_name ?? '(sin nombre)',
          role: p.role,
          zone: p.zone ?? '—',
          days: Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000),
        })),
      },
    }),
  });

  if (!res.ok) {
    console.error('[photo-missing-digest] send failed', await res.text());
    return new Response(JSON.stringify({ found: overdue.length, sent: 0, error: 'send failed' }), { status: 500, headers: corsHeaders });
  }

  try {
    await admin.from('email_logs' as any).insert({
      user_id: ADMIN_LOG_MARKER,
      type: logType,
      sent_at: new Date().toISOString(),
    });
  } catch { /* non-critical */ }

  return new Response(JSON.stringify({ found: overdue.length, sent: 1 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
