-- Añade "detalle" a analytics_quien_online: en /auth guarda el query string
-- (mode/role) para distinguir alta de profesional vs. login de organizador en
-- el panel "Quién está online" — antes solo se veía la ruta pelada.
--
-- CREATE OR REPLACE no vale aquí: Postgres no permite cambiar el shape de
-- RETURNS TABLE de una función existente (42P13), hay que borrarla primero.

DROP FUNCTION IF EXISTS public.panel_analytics_quien_online();
DROP FUNCTION IF EXISTS public.analytics_quien_online();

CREATE FUNCTION public.analytics_quien_online()
RETURNS TABLE (
  session_id   text,
  ultima_pagina text,
  device       text,
  hace_segundos int,
  display_name text,
  rol          text,
  detalle      text
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  WITH ultimos AS (
    SELECT DISTINCT ON (e.session_id)
      e.session_id, e.path, e.device, e.created_at, e.user_id, e.detalle
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
    p.role AS rol,
    u.detalle
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

CREATE FUNCTION public.panel_analytics_quien_online()
RETURNS TABLE (
  session_id text, ultima_pagina text, device text,
  hace_segundos int, display_name text, rol text, detalle text
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
