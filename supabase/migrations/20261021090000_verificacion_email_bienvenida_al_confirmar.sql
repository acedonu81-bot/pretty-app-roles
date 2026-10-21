-- (21 oct 2026) Verificación de email para todos (decisión del usuario, por encima de la
-- ficha XDS 72,8): las altas con email y contraseña ya no entran sin confirmar el correo
-- ("Confirm email" activado en Supabase Auth). La bienvenida "cuenta activada", con el
-- enlace para rellenar los datos obligatorios, se manda al confirmar y no al registrarse:
-- antes llegaba aunque el correo fuera inventado. El aviso al admin de cada alta sigue
-- saliendo al registrarse.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'pending');
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
    validation_status, validation_submitted_at,
    marketing_consent, marketing_consent_asked_at
  )
  VALUES (
    NEW.id, v_display_name, v_role,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    v_zone, v_category,
    'approved',
    now(),
    v_marketing_consent, now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  IF COALESCE(NEW.raw_user_meta_data->>'particular', '') = 'true' THEN
    RETURN NEW;
  END IF;

  BEGIN
    -- Bienvenida solo con el email ya confirmado (Google, cuentas creadas por XPEAK).
    -- Las altas con email y contraseña la reciben al confirmar: trigger
    -- on_auth_user_confirmed (avisar_cuenta_activada).
    IF NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'welcome',
        'data', jsonb_build_object('name', v_display_name, 'email', NEW.email, 'role', v_role)
      )
    );
    END IF;

    v_admin_type := CASE WHEN v_role = 'empresario' THEN 'empresario_registered' ELSE 'profesional_registered' END;
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
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
$function$;


-- Bienvenida "cuenta activada" cuando el email pasa de sin confirmar a confirmado.
CREATE OR REPLACE FUNCTION public.avisar_cuenta_activada()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role text;
  v_name text;
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'particular', '') = 'true' THEN
    RETURN NEW;
  END IF;

  SELECT role, display_name INTO v_role, v_name
  FROM public.profiles WHERE user_id = NEW.id
  ORDER BY is_primary DESC NULLS LAST LIMIT 1;

  BEGIN
    PERFORM net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'welcome',
        'data', jsonb_build_object(
          'name', COALESCE(NULLIF(trim(v_name), ''), NEW.email),
          'email', NEW.email,
          'role', COALESCE(v_role, 'pending'),
          'user_id', NEW.id
        )
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_cuenta_activada: fallo enviando bienvenida a %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.avisar_cuenta_activada();
