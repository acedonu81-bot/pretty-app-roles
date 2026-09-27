-- Añade consentimiento explícito de marketing en el registro (27 sep 2026).
-- Motivo: los 82 perfiles existentes nunca dieron opt-in de marketing (solo
-- aceptaron Términos/Privacidad/Cookies genéricos), así que no son una base
-- legal válida para campañas comerciales por email. `email_opt_out` tampoco
-- sirve: controla notificaciones de chat, no marketing. Esta columna nace en
-- false (nunca preseleccionada) y solo se activa por checkbox opcional real.

ALTER TABLE public.profiles
  ADD COLUMN marketing_consent boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.marketing_consent IS
  'Opt-in explícito y opcional para recibir emails de marketing/newsletter. No confundir con email_opt_out (notificaciones de chat). Nunca preseleccionado.';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'dj');
  v_category text;
  v_display_name text;
  v_zone text;
  v_admin_type text;
  v_marketing_consent boolean;
BEGIN
  v_category := COALESCE(NULLIF(NEW.raw_user_meta_data->>'category', 'pending'), 'professional');

  v_display_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
    NEW.email,
    ''
  );
  v_zone := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'zone'), ''), 'España');
  v_marketing_consent := COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false);

  INSERT INTO public.profiles (
    user_id, display_name, role, hourly_rate, zone, category,
    validation_status, validation_submitted_at, marketing_consent
  )
  VALUES (
    NEW.id, v_display_name, v_role,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    v_zone, v_category,
    'approved',
    now(),
    v_marketing_consent
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  -- Bienvenida al usuario + aviso al admin. Best-effort: un fallo aquí nunca
  -- bloquea la creación de la cuenta, solo queda en los logs de Postgres.
  BEGIN
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'welcome',
        'data', jsonb_build_object('name', v_display_name, 'email', NEW.email, 'role', v_role)
      )
    );

    v_admin_type := CASE WHEN v_role = 'empresario' THEN 'empresario_registered' ELSE 'profesional_registered' END;
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', v_admin_type,
        'data', jsonb_build_object('name', v_display_name, 'email', NEW.email, 'role', v_role, 'zone', v_zone)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: fallo enviando emails de alta para %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
