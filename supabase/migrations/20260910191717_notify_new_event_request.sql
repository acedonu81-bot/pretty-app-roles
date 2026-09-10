-- Una solicitud de evento publicada desde Flash Booking no avisaba a nadie.
--
-- 10 sep 2026, 18:50 UTC: "Burger Gourmet Fest" publica que busca DJ para el
-- 11 y 12 de septiembre. Cero notificaciones, cero emails, nada en el panel de
-- admin. Solo visible entrando a mano a la pestaña Flash Booking.
--
-- event_requests era la TERCERA tabla del mismo flujo sin sistema de avisos,
-- después de flash_bookings (arreglada tras el caso Ramón) y flash_jobs. Y era
-- la única sin ningún trigger en absoluto.
--
-- NOTA: esta versión tiene un fallo de tipos que corrige la migración
-- 20260910191806 (client_user_id es text, no uuid). Se conserva tal cual para
-- que el historial refleje lo que se aplicó de verdad.
CREATE OR REPLACE FUNCTION public.notify_new_event_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_cuerpo text;
  v_dest uuid;
  v_admin uuid;
  v_avisados int := 0;
  v_roles text[];
BEGIN
  v_roles := COALESCE(NEW.roles_needed, ARRAY[]::text[]);

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.client_name), ''), 'Un organizador')
    || ' busca ' || COALESCE(NULLIF(array_to_string(v_roles, ', '), ''), 'profesionales')
    || CASE WHEN NULLIF(trim(NEW.city), '') IS NOT NULL
            THEN ' en ' || NEW.city ELSE '' END
    || CASE WHEN NEW.budget_max IS NOT NULL
            THEN ' · hasta ' || NEW.budget_max || '€' ELSE '' END
  );

  FOR v_dest IN
    SELECT p.user_id FROM public.profiles p
    WHERE p.user_id IS NOT NULL
      AND p.role NOT IN ('empresario', 'pending')
      AND p.is_seed_profile IS DISTINCT FROM TRUE
      AND (
        cardinality(v_roles) = 0
        OR EXISTS (
          SELECT 1 FROM unnest(v_roles) AS r
          WHERE lower(r) LIKE '%' || lower(p.role) || '%'
             OR lower(p.role) LIKE '%' || lower(split_part(r, ' /', 1)) || '%'
        )
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_dest, 'event_request', 'Nueva oferta para ti',
      v_cuerpo, '/dashboard?view=flashbooking'
    );
    v_avisados := v_avisados + 1;
  END LOOP;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_event_request', 'Solicitud de evento nueva',
      v_cuerpo || ' — ' || v_avisados || ' profesional(es) avisados',
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_new_event_request_trigger ON public.event_requests;
CREATE TRIGGER notify_new_event_request_trigger
  AFTER INSERT ON public.event_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_event_request();
