-- Los triggers llamaban a send-email solo con el anon key publico,
-- indistinguible de un atacante. Ahora anaden x-internal-secret leido del vault
-- (el anon key se mantiene porque el gateway exige Authorization).
-- Requiere: vault secret 'send_email_internal_secret' = INTERNAL_SECRET de edge functions.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'pending');
  v_category text;
  v_display_name text;
  v_zone text;
  v_admin_type text;
  v_marketing_consent boolean;
BEGIN
  v_category := COALESCE(NULLIF(NEW.raw_user_meta_data->>'category', 'pending'), 'professional');

  v_display_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
    NEW.email,
    ''
  );
  v_zone := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'zone'), ''), 'España');
  v_marketing_consent := COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false);

  INSERT INTO public.profiles (
    user_id, display_name, role, hourly_rate, zone, category,
    validation_status, validation_submitted_at,
    marketing_consent, marketing_consent_asked_at
  )
  VALUES (
    NEW.id, v_display_name, v_role,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    v_zone, v_category,
    'approved',
    now(),
    v_marketing_consent, now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  BEGIN
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'welcome',
        'data', jsonb_build_object('name', v_display_name, 'email', NEW.email, 'role', v_role)
      )
    );

    v_admin_type := CASE WHEN v_role = 'empresario' THEN 'empresario_registered' ELSE 'profesional_registered' END;
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', v_admin_type,
        'data', jsonb_build_object('name', v_display_name, 'email', NEW.email, 'role', v_role, 'zone', v_zone)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: fallo enviando emails de alta para %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_admin_review_pending()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_professional_name text;
BEGIN
  IF NEW.approved IS TRUE THEN
    RETURN NEW;
  END IF;

  SELECT display_name INTO v_professional_name
  FROM public.profiles
  WHERE user_id = NEW.reviewed_user_id;

  PERFORM net.http_post(
    url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
      'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'type', 'resena_pendiente',
      'data', jsonb_build_object(
        'review_id', NEW.id,
        'reviewed_user_id', NEW.reviewed_user_id,
        'reviewer_name', COALESCE(NEW.reviewer_name, 'Alguien'),
        'professional_name', COALESCE(v_professional_name, 'un profesional'),
        'rating', NEW.rating,
        'comment', COALESCE(NEW.comment, '')
      )
    )
  );

  RETURN NEW;
END;
$function$
;

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
  v_client_user_id uuid;
  v_a uuid; v_b uuid; v_conv_id uuid;
  v_fecha_calendario date;
  v_fechas date[];
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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
      'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'user_id', NEW.professional_user_id, 'title', '¡Te han contratado!',
      'body', v_titulo || ' te ha elegido para el bolo.', 'url', '/dashboard?view=flashbooking')
  );

  -- Calendario: una fila por cada fecha del evento (event_dates si existe,
  -- si no la única de event_date). Cast defensivo: event_date/event_dates
  -- son texto/array de date en event_requests; una fecha inválida no debe
  -- romper la contratación (de ahí el EXCEPTION general de la función).
  SELECT err.event_dates INTO v_fechas
  FROM public.event_requests err WHERE err.id = NEW.request_id;

  IF v_fechas IS NULL OR cardinality(v_fechas) = 0 THEN
    SELECT ARRAY[NULLIF(trim(err.event_date), '')::date] INTO v_fechas
    FROM public.event_requests err WHERE err.id = NEW.request_id;
  END IF;

  FOREACH v_fecha_calendario IN ARRAY v_fechas
  LOOP
    IF v_fecha_calendario IS NOT NULL THEN
      INSERT INTO public.calendar_events (user_id, title, event_date, location, notes)
      VALUES (
        NEW.professional_user_id, v_titulo, v_fecha_calendario, NULLIF(v_lugar, 'Por concretar'),
        'Añadido automáticamente al ser contratado vía Flash Booking'
      );
    END IF;
  END LOOP;

  -- Chat: crea (o reutiliza, mismo orden lexicográfico que MessagesView.tsx)
  -- la conversación entre el profesional y quien le contrata, para que el
  -- "habla con quien te contrata" del aviso sea real y no un callejón sin salida.
  SELECT client_user_id::uuid INTO v_client_user_id
  FROM public.event_requests WHERE id = NEW.request_id;

  IF v_client_user_id IS NOT NULL AND v_client_user_id <> NEW.professional_user_id THEN
    v_a := LEAST(v_client_user_id, NEW.professional_user_id);
    v_b := GREATEST(v_client_user_id, NEW.professional_user_id);
    INSERT INTO public.conversations (participant_a, participant_b)
    VALUES (v_a, v_b)
    ON CONFLICT (participant_a, participant_b) DO NOTHING;
  END IF;

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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
$function$
;

CREATE OR REPLACE FUNCTION public.notify_lead_match_on_profile_complete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_lead record;
  v_rol_nuevo text := lower(trim(COALESCE(NEW.role, '')));
  v_zona_es text;
BEGIN
  v_zona_es := COALESCE(NULLIF(trim(NEW.zone), ''), NEW.region, 'España');

  FOR v_lead IN
    SELECT id, email, lead_role, lead_region
    FROM public.leads
    WHERE converted_at IS NULL
      AND lead_role IS NOT NULL
      AND (
        lower(lead_role) LIKE '%' || v_rol_nuevo || '%'
        OR v_rol_nuevo LIKE '%' || lower(lead_role) || '%'
      )
      AND (lead_region IS NULL OR lead_region = NEW.region OR NEW.region IS NULL)
  LOOP
    BEGIN
      PERFORM net.http_post(
        url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'type', 'lead_match_found',
          'data', jsonb_build_object('email', v_lead.email, 'role', NEW.role, 'zone', v_zona_es)
        )
      );
      UPDATE public.leads SET converted_at = now() WHERE id = v_lead.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_lead_match_on_profile_complete: fallo avisando a %: %', v_lead.email, SQLERRM;
    END;
  END LOOP;

  RETURN NEW;
END;
$function$
;

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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
$function$
;

CREATE OR REPLACE FUNCTION public.notify_reviewed_user_on_approve()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_email text;
  v_name text;
BEGIN
  SELECT u.email, p.display_name INTO v_email, v_name
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = NEW.reviewed_user_id;

  IF v_email IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
      'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'type', 'te_han_dejado_una_resena',
      'data', jsonb_build_object(
        'email', v_email,
        'name', COALESCE(v_name, ''),
        'reviewer_name', COALESCE(NEW.reviewer_name, 'Alguien'),
        'rating', NEW.rating,
        'comment', COALESCE(NEW.comment, '')
      )
    )
  );

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.pedir_valoraciones_bolos()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_fin date;
BEGIN
  FOR r IN
    SELECT er.id, er.professional_user_id, er.request_id,
           e.client_user_id, e.client_name, e.event_date, e.event_dates,
           COALESCE(NULLIF(trim(pp.display_name), ''), 'el profesional') AS pro_nombre,
           up.email AS pro_email, COALESCE(pp.email_opt_out, false) AS pro_opt,
           uc.email AS cli_email
    FROM public.event_request_responses er
    JOIN public.event_requests e ON e.id = er.request_id
    LEFT JOIN public.profiles pp ON pp.user_id = er.professional_user_id
    LEFT JOIN auth.users up ON up.id = er.professional_user_id
    LEFT JOIN auth.users uc ON uc.id::text = e.client_user_id
    WHERE er.hired_at IS NOT NULL
      AND er.review_asked_at IS NULL
  LOOP
    -- Último día del evento: del array si lo hay, si no de la fecha suelta.
    v_fin := NULL;
    IF r.event_dates IS NOT NULL AND cardinality(r.event_dates) > 0 THEN
      SELECT max(d) INTO v_fin FROM unnest(r.event_dates) AS d;
    ELSIF r.event_date IS NOT NULL THEN
      BEGIN
        v_fin := NULLIF(trim(r.event_date), '')::date;
      EXCEPTION WHEN OTHERS THEN CONTINUE;
      END;
    END IF;

    IF v_fin IS NULL OR v_fin >= current_date THEN
      CONTINUE;
    END IF;

    IF r.pro_email IS NOT NULL AND r.pro_email NOT LIKE '%@xpeak.es' AND r.pro_opt = false THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
          'Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'pedir_valoracion', 'data', jsonb_build_object(
          'email', r.pro_email, 'user_id', r.professional_user_id,
          'name', r.pro_nombre,
          'titulo', COALESCE(NULLIF(trim(r.client_name), ''), 'el evento'),
          'otra_parte', COALESCE(NULLIF(trim(r.client_name), ''), 'el organizador'),
          'es_organizador', false, 'ref', r.id))
      );
    END IF;

    IF r.cli_email IS NOT NULL AND r.cli_email NOT LIKE '%@xpeak.es' THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
          'Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'pedir_valoracion', 'data', jsonb_build_object(
          'email', r.cli_email, 'user_id', NULLIF(trim(r.client_user_id), '')::uuid,
          'name', COALESCE(NULLIF(trim(r.client_name), ''), 'Organizador'),
          'titulo', COALESCE(NULLIF(trim(r.client_name), ''), 'el evento'),
          'otra_parte', r.pro_nombre, 'es_organizador', true, 'ref', r.id))
      );
    END IF;

    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      r.professional_user_id, 'pedir_valoracion', '¿Qué tal fue el bolo?',
      'Cuéntanos cómo fue con ' || COALESCE(NULLIF(trim(r.client_name), ''), 'el organizador')
        || '. Las valoraciones son lo que hace que te contraten la próxima vez.',
      '/dashboard?view=valorar&e=' || r.id
    );

    IF NULLIF(trim(r.client_user_id), '') IS NOT NULL THEN
      BEGIN
        INSERT INTO public.notifications (user_id, type, title, body, link)
        VALUES (
          r.client_user_id::uuid, 'pedir_valoracion',
          '¿Qué tal fue con ' || r.pro_nombre || '?',
          'Tu valoración ayuda a otros organizadores a elegir con criterio.',
          '/dashboard?view=valorar&e=' || r.id
        );
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
    END IF;

    UPDATE public.event_request_responses SET review_asked_at = now() WHERE id = r.id;
  END LOOP;
END;
$function$
;
