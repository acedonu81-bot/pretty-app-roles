-- Una cuenta no puede tener dos perfiles del mismo oficio (14 oct 2026).
-- Dj eloy creó desde Ajustes > Mis perfiles dos copias vacías de su perfil de
-- Disco Móvil (seguramente buscando dónde cambiar el precio) y salía repetido
-- en el directorio. La app ya lo impide en Ajustes; esto lo impide por
-- cualquier camino de entrada.

-- 1. Copias vacías de hoy (sin foto ni texto, no activas). Eran los únicos
--    duplicados de toda la tabla.
delete from public.profiles
where id in ('a708d057-825b-4416-a33a-ea13add21a54', '85a0e878-e26d-4b3d-a960-2f1496bb0206')
  and user_id = '7de8fcc3-255a-4a30-a7c4-8dff7be88cc7'
  and photo_url is null
  and bio is null
  and is_primary = false;

-- 2. La regla.
create unique index if not exists profiles_un_perfil_por_oficio
  on public.profiles (user_id, role);
