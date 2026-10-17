-- 17 oct 2026: quién vota en el Concurso DJ. Solo lectura para el admin: cada
-- me gusta con el DJ votado, el nombre del votante (sin email), cuándo se creó
-- su cuenta y cuándo votó, para ver de un vistazo si llegan en rachas o con
-- cuentas recién creadas. Los votos van en feed_likes con content_key
-- 'concurso-dj-madrid-2026:<user_id del DJ>'.
CREATE FUNCTION public.panel_admin_concurso_votantes()
 RETURNS TABLE(
   dj text, votante text, rol text, cuenta_creada timestamptz, voto timestamptz,
   minutos_hasta_voto numeric, via text, consentimiento_marketing boolean, con_foto boolean
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT dj.display_name, vp.display_name, vp.role, au.created_at, l.created_at,
         round(EXTRACT(epoch FROM (l.created_at - au.created_at)) / 60.0, 1),
         au.raw_app_meta_data->>'provider',
         COALESCE(vp.marketing_consent, false),
         (vp.photo_url IS NOT NULL AND length(vp.photo_url) > 10)
    FROM public.feed_likes l
    JOIN public.concurso_inscripciones i
      ON l.content_key = 'concurso-dj-madrid-2026:' || i.user_id::text
    JOIN public.profiles dj ON dj.user_id = i.user_id
    JOIN auth.users au ON au.id = l.user_id
    LEFT JOIN public.profiles vp ON vp.user_id = l.user_id
   ORDER BY l.created_at DESC
   LIMIT 300;
END;
$function$;

REVOKE ALL ON FUNCTION public.panel_admin_concurso_votantes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_concurso_votantes() TO authenticated;
