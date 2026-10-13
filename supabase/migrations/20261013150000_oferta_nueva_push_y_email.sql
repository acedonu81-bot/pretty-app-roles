-- 13 oct 2026: la oferta de Burguerfest (DJ en Seseña) avisó a 43 profesionales
-- solo por campana. Dos fallos:
--  1) La migración del 30 sep (notify_event_request_mapeo_roles) reescribió
--     notify_new_event_request a partir de una versión ANTERIOR al push del
--     11 sep y se perdió: el push, notif_flash, el filtro por estilos y la
--     exclusión del propio organizador. Desde el 30 sep ninguna oferta nueva
--     manda push.
--  2) Nunca hubo email de oferta nueva. El email es el único canal que llega a
--     todos (solo 4 de 104 usuarios tienen push).
-- Esta versión conserva el emparejamiento por roles del 30 sep, restaura lo
-- perdido y añade el email (plantilla oferta_nueva de send-email, que respeta
-- la baja, dedupe por oferta y tope de 5 al día por dirección).
-- Cada aviso va en su propio bloque: un fallo de pg_net o de un destinatario
-- no puede impedir que se publique la oferta.

CREATE OR REPLACE FUNCTION public.notify_new_event_request()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_cuerpo text;
  v_dest uuid;
  v_admin uuid;
  v_avisados int := 0;
  v_roles text[];
  v_estilos text[];
  v_cliente uuid;
  v_fechas text[];
  v_email text;
  v_nombre text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
  v_secret text;
BEGIN
  v_roles := COALESCE(NEW.roles_needed, ARRAY[]::text[]);
  v_estilos := COALESCE(NEW.estilos, ARRAY[]::text[]);
  v_fechas := COALESCE(NEW.event_dates::text[], ARRAY[]::text[]);
  IF cardinality(v_fechas) = 0 AND NULLIF(trim(NEW.event_date), '') IS NOT NULL THEN
    v_fechas := ARRAY[trim(NEW.event_date)];
  END IF;

  BEGIN
    v_cliente := NULLIF(trim(NEW.client_user_id), '')::uuid;
  EXCEPTION WHEN OTHERS THEN v_cliente := NULL;
  END;

  BEGIN
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
  EXCEPTION WHEN OTHERS THEN v_secret := NULL;
  END;

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.client_name), ''), 'Un organizador')
    || ' busca ' || COALESCE(NULLIF(array_to_string(v_roles, ', '), ''), 'profesionales')
    || CASE WHEN NULLIF(trim(NEW.city), '') IS NOT NULL
            THEN ' en ' || NEW.city ELSE '' END
    || CASE WHEN NEW.budget_max IS NOT NULL
            THEN ' · hasta ' || NEW.budget_max || '€' ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.description), '') IS NOT NULL
            THEN '. ' || NEW.description ELSE '' END
  );

  FOR v_dest IN
    SELECT DISTINCT p.user_id FROM public.profiles p
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
          WHERE
            CASE WHEN public.flash_rol_ui_a_roles(r) IS NOT NULL THEN
              (ARRAY[p.role] || COALESCE(p.roles, ARRAY[]::text[])) && public.flash_rol_ui_a_roles(r)
            ELSE
              lower(r) LIKE '%' || lower(p.role) || '%'
              OR lower(p.role) LIKE '%' || lower(split_part(r, ' /', 1)) || '%'
            END
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

    -- Push, solo si el profesional tiene algún dispositivo suscrito.
    BEGIN
      IF EXISTS (SELECT 1 FROM public.push_subscriptions s WHERE s.user_id = v_dest) THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_anon,
            'x-internal-secret', v_secret,
            'Content-Type', 'application/json'),
          body := jsonb_build_object(
            'user_id', v_dest, 'title', 'Nueva oferta para ti',
            'body', v_cuerpo, 'url', '/dashboard?view=flashbooking',
            'tag', 'oferta-' || NEW.id));
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_new_event_request: push a % falló: %', v_dest, SQLERRM;
    END;

    -- Email, salvo que el profesional haya desactivado los emails de Flash.
    -- send-email aplica además la baja general y el tope diario.
    BEGIN
      IF COALESCE((SELECT pref.email_flash FROM public.alert_preferences pref WHERE pref.user_id = v_dest), true) THEN
        SELECT u.email INTO v_email FROM auth.users u WHERE u.id = v_dest;
        SELECT COALESCE(NULLIF(trim(p.display_name), ''), 'profesional') INTO v_nombre
          FROM public.profiles p WHERE p.user_id = v_dest ORDER BY p.is_primary DESC NULLS LAST LIMIT 1;
        IF v_email IS NOT NULL AND v_secret IS NOT NULL THEN
          PERFORM net.http_post(
            url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
            headers := jsonb_build_object(
              'Authorization', 'Bearer ' || v_anon,
              'x-internal-secret', v_secret,
              'Content-Type', 'application/json'),
            body := jsonb_build_object('type', 'oferta_nueva', 'data', jsonb_build_object(
              'name', v_nombre, 'email', v_email, 'user_id', v_dest, 'request_id', NEW.id,
              'client_name', NULLIF(trim(NEW.client_name), ''),
              'roles', NULLIF(array_to_string(v_roles, ', '), ''),
              'event_type', NULLIF(trim(NEW.event_type), ''),
              'city', NULLIF(trim(NEW.city), ''),
              'fechas', to_jsonb(v_fechas),
              'budget_min', NEW.budget_min, 'budget_max', NEW.budget_max)));
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_new_event_request: email a % falló: %', v_dest, SQLERRM;
    END;
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
