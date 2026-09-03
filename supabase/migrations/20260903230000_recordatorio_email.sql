-- NOTA: al aplicar, sustituir <<CLAVE_ANON>> por SUPABASE_PUBLISHABLE_KEY del .env
-- (mismo patron que 20260902150000_fix_cron_email_jobs.sql: la clave no se versiona).

-- Email de recordatorio, además de la notificación en la campana.
-- La clave que se inyecta aquí es la anon publica (la misma que ya usan los
-- otros cron de email); no se versiona en el repo, se sustituye al aplicar.
CREATE OR REPLACE FUNCTION public.remind_pending_flash_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_admin uuid;
  v_horas int;
  v_email text;
BEGIN
  FOR r IN
    SELECT * FROM public.flash_bookings
    WHERE status = 'pending'
      AND reminder_sent_at IS NULL
      AND created_at < now() - interval '1 hour'
      AND created_at > now() - interval '48 hours'
  LOOP
    v_horas := GREATEST(1, EXTRACT(EPOCH FROM (now() - r.created_at)) / 3600)::int;

    IF r.professional_user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        r.professional_user_id, 'booking_reminder',
        'Tienes una solicitud sin responder',
        COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
          || ' te escribio hace ' || v_horas || ' h y sigue esperando respuesta.'
          || ' Contesta aunque sea para decir que no puedes: quien responde recibe mas encargos.',
        '/dashboard?view=flashbooking'
      );

      -- Segundo aviso por email al profesional. Se dispara en el mismo sitio
      -- que la notificacion para que no puedan desincronizarse.
      SELECT email INTO v_email FROM auth.users WHERE id = r.professional_user_id;
      IF v_email IS NOT NULL THEN
        PERFORM net.http_post(
          url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Authorization', 'Bearer <<CLAVE_ANON — ver .env, no se versiona>>',
            'Content-Type', 'application/json'),
          body    := jsonb_build_object(
            'type', 'booking_received',
            'data', jsonb_build_object(
              'email', v_email,
              'professional_user_id', r.professional_user_id,
              'professional_name', r.professional_name,
              'requester_name', COALESCE(r.requester_name, 'Un cliente'),
              'requester_contact', r.requester_contact,
              'event_date', r.event_date,
              'event_location', r.event_location,
              'event_description', COALESCE(r.event_description, '')
                || ' [RECORDATORIO: llevas ' || v_horas || ' h sin responder a esta solicitud]'
            ))
        );
      END IF;
    END IF;

    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        v_admin, 'admin_booking_reminder',
        'Solicitud sin responder (' || v_horas || ' h)',
        COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
          || ' sigue sin respuesta'
          || CASE WHEN NULLIF(trim(r.professional_name), '') IS NOT NULL
                  THEN ' de ' || r.professional_name ELSE '' END
          || '. Contacto: ' || COALESCE(NULLIF(trim(r.requester_contact), ''), 'sin datos'),
        '/dashboard?view=admin'
      );
    END LOOP;

    UPDATE public.flash_bookings SET reminder_sent_at = now() WHERE id = r.id;
  END LOOP;
END;
$function$;
