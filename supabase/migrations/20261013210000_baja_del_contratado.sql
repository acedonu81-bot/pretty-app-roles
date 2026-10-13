-- 13 oct 2026: el profesional contratado dice que no. Se borra su candidatura y este
-- trigger avisa al organizador (campana, push y email) de que relance la oferta, quita
-- el bolo del calendario del profesional y avisa a los admins.
CREATE OR REPLACE FUNCTION public.avisar_baja_del_contratado()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_cliente uuid; v_titulo text; v_pro text; v_link text; v_secret text; v_email text; v_nombre text; v_admin uuid;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  IF OLD.hired_at IS NULL THEN RETURN OLD; END IF;
  BEGIN
    SELECT client_user_id::uuid, COALESCE(NULLIF(trim(client_name), ''), 'tu oferta')
      INTO v_cliente, v_titulo FROM public.event_requests WHERE id = OLD.request_id;
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'El profesional') INTO v_pro
      FROM public.profiles WHERE user_id = OLD.professional_user_id
      ORDER BY is_primary DESC NULLS LAST LIMIT 1;
    v_pro := COALESCE(v_pro, 'El profesional');
    v_link := '/dashboard?view=flashbooking&tab=demanda&oferta=' || OLD.request_id::text;
    BEGIN
      SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
    EXCEPTION WHEN OTHERS THEN v_secret := NULL;
    END;

    DELETE FROM public.calendar_events
     WHERE user_id = OLD.professional_user_id AND title = v_titulo
       AND notes LIKE 'Añadido automáticamente%';

    -- Anula la contratacion en el panel admin: la fila "Contratado" desaparece sola
    -- (sale de esta candidatura) y se borra su aviso.
    DELETE FROM public.notifications
     WHERE type = 'admin_contratacion' AND title = 'Contratación cerrada: ' || v_pro
       AND body LIKE v_titulo || '%';

    IF v_cliente IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_cliente, 'oferta_baja', v_pro || ' ya no puede',
              'Relanza la oferta de ' || v_titulo || ' para buscar a otro profesional.', v_link);
      BEGIN
        IF v_secret IS NOT NULL THEN
          PERFORM net.http_post(
            url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
            headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
            body := jsonb_build_object('user_id', v_cliente, 'title', v_pro || ' ya no puede',
              'body', 'Relanza tu oferta para buscar a otro.', 'url', v_link, 'tag', 'baja-' || OLD.id));
        END IF;
      EXCEPTION WHEN OTHERS THEN RAISE WARNING 'baja: push falló: %', SQLERRM;
      END;
      BEGIN
        IF v_secret IS NOT NULL THEN
          SELECT u.email, COALESCE(NULLIF(trim(p.display_name), ''), 'organizador') INTO v_email, v_nombre
            FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
            WHERE u.id = v_cliente AND COALESCE(p.email_opt_out, false) = false AND u.email NOT LIKE '%@xpeak.es'
            ORDER BY p.is_primary DESC NULLS LAST LIMIT 1;
          IF v_email IS NOT NULL THEN
            PERFORM net.http_post(
              url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
              headers := jsonb_build_object('Authorization', 'Bearer ' || v_anon, 'x-internal-secret', v_secret, 'Content-Type', 'application/json'),
              body := jsonb_build_object('type', 'oferta_baja', 'data', jsonb_build_object(
                'email', v_email, 'user_id', v_cliente, 'name', v_nombre,
                'request_id', OLD.request_id, 'titulo', v_titulo, 'profesional', v_pro)));
          END IF;
        END IF;
      EXCEPTION WHEN OTHERS THEN RAISE WARNING 'baja: email falló: %', SQLERRM;
      END;
    END IF;

    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_admin, 'admin_oferta_baja', v_pro || ' se ha dado de baja de ' || v_titulo,
              'El organizador debe relanzar la oferta.', '/dashboard?view=admin');
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_baja_del_contratado: %', SQLERRM;
  END;
  RETURN OLD;
END $function$;

DROP TRIGGER IF EXISTS trg_avisar_baja_del_contratado ON public.event_request_responses;
CREATE TRIGGER trg_avisar_baja_del_contratado
  AFTER DELETE ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.avisar_baja_del_contratado();
