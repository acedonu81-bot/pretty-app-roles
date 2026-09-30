-- notify_new_event_request emparejaba el rol pedido (etiqueta de la UI, p.ej.
-- 'Fotógrafo') con profiles.role por LIKE aproximado. Verificado el 30 sep 2026:
-- 'Fotógrafo', 'Grupo musical', 'Maquilladora' y 'Photo Booth' NO avisaban a
-- NADIE (media / grupo-musical / makeup / photo-booth no se parecen al texto).
-- Además solo miraba el oficio principal: un DJ que también alquila equipo
-- (roles = {dj, alquiler}) no se enteraba de una petición de alquiler.
--
-- Ahora: tabla explícita etiqueta -> roles de BD (espejo de ROL_UI_A_SLUG +
-- ROLE_ALIASES en src/lib/constants.ts) y se comprueba role Y roles[].
-- Si llega una etiqueta desconocida se conserva el LIKE antiguo como red.
CREATE OR REPLACE FUNCTION public.flash_rol_ui_a_roles(p_label text)
RETURNS text[]
LANGUAGE sql IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE lower(trim(p_label))
    WHEN 'dj / artista'         THEN ARRAY['dj']
    WHEN 'fotógrafo'            THEN ARRAY['media']
    WHEN 'camarero / staff'     THEN ARRAY['staff','camarero']
    WHEN 'maquilladora'         THEN ARRAY['makeup','peluqueria']
    WHEN 'grupo musical'        THEN ARRAY['grupo-musical']
    WHEN 'animador'             THEN ARRAY['animador']
    WHEN 'promotor / rrpp'      THEN ARRAY['promotor']
    WHEN 'photo booth'          THEN ARRAY['photo-booth']
    WHEN 'catering'             THEN ARRAY['catering']
    WHEN 'técnico de sonido'    THEN ARRAY['tecnico']
    WHEN 'alquiler de equipos'  THEN ARRAY['alquiler']
    ELSE NULL
  END
$$;

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
          WHERE
            CASE WHEN public.flash_rol_ui_a_roles(r) IS NOT NULL THEN
              -- oficio principal o cualquiera de los secundarios
              (ARRAY[p.role] || COALESCE(p.roles, ARRAY[]::text[])) && public.flash_rol_ui_a_roles(r)
            ELSE
              lower(r) LIKE '%' || lower(p.role) || '%'
              OR lower(p.role) LIKE '%' || lower(split_part(r, ' /', 1)) || '%'
            END
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
