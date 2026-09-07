-- Lista de quién está online ahora, no solo el número. Para cada sesión
-- activa en los últimos 5 min: su última página vista, dispositivo, hace
-- cuánto, y si hay sesión iniciada, nombre y rol (join con profiles). Sin
-- login solo hay "Visitante" — es lo máximo que dan estos datos sin
-- capturar IP, que este proyecto decidió no guardar (ver analytics_events).
--
-- Mismo patrón que analytics_online_ahora (7 sep, 15:30): función base +
-- envoltorio panel_* con es_admin(), excluye tráfico de cuentas admin.

CREATE OR REPLACE FUNCTION public.analytics_quien_online()
RETURNS TABLE (
  session_id   text,
  ultima_pagina text,
  device       text,
  hace_segundos int,
  display_name text,
  rol          text
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  -- Una fila por sesión: su evento más reciente en la ventana de 5 min.
  WITH ultimos AS (
    SELECT DISTINCT ON (e.session_id)
      e.session_id, e.path, e.device, e.created_at, e.user_id
    FROM public.analytics_events e
    WHERE e.created_at >= now() - interval '5 minutes'
      AND e.session_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.user_roles r
        WHERE r.user_id = e.user_id AND r.role = 'admin'
      )
    ORDER BY e.session_id, e.created_at DESC
  )
  SELECT
    u.session_id,
    u.path AS ultima_pagina,
    u.device,
    extract(epoch FROM (now() - u.created_at))::int AS hace_segundos,
    p.display_name,
    p.role AS rol
  FROM ultimos u
  LEFT JOIN LATERAL (
    SELECT display_name, role FROM public.profiles
    WHERE profiles.user_id = u.user_id
    ORDER BY is_primary DESC NULLS LAST
    LIMIT 1
  ) p ON u.user_id IS NOT NULL
  ORDER BY u.created_at DESC
  LIMIT 50;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_quien_online()
RETURNS TABLE (
  session_id text, ultima_pagina text, device text,
  hace_segundos int, display_name text, rol text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_quien_online();
END;
$function$;

GRANT EXECUTE ON FUNCTION public.panel_analytics_quien_online() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_quien_online() FROM anon, authenticated;
