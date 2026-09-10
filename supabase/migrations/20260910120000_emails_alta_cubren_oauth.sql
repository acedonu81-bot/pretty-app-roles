-- Las altas por Google OAuth no mandaban ni el email de bienvenida al
-- usuario ni el aviso "Nuevo profesional/empresario" al admin: ambos se
-- disparaban solo desde Auth.tsx, en el bloque de supabase.auth.signUp()
-- con contraseña, que el flujo de signInWithOAuth nunca ejecuta.
--
-- Detectado el 10 sep 2026 al revisar por qué no llegaba el aviso de alta:
-- el registro real de "DJ Geliux" (fjcislo@gmail.com, 9 sep 22:37, provider
-- 'google') no generó ninguna llamada a la función send-email.
--
-- Se mueve el disparo de ambos emails a handle_new_user, que corre en cada
-- alta sin importar el proveedor (password u OAuth) porque reacciona al
-- INSERT en auth.users, no a una llamada del cliente. Un fallo de red o de
-- la función de email nunca debe impedir que se cree el perfil: todo el
-- bloque de envío va en su propio EXCEPTION que solo deja rastro en los
-- logs de Postgres.
--
-- De paso se corrige que el aviso admin de un empresario usaba la plantilla
-- profesional_registered (existía empresario_registered pero nadie la
-- llamaba): ahora se elige una u otra según el rol.

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

  INSERT INTO public.profiles (
    user_id, display_name, role, hourly_rate, zone, category,
    validation_status, validation_submitted_at
  )
  VALUES (
    NEW.id, v_display_name, v_role,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    v_zone, v_category,
    CASE WHEN v_role = 'empresario' THEN 'awaiting_admin' ELSE 'pending' END,
    now()
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  -- Bienvenida al usuario + aviso al admin. Best-effort: cualquier fallo aquí
  -- (red, función caída, clave rotada) se traga y queda en los logs de
  -- Postgres, nunca bloquea la creación de la cuenta.
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
