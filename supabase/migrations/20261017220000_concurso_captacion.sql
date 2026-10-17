-- 17 oct 2026: captación a partir del Concurso DJ.
-- 1) set_marketing_consent: un toque tras votar ("avísame del resultado y de los
--    próximos concursos"). El usuario solo toca su propio perfil; se guarda cuándo.
-- 2) panel_admin_concurso_referidos: altas por enlace de aspirante (?ref=<nombre>).
--    El ref ya queda en analytics_events.detalle (query string del page_view).
-- 3) panel_admin_concurso_captacion: votantes únicos, cuántos aceptan avisos y
--    cuántos DJs piden la próxima edición (leads con source concurso-proxima-edicion).
CREATE FUNCTION public.set_marketing_consent(p_valor boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'sin sesión'; END IF;
  UPDATE public.profiles
     SET marketing_consent = COALESCE(p_valor, false), marketing_consent_asked_at = now()
   WHERE user_id = auth.uid();
END;
$function$;
REVOKE ALL ON FUNCTION public.set_marketing_consent(boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_marketing_consent(boolean) TO authenticated;

CREATE FUNCTION public.panel_admin_concurso_referidos()
 RETURNS TABLE(ref text, sesiones bigint, altas bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  WITH entradas AS (
    SELECT e.session_id, lower((regexp_match(e.detalle, '(?:^|&)ref=([^&]+)'))[1]) AS r
      FROM public.analytics_events e
     WHERE e.event_name = 'page_view'
       AND e.path LIKE '/concurso-dj-madrid%'
       AND e.detalle ~ '(?:^|&)ref='
       AND e.session_id IS NOT NULL
       AND e.created_at > now() - interval '60 days'
     GROUP BY 1, 2
  )
  SELECT en.r, count(DISTINCT en.session_id),
         count(DISTINCT en.session_id) FILTER (WHERE EXISTS (
           SELECT 1 FROM public.analytics_events s WHERE s.session_id = en.session_id AND s.event_name = 'signup'))
    FROM entradas en
   WHERE en.r IS NOT NULL
   GROUP BY en.r
   ORDER BY 3 DESC, 2 DESC;
END;
$function$;
REVOKE ALL ON FUNCTION public.panel_admin_concurso_referidos() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_concurso_referidos() TO authenticated;

CREATE FUNCTION public.panel_admin_concurso_captacion()
 RETURNS TABLE(votantes bigint, con_consentimiento bigint, quieren_proxima_edicion bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT
    (SELECT count(DISTINCT l.user_id) FROM public.feed_likes l WHERE l.content_key LIKE 'concurso-dj-madrid-2026:%'),
    (SELECT count(DISTINCT l.user_id) FROM public.feed_likes l
       JOIN public.profiles p ON p.user_id = l.user_id
      WHERE l.content_key LIKE 'concurso-dj-madrid-2026:%' AND p.marketing_consent),
    (SELECT count(DISTINCT lower(ld.email)) FROM public.leads ld WHERE ld.source = 'concurso-proxima-edicion');
END;
$function$;
REVOKE ALL ON FUNCTION public.panel_admin_concurso_captacion() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_concurso_captacion() TO authenticated;
