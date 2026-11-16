-- "Nuevo en XPEAK" en el Inicio del panel (16 nov 2026).
-- Lo que ve cualquier cuenta con sesión: hasta 5 profesionales que entraron en
-- los últimos 7 días y tienen el perfil bien completado. Solo datos que ya son
-- públicos (nombre, oficio, zona, foto y primera foto de portfolio). Nunca
-- teléfono, correo ni Instagram. Sin organizadores, cuentas seed, demo,
-- internas ni de admins.
-- Sale quien ha confirmado el correo, o quien fue dado de alta a mano por XPEAK
-- con el permiso del negocio (user_metadata.alta_asistida = 'true'), que aún no
-- ha entrado por primera vez.
CREATE OR REPLACE FUNCTION public.nuevos_profesionales_panel()
RETURNS TABLE(user_id uuid, display_name text, role text, zone text,
              photo_url text, portada_url text, creado timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
#variable_conflict use_column
BEGIN
  IF auth.uid() IS NULL OR COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) THEN
    RAISE EXCEPTION 'Solo con sesión';
  END IF;
  RETURN QUERY
  SELECT x.user_id, x.display_name, x.role, x.zone, x.photo_url, x.portada_url, x.creado
    FROM (
      SELECT DISTINCT ON (p.user_id)
             p.user_id,
             trim(p.display_name) AS display_name,
             p.role,
             p.zone,
             p.photo_url,
             (SELECT u FROM unnest(p.portfolio_urls) AS u WHERE u LIKE 'https://%' LIMIT 1) AS portada_url,
             p.created_at AS creado
        FROM public.profiles p
        JOIN auth.users au ON au.id = p.user_id
       WHERE p.created_at > now() - interval '7 days'
         AND p.validation_status = 'approved'
         AND p.is_public
         AND NOT p.is_seed
         AND NOT p.is_seed_profile
         AND NOT p.ai_moderation_flagged
         AND p.role IS NOT NULL
         AND p.role NOT IN ('pending', 'empresario')
         AND length(trim(COALESCE(p.display_name, ''))) > 1
         AND length(trim(COALESCE(p.photo_url, ''))) > 5
         AND length(trim(COALESCE(p.bio, ''))) >= 40
         AND (au.email_confirmed_at IS NOT NULL
              OR au.raw_user_meta_data->>'alta_asistida' = 'true')
         AND COALESCE(au.email, '') NOT ILIKE '%@xpeak.es'
         AND COALESCE(au.email, '') NOT ILIKE '%@xpeak.site'
         AND NOT EXISTS (SELECT 1 FROM public.user_roles ur
                          WHERE ur.user_id = p.user_id AND ur.role::text = 'admin')
       ORDER BY p.user_id, p.is_primary DESC, p.created_at DESC
    ) x
   ORDER BY x.creado DESC
   LIMIT 5;
END;
$function$;
REVOKE ALL ON FUNCTION public.nuevos_profesionales_panel() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.nuevos_profesionales_panel() TO authenticated;
