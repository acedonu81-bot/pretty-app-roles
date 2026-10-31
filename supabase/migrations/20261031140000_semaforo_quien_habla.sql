-- Semáforo de solicitudes: quién ha escrito en cada pareja (31 oct 2026).
-- "Hablando" no distinguía entre una conversación de dos y un profesional que
-- escribe solo (Cristina / Dj GuimoX: escribió él, ella no había abierto el chat).
-- Función aparte y solo lectura: no toca panel_admin_solicitudes_estado.
CREATE OR REPLACE FUNCTION public.panel_admin_solicitudes_quien_habla()
RETURNS TABLE(id uuid, del_cliente bigint, del_profesional bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT b.id,
         COUNT(*) FILTER (WHERE ms.sender_id = b.created_by),
         COUNT(*) FILTER (WHERE ms.sender_id = b.professional_user_id)
    FROM public.flash_bookings b
    LEFT JOIN public.conversations c
      ON ((c.participant_a = b.created_by AND c.participant_b = b.professional_user_id)
       OR (c.participant_a = b.professional_user_id AND c.participant_b = b.created_by))
    LEFT JOIN public.messages ms
      ON ms.conversation_id = c.id
     AND ms.deleted_at IS NULL
     AND (b.source = 'chat' OR ms.created_at >= b.created_at)
   WHERE b.created_at > now() - interval '14 days'
     AND b.professional_user_id IS NOT NULL
   GROUP BY b.id;
END;
$function$;
REVOKE ALL ON FUNCTION public.panel_admin_solicitudes_quien_habla() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_solicitudes_quien_habla() TO authenticated;
