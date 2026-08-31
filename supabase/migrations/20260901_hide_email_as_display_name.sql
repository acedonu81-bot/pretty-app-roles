-- Un alta por Google OAuth sin nombre acababa guardando el EMAIL como
-- display_name (ver 20260901_signup_category_zone_name.sql). El trigger ya no
-- lo hará, pero el perfil afectado del 31 ago 2026 conserva su email como
-- nombre y, al pasar a category='professional', quedaría expuesto en el
-- directorio y en las páginas públicas: publicar el correo de alguien sin su
-- consentimiento es una fuga de dato personal, no un fallo estético.
--
-- No se inventa un nombre (no hay forma de saberlo) ni se borra la cuenta.
-- Se marca el perfil como no público para que no aparezca en listados hasta
-- que su dueño ponga un nombre real. is_public ya lo respetan las vistas
-- públicas, así que no hace falta tocar ninguna consulta.
UPDATE public.profiles
SET is_public = false
WHERE display_name LIKE '%@%'
  AND display_name LIKE '%.%'
  AND is_public IS NOT false;
