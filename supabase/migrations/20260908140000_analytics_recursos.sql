-- Panel de Recursos: se registraba el evento resources_view con el oficio
-- consultado (ver logEvent('resources_view', '/recursos', key) en
-- ResourcesView.tsx), pero no existía ninguna función que lo agregase — el
-- dato estaba capturado y nadie lo leía en el panel de admin (9 sep 2026).
--
-- Mismo patrón que analytics_busquedas/analytics_afiliados/analytics_blog.
CREATE OR REPLACE FUNCTION public.analytics_recursos(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (oficio text, visitas bigint, sesiones bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT
    coalesce(nullif(trim(detalle), ''), 'sin-catalogo') AS oficio,
    count(*)::bigint AS visitas,
    count(DISTINCT session_id)::bigint AS sesiones
  FROM public.analytics_events
  WHERE event_name = 'resources_view'
    AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    AND (user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT LEAST(GREATEST(p_limite, 1), 100);
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_recursos(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (oficio text, visitas bigint, sesiones bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_recursos(p_dias, p_limite);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.analytics_recursos(int, int) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_recursos(int, int) TO authenticated;
