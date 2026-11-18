-- "Premium" en la tarjeta del Inicio del panel (18 nov 2026, XDS 69,8 aprobada por Daniel).
-- Ventaja del plan Premium: salir en la misma tarjeta que "Nuevo en XPEAK",
-- rotulado como Premium. Hasta 5 al azar en cada carga, para que roten si hay más.
-- subscription_tier solo lo cambia el webhook de Stripe (los triggers
-- prevent_privilege_escalation y proteger_campos_al_crear_perfil impiden que un
-- usuario se lo ponga). Mismos datos públicos y filtros de privacidad que
-- nuevos_profesionales_panel; aquí basta con nombre y foto, sin mínimo de bio.
CREATE OR REPLACE FUNCTION public.premium_profesionales_panel()
RETURNS TABLE(user_id uuid, display_name text, role text, zone text,
              photo_url text, portada_url text, creado timestamptz)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public'
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
       WHERE p.subscription_tier = 'business'
         AND p.validation_status = 'approved'
         AND p.is_public
         AND NOT p.is_seed
         AND NOT p.is_seed_profile
         AND NOT p.ai_moderation_flagged
         AND p.role IS NOT NULL
         AND p.role NOT IN ('pending', 'empresario')
         AND length(trim(COALESCE(p.display_name, ''))) > 1
         AND length(trim(COALESCE(p.photo_url, ''))) > 5
         AND COALESCE(au.email, '') NOT ILIKE '%@xpeak.es'
         AND COALESCE(au.email, '') NOT ILIKE '%@xpeak.site'
         AND NOT EXISTS (SELECT 1 FROM public.user_roles ur
                          WHERE ur.user_id = p.user_id AND ur.role::text = 'admin')
       ORDER BY p.user_id, p.is_primary DESC, p.created_at DESC
    ) x
   ORDER BY random()
   LIMIT 5;
END;
$function$;
REVOKE ALL ON FUNCTION public.premium_profesionales_panel() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.premium_profesionales_panel() TO authenticated;
