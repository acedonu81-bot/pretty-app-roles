-- Instalaciones de la PWA (evento 'pwa_installed', disparado por el
-- 'appinstalled' del navegador en App.tsx). Mismo patrón que
-- panel_analytics_quien_online: función interna + wrapper SECURITY DEFINER
-- que exige es_admin(), excluye admins del propio dato, y resuelve
-- display_name/role vía LEFT JOIN LATERAL cuando hay user_id (sesión activa
-- en el momento de instalar).
--
-- iOS Safari nunca dispara 'appinstalled' (ni tras "Añadir a pantalla de
-- inicio" manual), así que esto no cuenta instalaciones en iOS — solo
-- Chrome/Edge (desktop y Android).

CREATE FUNCTION public.analytics_pwa_instalaciones(p_dias int DEFAULT 30)
RETURNS TABLE (
  instalado_en timestamptz,
  device       text,
  display_name text,
  rol          text
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $function$
  SELECT
    e.created_at AS instalado_en,
    e.device,
    p.display_name,
    p.role AS rol
  FROM public.analytics_events e
  LEFT JOIN LATERAL (
    SELECT display_name, role FROM public.profiles
    WHERE profiles.user_id = e.user_id
    ORDER BY is_primary DESC NULLS LAST
    LIMIT 1
  ) p ON e.user_id IS NOT NULL
  WHERE e.event_name = 'pwa_installed'
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
  instalado_en timestamptz, device text, display_name text, rol text
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
