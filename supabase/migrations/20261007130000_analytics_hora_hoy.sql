-- analytics_por_hora agrega histórico completo por hora-del-día (generate_series
-- 0-23 fijo): sirve para "¿a qué hora entra tu gente?" pero no es una serie
-- temporal real, así que al reusarla para "Tráfico por hora" con el filtro
-- "Hoy" activo, el dashboard pintaba horas futuras del día (patrón de otros
-- días, no hoy) como si ya hubieran pasado. Esta función solo cuenta desde
-- las 00:00 de hoy (hora España) y corta en la hora actual: no genera horas
-- futuras.
CREATE OR REPLACE FUNCTION public.analytics_por_hora_hoy()
RETURNS TABLE(hora integer, visitas bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH ahora AS (
    SELECT (now() AT TIME ZONE 'Europe/Madrid') AS local_ts
  ),
  horas AS (
    SELECT generate_series(0, extract(hour FROM (SELECT local_ts FROM ahora))::int) AS hora
  ),
  ev AS (
    SELECT extract(hour FROM created_at AT TIME ZONE 'Europe/Madrid')::int AS hora
    FROM public.analytics_events
    WHERE event_name = 'page_view'
      AND created_at >= date_trunc('day', (SELECT local_ts FROM ahora)) AT TIME ZONE 'Europe/Madrid'
      AND NOT public.es_trafico_propio(analytics_events.user_id)
  )
  SELECT h.hora, count(e.hora)::bigint AS visitas
  FROM horas h LEFT JOIN ev e ON e.hora = h.hora
  GROUP BY h.hora ORDER BY h.hora;
$$;

CREATE OR REPLACE FUNCTION public.panel_analytics_hora_hoy()
RETURNS TABLE(hora integer, visitas bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_por_hora_hoy();
END;
$$;
