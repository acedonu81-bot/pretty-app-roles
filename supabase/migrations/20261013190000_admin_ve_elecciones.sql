-- 13 oct 2026: el admin no veia que el organizador de Burguerfest habia elegido a
-- Manuel. Solo recibia "se apunto" (campana) y, si el profesional confirma,
-- "contratacion". Dos cambios: campana al admin cuando el organizador elige, y
-- fila "Elegido" en la Actividad del panel admin.

CREATE OR REPLACE FUNCTION public.notify_preseleccion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_email text; v_email_pref boolean; v_link text; v_secret text; v_pro text; v_admin uuid;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  IF NEW.chosen_at IS NULL OR OLD.chosen_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(client_name), ''), 'Un organizador')
  INTO v_titulo FROM public.event_requests WHERE id = NEW.request_id;
  v_titulo := COALESCE(v_titulo, 'Un organizador');
  v_link := '/dashboard?view=flashbooking&tab=demanda&oferta=' || NEW.request_id::text;

  BEGIN
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
  EXCEPTION WHEN OTHERS THEN v_secret := NULL;
  END;

  BEGIN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      NEW.professional_user_id, 'preseleccionado',
      v_titulo || ' te ha elegido',
      'Entra y pulsa Aceptar el bolo para confirmar tu plaza. Si no respondes, puede elegir a otro.',
      v_link
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: campana falló: %', SQLERRM;
  END;

  BEGIN
    IF v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || v_anon,
          'x-internal-secret', v_secret,
          'Content-Type', 'application/json'),
        body := jsonb_build_object(
          'user_id', NEW.professional_user_id, 'title', v_titulo || ' te ha elegido',
          'body', 'Confirma tu plaza para cerrar el bolo.', 'url', v_link,
          'tag', 'elegido-' || NEW.id)
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: push falló: %', SQLERRM;
  END;

  BEGIN
    SELECT COALESCE(pref.email_flash, true) INTO v_email_pref
    FROM public.alert_preferences pref WHERE pref.user_id = NEW.professional_user_id;
    v_email_pref := COALESCE(v_email_pref, true);

    IF v_email_pref AND v_secret IS NOT NULL THEN
      SELECT u.email INTO v_email
      FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
      WHERE u.id = NEW.professional_user_id
        AND COALESCE(p.email_opt_out, false) = false
        AND u.email NOT LIKE '%@xpeak.es'
      LIMIT 1;

      IF v_email IS NOT NULL THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_anon,
            'x-internal-secret', v_secret,
            'Content-Type', 'application/json'),
          body := jsonb_build_object('type', 'preseleccionado', 'data', jsonb_build_object(
            'email', v_email, 'user_id', NEW.professional_user_id,
            'titulo', v_titulo, 'request_id', NEW.request_id))
        );
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: email falló: %', SQLERRM;
  END;

  -- El admin se entera de que el organizador ha elegido (antes solo veia
  -- "se apunto" y, al final, "contratado"; el paso intermedio no dejaba rastro).
  BEGIN
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional') INTO v_pro
      FROM public.profiles WHERE user_id = NEW.professional_user_id
      ORDER BY is_primary DESC NULLS LAST LIMIT 1;
    v_pro := COALESCE(v_pro, 'Un profesional');
    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_admin, 'admin_event_chosen',
              v_titulo || ' ha elegido a ' || v_pro,
              v_pro || ' ha sido elegido para ' || v_titulo || '. Falta que confirme.',
              '/dashboard?view=admin');
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: aviso a admins falló: %', SQLERRM;
  END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

-- Actividad del admin: fila nueva "Elegido" (el organizador ha elegido y falta que
-- el profesional confirme). Se añade a la vista EXISTENTE sin reescribirla a mano:
-- se lee su definición actual, se le añade la rama y se recrea. Si la vista ya
-- tiene la rama, no hace nada; si ha cambiado de forma, se niega a tocarla.
DO $vista$
DECLARE
  v text;
  marcador text := 'WHERE er2.hired_at IS NOT NULL) act';
  rama text := $rama$WHERE er2.hired_at IS NOT NULL
        UNION ALL
         SELECT 'eleccion_oferta'::text AS tipo,
            er3.chosen_at AS cuando,
            COALESCE(NULLIF(TRIM(BOTH FROM pr3.display_name), ''::text), 'Profesional'::text) AS quien,
            ('ELEGIDO por '::text || COALESCE(NULLIF(TRIM(BOTH FROM e4.client_name), ''::text), 'un organizador'::text))
              || CASE WHEN er3.hired_at IS NULL THEN ', falta que confirme'::text ELSE ''::text END AS detalle,
            COALESCE(NULLIF(TRIM(BOTH FROM e4.city), ''::text), '—'::text) AS lugar,
            NULL::text AS contacto,
            er3.id::text AS ref,
            er3.hired_at IS NULL AS pendiente,
            NULL::text AS que_pide,
            NULLIF(TRIM(BOTH FROM e4.event_date), ''::text) AS cuando_evento,
            er3.professional_user_id AS user_id
           FROM event_request_responses er3
             JOIN event_requests e4 ON e4.id = er3.request_id
             LEFT JOIN profiles pr3 ON pr3.user_id = er3.professional_user_id
          WHERE er3.chosen_at IS NOT NULL) act$rama$;
BEGIN
  v := pg_get_viewdef('public.admin_activity'::regclass, true);
  IF position('eleccion_oferta' in v) > 0 THEN
    RAISE NOTICE 'admin_activity ya tiene la rama eleccion_oferta';
    RETURN;
  END IF;
  IF position(marcador in v) = 0 THEN
    RAISE EXCEPTION 'admin_activity ha cambiado de forma: no se modifica';
  END IF;
  EXECUTE 'CREATE OR REPLACE VIEW public.admin_activity AS '
    || rtrim(replace(v, marcador, rama), E';\n ');
END
$vista$;
