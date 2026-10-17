-- 17 oct 2026: el admin no podía limpiar el aviso ámbar "solicitudes de cliente
-- sin responder" ni el semáforo "Solicitudes: cómo van"; se quedaban ahí las
-- de prueba y las que ya se habían atendido a mano (Kesia, food trucks).
-- Ahora cada solicitud se puede quitar del panel una a una. Solo la oculta en
-- el panel del admin: la solicitud sigue existiendo y el profesional la sigue
-- viendo y pudiendo contestar. Cambiar esta columna no dispara ningún trigger
-- (el de avisos solo escucha UPDATE OF status).
ALTER TABLE public.flash_bookings ADD COLUMN IF NOT EXISTS oculta_admin_at timestamptz;

CREATE OR REPLACE FUNCTION public.panel_admin_ocultar_solicitud(p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  UPDATE public.flash_bookings SET oculta_admin_at = now() WHERE id = p_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.panel_admin_ocultar_solicitud(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_ocultar_solicitud(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.panel_admin_pending_bookings()
 RETURNS TABLE(id uuid, requester_name text, requester_contact text, professional_name text, professional_user_id uuid, event_date text, event_location text, event_description text, created_at timestamp with time zone, reminder_sent_at timestamp with time zone, horas_esperando numeric)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT v.* FROM public.admin_pending_bookings v
   WHERE NOT EXISTS (SELECT 1 FROM public.flash_bookings b WHERE b.id = v.id AND b.oculta_admin_at IS NOT NULL);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_admin_solicitudes_estado()
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
     AND b.oculta_admin_at IS NULL
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
