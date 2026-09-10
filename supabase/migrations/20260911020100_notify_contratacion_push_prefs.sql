-- Push nativo + respeto de alert_preferences.email_flash: hasta ahora el
-- email de "contratado"/"oferta cubierta" solo miraba email_opt_out (opt-out
-- global de TODO), ignorando el toggle específico de Flash Booking que ya
-- existe en Ajustes. Y el aviso nunca llegaba como push nativo (solo campana
-- + email) — en la app iOS eso es la diferencia entre enterarse en minutos o
-- al día siguiente.
CREATE OR REPLACE FUNCTION public.notify_contratacion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_elegido text; v_lugar text; v_fecha text;
  v_otro record; v_admin uuid; v_email text; v_nombre text;
  v_plazas_totales int; v_plazas_cubiertas int;
  v_email_pref boolean;
BEGIN
  IF NEW.hired_at IS NULL OR OLD.hired_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(client_name), ''), 'un organizador'),
         COALESCE(NULLIF(trim(city), ''), 'Por concretar'),
         COALESCE(NULLIF(trim(event_date), ''), 'Por concretar')
  INTO v_titulo, v_lugar, v_fecha
  FROM public.event_requests WHERE id = NEW.request_id;

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional')
  INTO v_elegido FROM public.profiles WHERE user_id = NEW.professional_user_id;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    NEW.professional_user_id, 'contratado', '¡Te han contratado!',
    v_titulo || ' te ha elegido para el bolo. Entra para ver los detalles y hablar con quien te contrata.',
    '/dashboard?view=flashbooking'
  );

  PERFORM net.http_post(
    url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'user_id', NEW.professional_user_id, 'title', '¡Te han contratado!',
      'body', v_titulo || ' te ha elegido para el bolo.', 'url', '/dashboard?view=flashbooking')
  );

  SELECT COALESCE(pref.email_flash, true) INTO v_email_pref
  FROM public.alert_preferences pref WHERE pref.user_id = NEW.professional_user_id;
  v_email_pref := COALESCE(v_email_pref, true);

  IF v_email_pref THEN
    SELECT u.email, COALESCE(NULLIF(trim(p.display_name), ''), 'Profesional')
    INTO v_email, v_nombre
    FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
    WHERE u.id = NEW.professional_user_id
      AND COALESCE(p.email_opt_out, false) = false
      AND u.email NOT LIKE '%@xpeak.es';

    IF v_email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'contratado', 'data', jsonb_build_object(
          'email', v_email, 'user_id', NEW.professional_user_id,
          'name', v_nombre, 'titulo', v_titulo, 'lugar', v_lugar, 'fecha', v_fecha))
      );
    END IF;
  END IF;

  -- Solo los descartados de la MISMA plaza (mismo slot_id) — si hay 2
  -- camareros, contratar al de la plaza 1 no toca a los inscritos en la 2.
  FOR v_otro IN
    SELECT er.professional_user_id, u.email,
           COALESCE(NULLIF(trim(p.display_name), ''), 'Profesional') AS nombre,
           public.perfil_campos_faltantes(er.professional_user_id) AS falta,
           COALESCE(p.email_opt_out, false) AS opt_out,
           COALESCE(pref.email_flash, true) AS email_flash
    FROM public.event_request_responses er
    JOIN public.profiles p ON p.user_id = er.professional_user_id
    JOIN auth.users u ON u.id = er.professional_user_id
    LEFT JOIN public.alert_preferences pref ON pref.user_id = er.professional_user_id
    WHERE er.slot_id = NEW.slot_id AND er.id <> NEW.id AND er.hired_at IS NULL
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_otro.professional_user_id, 'no_seleccionado',
      'La oferta de ' || v_titulo || ' ya está cubierta',
      CASE WHEN cardinality(v_otro.falta) > 0
        THEN 'La plaza ya está cubierta, puedes liberar esa fecha. Para la próxima: completa '
             || array_to_string(v_otro.falta, ', ') || ' — los perfiles completos se ven primero.'
        ELSE 'La plaza ya está cubierta, puedes liberar esa fecha. Gracias por responder rápido: te avisaremos de la próxima que encaje contigo.'
      END,
      CASE WHEN cardinality(v_otro.falta) > 0 THEN '/dashboard?view=perfil'
           ELSE '/dashboard?view=flashbooking' END
    );

    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'),
      body := jsonb_build_object(
        'user_id', v_otro.professional_user_id, 'title', 'Oferta cubierta',
        'body', 'La oferta de ' || v_titulo || ' ya está cubierta.', 'url', '/dashboard?view=flashbooking')
    );

    IF v_otro.email IS NOT NULL AND v_otro.email NOT LIKE '%@xpeak.es'
       AND v_otro.opt_out = false AND v_otro.email_flash THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'oferta_cubierta', 'data', jsonb_build_object(
          'email', v_otro.email, 'user_id', v_otro.professional_user_id,
          'name', v_otro.nombre, 'titulo', v_titulo,
          'falta', to_jsonb(v_otro.falta)))
      );
    END IF;
  END LOOP;

  -- La oferta solo cierra cuando TODAS sus plazas tienen ganador.
  SELECT count(*) INTO v_plazas_totales
  FROM public.event_request_slots WHERE request_id = NEW.request_id;

  SELECT count(DISTINCT s.id) INTO v_plazas_cubiertas
  FROM public.event_request_slots s
  JOIN public.event_request_responses er ON er.slot_id = s.id AND er.hired_at IS NOT NULL
  WHERE s.request_id = NEW.request_id;

  IF v_plazas_totales > 0 AND v_plazas_cubiertas >= v_plazas_totales THEN
    UPDATE public.event_requests SET status = 'closed'
    WHERE id = NEW.request_id AND status = 'open';
  END IF;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_contratacion', 'Contratación cerrada: ' || v_elegido,
      v_titulo || ' ha contratado a ' || v_elegido || ' a través de XPEAK.',
      '/dashboard?view=admin'
    );
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

-- notify_preseleccion: mismo patrón, push + email condicionado a
-- alert_preferences.email_flash.
CREATE OR REPLACE FUNCTION public.notify_preseleccion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_email text; v_email_pref boolean;
BEGIN
  IF NEW.chosen_at IS NULL OR OLD.chosen_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(client_name), ''), 'un organizador')
  INTO v_titulo FROM public.event_requests WHERE id = NEW.request_id;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    NEW.professional_user_id, 'preseleccionado',
    '¡Te han elegido para un bolo!',
    v_titulo || ' quiere contratarte. Entra a confirmar antes de que elija a otro.',
    '/dashboard?view=flashbooking'
  );

  PERFORM net.http_post(
    url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'user_id', NEW.professional_user_id, 'title', '¡Te han elegido para un bolo!',
      'body', v_titulo || ' quiere contratarte. Confirma antes de que elija a otro.',
      'url', '/dashboard?view=flashbooking')
  );

  SELECT COALESCE(pref.email_flash, true) INTO v_email_pref
  FROM public.alert_preferences pref WHERE pref.user_id = NEW.professional_user_id;
  v_email_pref := COALESCE(v_email_pref, true);

  IF v_email_pref THEN
    SELECT u.email INTO v_email
    FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
    WHERE u.id = NEW.professional_user_id
      AND COALESCE(p.email_opt_out, false) = false
      AND u.email NOT LIKE '%@xpeak.es';

    IF v_email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'preseleccionado', 'data', jsonb_build_object(
          'email', v_email, 'user_id', NEW.professional_user_id, 'titulo', v_titulo))
      );
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;
