-- Push nativo al organizador cuando un profesional se apunta a su oferta —
-- antes solo llegaba la campana in-app, y el organizador (a menudo sin la
-- pestaña abierta) tardaba en verlo.
CREATE OR REPLACE FUNCTION public.notify_event_request_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_owner uuid;
  v_pro text;
  v_titulo text;
  v_admin uuid;
BEGIN
  SELECT
    NULLIF(trim(r.client_user_id), '')::uuid,
    COALESCE(NULLIF(trim(r.client_name), ''), 'tu evento')
  INTO v_owner, v_titulo
  FROM public.event_requests r WHERE r.id = NEW.request_id;

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional')
  INTO v_pro FROM public.profiles WHERE user_id = NEW.professional_user_id;
  v_pro := COALESCE(v_pro, 'Un profesional');

  IF v_owner IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_owner, 'event_response',
      v_pro || ' se ha apuntado a tu oferta',
      v_pro || ' está disponible para ' || v_titulo
        || CASE WHEN NULLIF(trim(NEW.message), '') IS NOT NULL
                THEN ': "' || left(NEW.message, 100) || '"' ELSE '' END,
      '/dashboard?view=flashbooking'
    );

    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'),
      body := jsonb_build_object(
        'user_id', v_owner, 'title', v_pro || ' se ha apuntado a tu oferta',
        'body', v_pro || ' está disponible para ' || v_titulo, 'url', '/dashboard?view=flashbooking')
    );
  END IF;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_event_response',
      'Respuesta a una oferta: ' || v_pro,
      v_pro || ' se ha apuntado a la oferta de ' || v_titulo,
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;
