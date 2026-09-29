-- El filtro "24 horas" del panel de analítica es una ventana móvil
-- (now() - interval '1 day'), no el día de calendario: a las 00:30 sigue
-- mostrando casi todo el tráfico de ayer, y el label "hoy" que ya usaba la UI
-- para p_dias=1 no reflejaba eso. Se añade p_desde_medianoche para que
-- "Hoy" cuente de verdad desde las 00:00 de hoy (hora España) hasta ahora,
-- sin tocar el comportamiento por defecto (rangos de 24h/7/30/90 días).

CREATE OR REPLACE FUNCTION public.analytics_usuarios_unicos(
  p_dias integer DEFAULT 30,
  p_desde_medianoche boolean DEFAULT false
)
RETURNS TABLE(usuarios bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT count(DISTINCT session_id)::bigint AS usuarios
  FROM public.analytics_events
  WHERE created_at >= CASE
      WHEN p_desde_medianoche THEN date_trunc('day', now() AT TIME ZONE 'Europe/Madrid') AT TIME ZONE 'Europe/Madrid'
      ELSE now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    END
    AND NOT public.es_trafico_propio(analytics_events.user_id);
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_usuarios_unicos(
  p_dias integer DEFAULT 30,
  p_desde_medianoche boolean DEFAULT false
)
RETURNS TABLE(usuarios bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_usuarios_unicos(p_dias, p_desde_medianoche);
END;
$function$;
