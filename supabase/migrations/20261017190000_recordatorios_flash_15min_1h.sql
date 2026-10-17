-- 17 oct 2026: regla de recordatorios de Flash Booking. Antes: un solo aviso a
-- los 30 minutos, solo dentro de la app. Ahora, para una solicitud directa sin
-- responder (status = 'pending'):
--   en el momento      aviso al crearse (notificación, push y, en los
--                      particulares, email: ya existía / particular-solicitud)
--   a los 15 minutos   recordatorio 1: notificación + push + email al profesional
--                      y aviso al admin
--   a la hora          recordatorio 2: igual, con otro texto
-- Se mira cada 5 minutos. Las solicitudes generales sin profesional (lead a
-- repartir a mano) solo avisan al admin.
ALTER TABLE public.flash_bookings ADD COLUMN IF NOT EXISTS reminder2_sent_at timestamptz;

CREATE OR REPLACE FUNCTION public.remind_pending_flash_bookings()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_admin uuid;
  v_mins int;
  v_stage int;
  v_titulo text;
  v_cuerpo text;
  v_hdr jsonb;
BEGIN
  FOR r IN
    SELECT * FROM public.flash_bookings
    WHERE status = 'pending'
      AND created_at > now() - interval '48 hours'
      AND ( (reminder_sent_at IS NULL AND created_at < now() - interval '15 minutes')
         OR (reminder_sent_at IS NOT NULL AND reminder2_sent_at IS NULL AND created_at < now() - interval '60 minutes') )
  LOOP
    v_stage := CASE WHEN r.reminder_sent_at IS NULL THEN 1 ELSE 2 END;
    v_mins := GREATEST(15, EXTRACT(EPOCH FROM (now() - r.created_at)) / 60)::int;

    IF r.professional_user_id IS NOT NULL THEN
      v_titulo := CASE WHEN v_stage = 1 THEN 'Tienes una solicitud esperando' ELSE 'Sigue sin respuesta, lleva 1 hora' END;
      v_cuerpo := COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
        || ' te escribió hace ' || v_mins || ' min y espera respuesta.'
        || ' Pulsa Sí, puedo o No puedo: quien responde recibe más encargos.';

      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (r.professional_user_id, 'booking_reminder', v_titulo, v_cuerpo, '/dashboard?view=flashbooking&tab=solicitudes');

      BEGIN
        v_hdr := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
          'Content-Type', 'application/json');
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
          headers := v_hdr,
          body := jsonb_build_object('user_id', r.professional_user_id, 'title', v_titulo, 'body', v_cuerpo,
            'url', '/dashboard?view=flashbooking&tab=solicitudes', 'tag', 'flash-rem-' || r.id || '-' || v_stage));
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
          headers := v_hdr,
          body := jsonb_build_object('type', 'booking_reminder', 'data', jsonb_build_object(
            'professional_user_id', r.professional_user_id, 'stage', v_stage,
            'requester_name', r.requester_name, 'event_date', r.event_date,
            'event_location', NULLIF(trim(COALESCE(r.event_location, '')), ''),
            'event_description', r.event_description)));
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'remind_pending_flash_bookings: aviso externo % : %', r.id, SQLERRM;
      END;
    END IF;

    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        v_admin, 'admin_booking_reminder',
        'Solicitud sin responder (' || v_mins || ' min)',
        COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
          || ' sigue sin respuesta'
          || CASE WHEN NULLIF(trim(r.professional_name), '') IS NOT NULL
                  THEN ' de ' || r.professional_name ELSE '' END
          || '. Contacto: ' || COALESCE(NULLIF(trim(r.requester_contact), ''), 'sin datos'),
        '/dashboard?view=admin'
      );
    END LOOP;

    IF v_stage = 1 THEN
      UPDATE public.flash_bookings SET reminder_sent_at = now() WHERE id = r.id;
    ELSE
      UPDATE public.flash_bookings SET reminder2_sent_at = now() WHERE id = r.id;
    END IF;
  END LOOP;
END;
$function$;

-- Cada 5 minutos (antes cada 10) para que el aviso de los 15 minutos no llegue a los 25.
SELECT cron.schedule('xpeak-flash-booking-reminder', '*/5 * * * *', 'SELECT public.remind_pending_flash_bookings()');
