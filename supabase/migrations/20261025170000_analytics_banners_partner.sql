-- ---------------------------------------------------------------------------
-- CLICS EN BANNERS DE COLABORADORES (Warm Up Academy y los que vengan)
--
-- WarmUpAcademyBanner registra `partner_click` con detalle `warmup:app` o
-- `warmup:publica`, pero log_analytics_event tiene una lista cerrada de
-- eventos y `partner_click` no estaba: los clics se tiraban sin error desde
-- el 25 oct a mediodía hasta las 17:29 (aplicado a mano ese día; aquí queda
-- en el repo).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_analytics_event(p_event_name text, p_path text DEFAULT NULL, p_referrer text DEFAULT NULL, p_device text DEFAULT NULL, p_session_id text DEFAULT NULL, p_detalle text DEFAULT NULL)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF p_event_name IS NULL OR p_event_name NOT IN (
    'page_view', 'signup', 'login', 'flash_request', 'message_sent',
    'profile_view', 'contact_click', 'favorite', 'resources_view',
    'affiliate_click', 'search', 'search_sin_resultados', 'filtro_rol',
    'cta_click', 'auth_field_touched', 'auth_paso', 'pwa_installed',
    'pwa_session', 'partner_click'
  ) THEN
    RETURN;
  END IF;
  INSERT INTO public.analytics_events (event_name, path, referrer, device, session_id, user_id, detalle)
  VALUES (p_event_name, left(p_path,300), left(p_referrer,200), left(p_device,20), left(p_session_id,64), auth.uid(), left(p_detalle,120));
END;
$function$;

-- Registro clic a clic para el panel admin. Se agrupa en el cliente: con el
-- volumen actual son decenas de filas, no merece una función por vista.
-- `prueba-claude` es el clic de prueba del 25 oct que no se pudo borrar.
CREATE OR REPLACE FUNCTION public.panel_analytics_banners(p_dias int DEFAULT 30)
RETURNS TABLE (cuando timestamptz, banner text, origen text, path text, device text, session_id text, quien text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT e.created_at,
         split_part(coalesce(e.detalle, 'sin_detalle'), ':', 1),
         nullif(split_part(coalesce(e.detalle, ''), ':', 2), ''),
         e.path::text, e.device::text, e.session_id::text,
         p.display_name::text
  FROM public.analytics_events e
  LEFT JOIN public.profiles p ON p.user_id = e.user_id
  WHERE e.event_name = 'partner_click'
    AND e.created_at >= now() - make_interval(days => p_dias)
    AND e.session_id IS DISTINCT FROM 'prueba-claude'
  ORDER BY e.created_at DESC
  LIMIT 500;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.panel_analytics_banners(int) TO authenticated;
