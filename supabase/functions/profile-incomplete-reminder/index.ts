import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isDemoAccount } from './isDemoAccount.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Same completeness criteria as ProfileView.tsx's completenessSteps — kept
// in sync by hand since one runs client-side (React state) and the other
// server-side (raw row). If you change one, change the other.
function completeness(p: Record<string, unknown>): { percent: number; missing: string[] } {
  // A un organizador no se le piden tarifa, especialidad ni portfolio: no
  // vende un servicio, contrata. Lo que necesita es que el profesional al que
  // escribe pueda ver QUIÉN le está ofreciendo el bolo — un perfil de sala
  // vacío hace que la oferta parezca spam y baja la respuesta.
  if (p.role === 'empresario') {
    const pasos = [
      { label: 'el logo o una foto del local', done: !!p.photo_url },
      { label: 'una descripción de tu sala o empresa', done: typeof p.bio === 'string' && p.bio.trim().length > 20 },
      { label: 'tu ciudad', done: typeof p.zone === 'string' && p.zone.trim().length > 0 && p.zone !== 'España' },
      { label: 'tu Instagram', done: typeof p.instagram === 'string' && p.instagram.trim().length > 0 },
    ];
    const ok = pasos.filter(s => s.done).length;
    return { percent: Math.round((ok / pasos.length) * 100), missing: pasos.filter(s => !s.done).map(s => s.label) };
  }

  const steps: { label: string; done: boolean }[] = [
    { label: 'una foto de perfil', done: !!p.photo_url },
    { label: 'una bio (mínimo una frase)', done: typeof p.bio === 'string' && p.bio.trim().length > 20 },
    { label: 'tu ciudad', done: typeof p.zone === 'string' && p.zone.trim().length > 0 && p.zone !== 'España' },
    { label: 'tu especialidad', done: typeof p.specialty === 'string' && p.specialty.trim().length > 0 },
    { label: 'tu Instagram', done: typeof p.instagram === 'string' && p.instagram.trim().length > 0 },
    { label: 'tu tarifa', done: typeof p.hourly_rate === 'number' && p.hourly_rate > 0 },
  ];
  // Los roles musicales piden audio; el resto, portfolio. 'rookie' se retiro el
  // 2 sep 2026, y grupo-musical necesita audio igual que un DJ: pedirle
  // "portfolio" a una cantante era pedirle lo que no aplica a su trabajo.
  if (p.role === 'dj' || p.role === 'grupo-musical') {
    steps.push({
      label: 'un audio o vídeo tuyo',
      done: (typeof p.audio_embed_url === 'string' && p.audio_embed_url.trim().length > 0)
        || (Array.isArray(p.audio_session_urls) && p.audio_session_urls.length > 0),
    });
  } else if (p.role !== 'empresario') {
    steps.push({ label: 'tu portfolio', done: Array.isArray(p.portfolio_urls) && p.portfolio_urls.length > 0 });
  }
  const done = steps.filter(s => s.done).length;
  return { percent: Math.round((done / steps.length) * 100), missing: steps.filter(s => !s.done).map(s => s.label) };
}

// Finds ANY incomplete, non-empresario, non-seed profile (sin límite de
// antigüedad — antes solo miraba la ventana 24-48h desde el registro, así
// que nunca alcanzaba a perfiles ya asentados e incompletos).
// Designed to be called daily via Supabase cron.
//
// Tope de MAX_REMINDERS: el guard anterior era "una vez para siempre, nunca
// más" via email_logs, pero un fallo de esa comprobación (sin UNIQUE
// constraint, ver migración 20260926130000) dejó a un usuario recibiendo
// este email 13 días seguidos sin parar (ivanperezblanco1992@gmail.com,
// 12-23 sep 2026). Ahora se cuenta cuántos recordatorios lleva y se corta.
const MAX_REMINDERS = 4;
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('user_id, display_name, role, photo_url, bio, zone, specialty, instagram, audio_embed_url, audio_session_urls, portfolio_urls, hourly_rate, created_at')
    .eq('is_seed', false)
    // Los empresarios ya NO se excluyen: también reciben su recordatorio, con
    // criterios propios (ver completeness). Antes solo se avisaba a los
    // profesionales, así que las salas se quedaban con el perfil vacío para
    // siempre y nadie se lo decía.
    .neq('role', 'pending');

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

      const { count: reminderCount } = await admin
        .from('email_logs' as any)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', profile.user_id)
        .eq('type', 'profile_incomplete_reminder');
      if ((reminderCount ?? 0) >= MAX_REMINDERS) continue;

      // Reservar el envío de HOY antes de enviarlo: el UNIQUE(user_id, type,
      // sent_day) de email_logs (migración 20260926130000) hace que una
      // segunda invocación de la función el mismo día falle aquí con
      // conflicto y nunca llegue a duplicar el email. Antes el insert iba
      // DESPUÉS de enviar (y sin constraint), así que el guard de "ya se
      // envió" no protegía nada frente a invocaciones repetidas — el caso
      // real fue ivanperezblanco1992@gmail.com recibiendo este email 13 días
      // seguidos sin parar (12-23 sep 2026), con 16 filas de log para el
      // mismo user+type en vez de una por día.
      const { error: reserveError } = await admin.from('email_logs' as any).insert({
        user_id: profile.user_id,
        type: 'profile_incomplete_reminder',
        sent_at: new Date().toISOString(),
      });
      if (reserveError) continue; // ya reservado hoy por otra invocación

      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.user_id);
      if (userError || !userData?.user?.email) {
        console.warn('[profile-incomplete-reminder] no email for', profile.user_id);
        continue;
      }
      if (isDemoAccount(userData.user.email)) continue;

      const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: 'profile_incomplete_reminder',
          data: {
            email: userData.user.email,
            name: profile.display_name ?? (profile.role === 'empresario' ? 'Organizador' : 'Profesional'),
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
