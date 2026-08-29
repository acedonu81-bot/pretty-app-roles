-- Permite que un mismo perfil tenga varios roles (ej. DJ + Fotógrafo)
-- y aparezca en el directorio de cada uno. `role` se mantiene como rol
-- principal (SEO, avatar, vista por defecto del dashboard); `roles`
-- es la lista completa que controla en qué directorios aparece.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roles TEXT[] NOT NULL DEFAULT '{}';

UPDATE public.profiles SET roles = ARRAY[role] WHERE roles = '{}';

CREATE INDEX IF NOT EXISTS profiles_roles_gin_idx ON public.profiles USING GIN (roles);
