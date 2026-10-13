-- 13 oct 2026: auditoria de avisos de Flash Booking. Dos huecos:
--  1) Cuando el organizador ELIGE a un profesional, el aviso (campana, push y
--     email) llevaba a Flash Booking en general, no a la oferta, y el texto no
--     decia que hacer. Ahora abre la oferta y dice: pulsa Aceptar el bolo.
--  2) Cuando el profesional CONFIRMA, el organizador solo recibia campana y push
--     (la mayoria no tiene push) y el aviso no llevaba a ningun sitio. Ahora
--     tambien recibe email y el enlace abre su oferta.
-- Cada aviso va en su bloque: un fallo de pg_net o SMTP no impide guardar nada.

CREATE OR REPLACE FUNCTION public.notify_preseleccion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_email text; v_email_pref boolean; v_link text; v_secret text;
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

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.avisar_organizador_aceptacion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_cliente uuid; v_titulo text; v_pro text; v_link text; v_secret text;
  v_email text; v_nombre text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  IF NEW.hired_at IS NULL OR OLD.hired_at IS NOT NULL THEN RETURN NEW; END IF;
  BEGIN
    SELECT client_user_id::uuid, COALESCE(NULLIF(trim(client_name), ''), 'tu oferta')
      INTO v_cliente, v_titulo FROM public.event_requests WHERE id = NEW.request_id;
    IF v_cliente IS NULL OR v_cliente = NEW.professional_user_id THEN RETURN NEW; END IF;
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'El profesional') INTO v_pro
      FROM public.profiles WHERE user_id = NEW.professional_user_id
      ORDER BY is_primary DESC NULLS LAST LIMIT 1;
    v_pro := COALESCE(v_pro, 'El profesional');
    v_link := '/dashboard?view=flashbooking&tab=demanda&oferta=' || NEW.request_id::text;

    BEGIN
      SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
    EXCEPTION WHEN OTHERS THEN v_secret := NULL;
    END;

    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (v_cliente, 'oferta_aceptada', v_pro || ' ha confirmado el bolo',
            'La plaza de ' || v_titulo || ' está cubierta y el chat abierto. Entra para escribirle y hacer el contrato.',
            v_link);

    BEGIN
      IF v_secret IS NOT NULL THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_anon,
            'x-internal-secret', v_secret,
            'Content-Type', 'application/json'),
          body := jsonb_build_object('user_id', v_cliente, 'title', v_pro || ' ha confirmado el bolo',
            'body', 'La plaza de ' || v_titulo || ' está cubierta. Abre la oferta para escribirle.',
            'url', v_link, 'tag', 'confirmado-' || NEW.id));
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'avisar_organizador_aceptacion: push falló: %', SQLERRM;
    END;

    BEGIN
      IF v_secret IS NOT NULL
         AND COALESCE((SELECT pref.email_flash FROM public.alert_preferences pref WHERE pref.user_id = v_cliente), true) THEN
        SELECT u.email, COALESCE(NULLIF(trim(p.display_name), ''), 'organizador')
          INTO v_email, v_nombre
          FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
          WHERE u.id = v_cliente
            AND COALESCE(p.email_opt_out, false) = false
            AND u.email NOT LIKE '%@xpeak.es'
          ORDER BY p.is_primary DESC NULLS LAST LIMIT 1;
        IF v_email IS NOT NULL THEN
          PERFORM net.http_post(
            url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
            headers := jsonb_build_object(
              'Authorization', 'Bearer ' || v_anon,
              'x-internal-secret', v_secret,
              'Content-Type', 'application/json'),
            body := jsonb_build_object('type', 'oferta_aceptada', 'data', jsonb_build_object(
              'email', v_email, 'user_id', v_cliente, 'name', v_nombre,
              'request_id', NEW.request_id, 'response_id', NEW.id,
              'titulo', v_titulo, 'profesional', v_pro)));
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'avisar_organizador_aceptacion: email falló: %', SQLERRM;
    END;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_organizador_aceptacion: %', SQLERRM;
  END;
  RETURN NEW;
END $function$;
