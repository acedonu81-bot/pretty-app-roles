-- 17 oct 2026: el semáforo decidía el color solo por si había mensajes, así que
-- una reserva cerrada en el chat salía "aceptada sin hablar" (amarillo) y luego
-- "Hablando, todo bien" (verde) cuando en realidad el trato ya estaba cerrado
-- (Magic Dreams / Mar~Iña, acuerdo de 400 € aceptado en el chat).
-- Ahora el estado lo calcula la base de datos, mirando primero el trato:
--   no                   rechazada o cancelada
--   sin_respuesta        pendiente
--   cerrado              acuerdo aceptado en el chat (source = 'chat'), cerrada o completada
--   aceptada_sin_hablar  aceptada y sin mensajes después de la solicitud
--   hablando             aceptada, hablan, falta cerrar el trato
-- La función antigua panel_admin_solicitudes_semaforo se deja sin usar (no se borra).
-- Si la misma pareja tiene una reserva cerrada en el chat, la reserva directa
-- anterior no se repite en la lista.
CREATE FUNCTION public.panel_admin_solicitudes_estado()
 RETURNS TABLE(
   id uuid, requester_name text, professional_name text, status text, source text,
   agreed_price numeric, event_date text, event_location text, event_description text,
   created_at timestamptz, mensajes bigint, estado text
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT b.id, b.requester_name, b.professional_name, b.status, b.source,
         b.agreed_price::numeric, b.event_date, b.event_location, b.event_description, b.created_at,
         COALESCE(m.n, 0),
         CASE
           WHEN b.status IN ('rejected', 'cancelled') THEN 'no'
           WHEN b.status = 'pending' THEN 'sin_respuesta'
           WHEN b.status IN ('completed', 'closed') OR b.source = 'chat' THEN 'cerrado'
           WHEN COALESCE(m.n, 0) = 0 THEN 'aceptada_sin_hablar'
           ELSE 'hablando'
         END
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
     AND NOT (
       b.source IS DISTINCT FROM 'chat'
       AND EXISTS (
         SELECT 1 FROM public.flash_bookings c2
          WHERE c2.source = 'chat' AND c2.status IN ('confirmed', 'accepted', 'completed', 'closed')
            AND c2.created_by = b.created_by AND c2.professional_user_id = b.professional_user_id
            AND c2.created_at >= b.created_at)
     )
   ORDER BY b.created_at DESC
   LIMIT 30;
END;
$function$;

REVOKE ALL ON FUNCTION public.panel_admin_solicitudes_estado() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_solicitudes_estado() TO authenticated;
