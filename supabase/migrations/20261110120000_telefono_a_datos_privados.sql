-- Auditoría de seguridad 10 nov 2026: profiles.phone era legible SIN login
-- por la API REST (policy "Anon can view approved profiles" expone todas las
-- columnas). 25 teléfonos de perfiles aprobados descargables con la clave anon.
--
-- Mismo patrón que el email (SEC-06): el teléfono pasa a profile_private_data,
-- que solo lee su dueño (RLS) y el admin por RPC. profiles.phone se queda
-- siempre a NULL; un trigger recoge cualquier escritura (Ajustes, o una versión
-- vieja de la app en caché) y la guarda en el sitio privado.

-- 1. Columna privada
ALTER TABLE public.profile_private_data ADD COLUMN IF NOT EXISTS phone text;

-- 2. Copiar los teléfonos actuales (un usuario puede tener varios perfiles:
--    gana el principal, luego el más reciente con teléfono)
INSERT INTO public.profile_private_data (user_id, phone)
SELECT DISTINCT ON (p.user_id) p.user_id, p.phone
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE coalesce(btrim(p.phone), '') <> ''
ORDER BY p.user_id, p.is_primary DESC NULLS LAST, p.updated_at DESC NULLS LAST
ON CONFLICT (user_id) DO UPDATE SET phone = EXCLUDED.phone;

-- 3. Trigger: lo que se escriba en profiles.phone va a la tabla privada
CREATE OR REPLACE FUNCTION public.profiles_phone_a_privado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.phone IS DISTINCT FROM NULL THEN
    INSERT INTO public.profile_private_data (user_id, phone)
    VALUES (NEW.user_id, nullif(btrim(NEW.phone), ''))
    ON CONFLICT (user_id) DO UPDATE SET phone = EXCLUDED.phone;
    NEW.phone := NULL;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.profiles_phone_a_privado() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_phone_a_privado ON public.profiles;
CREATE TRIGGER profiles_phone_a_privado
  BEFORE INSERT OR UPDATE OF phone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_phone_a_privado();

-- 4. Vaciar la columna pública (el trigger no actúa: se escribe NULL)
UPDATE public.profiles SET phone = NULL WHERE phone IS NOT NULL;

-- 5. my_profile(): el dueño sigue viendo su teléfono
CREATE OR REPLACE FUNCTION public.my_profile()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(p) || jsonb_build_object('email', pd.email, 'phone', pd.phone)
  FROM public.profiles p
  LEFT JOIN public.profile_private_data pd ON pd.user_id = p.user_id
  WHERE p.user_id = auth.uid();
$$;

-- 6. Teléfonos para el panel de admin (AdminBusinesses)
CREATE OR REPLACE FUNCTION public.profile_phones_for_admin(p_user_ids uuid[])
RETURNS TABLE (user_id uuid, phone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pd.user_id, pd.phone
  FROM public.profile_private_data pd
  WHERE pd.user_id = ANY(p_user_ids)
    AND pd.phone IS NOT NULL
    AND public.has_role(auth.uid(), 'admin');
$$;
REVOKE EXECUTE ON FUNCTION public.profile_phones_for_admin(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.profile_phones_for_admin(uuid[]) TO authenticated;
