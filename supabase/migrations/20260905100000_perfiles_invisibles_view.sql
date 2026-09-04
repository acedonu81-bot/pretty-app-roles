-- Perfiles reales que NO aparecen en ningún directorio de ciudad, hoy.
--
-- AdminNewProfileAlert avisa de "sin comunidad" / "sin foto" solo mientras el
-- alta está sin marcar como revisada (admin_seen_at IS NULL). En cuanto se
-- marca como vista, el aviso desaparece aunque el perfil SIGA sin foto o sin
-- ciudad para siempre — medido el 5 sep: los 8 camareros reales están todos
-- marcados como "revisados" y 7 no tienen foto, 5 no tienen ciudad real.
--
-- Esta vista no depende de admin_seen_at: enseña el estado actual de
-- visibilidad, sea el perfil de hace un día o de hace tres meses.
CREATE OR REPLACE VIEW public.admin_perfiles_invisibles AS
SELECT
  p.user_id,
  p.display_name,
  p.role,
  p.zone,
  p.created_at,
  (p.photo_url IS NULL OR length(p.photo_url) < 10) AS sin_foto,
  (p.zone IS NULL OR p.zone = 'España' OR trim(p.zone) = '') AS sin_ciudad_real
FROM public.profiles p
WHERE p.is_seed = false
  AND p.role NOT IN ('empresario', 'pending')
  AND (
    p.photo_url IS NULL OR length(p.photo_url) < 10
    OR p.zone IS NULL OR p.zone = 'España' OR trim(p.zone) = ''
  )
ORDER BY p.created_at DESC;

COMMENT ON VIEW public.admin_perfiles_invisibles IS
  'Profesionales sin foto o sin ciudad real, sea cual sea la antigüedad del alta. Sin esto, no aparecen en /contratar-:categoria/:ciudad. No depende de admin_seen_at, así que no desaparece al marcar el alta como revisada.';

REVOKE ALL ON public.admin_perfiles_invisibles FROM anon, authenticated;
GRANT SELECT ON public.admin_perfiles_invisibles TO authenticated;
