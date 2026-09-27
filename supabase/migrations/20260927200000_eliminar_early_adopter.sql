-- Elimina por completo la feature "early adopter" / aro azul (27 sep 2026):
-- badge visual, orden de listado por early adopter, override manual de admin
-- y bonus de +5 en el matching de Flash Booking, todo retirado del código.
-- is_early_adopter nunca se escribía desde el frontend (siempre false,
-- siempre sobreescrita en cliente por isEarlyAdopter()) — sin efecto real.
-- is_early_adopter_override sí tenía datos (5 perfiles en true) pero ya no
-- lo lee ningún flujo tras esta limpieza.

ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_early_adopter;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_early_adopter_override;
