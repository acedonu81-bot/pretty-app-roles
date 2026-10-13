-- 13 oct 2026: ELEGIR = CONTRATAR (decision del usuario: apuntarse ya es aceptar;
-- la segunda confirmacion del profesional era friccion). Sustituye al SQL anterior
-- del admin (20261013190000): incluye todo lo suyo, se puede ejecutar aunque ya
-- se hubiera pegado.
--
--  1) notify_preseleccion: no avisa "confirma tu plaza" si se elige y contrata a la
--     vez; sigue avisando al admin cuando solo hay eleccion (navegadores con la
--     version antigua abierta).
--  2) Se quita el trigger que decia al organizador "X ha confirmado": ya no hay
--     confirmacion del profesional.
--  3) notify_contratacion (aviso "te han contratado" al profesional, calendario,
--     chat, aviso a los demas): su aviso y su push abren la oferta concreta, y el
--     email lleva el id de la oferta.
--  4) Actividad del admin: la fila "Elegido" solo para elecciones sin contratar
--     (las contratadas ya salen como "Contratado").
--  5) Lo ya elegido y sin confirmar pasa a contratado (el organizador ya pulso
--     Elegir): hoy es Manuel Jesus Frias Martin en Burguerfest.

-- 1)
CREATE OR REPLACE FUNCTION public.notify_preseleccion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text; v_email text; v_email_pref boolean; v_link text; v_secret text; v_pro text; v_admin uuid;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk';
BEGIN
  -- Elegir ya cierra el bolo (chosen_at y hired_at a la vez): el aviso es el de
  -- contratacion, no el de "confirma tu plaza".
  IF NEW.chosen_at IS NULL OR OLD.chosen_at IS NOT NULL OR NEW.hired_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(client_name), ''), 'Un organizador')
  INTO v_titulo FROM public.event_requests WHERE id = NEW.request_id;
  v_titulo := COALESCE(v_titulo, 'Un organizador');
  v_link := '/dashboard?view=flashbooking&tab=demanda&oferta=' || NEW.request_id::text;

  BEGIN
    SELECT decrypted_secret INTO v_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret';
  EXCEPTION WHEN OTHERS THEN v_secret := NULL;
  END;

  BEGIN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      NEW.professional_user_id, 'preseleccionado',
      v_titulo || ' te ha elegido',
      'Entra y pulsa Aceptar el bolo para confirmar tu plaza. Si no respondes, puede elegir a otro.',
      v_link
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: campana falló: %', SQLERRM;
  END;

  BEGIN
    IF v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || v_anon,
          'x-internal-secret', v_secret,
          'Content-Type', 'application/json'),
        body := jsonb_build_object(
          'user_id', NEW.professional_user_id, 'title', v_titulo || ' te ha elegido',
          'body', 'Confirma tu plaza para cerrar el bolo.', 'url', v_link,
          'tag', 'elegido-' || NEW.id)
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: push falló: %', SQLERRM;
  END;

  BEGIN
    SELECT COALESCE(pref.email_flash, true) INTO v_email_pref
    FROM public.alert_preferences pref WHERE pref.user_id = NEW.professional_user_id;
    v_email_pref := COALESCE(v_email_pref, true);

    IF v_email_pref AND v_secret IS NOT NULL THEN
      SELECT u.email INTO v_email
      FROM auth.users u JOIN public.profiles p ON p.user_id = u.id
      WHERE u.id = NEW.professional_user_id
        AND COALESCE(p.email_opt_out, false) = false
        AND u.email NOT LIKE '%@xpeak.es'
      LIMIT 1;

      IF v_email IS NOT NULL THEN
        PERFORM net.http_post(
          url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_anon,
            'x-internal-secret', v_secret,
            'Content-Type', 'application/json'),
          body := jsonb_build_object('type', 'preseleccionado', 'data', jsonb_build_object(
            'email', v_email, 'user_id', NEW.professional_user_id,
            'titulo', v_titulo, 'request_id', NEW.request_id))
        );
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: email falló: %', SQLERRM;
  END;

  -- El admin se entera de que el organizador ha elegido.
  BEGIN
    SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional') INTO v_pro
      FROM public.profiles WHERE user_id = NEW.professional_user_id
      ORDER BY is_primary DESC NULLS LAST LIMIT 1;
    v_pro := COALESCE(v_pro, 'Un profesional');
    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (v_admin, 'admin_event_chosen',
              v_titulo || ' ha elegido a ' || v_pro,
              v_pro || ' ha sido elegido para ' || v_titulo || '. Falta que confirme.',
              '/dashboard?view=admin');
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preseleccion: aviso a admins falló: %', SQLERRM;
  END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

-- 2) Ya no hay confirmacion del profesional que avisar al organizador.
DROP TRIGGER IF EXISTS trg_avisar_organizador_aceptacion ON public.event_request_responses;

-- 3) notify_contratacion: enlace a la oferta y request_id en el email. Se parte de
-- su definicion actual para no copiarla a mano; si ya enlaza o ha cambiado de
-- forma, no se toca.
DO $patch$
DECLARE
  v text; n text;
BEGIN
  v := pg_get_functiondef('public.notify_contratacion'::regproc);
  IF position('oferta=' in v) > 0 THEN
    RAISE NOTICE 'notify_contratacion ya enlaza a la oferta';
    RETURN;
  END IF;
  n := regexp_replace(v, '(hablar con quien te contrata\.'',\s*)''/dashboard\?view=flashbooking''',
                         '\1''/dashboard?view=flashbooking&tab=demanda&oferta='' || NEW.request_id::text');
  n := regexp_replace(n, '(''body'', v_titulo \|\| '' te ha elegido para el bolo\.'', ''url'', )''/dashboard\?view=flashbooking''',
                         '\1''/dashboard?view=flashbooking&tab=demanda&oferta='' || NEW.request_id::text');
  n := regexp_replace(n, '''fecha'', v_fecha\)\)', '''fecha'', v_fecha, ''request_id'', NEW.request_id))');
  IF position('request_id'', NEW.request_id' in n) = 0 OR (length(n) - length(v)) < 100 THEN
    RAISE NOTICE 'notify_contratacion ha cambiado de forma: no se modifica';
    RETURN;
  END IF;
  EXECUTE n;
END
$patch$;

-- 4) Actividad del admin: "Elegido" solo mientras falta contratar.
DO $vista$
DECLARE
  v text;
  marcador text := 'WHERE er2.hired_at IS NOT NULL) act';
  rama text := $rama$WHERE er2.hired_at IS NOT NULL
        UNION ALL
         SELECT 'eleccion_oferta'::text AS tipo,
            er3.chosen_at AS cuando,
            COALESCE(NULLIF(TRIM(BOTH FROM pr3.display_name), ''::text), 'Profesional'::text) AS quien,
            ('ELEGIDO por '::text || COALESCE(NULLIF(TRIM(BOTH FROM e4.client_name), ''::text), 'un organizador'::text))
              || ', falta que confirme'::text AS detalle,
            COALESCE(NULLIF(TRIM(BOTH FROM e4.city), ''::text), '—'::text) AS lugar,
            NULL::text AS contacto,
            er3.id::text AS ref,
            true AS pendiente,
            NULL::text AS que_pide,
            NULLIF(TRIM(BOTH FROM e4.event_date), ''::text) AS cuando_evento,
            er3.professional_user_id AS user_id
           FROM event_request_responses er3
             JOIN event_requests e4 ON e4.id = er3.request_id
             LEFT JOIN profiles pr3 ON pr3.user_id = er3.professional_user_id
          WHERE er3.chosen_at IS NOT NULL AND er3.hired_at IS NULL) act$rama$;
BEGIN
  v := pg_get_viewdef('public.admin_activity'::regclass, true);
  IF position('eleccion_oferta' in v) = 0 THEN
    IF position(marcador in v) = 0 THEN
      RAISE NOTICE 'admin_activity ha cambiado de forma: no se modifica';
      RETURN;
    END IF;
    EXECUTE 'CREATE OR REPLACE VIEW public.admin_activity AS ' || rtrim(replace(v, marcador, rama), E';\n ');
  ELSIF position('er3.chosen_at IS NOT NULL) act' in v) > 0 THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.admin_activity AS '
      || rtrim(replace(v, 'er3.chosen_at IS NOT NULL) act', 'er3.chosen_at IS NOT NULL AND er3.hired_at IS NULL) act'), E';\n ');
  END IF;
END
$vista$;

-- 5) Lo ya elegido y sin confirmar pasa a contratado. Dispara notify_contratacion:
-- aviso "te han contratado" al profesional, calendario, chat, aviso de oferta
-- cubierta a los demas candidatos y cierre de la oferta.
-- ANULADO el 13 oct 2026 (ya aplicado una vez en producción, NO volver a ejecutar):
-- convirtió en contratado a Manuel en Burguerfest cuando el organizador solo lo había
-- elegido y ellos se descartaron por chat (Seseña vs Málaga). Un solo UPDATE disparó el
-- "te han contratado" a Manuel, el "oferta cubierta" a DJ VIZARD y el cierre de la oferta.
-- UPDATE public.event_request_responses
--    SET hired_at = chosen_at
--  WHERE chosen_at IS NOT NULL AND hired_at IS NULL;
