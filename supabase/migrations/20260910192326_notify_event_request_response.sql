-- Aviso al organizador cuando un profesional se apunta a su oferta.
--
-- El organizador del Burger Gourmet Fest dijo que no mira el correo y que se
-- entera entrando a la web: por eso el aviso principal es la campana del
-- dashboard, no el email. El email queda como refuerzo (lo dispara el
-- frontend), pero la campana es la que no puede faltar.
CREATE OR REPLACE FUNCTION public.notify_event_request_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_owner uuid;
  v_pro text;
  v_titulo text;
  v_admin uuid;
BEGIN
  SELECT
    NULLIF(trim(r.client_user_id), '')::uuid,
    COALESCE(NULLIF(trim(r.client_name), ''), 'tu evento')
  INTO v_owner, v_titulo
  FROM public.event_requests r WHERE r.id = NEW.request_id;

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Un profesional')
  INTO v_pro FROM public.profiles WHERE user_id = NEW.professional_user_id;
  v_pro := COALESCE(v_pro, 'Un profesional');

  IF v_owner IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_owner, 'event_response',
      v_pro || ' se ha apuntado a tu oferta',
      v_pro || ' está disponible para ' || v_titulo
        || CASE WHEN NULLIF(trim(NEW.message), '') IS NOT NULL
                THEN ': "' || left(NEW.message, 100) || '"' ELSE '' END,
      '/dashboard?view=flashbooking'
    );
  END IF;

  -- El admin también: si una oferta recibe respuestas y el organizador no
  -- reacciona, hay que poder rescatarla a mano (lección del caso Ramón).
  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_event_response',
      'Respuesta a una oferta: ' || v_pro,
      v_pro || ' se ha apuntado a la oferta de ' || v_titulo,
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- El aviso nunca puede impedir que el profesional se apunte.
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_event_request_response_trigger ON public.event_request_responses;
CREATE TRIGGER notify_event_request_response_trigger
  AFTER INSERT ON public.event_request_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_event_request_response();
