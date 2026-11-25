-- 25 nov 2026: al publicar una oferta, el organizador solo veía un aviso en
-- pantalla. Ahora recibe también un email de confirmación (plantilla
-- oferta_publicada_confirm de send-email, dedupe por oferta). Se añade al final
-- de notify_new_event_request, en su propio BEGIN/EXCEPTION, sobre la versión
-- que hay en producción (idempotente: no se repite si ya está).
DO $mig$
DECLARE
  v_def text := pg_get_functiondef('public.notify_new_event_request'::regproc);
  v_bloque text := $b$
  -- Confirmación al organizador (si tiene cuenta y email).
  BEGIN
    IF v_secret IS NOT NULL AND v_cliente IS NOT NULL THEN
      SELECT u.email INTO v_email FROM auth.users u WHERE u.id = v_cliente;
      IF v_email IS NOT NULL THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
          body := jsonb_build_object('type', 'oferta_publicada_confirm', 'data', jsonb_build_object(
            'name', NULLIF(trim(NEW.client_name), ''), 'email', v_email, 'user_id', v_cliente, 'request_id', NEW.id,
            'roles', NULLIF(array_to_string(v_roles, ', '), ''),
            'city', NULLIF(trim(NEW.city), ''),
            'fechas', to_jsonb(v_fechas))));
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_new_event_request: confirmación al organizador falló: %', SQLERRM;
  END;
  RETURN NEW;$b$;
BEGIN
  IF position('oferta_publicada_confirm' in v_def) = 0 THEN
    IF position('  RETURN NEW;' in v_def) = 0 THEN RAISE EXCEPTION 'no se encontró RETURN NEW'; END IF;
    EXECUTE replace(v_def, '  RETURN NEW;', v_bloque);
  END IF;
END
$mig$;
