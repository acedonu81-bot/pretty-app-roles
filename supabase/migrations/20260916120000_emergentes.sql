-- Categoría "Emergentes": DJs que se están iniciando, aparecen en un
-- directorio separado del de profesionales. No usa `roles[]` (para no
-- repetir el error de 'rookie', mezclado con oficios reales y filtrado
-- en 2 lugares con etiquetas distintas). Es un atributo ortogonal al
-- oficio: un perfil sigue siendo role='dj', pero experience_level
-- decide en qué directorio aparece.
--
-- El sub_nivel es autodeclarado por años de experiencia y es solo
-- informativo. El ascenso de sub_nivel y la graduación a profesional
-- (experience_level -> NULL) los decide siempre un admin a mano, tras
-- revisar sesiones subidas e Instagram — nunca automático por años.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_level text
    CHECK (experience_level IS NULL OR experience_level = 'emergente');

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS emergente_sub_nivel text
    CHECK (emergente_sub_nivel IS NULL OR emergente_sub_nivel IN ('principiante', 'medio', 'avanzado'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS emergente_anios numeric;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS emergente_verified_at timestamptz;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS emergente_verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS profiles_experience_level_idx
  ON public.profiles (experience_level)
  WHERE experience_level = 'emergente';

-- Igual que otras columnas nuevas: sin GRANT explícito, una tabla con
-- grants por columna no hereda privilegios en la nueva (bug real 16 sep
-- con ALTER TABLE sin GRANT SELECT). Se replican los mismos grants que
-- ya tiene el resto de columnas de perfil (SELECT/INSERT/UPDATE), salvo
-- en las de verificación, que solo el propio usuario puede leer y solo
-- admin/service_role puede escribir (vía la policy de UPDATE de admin
-- ya existente, no una policy nueva).
GRANT SELECT, INSERT, UPDATE (experience_level, emergente_sub_nivel, emergente_anios)
  ON public.profiles TO anon, authenticated;

GRANT SELECT (emergente_verified_at, emergente_verified_by) ON public.profiles TO anon, authenticated;
