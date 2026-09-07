-- "Online ahora" para el panel Admin de tráfico: sesiones distintas con
-- actividad en los últimos 5 minutos. Reemplaza al contador equivalente de
-- Vercel Web Analytics, que devuelve 404 en este proyecto (plan no lo
-- incluye) — ver reference_vercel_analytics_acceso en la memoria del usuario.
--
-- Mismo patrón que el resto de analytics_propia.sql: función base +
-- envoltorio panel_* que exige es_admin() y excluye el tráfico de cuentas
-- admin, para no contarse a uno mismo como visitante "online".
--
-- Usa idx_analytics_created_at (ya existe) — no hace falta índice nuevo:
-- el filtro por created_at DESC es exactamente lo que ese índice cubre.

CREATE OR REPLACE FUNCTION public.analytics_online_ahora()
RETURNS TABLE (online bigint)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  SELECT count(DISTINCT e.session_id)::bigint AS online
  FROM public.analytics_events e
  WHERE e.created_at >= now() - interval '5 minutes'
    AND e.session_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles r
      WHERE r.user_id = e.user_id AND r.role = 'admin'
    );
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_online_ahora()
RETURNS TABLE (online bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_online_ahora();
END;
$function$;

GRANT EXECUTE ON FUNCTION public.panel_analytics_online_ahora() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_online_ahora() FROM anon, authenticated;
