-- log_analytics_event descarta en silencio cualquier event_name que no esté
-- en su lista. El front ya enviaba 'auth_field_touched', 'pwa_installed' y
-- 'pwa_session' y ninguno se ha guardado nunca (0 filas a 11 oct 2026).
-- Se añaden, más 'auth_paso' (embudo de /auth: vista, envío, errores,
-- captcha), para ver en qué paso abandona la gente de la campaña de Instagram.

CREATE OR REPLACE FUNCTION public.log_analytics_event(
  p_event_name text,
  p_path text DEFAULT NULL::text,
  p_referrer text DEFAULT NULL::text,
  p_device text DEFAULT NULL::text,
  p_session_id text DEFAULT NULL::text,
  p_detalle text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF p_event_name IS NULL OR p_event_name NOT IN (
    'page_view', 'signup', 'login', 'flash_request', 'message_sent',
    'profile_view', 'contact_click', 'favorite', 'resources_view',
    'affiliate_click', 'search', 'search_sin_resultados', 'filtro_rol',
    'cta_click', 'auth_field_touched', 'auth_paso', 'pwa_installed',
    'pwa_session'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.analytics_events (event_name, path, referrer, device, session_id, user_id, detalle)
  VALUES (
    p_event_name,
    left(p_path, 300),
    left(p_referrer, 200),
    left(p_device, 20),
    left(p_session_id, 64),
    auth.uid(),
    left(p_detalle, 120)
  );
END;
$function$;
