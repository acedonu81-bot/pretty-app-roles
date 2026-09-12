-- Un mensaje nuevo solo avisaba por email + notificación in-app, ambas
-- disparadas desde el CLIENTE (MessagesView.tsx, fire-and-forget). Sin push
-- nativo: un usuario de la app iOS con la app cerrada no se enteraba de un
-- mensaje nuevo hasta abrir el correo — mismo patrón de fallo silencioso que
-- ya pasó con Flash Booking (caso Ramón, 22 ago 2026). Al vivir solo en el
-- cliente, además, cualquier inserción de mensaje que no pasara por
-- MessagesView.tsx (futura función admin, import, webhook) no generaba
-- ningún aviso en absoluto.
--
-- Se mueve a un trigger AFTER INSERT en public.messages, mismo patrón que
-- notify_new_flash_booking / notify_new_event_request: cubre TODOS los
-- caminos de entrada, no solo el del cliente web, y respeta
-- alert_preferences.notif_messages (ya existía como toggle de "avisos de
-- mensajes" en Ajustes, hasta hoy solo controlaba in-app).
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_dest uuid; v_sender_name text; v_preview text;
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

  PERFORM net.http_post(
    url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'user_id', v_dest,
      'title', v_sender_name || ' te ha escrito',
      'body', v_preview,
      'url', '/dashboard?view=messages')
  );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_notify_new_message ON public.messages;
CREATE TRIGGER trg_notify_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message();
