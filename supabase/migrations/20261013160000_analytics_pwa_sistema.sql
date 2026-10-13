-- (13 oct) Añade detalle (iphone/android...) al resultado.
-- Complementa panel_analytics_pwa_instalaciones (evento 'pwa_installed',
-- solo captura el MOMENTO de instalar y nunca en iOS) con 'pwa_session':
-- gente que abre la web YA en modo app instalada, sin importar cuándo la
-- puso — incluye instalaciones de antes de que 'pwa_installed' existiera,
-- y SÍ cuenta iOS (navigator.standalone no depende de 'appinstalled').
--
-- DROP+CREATE porque cambia el shape de RETURNS TABLE respecto a la versión
-- anterior (añade p_evento), igual que ya hizo 20260928...quien_online_detalle.

DROP FUNCTION IF EXISTS public.panel_analytics_pwa_instalaciones(int);
DROP FUNCTION IF EXISTS public.analytics_pwa_instalaciones(int);

CREATE FUNCTION public.analytics_pwa_instalaciones(p_dias int DEFAULT 30)
RETURNS TABLE (
  instalado_en timestamptz,
  device       text,
  display_name text,
  rol          text,
  evento       text,
  detalle      text
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  SELECT
    e.created_at AS instalado_en,
    e.device,
    p.display_name,
    p.role AS rol,
    e.event_name AS evento,
    e.detalle
  FROM public.analytics_events e
  LEFT JOIN LATERAL (
    SELECT display_name, role FROM public.profiles
    WHERE profiles.user_id = e.user_id
    ORDER BY is_primary DESC NULLS LAST
    LIMIT 1
  ) p ON e.user_id IS NOT NULL
  WHERE e.event_name IN ('pwa_installed', 'pwa_session')
    AND e.created_at >= now() - (p_dias || ' days')::interval
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles r
      WHERE r.user_id = e.user_id AND r.role = 'admin'
    )
  ORDER BY e.created_at DESC
  LIMIT 200;
$function$;

CREATE FUNCTION public.panel_analytics_pwa_instalaciones(p_dias int DEFAULT 30)
RETURNS TABLE (
  instalado_en timestamptz, device text, display_name text, rol text, evento text, detalle text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_pwa_instalaciones(p_dias);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.panel_analytics_pwa_instalaciones(int) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_pwa_instalaciones(int) FROM anon, authenticated;
