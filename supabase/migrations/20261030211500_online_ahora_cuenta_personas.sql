-- 30 oct 2026: "Online ahora" contaba session_id distintos, y una misma persona
-- con login tiene varios (otra pestaña, otro dispositivo, sesión nueva tras 30
-- min): una sola persona salía como 3 en el panel. Ahora, con login, cuenta y
-- lista una fila por usuario (su evento más reciente). Sin login sigue siendo
-- una por sesión, que es lo único que se distingue sin guardar IP, y una sesión
-- anónima que ya ha iniciado sesión no se cuenta aparte de su usuario.
-- Mismas firmas y permisos que antes: solo cambia el cuerpo. Mantiene la
-- exclusión de es_trafico_propio (admin, Torrejón y cuentas demo).

CREATE OR REPLACE FUNCTION public.analytics_online_ahora()
RETURNS TABLE (online bigint)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  WITH ev AS (
    SELECT e.user_id, e.session_id
    FROM public.analytics_events e
    WHERE e.created_at >= now() - interval '5 minutes'
      AND e.session_id IS NOT NULL
      AND NOT public.es_trafico_propio(e.user_id)
  )
  SELECT count(DISTINCT coalesce(ev.user_id::text, ev.session_id))::bigint AS online
  FROM ev
  WHERE ev.user_id IS NOT NULL
     OR NOT EXISTS (
       SELECT 1 FROM ev x
       WHERE x.session_id = ev.session_id AND x.user_id IS NOT NULL
     );
$function$;

CREATE OR REPLACE FUNCTION public.analytics_quien_online()
RETURNS TABLE (
  session_id    text,
  ultima_pagina text,
  device        text,
  hace_segundos int,
  display_name  text,
  rol           text,
  detalle       text
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  WITH ev AS (
    SELECT e.session_id, e.path, e.device, e.created_at, e.user_id, e.detalle
    FROM public.analytics_events e
    WHERE e.created_at >= now() - interval '5 minutes'
      AND e.session_id IS NOT NULL
      AND NOT public.es_trafico_propio(e.user_id)
  ),
  ultimos AS (
    SELECT DISTINCT ON (coalesce(ev.user_id::text, ev.session_id))
      ev.session_id, ev.path, ev.device, ev.created_at, ev.user_id, ev.detalle
    FROM ev
    WHERE ev.user_id IS NOT NULL
       OR NOT EXISTS (
         SELECT 1 FROM ev x
         WHERE x.session_id = ev.session_id AND x.user_id IS NOT NULL
       )
    ORDER BY coalesce(ev.user_id::text, ev.session_id), ev.created_at DESC
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
