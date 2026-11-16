-- Movimiento visible en el Inicio del panel (16 nov 2026).
-- Lo que ve cualquier cuenta con sesión: las últimas solicitudes y ofertas
-- reales de los últimos 14 días, solo servicio, lugar y fecha. Nunca nombre,
-- contacto, descripción ni a qué profesionales llegó. Sin autorregistros ni
-- peticiones de admins. Una solicitud que llega a varios profesionales cuenta
-- una sola vez.
CREATE OR REPLACE FUNCTION public.actividad_reciente_panel()
RETURNS TABLE(tipo text, servicio text, lugar text, creado timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Solo con sesión'; END IF;
  RETURN QUERY
  SELECT x.tipo, x.servicio, x.lugar, x.creado
    FROM (
      SELECT 'solicitud'::text AS tipo,
             min(fb.professional_role) AS servicio,
             NULLIF(trim(fb.event_location), '') AS lugar,
             min(fb.created_at) AS creado
        FROM public.flash_bookings fb
       WHERE fb.source = 'particular'
         AND fb.es_autorregistro = false
         AND fb.professional_user_id IS NOT NULL
         AND fb.created_at > now() - interval '14 days'
         AND NOT EXISTS (SELECT 1 FROM public.user_roles ur
                          WHERE ur.user_id = fb.created_by AND ur.role::text = 'admin')
       GROUP BY fb.created_by, fb.event_date, fb.event_location
      UNION ALL
      SELECT 'oferta'::text,
             COALESCE(er.roles_needed[1], er.event_type),
             NULLIF(trim(er.city), ''),
             er.created_at
        FROM public.event_requests er
       WHERE er.created_at > now() - interval '14 days'
         AND NOT EXISTS (SELECT 1 FROM public.user_roles ur
                          WHERE ur.user_id::text = er.client_user_id AND ur.role::text = 'admin')
    ) x
   ORDER BY x.creado DESC
   LIMIT 5;
END;
$function$;
REVOKE ALL ON FUNCTION public.actividad_reciente_panel() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.actividad_reciente_panel() TO authenticated;
