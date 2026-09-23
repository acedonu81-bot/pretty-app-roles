-- Desde registro_directo_sin_aprobacion (22 sep) no hay aprobación manual,
-- pero el default de validation_status seguía en 'pending': cualquier perfil
-- creado con "Añadir perfil" (useProfile.createProfile no lo rellena)
-- quedaba invisible en el directorio.
ALTER TABLE public.profiles ALTER COLUMN validation_status SET DEFAULT 'approved';

-- Perfil secundario atascado en el estado 'rookie', retirado el 2 sep.
UPDATE public.profiles SET validation_status = 'approved'
WHERE validation_status = 'rookie' AND is_seed = false;

-- Vulcano Grill (alta 23 sep) se registró como empresario pero ofrece
-- catering (food truck). Se le añade un perfil profesional de catering en
-- su misma cuenta con los datos que ya rellenó; el de empresario se queda.
INSERT INTO public.profiles (
  user_id, display_name, role, category, is_primary, validation_status, validation_submitted_at,
  photo_url, bio, zone, region, city_ref, instagram, languages, specialty,
  subscription_tier, hourly_rate, is_public
)
SELECT user_id, display_name, 'catering', 'professional', false, 'approved', now(),
  photo_url, bio, zone, region, city_ref, instagram, languages, 'Food truck de hamburguesas gourmet',
  subscription_tier, 0, true
FROM public.profiles
WHERE id = '7e0d793c-c2e1-4f84-a865-b1d5ce1e1b25'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p2
    WHERE p2.user_id = '92f7a533-72fe-429e-83b4-75b551624e0c' AND p2.role = 'catering'
  );
