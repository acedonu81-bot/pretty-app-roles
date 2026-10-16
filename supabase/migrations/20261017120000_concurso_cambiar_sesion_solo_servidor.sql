-- 17 oct 2026: cambiar la sesión del concurso solo si la actual está rota. La
-- comprobación (oEmbed de SoundCloud) la hace la función concurso-cambiar-sesion
-- en el servidor, que escribe con la clave de servicio. La RPC anterior
-- (20261017100000), que dejaba cambiarla siempre, se elimina para que nadie
-- pueda saltarse esa comprobación llamándola directamente.
DROP FUNCTION IF EXISTS public.cambiar_sesion_concurso(text);
