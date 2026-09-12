-- La tarjeta "Visitas" del panel admin contaba páginas vistas (count(*) de
-- page_view), no personas. "Sesiones" sí cuenta personas distintas, pero
-- SUMANDO el conteo día a día (analytics_por_dia agrupa por día): quien visita
-- 3 días seguidos cuenta 3 veces, no es "usuarios únicos del periodo" de
-- verdad. El usuario quiere una cifra literal tipo "5 usuarios hoy" — personas
-- reales, sin duplicar si vuelven varios días.
--
-- Nueva función que cuenta DISTINCT session_id sobre el rango COMPLETO (no
-- por día), mismo criterio de exclusión de admin que analytics_por_dia.
CREATE OR REPLACE FUNCTION public.analytics_usuarios_unicos(p_dias integer DEFAULT 30)
RETURNS TABLE(usuarios bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT count(DISTINCT session_id)::bigint AS usuarios
  FROM public.analytics_events
  WHERE event_name = 'page_view'
    AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    AND (user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'));
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_usuarios_unicos(p_dias integer DEFAULT 30)
RETURNS TABLE(usuarios bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_usuarios_unicos(p_dias);
END;
$function$;
