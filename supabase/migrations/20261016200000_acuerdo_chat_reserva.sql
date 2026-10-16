-- Acuerdo cerrado en el chat → reserva confirmada (16 oct 2026).
-- Cuando organizador y profesional pulsan ACEPTO con las mismas condiciones,
-- el chat llama a cerrar_acuerdo_chat(): crea la reserva en flash_bookings
-- (historial del organizador, métricas, reseña después del evento) y el
-- trabajo en el calendario del profesional. Idempotente por chat_message_id.

ALTER TABLE public.flash_bookings ADD COLUMN IF NOT EXISTS chat_message_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS flash_bookings_chat_message_id_key
  ON public.flash_bookings (chat_message_id) WHERE chat_message_id IS NOT NULL;
-- flash_bookings tiene permisos por columna: sin esto el SELECT * de la web fallaría.
GRANT SELECT (chat_message_id) ON public.flash_bookings TO authenticated;

-- Los avisos de "X quiere contratarte / Nueva solicitud Flash Booking" no
-- aplican a un acuerdo que ya está cerrado: se saltan para source = 'chat'.
DROP TRIGGER IF EXISTS notify_new_flash_booking_trigger ON public.flash_bookings;
CREATE TRIGGER notify_new_flash_booking_trigger AFTER INSERT ON public.flash_bookings
  FOR EACH ROW WHEN (NEW.source IS DISTINCT FROM 'chat') EXECUTE FUNCTION public.notify_new_flash_booking();

DROP TRIGGER IF EXISTS trg_push_nueva_reserva_flash ON public.flash_bookings;
CREATE TRIGGER trg_push_nueva_reserva_flash AFTER INSERT ON public.flash_bookings
  FOR EACH ROW WHEN (NEW.source IS DISTINCT FROM 'chat') EXECUTE FUNCTION public.push_nueva_reserva_flash();

DROP TRIGGER IF EXISTS trg_flash_booking_reply_notification ON public.flash_bookings;
CREATE TRIGGER trg_flash_booking_reply_notification AFTER INSERT ON public.flash_bookings
  FOR EACH ROW WHEN (NEW.source IS DISTINCT FROM 'chat') EXECUTE FUNCTION public.notify_flash_booking_reply_message();

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
  v_otro uuid; v_org uuid; v_pro uuid;
  v_rol_a text; v_rol_b text; v_pro_rol text;
  v_org_nombre text; v_pro_nombre text;
  v_fecha date; v_ciudad text; v_precio numeric; v_evento text;
  v_id uuid;
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

  -- La otra parte tiene que haber aceptado antes exactamente las mismas condiciones.
  v_otro := CASE WHEN m.sender_id = c.participant_a THEN c.participant_b ELSE c.participant_a END;
  IF NOT EXISTS (
    SELECT 1 FROM public.messages x
    WHERE x.conversation_id = m.conversation_id AND x.sender_id = v_otro
      AND x.content = m.content AND x.created_at < m.created_at AND x.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'falta que acepte la otra parte';
  END IF;

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
  BEGIN
    v_fecha := to_date(substring(m.content from 'f=([0-9]{1,2}/[0-9]{1,2}/[0-9]{4})'), 'DD/MM/YYYY');
  EXCEPTION WHEN OTHERS THEN v_fecha := NULL;
  END;
  v_ciudad := NULLIF(trim(substring(m.content from 'c=([^;\]]*)')), '');
  v_evento := NULLIF(trim(substring(m.content from 'e=([^;\]]*)')), '');
  BEGIN
    v_precio := replace(substring(m.content from 'p=([0-9]+(?:[.,][0-9]+)?)'), ',', '.')::numeric;
  EXCEPTION WHEN OTHERS THEN v_precio := NULL;
  END;

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

  IF v_fecha IS NOT NULL THEN
    INSERT INTO public.calendar_events (user_id, title, event_date, location, notes)
    VALUES (v_pro, 'Trabajo: ' || COALESCE(v_org_nombre, 'acuerdo del chat'), v_fecha, v_ciudad, v_evento);
  END IF;

  RETURN v_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.cerrar_acuerdo_chat(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cerrar_acuerdo_chat(uuid) TO authenticated;
