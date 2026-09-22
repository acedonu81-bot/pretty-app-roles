import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Same completeness criteria as ProfileView.tsx / profile-incomplete-reminder
// — solo se invita a crear un segundo perfil de Organizador a quien ya tiene
// el suyo terminado (foto+bio+zona+especialidad+instagram+audio/portfolio):
// pedirle un segundo perfil a alguien con el primero a medias sería ruido.
function isComplete(p: Record<string, unknown>): boolean {
  const steps: boolean[] = [
    !!p.photo_url,
    typeof p.bio === 'string' && p.bio.trim().length > 20,
    typeof p.zone === 'string' && p.zone.trim().length > 0 && p.zone !== 'España',
    typeof p.specialty === 'string' && (p.specialty as string).trim().length > 0,
    typeof p.instagram === 'string' && (p.instagram as string).trim().length > 0,
    typeof p.hourly_rate === 'number' && p.hourly_rate > 0,
  ];
  if (p.role === 'dj' || p.role === 'grupo-musical') {
    steps.push(
      (typeof p.audio_embed_url === 'string' && (p.audio_embed_url as string).trim().length > 0)
      || (Array.isArray(p.audio_session_urls) && (p.audio_session_urls as unknown[]).length > 0),
    );
  } else {
    steps.push(Array.isArray(p.portfolio_urls) && (p.portfolio_urls as unknown[]).length > 0);
  }
  return steps.every(Boolean);
}

// Invita una sola vez (dedupe vía email_logs) a profesionales con ficha
// terminada a crear un segundo perfil de Organizador en la misma cuenta.
// Se excluye a quien ya tenga cualquier fila con role='empresario' bajo su
// user_id — multi-perfil habilitado desde 20260714120000_remove_profiles_user_id_unique.
// Designed to be called weekly via Supabase cron.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('user_id, display_name, role, photo_url, bio, zone, specialty, instagram, audio_embed_url, audio_session_urls, portfolio_urls, hourly_rate')
    .eq('is_seed', false)
    .neq('role', 'empresario')
    .neq('role', 'pending');

  if (profilesError) {
    console.error('[organizador-segundo-perfil-reminder] fetch error', profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: corsHeaders });
  }

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No profiles to check' }), { headers: corsHeaders });
  }

  const { data: empresarioRows } = await admin
    .from('profiles')
    .select('user_id')
    .eq('role', 'empresario');
  const yaTieneOrganizador = new Set((empresarioRows ?? []).map(r => r.user_id));

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    try {
      if (yaTieneOrganizador.has(profile.user_id)) continue;
      if (!isComplete(profile as Record<string, unknown>)) continue;

      const { data: existing } = await admin
        .from('email_logs' as any)
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('type', 'organizador_segundo_perfil')
        .maybeSingle();
      if (existing) continue;

      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: 'organizador_segundo_perfil',
          data: {
            user_id: profile.user_id,
            name: profile.display_name ?? 'Profesional',
          },
        }),
      });

      if (!res.ok) {
        console.error('[organizador-segundo-perfil-reminder] send failed for', profile.user_id, await res.text());
        errors.push(profile.user_id);
        continue;
      }

      try {
        await admin.from('email_logs' as any).insert({
          user_id: profile.user_id,
          type: 'organizador_segundo_perfil',
          sent_at: new Date().toISOString(),
        });
      } catch { /* non-critical */ }

      sent++;
    } catch (e) {
      console.error('[organizador-segundo-perfil-reminder] unexpected error for', profile.user_id, e);
      errors.push(profile.user_id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: profiles.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
