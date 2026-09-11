-- La campana avisaba de una solicitud sin decir qué pedía el organizador.
--
-- Caso real: 11 sep 2026, "Sala Aurora Eventos" contrata a un profesional vía
-- Flash Booking. La campana solo dijo "Sala Aurora Eventos quiere contratarte
-- para el 5 de septiembre en Madrid" — el mensaje/condiciones que el
-- organizador escribió en el campo "Descripción" (aforo, horario, detalles) y
-- el caché ofrecido nunca llegaron a la notificación. El email sí los
-- incluía, pero nadie mira el email primero: la campana es la que se ve.
--
-- Es el mismo bug del caso Ramón reapareciendo, esta vez no por tabla nueva
-- sin trigger sino por trigger existente con columna incompleta — y en las
-- tres tablas del ecosistema Flash Booking a la vez (se copiaron entre sí).
--
-- flash_bookings.event_description / agreed_price
-- flash_jobs.description
-- event_requests.description
-- ninguno se propagaba al body de notifications.

CREATE OR REPLACE FUNCTION public.notify_new_flash_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_is_seed boolean;
  v_when text;
  v_cuerpo text;
  v_cuerpo_prof text;
  v_admin uuid;
  v_extra text;
BEGIN
  v_when := NULLIF(trim(NEW.event_date), '');
  IF v_when IS NOT NULL THEN
    BEGIN
      v_when := extract(day from v_when::date)::text || ' de ' || (ARRAY[
        'enero','febrero','marzo','abril','mayo','junio',
        'julio','agosto','septiembre','octubre','noviembre','diciembre'
      ])[extract(month from v_when::date)::int];
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  v_extra := trim(both ' ' from
    CASE WHEN NEW.agreed_price IS NOT NULL THEN 'Caché: ' || NEW.agreed_price || '€. ' ELSE '' END
    || COALESCE(NULLIF(trim(NEW.event_description), ''), '')
  );

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
    || ' quiere contratar'
    || CASE WHEN NULLIF(trim(NEW.professional_name), '') IS NOT NULL
            THEN ' a ' || NEW.professional_name ELSE 'te' END
    || CASE WHEN v_when IS NOT NULL THEN ' para el ' || v_when ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.event_location), '') IS NOT NULL
            THEN ' en ' || NEW.event_location ELSE '' END
    || CASE WHEN v_extra <> '' THEN '. ' || v_extra ELSE '' END
  );

  v_cuerpo_prof := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
    || ' quiere contratarte'
    || CASE WHEN v_when IS NOT NULL THEN ' para el ' || v_when ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.event_location), '') IS NOT NULL
            THEN ' en ' || NEW.event_location ELSE '' END
    || CASE WHEN v_extra <> '' THEN '. ' || v_extra ELSE '' END
  );

  IF NEW.professional_user_id IS NOT NULL THEN
    SELECT is_seed_profile INTO v_is_seed
    FROM public.profiles WHERE user_id = NEW.professional_user_id;

    IF v_is_seed IS DISTINCT FROM TRUE THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        NEW.professional_user_id, 'booking', 'Nueva solicitud de reserva',
        v_cuerpo_prof,
        '/dashboard?view=flashbooking'
      );
    END IF;
  END IF;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_booking', 'Solicitud nueva de un cliente', v_cuerpo,
      '/dashboard?view=admin'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_new_flash_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_empresa text;
  v_cuerpo text;
  v_rol text;
  v_dest uuid;
  v_admin uuid;
  v_avisados int := 0;
  v_detalle text;
BEGIN
  SELECT display_name INTO v_empresa
  FROM public.profiles WHERE user_id = NEW.employer_id;
  v_empresa := COALESCE(NULLIF(trim(v_empresa), ''), 'Un organizador');

  v_detalle := COALESCE(NULLIF(trim(NEW.title), ''), NULLIF(trim(NEW.description), ''));

  v_cuerpo := trim(both ' ' from
    v_empresa || ' busca ' || COALESCE(NULLIF(trim(NEW.role_needed), ''), 'profesionales')
    || CASE WHEN NULLIF(trim(NEW.location), '') IS NOT NULL
            THEN ' en ' || NEW.location ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.pay), '') IS NOT NULL
            THEN ' · ' || NEW.pay ELSE '' END
    || CASE WHEN v_detalle IS NOT NULL THEN '. ' || v_detalle ELSE '' END
  );

  v_rol := lower(trim(COALESCE(NEW.role_needed, '')));

  FOR v_dest IN
    SELECT p.user_id FROM public.profiles p
    WHERE p.user_id IS NOT NULL
      AND p.user_id <> NEW.employer_id
      AND p.role NOT IN ('empresario', 'pending')
      AND p.is_seed_profile IS DISTINCT FROM TRUE
      AND (
        v_rol = ''
        OR lower(p.role) LIKE '%' || v_rol || '%'
        OR v_rol LIKE '%' || lower(p.role) || '%'
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_dest, 'flash_job', 'Nueva oferta Flash para ti',
      v_cuerpo, '/dashboard?view=flashbooking'
    );
    v_avisados := v_avisados + 1;
  END LOOP;

  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_flash_job', 'Oferta Flash nueva de un organizador',
      v_cuerpo || ' — ' || v_avisados || ' profesional(es) avisados',
      '/dashboard?view=flashbooking'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

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
    || CASE WHEN NULLIF(trim(NEW.description), '') IS NOT NULL
            THEN '. ' || NEW.description ELSE '' END
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
