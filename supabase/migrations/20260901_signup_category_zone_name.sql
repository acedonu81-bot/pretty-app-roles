-- Tres bugs del alta, encontrados al investigar por qué el último inscrito
-- (31 ago 2026) se quedó en category='pending' con el email como nombre.
--
-- 1) category='pending' sin salida automática.
--    Auth.tsx envía category:'pending' en el signup y NADA lo asciende: la
--    única escritura de category en toda la BD es este propio trigger, y en la
--    app solo AdminValidations (aprobación manual, que nunca se ha usado). Los
--    34 perfiles anteriores están en 'professional' porque se registraron antes
--    de ese cambio; el primero que llegó después se quedó colgado.
--    Hoy no rompe nada visible porque ninguna página pública filtra por
--    category, pero en cuanto alguna lo haga desaparecerían TODOS los registros
--    nuevos de golpe — mismo patrón que el bug de is_primary (31 ago).
--    Se ignora el 'pending' que manda el cliente y se nace publicado. La cola
--    de Admin > Validaciones sigue existiendo para quien quiera usarla.
--
-- 2) zone nunca se insertaba.
--    Auth.tsx envía zone:'España' pero el INSERT no incluía la columna, así que
--    todo perfil nacía con zone=null. Importa porque las páginas de ciudad
--    filtran por zone: un perfil sin zona no aparece en ninguna.
--
-- 3) display_name caía al email en las altas por OAuth.
--    signInWithOAuth no pasa display_name, así que COALESCE llegaba a NEW.email
--    y se guardaba el correo como nombre PÚBLICO del profesional. Google envía
--    el nombre en raw_user_meta_data->>'full_name' (o 'name'): se usan esos
--    antes de caer al email.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'dj');
  v_category text;
BEGIN
  -- 'pending' del cliente se traduce al estado publicable real. Un valor
  -- explícito distinto (p.ej. 'rookie') se respeta.
  v_category := COALESCE(NULLIF(NEW.raw_user_meta_data->>'category', 'pending'), 'professional');

  INSERT INTO public.profiles (
    user_id, display_name, role, hourly_rate, zone, category,
    validation_status, validation_submitted_at
  )
  VALUES (
    NEW.id,
    -- El email es el último recurso, no el primero: evita publicar un correo
    -- como nombre visible del profesional.
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
      NEW.email,
      ''
    ),
    v_role,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'zone'), ''), 'España'),
    v_category,
    CASE
      WHEN v_role = 'empresario' THEN 'awaiting_admin'
      ELSE 'pending'
    END,
    now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Repara el único perfil afectado por los tres bugs (alta del 31 ago 2026).
-- El nombre no se toca: no hay forma de reconstruirlo, y sobrescribirlo con
-- algo inventado sería peor. Se le da zona y categoría publicable para que
-- deje de ser invisible frente al resto.
UPDATE public.profiles
SET category = 'professional',
    zone = COALESCE(zone, 'España')
WHERE category = 'pending';
