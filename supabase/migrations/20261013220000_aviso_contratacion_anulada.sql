-- 13 oct 2026: el organizador anula una contratacion (Relanzar oferta con alguien contratado).
-- Al profesional se le avisa de que se ha caido, y se le quita el bolo del calendario.
CREATE OR REPLACE FUNCTION public.avisar_contratacion_anulada()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_pro text; v_secret text; v_email text; v_nombre text; v_admin uuid;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  IF OLD.hired_at IS NULL OR NEW.hired_at IS NOT NULL THEN RETURN NEW; END IF;
  BEGIN
    SELECT COALESCE(NULLIF(trim(client_name), ''), 'El organizador') INTO v_titulo
      FROM public.event_requests WHERE id = NEW.request_id;
    v_titulo := COALESCE(v_titulo, 'El organizador');
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'El profesional') INTO v_pro
      FROM public.profiles WHERE user_id = NEW.professional_user_id
      ORDER BY is_primary DESC NULLS LAST LIMIT 1;
    v_pro := COALESCE(v_pro, 'El profesional');
    BEGIN
      SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
    EXCEPTION WHEN OTHERS THEN v_secret := NULL;
    END;

    DELETE FROM public.calendar_events
     WHERE user_id = NEW.professional_user_id AND title = v_titulo
       AND notes LIKE 'Añadido automáticamente%';
    DELETE FROM public.notifications
     WHERE type = 'admin_contratacion' AND title = 'Contratación cerrada: ' || v_pro
       AND body LIKE v_titulo || '%';

    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.professional_user_id, 'contratacion_anulada', 'Se ha caído la contratación',
            v_titulo || ' ha anulado tu contratación y ha vuelto a abrir la oferta. Puedes escribirle por el chat.',
            '/dashboard?view=messages');

    BEGIN
      IF v_secret IS NOT NULL THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
          headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
          body := jsonb_build_object('user_id', NEW.professional_user_id, 'title', 'Se ha caído la contratación',
            'body', v_titulo || ' ha anulado tu contratación.', 'url', '/dashboard?view=messages', 'tag', 'anulada-' || NEW.id));
      END IF;
    EXCEPTION WHEN OTHERS THEN RAISE WARNING 'anulada: push falló: %', SQLERRM;
    END;
    BEGIN
      IF v_secret IS NOT NULL THEN
        SELECT u.email, COALESCE(NULLIF(trim(p.display_name), ''), 'profesional') INTO v_email, v_nombre
          FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
          WHERE u.id = NEW.professional_user_id AND COALESCE(p.email_opt_out, false) = false AND u.email NOT LIKE '%@xpeak.es'
          ORDER BY p.is_primary DESC NULLS LAST LIMIT 1;
        IF v_email IS NOT NULL THEN
          PERFORM net.http_post(
            url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
            headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
            body := jsonb_build_object('type', 'contratacion_anulada', 'data', jsonb_build_object(
              'email', v_email, 'name', v_nombre, 'titulo', v_titulo)));
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN RAISE WARNING 'anulada: email falló: %', SQLERRM;
    END;

    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_admin, 'admin_contratacion_anulada', v_titulo || ' ha anulado la contratación de ' || v_pro,
              'La oferta se ha vuelto a abrir.', '/dashboard?view=admin');
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_contratacion_anulada: %', SQLERRM;
  END;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_avisar_contratacion_anulada ON public.event_request_responses;
CREATE TRIGGER trg_avisar_contratacion_anulada
  AFTER UPDATE ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.avisar_contratacion_anulada();
