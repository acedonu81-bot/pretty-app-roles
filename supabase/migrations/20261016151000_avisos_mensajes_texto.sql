-- Textos de los avisos de mensaje (campana y push), 16 oct 2026.
-- YA APLICADA a mano por el usuario en el SQL Editor el 16 oct 2026; este
-- archivo deja constancia en el repo de cómo están las funciones en producción.
-- Antes, un contrato propuesto en el chat salía en la campana y el push como
-- "[[acuerdo:propuesto|XPEAK-...]]" y un vídeo como "Te ha enviado una imagen".
-- Requiere las columnas photo_url / video_url (20261016150000_chat_adjuntos.sql).

CREATE OR REPLACE FUNCTION public.create_message_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_recipient uuid;
  v_sender_name text;
  v_body text;
BEGIN
  IF NEW.deleted_at IS NOT NULL THEN RETURN NEW; END IF;

  SELECT CASE WHEN c.participant_a = NEW.sender_id THEN c.participant_b ELSE c.participant_a END
    INTO v_recipient
  FROM public.conversations c
  WHERE c.id = NEW.conversation_id
    AND NEW.sender_id IN (c.participant_a, c.participant_b);

  IF v_recipient IS NULL OR NOT COALESCE((
    SELECT ap.notif_messages FROM public.alert_preferences ap WHERE ap.user_id = v_recipient
  ), true) THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(p.display_name), ''), 'Un usuario') INTO v_sender_name
  FROM public.profiles p
  WHERE p.user_id = NEW.sender_id
  ORDER BY p.is_primary DESC
  LIMIT 1;

  v_body := CASE
    WHEN NEW.content LIKE '[[acuerdo:propuesto|%' THEN 'Te ha enviado una propuesta de contrato'
    WHEN NEW.content LIKE '[[acuerdo:aceptado|%' THEN 'Ha aceptado el contrato'
    WHEN NULLIF(NEW.content, '') IS NULL AND NEW.video_url IS NOT NULL THEN 'Te ha enviado un vídeo'
    WHEN NULLIF(NEW.content, '') IS NULL THEN 'Te ha enviado una foto'
    ELSE NEW.content
  END;
  IF length(v_body) > 80 THEN v_body := left(v_body, 80) || '…'; END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (v_recipient, 'message', COALESCE(v_sender_name, 'Un usuario') || ' te ha escrito', v_body,
    '/dashboard?view=messages');

  RETURN NEW;
END;
$function$;

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

  v_preview := CASE
    WHEN NEW.content LIKE '[[acuerdo:propuesto|%' THEN 'Te ha enviado una propuesta de contrato'
    WHEN NEW.content LIKE '[[acuerdo:aceptado|%' THEN 'Ha aceptado el contrato'
    WHEN NULLIF(NEW.content, '') IS NULL AND NEW.video_url IS NOT NULL THEN 'Te ha enviado un vídeo'
    WHEN NULLIF(NEW.content, '') IS NULL AND NEW.photo_url IS NOT NULL THEN 'Te ha enviado una foto'
    ELSE COALESCE(NEW.content, '')
  END;
  IF length(v_preview) > 80 THEN v_preview := left(v_preview, 80) || '…'; END IF;
  IF v_preview = '' THEN v_preview := 'Te ha enviado un mensaje'; END IF;

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
