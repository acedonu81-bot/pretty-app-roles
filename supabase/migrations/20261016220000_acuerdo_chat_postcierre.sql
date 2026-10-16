-- Después de cerrar un acuerdo en el chat (16 oct 2026), estilo Wallapop:
-- 1) el organizador también tiene el evento en su calendario;
-- 2) la otra parte recibe aviso (campana y móvil) al cerrarse;
-- 3) cualquiera de las dos partes puede cancelar el acuerdo (cancelar_acuerdo_chat);
-- 4) los avisos de mensaje muestran "Ha cancelado el acuerdo".
-- Requiere 20261016150000, 20261016151000 y 20261016200000.

CREATE OR REPLACE FUNCTION public.cerrar_acuerdo_chat(p_message_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  m public.messages%ROWTYPE;
  c public.conversations%ROWTYPE;
  v_org uuid; v_pro uuid;
  v_rol_a text; v_rol_b text; v_pro_rol text;
  v_org_nombre text; v_pro_nombre text;
  v_fecha date; v_ciudad text; v_precio numeric; v_evento text;
  v_resumen text; v_par text; v_k text; v_v text; v_vistas text[] := '{}';
  x record; v_r text; v_cond text := ''; v_pend uuid[] := '{}'; v_cierra boolean := false;
  v_id uuid; v_otro uuid; v_quien text; v_titulo text; v_cuerpo text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'sin sesión'; END IF;

  SELECT * INTO m FROM public.messages WHERE id = p_message_id AND deleted_at IS NULL;
  IF NOT FOUND OR m.content NOT LIKE '[[acuerdo:aceptado|ACUERDO|%' THEN
    RAISE EXCEPTION 'mensaje de acuerdo no válido';
  END IF;

  SELECT * INTO c FROM public.conversations WHERE id = m.conversation_id;
  IF v_uid NOT IN (c.participant_a, c.participant_b) THEN RAISE EXCEPTION 'no autorizado'; END IF;

  -- Ya registrado: devolver el mismo.
  SELECT id INTO v_id FROM public.flash_bookings WHERE chat_message_id = m.id;
  IF FOUND THEN RETURN v_id; END IF;

  -- El mensaje tiene que CERRAR un acuerdo abierto (revisión de seguridad, 16 oct
  -- 2026): antes bastaba con que la otra parte hubiera aceptado alguna vez esas
  -- condiciones, así que repitiendo ACEPTO se podían crear reservas nuevas sin su
  -- consentimiento. Se recorre el historial igual que estadoAcepto() en el chat:
  -- unas condiciones distintas reinician el acuerdo, y se cierra cuando lo
  -- aceptan los dos con las mismas.
  FOR x IN
    SELECT id, sender_id, content FROM public.messages
    WHERE conversation_id = m.conversation_id AND deleted_at IS NULL
      AND content LIKE '[[acuerdo:aceptado|ACUERDO%' AND created_at <= m.created_at
    ORDER BY created_at, id
  LOOP
    v_r := COALESCE(substring(x.content from '^\[\[acuerdo:aceptado\|ACUERDO\|(.*)\]\]$'), '');
    IF COALESCE(array_length(v_pend, 1), 0) > 0 AND v_r IS DISTINCT FROM v_cond THEN v_pend := '{}'; END IF;
    IF COALESCE(array_length(v_pend, 1), 0) = 0 THEN v_cond := v_r; END IF;
    IF NOT (x.sender_id = ANY (v_pend)) THEN v_pend := v_pend || x.sender_id; END IF;
    IF array_length(v_pend, 1) >= 2 THEN
      v_cierra := (x.id = m.id); v_pend := '{}'; v_cond := '';
    ELSE
      v_cierra := false;
    END IF;
    EXIT WHEN x.id = m.id;
  END LOOP;
  IF NOT v_cierra THEN RAISE EXCEPTION 'este mensaje no cierra un acuerdo'; END IF;

  SELECT role INTO v_rol_a FROM public.profiles WHERE user_id = c.participant_a ORDER BY is_primary DESC LIMIT 1;
  SELECT role INTO v_rol_b FROM public.profiles WHERE user_id = c.participant_b ORDER BY is_primary DESC LIMIT 1;
  IF (v_rol_a = 'empresario') IS NOT DISTINCT FROM (v_rol_b = 'empresario') THEN
    RAISE EXCEPTION 'solo entre organizador y profesional';
  END IF;
  v_org := CASE WHEN v_rol_a = 'empresario' THEN c.participant_a ELSE c.participant_b END;
  v_pro := CASE WHEN v_org = c.participant_a THEN c.participant_b ELSE c.participant_a END;

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Organizador') INTO v_org_nombre
    FROM public.profiles WHERE user_id = v_org ORDER BY is_primary DESC LIMIT 1;
  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Profesional'), role INTO v_pro_nombre, v_pro_rol
    FROM public.profiles WHERE user_id = v_pro ORDER BY is_primary DESC LIMIT 1;

  -- Condiciones: [[acuerdo:aceptado|ACUERDO|f=12/12/2026;c=Madrid;p=500;e=Boda]]
  -- Lectura estricta campo a campo (revisión de seguridad, 16 oct 2026): con
  -- búsquedas sueltas, un evento "xc=Barcelona" escrito a mano podía hacer que la
  -- reserva guardara otra ciudad de la que se ve en el chat. Solo se admiten
  -- f, c, p y e, sin repetir, con formato fijo; si no, se rechaza.
  v_resumen := substring(m.content from '^\[\[acuerdo:aceptado\|ACUERDO\|(.*)\]\]$');
  IF v_resumen IS NULL THEN RAISE EXCEPTION 'condiciones no válidas'; END IF;
  FOREACH v_par IN ARRAY string_to_array(v_resumen, ';') LOOP
    v_k := split_part(v_par, '=', 1);
    v_v := trim(substring(v_par from length(v_k) + 2));
    IF position('=' in v_par) = 0 OR v_k = ANY (v_vistas) THEN RAISE EXCEPTION 'condiciones no válidas'; END IF;
    v_vistas := v_vistas || v_k;
    CASE v_k
      WHEN 'f' THEN
        IF v_v !~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' THEN RAISE EXCEPTION 'fecha no válida'; END IF;
        v_fecha := to_date(v_v, 'DD/MM/YYYY');
      WHEN 'c' THEN
        IF v_v ~ '[=\]|]' OR length(v_v) NOT BETWEEN 2 AND 60 THEN RAISE EXCEPTION 'ciudad no válida'; END IF;
        v_ciudad := v_v;
      WHEN 'p' THEN
        IF v_v !~ '^[0-9]{1,7}([.,][0-9]{1,2})?$' THEN RAISE EXCEPTION 'precio no válido'; END IF;
        v_precio := replace(v_v, ',', '.')::numeric;
      WHEN 'e' THEN
        IF v_v ~ '[=\]|]' OR length(v_v) > 60 THEN RAISE EXCEPTION 'evento no válido'; END IF;
        v_evento := NULLIF(v_v, '');
      ELSE RAISE EXCEPTION 'condiciones no válidas';
    END CASE;
  END LOOP;
  IF v_fecha IS NULL OR v_ciudad IS NULL OR v_precio IS NULL OR v_precio <= 0 THEN
    RAISE EXCEPTION 'faltan condiciones';
  END IF;

  INSERT INTO public.flash_bookings (
    professional_name, professional_role, requester_name, requester_contact,
    event_date, event_location, event_description, status,
    created_by, professional_user_id, agreed_price, source, chat_message_id
  ) VALUES (
    COALESCE(v_pro_nombre, 'Profesional'), v_pro_rol, COALESCE(v_org_nombre, 'Organizador'), 'chat:' || c.id::text,
    to_char(v_fecha, 'YYYY-MM-DD'), v_ciudad, v_evento, 'confirmed',
    v_org, v_pro, v_precio, 'chat', m.id
  )
  ON CONFLICT (chat_message_id) WHERE chat_message_id IS NOT NULL DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.flash_bookings WHERE chat_message_id = m.id;
    RETURN v_id;
  END IF;

  -- Calendario de los dos (el del organizador es nuevo): los títulos son los que
  -- usa cancelar_acuerdo_chat para quitarlos si se cancela.
  INSERT INTO public.calendar_events (user_id, title, event_date, location, notes)
  VALUES (v_pro, 'Trabajo: ' || COALESCE(v_org_nombre, 'acuerdo del chat'), v_fecha, v_ciudad, v_evento),
         (v_org, 'Evento: ' || COALESCE(v_pro_nombre, 'profesional'), v_fecha, v_ciudad, v_evento);

  -- Aviso a la otra parte (campana y móvil), como en Wallapop: quien aceptó
  -- primero se entera de que el acuerdo ya está cerrado aunque no tenga el chat abierto.
  -- Se avisa a quien aceptó PRIMERO (el que no envió el mensaje que cerró), con
  -- independencia de cuál de los dos clientes llame antes a esta función.
  v_otro := CASE WHEN m.sender_id = v_org THEN v_pro ELSE v_org END;
  v_quien := CASE WHEN m.sender_id = v_org THEN v_org_nombre ELSE v_pro_nombre END;
  v_titulo := 'Acuerdo cerrado con ' || COALESCE(v_quien, 'tu contacto');
  v_cuerpo := concat_ws(' · ', v_evento, to_char(v_fecha, 'DD/MM/YYYY'), v_ciudad, v_precio::text || ' €');
  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (v_otro, 'acuerdo_cerrado', v_titulo, v_cuerpo, '/dashboard?view=messages');
  BEGIN
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', v_otro, 'title', v_titulo, 'body', v_cuerpo, 'url', '/dashboard?view=messages'));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'cerrar_acuerdo_chat push: %', SQLERRM;
  END;

  RETURN v_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.cerrar_acuerdo_chat(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cerrar_acuerdo_chat(uuid) TO authenticated;

-- Cancelar un acuerdo cerrado en el chat. Lo puede hacer cualquiera de las dos
-- partes mientras la reserva siga confirmada: pasa a 'cancelled', se quitan los
-- dos eventos del calendario y se deja un mensaje en la conversación (la otra
-- parte recibe además el aviso normal de mensaje nuevo).
CREATE OR REPLACE FUNCTION public.cancelar_acuerdo_chat(p_booking_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  b public.flash_bookings%ROWTYPE;
  v_conv uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'sin sesión'; END IF;

  -- Solo reservas creadas por el cierre de un acuerdo del chat. chat_message_id
  -- no es escribible por los clientes (solo tienen SELECT en esa columna), así
  -- que una reserva normal no puede hacerse pasar por una del chat (revisión de
  -- seguridad, 16 oct 2026).
  SELECT * INTO b FROM public.flash_bookings WHERE id = p_booking_id AND source = 'chat' AND chat_message_id IS NOT NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'acuerdo no encontrado'; END IF;
  IF v_uid NOT IN (b.created_by, b.professional_user_id) THEN RAISE EXCEPTION 'no autorizado'; END IF;
  IF b.status IS DISTINCT FROM 'confirmed' THEN RAISE EXCEPTION 'el acuerdo ya no está activo'; END IF;

  -- La conversación sale del mensaje que cerró el acuerdo, no de un campo de
  -- texto de la reserva, y quien cancela tiene que ser parte de ella.
  SELECT conversation_id INTO v_conv FROM public.messages WHERE id = b.chat_message_id;
  IF v_conv IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.conversations WHERE id = v_conv AND v_uid IN (participant_a, participant_b)
  ) THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.flash_bookings SET status = 'cancelled' WHERE id = b.id;

  DELETE FROM public.calendar_events
  WHERE event_date = b.event_date::date
    AND location IS NOT DISTINCT FROM b.event_location
    AND ( (user_id = b.professional_user_id AND title = 'Trabajo: ' || b.requester_name)
       OR (user_id = b.created_by AND title = 'Evento: ' || b.professional_name) );

  INSERT INTO public.messages (conversation_id, sender_id, content)
  VALUES (v_conv, v_uid, '[[acuerdo:cancelado|ACUERDO|' || b.id::text || ']]');
  UPDATE public.conversations SET last_message_at = now() WHERE id = v_conv;

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.cancelar_acuerdo_chat(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancelar_acuerdo_chat(uuid) TO authenticated;

-- Avisos de mensaje (campana y push) con los textos del acuerdo.
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
    WHEN NEW.content LIKE '[[acuerdo:aceptado|ACUERDO%' THEN 'Ha aceptado el acuerdo'
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
    WHEN NEW.content LIKE '[[acuerdo:aceptado|ACUERDO%' THEN 'Ha aceptado el acuerdo'
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
