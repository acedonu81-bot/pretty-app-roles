-- 13 oct 2026: un DJ se apuntó a Burguerfest (19:54 UTC) y el organizador no se
-- enteró. El trigger notify_event_request_response solo dejaba una fila en la
-- campana y su push a send-push devolvió 401: send-push exige x-internal-secret
-- desde el 5 oct y este trigger nunca lo mandó. El organizador tampoco recibía
-- email (no existía) ni veía el candidato sin abrir la tarjeta de la oferta.
--
-- Ahora, cuando alguien se apunta:
--   1) campana con enlace directo a la oferta (?oferta=<id>), que la abre sola;
--   2) push con la clave interna, solo si el organizador tiene dispositivo;
--   3) email 'oferta_respuesta' (respeta baja y email_flash; send-email deduplica
--      por respuesta y limita el volumen diario).
-- Cada aviso va en su propio bloque: un fallo de pg_net o de SMTP no puede
-- impedir que la candidatura se guarde.

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
  v_rol text;
  v_admin uuid;
  v_link text;
  v_cuerpo text;
  v_email text;
  v_nombre text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
  v_secret text;
BEGIN
  BEGIN
    v_owner := NULL;
    SELECT NULLIF(trim(r.client_user_id), '')::uuid,
           COALESCE(NULLIF(trim(r.client_name), ''), 'tu evento')
      INTO v_owner, v_titulo
      FROM public.event_requests r WHERE r.id = NEW.request_id;
  EXCEPTION WHEN OTHERS THEN
    v_owner := NULL;
  END;
  v_titulo := COALESCE(v_titulo, 'tu evento');

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional')
    INTO v_pro FROM public.profiles WHERE user_id = NEW.professional_user_id
    ORDER BY is_primary DESC NULLS LAST LIMIT 1;
  v_pro := COALESCE(v_pro, 'Un profesional');

  SELECT s.role INTO v_rol FROM public.event_request_slots s WHERE s.id = NEW.slot_id;

  v_link := '/dashboard?view=flashbooking&tab=demanda&oferta=' || NEW.request_id::text;
  v_cuerpo := v_pro || ' está disponible para ' || v_titulo
    || CASE WHEN NULLIF(trim(NEW.message), '') IS NOT NULL
            THEN ': "' || left(NEW.message, 100) || '"' ELSE '' END
    || '. Entra y pulsa Elegir para abrir el chat.';

  BEGIN
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
  EXCEPTION WHEN OTHERS THEN v_secret := NULL;
  END;

  IF v_owner IS NOT NULL AND v_owner <> NEW.professional_user_id THEN
    BEGIN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_owner, 'event_response', v_pro || ' se ha apuntado a tu oferta', v_cuerpo, v_link);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_event_request_response: campana falló: %', SQLERRM;
    END;

    -- Push, solo si el organizador tiene algún dispositivo suscrito.
    BEGIN
      IF v_secret IS NOT NULL AND EXISTS (SELECT 1 FROM public.push_subscriptions s WHERE s.user_id = v_owner) THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_anon,
            'x-internal-secret', v_secret,
            'Content-Type', 'application/json'),
          body := jsonb_build_object(
            'user_id', v_owner, 'title', v_pro || ' se ha apuntado a tu oferta',
            'body', v_cuerpo, 'url', v_link, 'tag', 'respuesta-' || NEW.id));
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_event_request_response: push falló: %', SQLERRM;
    END;

    -- Email, salvo baja general o emails de Flash desactivados.
    BEGIN
      IF v_secret IS NOT NULL
         AND COALESCE((SELECT pref.email_flash FROM public.alert_preferences pref WHERE pref.user_id = v_owner), true) THEN
        SELECT u.email, COALESCE(NULLIF(trim(p.display_name), ''), 'organizador')
          INTO v_email, v_nombre
          FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
          WHERE u.id = v_owner
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
            body := jsonb_build_object('type', 'oferta_respuesta', 'data', jsonb_build_object(
              'email', v_email, 'user_id', v_owner, 'name', v_nombre,
              'request_id', NEW.request_id, 'response_id', NEW.id,
              'titulo', v_titulo, 'profesional', v_pro, 'rol', v_rol,
              'mensaje', NULLIF(trim(NEW.message), ''))));
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify_event_request_response: email falló: %', SQLERRM;
    END;
  END IF;

  BEGIN
    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        v_admin, 'admin_event_response',
        'Respuesta a una oferta: ' || v_pro,
        v_pro || ' se ha apuntado a la oferta de ' || v_titulo,
        '/dashboard?view=flashbooking'
      );
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_event_request_response: admins falló: %', SQLERRM;
  END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

-- Burguerfest: el aviso de Manuel Jesús (19:54 UTC) quedó leído y sin enlace a
-- la oferta. Se vuelve a encender y apunta a la tarjeta, solo si sigue sin elegir.
UPDATE public.notifications n
   SET link = '/dashboard?view=flashbooking&tab=demanda&oferta=' || r.request_id::text,
       is_read = false
  FROM public.event_request_responses r
  JOIN public.event_requests q ON q.id = r.request_id
 WHERE n.type = 'event_response'
   AND n.created_at = r.created_at
   AND n.user_id::text = q.client_user_id
   AND q.status = 'open'
   AND r.hired_at IS NULL
   AND r.chosen_at IS NULL;

-- Mismo fallo en el push de mensajes de chat: notify_new_message llamaba a
-- send-push sin x-internal-secret (401 desde que la función lo exige), así que
-- nadie recibía push al llegarle un mensaje. Solo se añade la clave y un bloque
-- de seguridad; el resto (toggle notif_messages, texto, enlace) no cambia.
CREATE OR REPLACE FUNCTION public.notify_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_dest uuid; v_sender_name text; v_preview text; v_secret text;
BEGIN
  IF NEW.deleted_at IS NOT NULL THEN RETURN NEW; END IF;

  SELECT CASE WHEN c.participant_a = NEW.sender_id THEN c.participant_b ELSE c.participant_a END
  INTO v_dest
  FROM public.conversations c
  WHERE c.id = NEW.conversation_id;

  IF v_dest IS NULL THEN RETURN NEW; END IF;

  SELECT COALESCE(NULLIF(trim(p.display_name), ''), 'Un usuario') INTO v_sender_name
  FROM public.profiles p WHERE p.user_id = NEW.sender_id
  ORDER BY p.is_primary DESC LIMIT 1;

  v_preview := COALESCE(NEW.content, '');
  IF length(v_preview) > 80 THEN v_preview := left(v_preview, 80) || '…'; END IF;
  IF v_preview = '' THEN v_preview := 'Te ha enviado un mensaje'; END IF;

  -- Respeta el mismo toggle que ya controla el aviso in-app (Ajustes →
  -- Notificaciones de mensajes), por defecto activado.
  IF NOT COALESCE((SELECT pref.notif_messages FROM public.alert_preferences pref WHERE pref.user_id = v_dest), true) THEN
    RETURN NEW;
  END IF;

  BEGIN
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
    IF v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
          'x-internal-secret', v_secret,
          'Content-Type', 'application/json'),
        body := jsonb_build_object(
          'user_id', v_dest,
          'title', v_sender_name || ' te ha escrito',
          'body', v_preview,
          'url', '/dashboard?view=messages')
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_new_message: push falló: %', SQLERRM;
  END;

  RETURN NEW;
END;
$function$;
