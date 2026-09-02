-- Aviso de altas nuevas en el panel de admin, equivalente al banner rojo de
-- bajas (20260901120000_profile_deletions_log.sql).
--
-- Por que hace falta: el 2 sep 2026 una profesional se registro con el rol
-- equivocado y una ciudad fuera de la lista, y quedo invisible en el directorio
-- durante horas sin que nadie lo viera. El email de aviso al admin ayuda, pero
-- un correo se pierde entre otros; el panel es donde se entra a mirar.
--
-- Se marca el alta como vista con una fecha, no con un booleano, para poder
-- distinguir "nunca revisada" de "revisada el dia X" si algun dia interesa.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_seen_at timestamptz;

COMMENT ON COLUMN public.profiles.admin_seen_at IS
  'Cuando el admin marco esta alta como revisada en el panel. NULL = pendiente de revisar.';

-- Los perfiles que ya existian no son "altas nuevas": se dan por revisados para
-- que el banner no aparezca de golpe con 38 avisos historicos.
UPDATE public.profiles SET admin_seen_at = now() WHERE admin_seen_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_admin_seen_at
  ON public.profiles (created_at DESC) WHERE admin_seen_at IS NULL;
