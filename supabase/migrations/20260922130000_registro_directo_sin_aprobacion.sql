-- Revierte el gate de aprobación manual añadido hoy (20260922120000): un
-- alta nueva vuelve a nacer visible de inmediato, sin esperar a que un admin
-- la revise. Decisión explícita del usuario: "que se registren directamente".

BEGIN;

-- El trigger nace ya 'approved' para todos los roles (antes: 'pending' o
-- 'awaiting_admin' para empresario, bloqueado por el gate de RLS de hoy).
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
  v_category := COALESCE(NULLIF(NEW.raw_user_meta_data->>'category', 'pending'), 'professional');

  INSERT INTO public.profiles (
    user_id, display_name, role, hourly_rate, zone, category,
    validation_status, validation_submitted_at
  )
  VALUES (
    NEW.id,
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
    'approved',
    now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Desbloquea a quienes se registraron hoy bajo el gate (empresarios sobre
-- todo, que el backfill de la migración anterior no cubrió).
UPDATE public.profiles
SET validation_status = 'approved'
WHERE validation_status IN ('pending', 'awaiting_admin');

COMMIT;
