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

  if (!bookings || bookings.length === 0) {
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

  return new Response(
    JSON.stringify({ sent, errors: errors.length, checked: bookings.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
