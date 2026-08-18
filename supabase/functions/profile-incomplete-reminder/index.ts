import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Same completeness criteria as ProfileView.tsx's completenessSteps — kept
// in sync by hand since one runs client-side (React state) and the other
// server-side (raw row). If you change one, change the other.
function completeness(p: Record<string, unknown>): { percent: number; missing: string[] } {
  const steps: { label: string; done: boolean }[] = [
    { label: 'una foto de perfil', done: !!p.photo_url },
    { label: 'una bio (mínimo una frase)', done: typeof p.bio === 'string' && p.bio.trim().length > 20 },
    { label: 'tu ciudad', done: typeof p.zone === 'string' && p.zone.trim().length > 0 && p.zone !== 'España' },
    { label: 'tu especialidad', done: typeof p.specialty === 'string' && p.specialty.trim().length > 0 },
    { label: 'tu Instagram', done: typeof p.instagram === 'string' && p.instagram.trim().length > 0 },
  ];
  if (p.role === 'dj' || p.role === 'rookie') {
    steps.push({
      label: 'un mix o sesión de audio',
      done: (typeof p.audio_embed_url === 'string' && p.audio_embed_url.trim().length > 0)
        || (Array.isArray(p.audio_session_urls) && p.audio_session_urls.length > 0),
    });
  } else if (p.role !== 'empresario') {
    steps.push({ label: 'tu portfolio', done: Array.isArray(p.portfolio_urls) && p.portfolio_urls.length > 0 });
  }
  const done = steps.filter(s => s.done).length;
  return { percent: Math.round((done / steps.length) * 100), missing: steps.filter(s => !s.done).map(s => s.label) };
}

// Finds profiles created 24-48h ago that are still incomplete and not
// empresario (empresarios don't have a "directory" completeness concept),
// sends one reminder email, logs it to avoid ever sending twice.
// Designed to be called daily via Supabase cron.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const from = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const to = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('user_id, display_name, role, photo_url, bio, zone, specialty, instagram, audio_embed_url, audio_session_urls, portfolio_urls, created_at')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())
    .neq('role', 'empresario');

  if (profilesError) {
    console.error('[profile-incomplete-reminder] fetch error', profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: corsHeaders });
  }

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No profiles in window' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    try {
      const { percent, missing } = completeness(profile as Record<string, unknown>);
      if (percent >= 100 || missing.length === 0) continue;

      const { data: existing } = await admin
        .from('email_logs' as any)
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('type', 'profile_incomplete_reminder')
        .maybeSingle();
      if (existing) continue;

      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.user_id);
      if (userError || !userData?.user?.email) {
        console.warn('[profile-incomplete-reminder] no email for', profile.user_id);
        continue;
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: 'profile_incomplete_reminder',
          data: {
            email: userData.user.email,
            name: profile.display_name ?? 'Profesional',
            role: profile.role ?? 'profesional',
            percent,
            missingCount: missing.length,
            missingLabels: missing.join(', '),
          },
        }),
      });

      if (!res.ok) {
        console.error('[profile-incomplete-reminder] send failed for', profile.user_id, await res.text());
        errors.push(profile.user_id);
        continue;
      }

      await admin.from('email_logs' as any).insert({
        user_id: profile.user_id,
        type: 'profile_incomplete_reminder',
        sent_at: new Date().toISOString(),
      }).catch(() => {/* non-critical */});

      sent++;
    } catch (e) {
      console.error('[profile-incomplete-reminder] unexpected error for', profile.user_id, e);
      errors.push(profile.user_id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: profiles.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
