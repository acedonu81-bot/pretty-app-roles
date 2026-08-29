-- El panel Admin > Validaciones prioriza solicitudes CRÍTICO/URGENTE según
-- validation_submitted_at, pero nada del código escribía ese campo — las 31
-- solicitudes pendientes en producción lo tienen en null y aparecen como
-- "SIN FECHA" sin importar cuánto lleven esperando. handle_new_user() nunca
-- lo poblaba al crear el perfil. Los registros existentes se quedan sin fecha
-- (no hay forma de reconstruir cuándo se enviaron de verdad) — este fix solo
-- cubre altas nuevas a partir de ahora.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role, hourly_rate, category, validation_status, validation_submitted_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'dj'),
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    COALESCE(NEW.raw_user_meta_data->>'category', 'pending'),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' = 'empresario' THEN 'awaiting_admin'
      ELSE 'pending'
    END,
    now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
