-- Corrección de tipos del trigger anterior.
--
-- event_requests.client_user_id es TEXT (no uuid) y event_date es TEXT (no
-- date): comparar contra profiles.user_id (uuid) reventaba con
-- "operator does not exist: uuid = text" en CADA insert, es decir, el
-- organizador no habría podido ni publicar la oferta.
--
-- El cast de client_user_id va envuelto: es texto libre y una cadena que no
-- sea un uuid válido no puede tumbar la publicación. Igual con event_date.
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
  v_cliente uuid;
  v_fecha text;
BEGIN
  v_roles := COALESCE(NEW.roles_needed, ARRAY[]::text[]);

  BEGIN
    v_cliente := NULLIF(trim(NEW.client_user_id), '')::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_cliente := NULL;
  END;

  v_fecha := NULLIF(trim(NEW.event_date), '');
  IF v_fecha IS NOT NULL THEN
    BEGIN
      v_fecha := to_char(v_fecha::date, 'DD/MM');
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.client_name), ''), 'Un organizador')
    || ' busca ' || COALESCE(NULLIF(array_to_string(v_roles, ', '), ''), 'profesionales')
    || CASE WHEN NULLIF(trim(NEW.city), '') IS NOT NULL
            THEN ' en ' || NEW.city ELSE '' END
    || CASE WHEN v_fecha IS NOT NULL THEN ' para el ' || v_fecha ELSE '' END
    || CASE WHEN NEW.budget_max IS NOT NULL
            THEN ' · hasta ' || NEW.budget_max || '€' ELSE '' END
  );

  FOR v_dest IN
    SELECT p.user_id FROM public.profiles p
    WHERE p.user_id IS NOT NULL
      AND (v_cliente IS NULL OR p.user_id <> v_cliente)
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
