import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// El sistema de reseñas está construido y verificado (RLS exige un
// flash_booking real) pero nadie lo usa: 0 filas en 6+ meses de producción,
// porque nunca se le pide al organizador (ni al profesional) que valore.
// La plantilla de email `pedir_valoracion` ya existía en send-email/index.ts
// pero no la disparaba nada — esta función es la pieza que faltaba.
//
// Dispara 3 días después de la fecha del evento (event_date es texto libre
// tipo YYYY-MM-DD, no un date real — ver notify_new_flash_booking.sql), para
// dar margen a que el bolo haya terminado de verdad antes de pedir opinión.
// Se pide a las dos partes: el organizador valora al profesional desde su
// ficha pública (/p/:id, ReviewsSection en PublicProfile.tsx); el profesional
// valora al organizador desde SolicitudesTab.tsx (ReviewOrganizadorModal).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const targetDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const targetStr = targetDate.toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: bookings, error: bookingsError } = await admin
    .from('flash_bookings')
    .select('id, created_by, professional_user_id, professional_name, requester_name, event_date')
    .eq('event_date', targetStr)
    .in('status', ['confirmed', 'completed'])
    .not('professional_user_id', 'is', null);

  if (bookingsError) {
    console.error('[review-reminder] fetch error', bookingsError);
    return new Response(JSON.stringify({ error: bookingsError.message }), { status: 500, headers: corsHeaders });
  }

  // Segunda vía de contratación: event_requests / event_request_responses.
  // No pasa por flash_bookings, así que el bloque de arriba nunca la veía —
  // el caso real (13 sep 2026) fue un evento del 11 sep contratado por esta
  // vía (hired_at en event_request_responses) que nunca disparó el email de
  // valoración. review_asked_at ya existía en el esquema para esto, solo
  // faltaba la pieza que lo dispara.
  const { data: hiredResponses, error: hiredError } = await admin
    .from('event_request_responses' as any)
    .select('id, request_id, professional_user_id, hired_at, review_asked_at, event_requests!inner(id, client_user_id, client_name, event_date)')
    .not('hired_at', 'is', null)
    .is('review_asked_at', null)
    .eq('event_requests.event_date', targetStr);

  if (hiredError) {
    console.error('[review-reminder] event_request_responses fetch error', hiredError);
  }

  if (!bookings?.length && !hiredResponses?.length) {
    return new Response(JSON.stringify({ sent: 0, message: 'No bookings 3 days ago' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  const sendReminder = async (
    bookingId: string,
    userId: string,
    logSuffix: string,
    data: { name: string; titulo: string; otra_parte: string; es_organizador: boolean; ref: string },
  ) => {
    const logKey = `review_reminder_${bookingId}_${logSuffix}`;
    const { data: existingLog } = await admin
      .from('email_logs' as any)
      .select('id')
      .eq('user_id', userId)
      .eq('type', logKey)
      .limit(1)
      .maybeSingle();
    if (existingLog) return;

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(userId);
    if (userError || !userData?.user?.email) {
      console.warn('[review-reminder] no email for', userId);
      return;
    }

    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
      body: JSON.stringify({
        type: 'pedir_valoracion',
        data: { email: userData.user.email, ...data },
      }),
    });

    if (!res.ok) {
      console.error('[review-reminder] send failed for', userId, await res.text());
      errors.push(userId);
      return;
    }

    await admin.from('email_logs' as any).insert({
      user_id: userId,
      type: logKey,
      sent_at: new Date().toISOString(),
    }).catch(() => { /* non-critical */ });

    sent++;
  };

  for (const b of bookings) {
    try {
      // Organizador → valora al profesional (solo si aún no lo valoró).
      const { data: existingReview } = await admin
        .from('reviews')
        .select('id')
        .eq('reviewer_id', b.created_by)
        .eq('reviewed_user_id', b.professional_user_id)
        .maybeSingle();

      if (!existingReview) {
        await sendReminder(b.id, b.created_by, 'organizador', {
          name: b.requester_name || 'Organizador',
          titulo: `tu evento con ${b.professional_name}`,
          otra_parte: b.professional_name,
          es_organizador: true,
          ref: b.professional_user_id as string,
        });
      }

      // Profesional → valora al organizador (solo si aún no lo valoró).
      const { data: existingReviewReverse } = await admin
        .from('reviews')
        .select('id')
        .eq('reviewer_id', b.professional_user_id)
        .eq('reviewed_user_id', b.created_by)
        .maybeSingle();

      if (!existingReviewReverse) {
        await sendReminder(b.id, b.professional_user_id as string, 'profesional', {
          name: b.professional_name || 'Profesional',
          titulo: `el evento con ${b.requester_name || 'el organizador'}`,
          otra_parte: b.requester_name || 'el organizador',
          es_organizador: false,
          ref: b.created_by,
        });
      }
    } catch (e) {
      console.error('[review-reminder] unexpected error for', b.created_by, e);
      errors.push(b.created_by);
    }
  }

  for (const r of (hiredResponses as any[]) || []) {
    const request = r.event_requests;
    const clientUserId = request?.client_user_id;
    if (!clientUserId) continue;
    try {
      const { data: profProfile } = await admin
        .from('profiles')
        .select('display_name')
        .eq('user_id', r.professional_user_id)
        .maybeSingle();
      const profName = profProfile?.display_name || 'el profesional';
      const clientName = request?.client_name || 'Organizador';

      // Organizador → valora al profesional (solo si aún no lo valoró).
      const { data: existingReview } = await admin
        .from('reviews')
        .select('id')
        .eq('reviewer_id', clientUserId)
        .eq('reviewed_user_id', r.professional_user_id)
        .maybeSingle();

      if (!existingReview) {
        await sendReminder(r.request_id, clientUserId, `request_organizador_${r.id}`, {
          name: clientName,
          titulo: `tu evento con ${profName}`,
          otra_parte: profName,
          es_organizador: true,
          ref: r.professional_user_id as string,
        });
      }

      // Profesional → valora al organizador (solo si aún no lo valoró).
      const { data: existingReviewReverse } = await admin
        .from('reviews')
        .select('id')
        .eq('reviewer_id', r.professional_user_id)
        .eq('reviewed_user_id', clientUserId)
        .maybeSingle();

      if (!existingReviewReverse) {
        await sendReminder(r.request_id, r.professional_user_id, `request_profesional_${r.id}`, {
          name: profName,
          titulo: `el evento con ${clientName}`,
          otra_parte: clientName,
          es_organizador: false,
          ref: clientUserId,
        });
      }

      await admin
        .from('event_request_responses' as any)
        .update({ review_asked_at: new Date().toISOString() })
        .eq('id', r.id);
    } catch (e) {
      console.error('[review-reminder] unexpected error for request response', r.id, e);
      errors.push(r.id);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: (bookings?.length || 0) + (hiredResponses?.length || 0) }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
