-- "Sí, puedo" no es un bolo (19 oct 2026).
--
-- Hasta hoy el botón "Sí, puedo" de una solicitud de Flash Booking guardaba
-- status='confirmed', el mismo valor que un acuerdo de verdad cerrado en el
-- chat (fecha + ciudad + precio, cerrar_acuerdo_chat). Toda la app lo leía como
-- bolo contratado: "Bolo aceptado", email "Trabajo confirmado", reseña
-- verificada, recordatorios de valoración, métricas del panel... Una solicitud
-- de particular repartida a 5 DJs acababa con 4 "bolos" sin fecha ni precio.
--
-- Ahora "Sí, puedo" escribe 'disponible' (puede, falta hablar) y 'confirmed'
-- queda solo para acuerdos reales.

ALTER TABLE public.flash_bookings DROP CONSTRAINT flash_bookings_status_check;
ALTER TABLE public.flash_bookings ADD CONSTRAINT flash_bookings_status_check CHECK (
  status IS NULL OR status = ANY (ARRAY['open','accepted','rejected','closed','pending',
    'disponible','confirmed','completed','cancelled'])
);

-- Aviso al organizador: 'disponible' es el "ha dicho que sí, habla con él".
-- 'confirmed' por UPDATE ya no lo escribe el profesional (ver guarda abajo).
CREATE OR REPLACE FUNCTION public.avisar_organizador_estado_reserva()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_pro text; v_titulo text; v_cuerpo text; v_link text;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status OR NEW.created_by IS NULL
     OR NEW.status NOT IN ('disponible', 'rejected')
     OR auth.uid() = NEW.created_by THEN
    RETURN NEW;
  END IF;
  BEGIN
    v_pro := COALESCE(NULLIF(trim(NEW.professional_name), ''), 'El profesional');
    v_link := '/dashboard?view=flashbooking';
    IF NEW.status = 'disponible' THEN
      v_titulo := v_pro || ' está disponible';
      v_cuerpo := v_pro || ' puede' || COALESCE(' el ' || public.fecha_legible(NEW.event_date), '')
                  || '. Escríbele para cerrar fecha, sitio y precio.';
      IF NEW.professional_user_id IS NOT NULL THEN
        v_link := '/dashboard?view=messages&con=' || NEW.professional_user_id::text
                  || '&nombre=' || replace(regexp_replace(v_pro, '[&#?=+%]', '', 'g'), ' ', '%20');
      END IF;
    ELSE
      v_titulo := v_pro || ' no está disponible';
      v_cuerpo := v_pro || ' no puede aceptar tu solicitud' || COALESCE(' para el ' || public.fecha_legible(NEW.event_date), '')
                  || '. Puedes buscar a otro profesional o publicar una oferta para recibir propuestas.';
    END IF;
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.created_by, 'reserva_' || NEW.status, v_titulo, v_cuerpo, v_link);
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', NEW.created_by, 'title', v_titulo, 'body', v_cuerpo, 'url', v_link));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_organizador_estado_reserva: %', SQLERRM;
  END;
  RETURN NEW;
END $function$;

-- Guarda: la política "Professional can update own flash bookings" deja al
-- profesional escribir cualquier estado. Con eso podía marcarse 'confirmed' o
-- 'completed' él solo y ganar derecho a reseña verificada. Desde el cliente
-- (current_user = authenticated) el profesional solo puede decir que puede o
-- que no, y no toca el precio. Las RPC SECURITY DEFINER (cerrar/cancelar
-- acuerdo del chat) corren como su dueño y no pasan por aquí. Los
-- autorregistros (created_by = el propio profesional) siguen libres.
CREATE OR REPLACE FUNCTION public.guarda_estado_flash_profesional()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF current_user = 'authenticated'
     AND auth.uid() = OLD.professional_user_id
     AND auth.uid() IS DISTINCT FROM OLD.created_by
     AND NOT public.es_admin() THEN
    IF NEW.status IS DISTINCT FROM OLD.status
       AND NEW.status IN ('confirmed', 'completed', 'accepted', 'closed') THEN
      RAISE EXCEPTION 'El acuerdo se cierra en el chat, no desde la solicitud';
    END IF;
    IF NEW.agreed_price IS DISTINCT FROM OLD.agreed_price THEN
      RAISE EXCEPTION 'El precio se acuerda en el chat';
    END IF;
  END IF;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_guarda_estado_flash_profesional ON public.flash_bookings;
CREATE TRIGGER trg_guarda_estado_flash_profesional
  BEFORE UPDATE ON public.flash_bookings
  FOR EACH ROW EXECUTE FUNCTION public.guarda_estado_flash_profesional();

-- Datos: los "confirmed" que solo eran un "Sí, puedo" (sin precio, sin fecha
-- real, no nacidos del chat ni apuntados a mano) pasan a 'disponible'. Sin
-- avisos: el organizador ya recibió el suyo en su día.
ALTER TABLE public.flash_bookings DISABLE TRIGGER trg_avisar_organizador_estado_reserva;
UPDATE public.flash_bookings
   SET status = 'disponible'
 WHERE status IN ('confirmed', 'accepted')
   AND agreed_price IS NULL
   AND COALESCE(source, '') NOT IN ('chat', 'manual_offline')
   AND COALESCE(es_autorregistro, false) = false;
ALTER TABLE public.flash_bookings ENABLE TRIGGER trg_avisar_organizador_estado_reserva;

-- Acuerdo en el chat: también con particulares, y completa la solicitud previa.
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
  -- Lado cliente = organizador o particular (rol 'pending', sin oficio).
  IF (COALESCE(v_rol_a, '') IN ('empresario', 'pending')) = (COALESCE(v_rol_b, '') IN ('empresario', 'pending')) THEN
    RAISE EXCEPTION 'solo entre organizador y profesional';
  END IF;
  v_org := CASE WHEN COALESCE(v_rol_a, '') IN ('empresario', 'pending') THEN c.participant_a ELSE c.participant_b END;
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

  -- Si ya había una solicitud entre los dos a la que el profesional dijo
  -- "Sí, puedo" (o aún pendiente), el acuerdo la completa en vez de dejarla
  -- colgando como "falta cerrar" al lado de una reserva nueva.
  UPDATE public.flash_bookings
     SET status = 'confirmed', event_date = to_char(v_fecha, 'YYYY-MM-DD'), event_location = v_ciudad,
         event_description = COALESCE(v_evento, event_description), agreed_price = v_precio,
         chat_message_id = m.id
   WHERE id = (SELECT id FROM public.flash_bookings
                WHERE created_by = v_org AND professional_user_id = v_pro
                  AND status IN ('disponible', 'pending') AND chat_message_id IS NULL
                ORDER BY created_at DESC LIMIT 1)
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
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
  END IF;

  IF v_fecha IS NOT NULL THEN
    INSERT INTO public.calendar_events (user_id, title, event_date, location, notes)
    VALUES (v_pro, 'Trabajo: ' || COALESCE(v_org_nombre, 'acuerdo del chat'), v_fecha, v_ciudad, v_evento);
  END IF;

  RETURN v_id;
END;
$function$;
