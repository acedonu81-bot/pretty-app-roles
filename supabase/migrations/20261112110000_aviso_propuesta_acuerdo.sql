-- 12 nov 2026: el primer "Acepto" del chat es una propuesta, pero la campana y
-- el push decían "Ha aceptado el acuerdo" (el cliente creía que ya estaba
-- cerrado). Se reconstruye la ronda igual que estadoAcepto (lib/acuerdoChat.ts)
-- para saber si el mensaje propone o cierra.
CREATE OR REPLACE FUNCTION public.texto_aviso_acuerdo(p_msg uuid)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_conv uuid;
  pend uuid[] := '{}';
  cond text := '';
  res text;
  v_cierra boolean := false;
  v_res text := '';
  v_fecha text;
BEGIN
  SELECT conversation_id INTO v_conv FROM public.messages WHERE id = p_msg;
  FOR r IN
    SELECT id, sender_id, trim(content) AS c FROM public.messages
     WHERE conversation_id = v_conv AND deleted_at IS NULL AND content LIKE '[[acuerdo:aceptado|ACUERDO%'
     ORDER BY created_at, id
  LOOP
    IF r.c !~ '^\[\[acuerdo:aceptado\|ACUERDO(\|[^\]]{0,200})?\]\]$' THEN CONTINUE; END IF;
    res := COALESCE(substring(r.c FROM '^\[\[acuerdo:aceptado\|ACUERDO\|([^\]]{0,200})\]\]$'), '');
    IF cardinality(pend) > 0 AND res <> cond THEN pend := '{}'; END IF;
    IF cardinality(pend) = 0 THEN cond := res; END IF;
    IF NOT (r.sender_id = ANY (pend)) THEN pend := pend || r.sender_id; END IF;
    IF r.id = p_msg THEN v_cierra := cardinality(pend) >= 2; v_res := res; EXIT; END IF;
    IF cardinality(pend) >= 2 THEN pend := '{}'; cond := ''; END IF;
  END LOOP;
  IF v_cierra THEN RETURN 'Ha aceptado tu propuesta. Acuerdo cerrado'; END IF;
  v_fecha := substring(v_res FROM 'f=([0-9]{1,2}/[0-9]{1,2}/[0-9]{4})');
  RETURN CASE WHEN v_fecha IS NOT NULL THEN 'Te propone un acuerdo para el ' || v_fecha ELSE 'Te propone un acuerdo' END;
END;
$function$;
REVOKE ALL ON FUNCTION public.texto_aviso_acuerdo(uuid) FROM PUBLIC, anon, authenticated;

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
    WHEN NEW.content LIKE '[[acuerdo:cancelado|%' THEN 'Ha cancelado el acuerdo'
    WHEN NEW.content LIKE '[[acuerdo:aceptado|ACUERDO%' THEN public.texto_aviso_acuerdo(NEW.id)
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
    WHEN NEW.content LIKE '[[acuerdo:cancelado|%' THEN 'Ha cancelado el acuerdo'
    WHEN NEW.content LIKE '[[acuerdo:aceptado|ACUERDO%' THEN public.texto_aviso_acuerdo(NEW.id)
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
