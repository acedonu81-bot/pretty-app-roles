-- 19 nov 2026: contactos por profesional para el panel admin. Con el chat libre
-- (teléfono, Instagram y WhatsApp sin restricción) XPEAK deja de ver lo que
-- pasa fuera, y el precio de los planes solo debe subir cuando cada profesional
-- de pago recibe al menos 2 contactos al mes. Un contacto = una persona distinta
-- que le ha escrito (conversación nueva) o le ha pedido algo (solicitud). Si la
-- misma persona hace las dos cosas, cuenta una vez. Sin admins, sin la cuenta de
-- XPEAK, sin autorregistros, sin perfiles de ejemplo. Solo lo puede leer un admin.
CREATE OR REPLACE FUNCTION public.admin_contactos_por_profesional(p_dias integer DEFAULT 30)
RETURNS TABLE(user_id uuid, nombre text, rol text, plan text, conversaciones bigint, solicitudes bigint, contactos bigint, ultimo timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_xpeak constant uuid := 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';
  v_desde timestamptz := now() - make_interval(days => GREATEST(1, LEAST(COALESCE(p_dias, 30), 365)));
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  WITH pros AS (
    SELECT DISTINCT ON (p.user_id) p.user_id AS uid, p.display_name AS dn, p.role::text AS rl, p.subscription_tier::text AS tier
      FROM public.profiles p
     WHERE p.validation_status = 'approved'
       AND NOT COALESCE(p.is_seed, false) AND NOT COALESCE(p.is_seed_profile, false)
       AND p.role::text NOT IN ('empresario', 'pending')
       AND COALESCE(p.photo_url, '') <> ''
       AND NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = p.user_id AND r.role = 'admin')
     ORDER BY p.user_id, p.is_primary DESC
  ),
  gente AS (
    SELECT pr.uid AS pro,
           CASE WHEN c.participant_a = pr.uid THEN c.participant_b ELSE c.participant_a END AS otro,
           c.created_at AS cuando, 'c'::text AS via
      FROM pros pr
      JOIN public.conversations c ON pr.uid IN (c.participant_a, c.participant_b)
     WHERE c.created_at >= v_desde AND v_xpeak NOT IN (c.participant_a, c.participant_b)
    UNION ALL
    SELECT pr.uid, f.created_by, f.created_at, 's'::text
      FROM pros pr
      JOIN public.flash_bookings f ON f.professional_user_id = pr.uid
     WHERE f.created_at >= v_desde
       AND NOT COALESCE(f.es_autorregistro, false)
       AND f.created_by IS DISTINCT FROM f.professional_user_id
  ),
  limpia AS (
    SELECT g.* FROM gente g
     WHERE g.otro IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = g.otro AND r.role = 'admin')
  )
  SELECT pr.uid,
         COALESCE(NULLIF(trim(pr.dn), ''), 'Sin nombre'),
         pr.rl,
         pr.tier,
         count(DISTINCT l.otro) FILTER (WHERE l.via = 'c'),
         count(DISTINCT l.otro) FILTER (WHERE l.via = 's'),
         count(DISTINCT l.otro),
         max(l.cuando)
    FROM pros pr
    LEFT JOIN limpia l ON l.pro = pr.uid
   GROUP BY pr.uid, pr.dn, pr.rl, pr.tier
   ORDER BY 7 DESC, 8 DESC NULLS LAST;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_contactos_por_profesional(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_contactos_por_profesional(integer) TO authenticated;
