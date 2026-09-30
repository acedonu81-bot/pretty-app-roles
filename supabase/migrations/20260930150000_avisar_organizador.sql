-- Auditoría de flujos 30 sep 2026: el organizador (quien publica la oferta o
-- pide la reserva) no recibía NINGÚN aviso cuando el profesional aceptaba su
-- oferta ni cuando confirmaba/rechazaba su reserva directa. El profesional sí
-- recibía todo (preseleccionado, contratado, booking). "Los empresarios no
-- esperan": sin aviso tenía que entrar a mirar.

CREATE OR REPLACE FUNCTION public.avisar_organizador_aceptacion()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_cliente uuid; v_titulo text; v_pro text;
BEGIN
  IF NEW.hired_at IS NULL OR OLD.hired_at IS NOT NULL THEN RETURN NEW; END IF;
  BEGIN
    SELECT client_user_id::uuid, COALESCE(NULLIF(trim(event_type), ''), 'tu evento')
      INTO v_cliente, v_titulo FROM public.event_requests WHERE id = NEW.request_id;
    IF v_cliente IS NULL OR v_cliente = NEW.professional_user_id THEN RETURN NEW; END IF;
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'El profesional') INTO v_pro
      FROM public.profiles WHERE user_id = NEW.professional_user_id;
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (v_cliente, 'oferta_aceptada', v_pro || ' ha aceptado',
            v_pro || ' ha aceptado tu oferta (' || v_titulo || '). Ya tenéis el chat abierto para cerrar los detalles.',
            '/dashboard?view=flashbooking');
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', v_cliente, 'title', v_pro || ' ha aceptado',
        'body', 'Ha aceptado tu oferta. Entra para hablar con él/ella.', 'url', '/dashboard?view=flashbooking'));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_organizador_aceptacion: %', SQLERRM;
  END;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_avisar_organizador_aceptacion ON public.event_request_responses;
CREATE TRIGGER trg_avisar_organizador_aceptacion
  AFTER UPDATE OF hired_at ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.avisar_organizador_aceptacion();

CREATE OR REPLACE FUNCTION public.avisar_organizador_estado_reserva()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_pro text; v_titulo text; v_cuerpo text;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status OR NEW.created_by IS NULL
     OR NEW.status NOT IN ('confirmed', 'rejected')
     OR auth.uid() = NEW.created_by THEN
    RETURN NEW;
  END IF;
  BEGIN
    v_pro := COALESCE(NULLIF(trim(NEW.professional_name), ''), 'El profesional');
    IF NEW.status = 'confirmed' THEN
      v_titulo := v_pro || ' ha aceptado tu solicitud';
      v_cuerpo := v_pro || ' confirma que puede' || COALESCE(' el ' || NULLIF(NULLIF(trim(NEW.event_date), ''), 'Por confirmar'), '')
                  || '. Escríbele para cerrar los detalles.';
    ELSE
      v_titulo := v_pro || ' no está disponible';
      v_cuerpo := v_pro || ' no puede aceptar tu solicitud' || COALESCE(' para el ' || NULLIF(NULLIF(trim(NEW.event_date), ''), 'Por confirmar'), '')
                  || '. Puedes buscar a otro profesional o publicar una oferta para recibir propuestas.';
    END IF;
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.created_by, 'reserva_' || NEW.status, v_titulo, v_cuerpo, '/dashboard?view=flashbooking');
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', NEW.created_by, 'title', v_titulo, 'body', v_cuerpo, 'url', '/dashboard?view=flashbooking'));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_organizador_estado_reserva: %', SQLERRM;
  END;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_avisar_organizador_estado_reserva ON public.flash_bookings;
CREATE TRIGGER trg_avisar_organizador_estado_reserva
  AFTER UPDATE OF status ON public.flash_bookings
  FOR EACH ROW EXECUTE FUNCTION public.avisar_organizador_estado_reserva();

-- notify_contratacion va entera dentro de EXCEPTION WHEN OTHERS: si el cast de
-- event_date a date fallaba (texto libre), se deshacían en silencio TODOS sus
-- efectos (aviso, calendario, chat, cierre de oferta). Cast seguro.
DO $mig$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.notify_contratacion'::regproc);
  IF position('fecha_segura' IN d) > 0 THEN RETURN; END IF;
  d := replace(d, $x$SELECT ARRAY[NULLIF(trim(err.event_date), '')::date] INTO v_fechas$x$,
    $x$SELECT ARRAY[CASE WHEN trim(err.event_date) ~ '^\d{4}-\d{2}-\d{2}$' THEN trim(err.event_date)::date END] /* fecha_segura */ INTO v_fechas$x$);
  IF position('fecha_segura' IN d) = 0 THEN RAISE EXCEPTION 'no se encontró el cast de fecha en notify_contratacion'; END IF;
  EXECUTE d;
END
$mig$;
