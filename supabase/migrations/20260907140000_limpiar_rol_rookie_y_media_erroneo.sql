-- Limpieza de dos roles que ensucian el directorio (7 sep 2026).
--
-- 1) 'rookie' ("DJ / Artista Promesa") se retiro de la web: ya no aparece en el
--    selector de Mi Ficha, asi que nadie nuevo puede marcarlo. Pero 2 perfiles
--    siguen arrastrando el valor antiguo en su array `roles`, y las tablas de
--    etiquetas del dashboard lo siguen traduciendo como "Promesa". Se elimina
--    del array sin tocar el resto de oficios.
--
-- 2) Sairo (DJ real) aparecia en el directorio de "Media & Contenido" porque
--    tenia 'media' en `roles`. No es fotografo: marco la opcion cuando el
--    selector la etiquetaba "Foto & Video" y entendio que servia para subir
--    fotos de sus sesiones. La etiqueta ya se ha corregido en ProfileView para
--    que coincida con el nombre del directorio, y ahora se pide confirmacion
--    antes de anadir un oficio; aqui se repara el dato que dejo aquel fallo.
--
-- Se usa array_remove, que respeta el resto de valores y no falla si el rol no
-- esta presente. `role` (el oficio principal) no se toca en ningun caso.

-- 1) Fuera 'rookie' de todos los perfiles que lo conserven.
UPDATE public.profiles
SET    roles = array_remove(roles, 'rookie')
WHERE  roles @> ARRAY['rookie'];

-- 2) Fuera 'media' solo en el perfil de Sairo, que no ofrece ese servicio.
UPDATE public.profiles
SET    roles = array_remove(roles, 'media')
WHERE  user_id = '1d69aaa6-2ddd-4665-bf5d-70798e8514a3'
AND    roles @> ARRAY['media'];

-- Salvaguarda: un perfil no puede quedarse sin ningun oficio. Si al quitar los
-- roles anteriores el array queda vacio, se rellena con el oficio principal
-- (caso de Aurora Timon: role='grupo-musical' con roles=['rookie']).
UPDATE public.profiles
SET    roles = ARRAY[role]
WHERE  (roles IS NULL OR cardinality(roles) = 0)
AND    role IS NOT NULL
AND    role NOT IN ('pending', 'empresario');
