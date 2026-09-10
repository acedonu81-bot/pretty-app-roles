-- Push nativo a cada profesional avisado de una oferta nueva de su rol —
-- respeta alert_preferences.notif_flash (ya existía como toggle de "avisos
-- de Flash Booking" en Ajustes, hasta hoy solo controlaba web push/campana).
CREATE OR REPLACE FUNCTION public.notify_new_event_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_cuerpo text; v_dest uuid; v_admin uuid;
  v_avisados int := 0; v_roles text[]; v_cliente uuid; v_fecha text;
  v_estilos text[];
BEGIN
  v_roles := COALESCE(NEW.roles_needed, ARRAY[]::text[]);
  v_estilos := COALESCE(NEW.estilos, ARRAY[]::text[]);

  BEGIN
    v_cliente := NULLIF(trim(NEW.client_user_id), '')::uuid;
  EXCEPTION WHEN OTHERS THEN v_cliente := NULL;
  END;

  v_fecha := NULLIF(trim(NEW.event_date), '');
  IF v_fecha IS NOT NULL THEN
    BEGIN v_fecha := to_char(v_fecha::date, 'DD/MM');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.client_name), ''), 'Un organizador')
    || ' busca ' || COALESCE(NULLIF(array_to_string(v_roles, ', '), ''), 'profesionales')
    || CASE WHEN cardinality(v_estilos) > 0
            THEN ' (' || array_to_string(v_estilos[1:3], ', ') || ')' ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.city), '') IS NOT NULL THEN ' en ' || NEW.city ELSE '' END
    || CASE WHEN v_fecha IS NOT NULL THEN ' para el ' || v_fecha ELSE '' END
    || CASE WHEN NEW.budget_max IS NOT NULL THEN ' · hasta ' || NEW.budget_max || '€' ELSE '' END
  );

  FOR v_dest IN
    SELECT p.user_id FROM public.profiles p
    LEFT JOIN public.alert_preferences pref ON pref.user_id = p.user_id
    WHERE p.user_id IS NOT NULL
      AND (v_cliente IS NULL OR p.user_id <> v_cliente)
      AND p.role NOT IN ('empresario', 'pending')
      AND p.is_seed_profile IS DISTINCT FROM TRUE
      AND COALESCE(pref.notif_flash, true) = true
      AND (
        cardinality(v_roles) = 0
        OR EXISTS (
          SELECT 1 FROM unnest(v_roles) AS r
          WHERE lower(r) LIKE '%' || lower(p.role) || '%'
             OR lower(p.role) LIKE '%' || lower(split_part(r, ' /', 1)) || '%'
        )
      )
      AND (
        cardinality(v_estilos) = 0
        OR p.genres IS NULL
        OR cardinality(p.genres) = 0
        OR p.genres && v_estilos
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (v_dest, 'event_request', 'Nueva oferta para ti', v_cuerpo, '/dashboard?view=flashbooking');
    v_avisados := v_avisados + 1;

    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'),
      body := jsonb_build_object(
        'user_id', v_dest, 'title', 'Nueva oferta para ti',
        'body', v_cuerpo, 'url', '/dashboard?view=flashbooking')
    );
  END LOOP;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_event_request', 'Solicitud de evento nueva',
      v_cuerpo || ' — ' || v_avisados || ' profesional(es) avisados',
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;
