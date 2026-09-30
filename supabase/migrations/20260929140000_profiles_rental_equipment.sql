-- Equipo que alquila un profesional (rol 'alquiler', principal o secundario).
-- Va en su propia columna, igual que class_styles, para no mezclarse con
-- genres: un DJ que también alquila su equipo conserva sus géneros aparte.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rental_equipment text[];

-- profiles tiene permisos por columna: una columna nueva NO hereda SELECT
-- (caso response_bucket, 16 sep 2026: todos los perfiles públicos daban 401).
GRANT SELECT (rental_equipment) ON public.profiles TO anon, authenticated;
GRANT INSERT (rental_equipment), UPDATE (rental_equipment) ON public.profiles TO authenticated;
