-- 17 oct 2026: las reservas cerradas por chat (source = 'chat') nacen DESPUÉS de
-- la conversación, así que contar solo los mensajes posteriores las marcaba como
-- "aceptadas sin hablar" (falso aviso de Magic Dreams / Mar~Iña). Para esas se
-- cuenta toda la conversación.
CREATE OR REPLACE FUNCTION public.panel_admin_solicitudes_semaforo()
 RETURNS TABLE(
   id uuid, requester_name text, professional_name text, status text,
   event_date text, event_location text, event_description text,
   created_at timestamptz, mensajes bigint
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT b.id, b.requester_name, b.professional_name, b.status,
         b.event_date, b.event_location, b.event_description, b.created_at,
         COALESCE(m.n, 0)
    FROM public.flash_bookings b
    LEFT JOIN LATERAL (
      SELECT count(*) AS n
        FROM public.messages ms
        JOIN public.conversations c ON c.id = ms.conversation_id
       WHERE (b.source = 'chat' OR ms.created_at >= b.created_at)
         AND ms.deleted_at IS NULL
         AND ((c.participant_a = b.created_by AND c.participant_b = b.professional_user_id)
           OR (c.participant_a = b.professional_user_id AND c.participant_b = b.created_by))
    ) m ON true
   WHERE b.created_at > now() - interval '14 days'
     AND b.professional_user_id IS NOT NULL
     AND COALESCE(b.es_autorregistro, false) = false
     AND b.created_by IS DISTINCT FROM b.professional_user_id
   ORDER BY b.created_at DESC
   LIMIT 30;
END;
$function$;
