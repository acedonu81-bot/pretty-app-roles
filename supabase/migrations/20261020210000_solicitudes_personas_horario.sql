-- (20 oct 2026) Las solicitudes a profesionales también exigen número de personas y horario
-- (los pedía el correo de Kesia: sin ellos nadie puede contestar con un precio). Van al principio
-- de event_description como "[Personas: 30 a 80] [Horario: De 22:00 a 03:00]".
-- Mismo trigger de siempre con dos comprobaciones más; las exenciones no cambian.
CREATE OR REPLACE FUNCTION public.flash_bookings_exige_datos()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  falta text[] := ARRAY[]::text[];
  quien uuid := auth.uid();
  desc_ text := COALESCE(NEW.event_description, '');
  autorregistro boolean := quien IS NOT NULL AND NEW.created_by = quien AND NEW.professional_user_id = quien;
BEGIN
  IF COALESCE(auth.role(), 'service_role') NOT IN ('anon', 'authenticated') OR public.es_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.source = 'chat' AND NEW.chat_message_id IS NOT NULL AND quien IS NOT NULL
     AND NEW.created_by IS NOT NULL AND NEW.professional_user_id IS NOT NULL
     AND NEW.created_by <> NEW.professional_user_id
     AND quien IN (NEW.created_by, NEW.professional_user_id)
     AND NOT EXISTS (SELECT 1 FROM public.flash_bookings b WHERE b.chat_message_id = NEW.chat_message_id)
     AND EXISTS (
       SELECT 1 FROM public.messages m
       JOIN public.conversations c ON c.id = m.conversation_id
       WHERE m.id = NEW.chat_message_id AND m.deleted_at IS NULL
         AND m.content LIKE '[[acuerdo:aceptado|ACUERDO|%'
         AND ((c.participant_a = NEW.created_by AND c.participant_b = NEW.professional_user_id)
           OR (c.participant_b = NEW.created_by AND c.participant_a = NEW.professional_user_id))
     ) THEN
    RETURN NEW;
  END IF;

  IF public.solicitud_texto_basura(NEW.requester_name) THEN falta := falta || 'nombre'; END IF;
  IF NOT public.solicitud_contacto_valido(NEW.requester_contact) THEN falta := falta || 'contacto'; END IF;
  IF NOT public.solicitud_fecha_valida(NEW.event_date) THEN falta := falta || 'fecha'; END IF;
  IF length(regexp_replace(COALESCE(NEW.event_location, ''), '[^[:alpha:]]', '', 'g')) < 3
     OR public.solicitud_texto_basura(NEW.event_location) THEN falta := falta || 'lugar'; END IF;
  IF desc_ !~ '\[Personas: [^]]+\]' THEN falta := falta || 'personas'; END IF;
  IF desc_ !~ '\[Horario: [^]]{4,}\]' OR desc_ !~ '\[Horario: [^]]*[0-9][^]]*\]' THEN falta := falta || 'horario'; END IF;

  IF array_length(falta, 1) > 0 THEN
    RAISE EXCEPTION 'SOLICITUD_INCOMPLETA:%', array_to_string(falta, ',')
      USING HINT = 'Sin todos los datos no se manda nada a ningún profesional';
  END IF;

  IF quien IS NOT NULL AND NOT autorregistro AND NOT public.es_organizador(quien) THEN
    RAISE EXCEPTION 'NECESITAS_PERFIL_ORGANIZADOR'
      USING HINT = 'Para pedir un profesional crea antes un perfil de organizador (Empresa / Sala)';
  END IF;

  RETURN NEW;
END;
$function$;
