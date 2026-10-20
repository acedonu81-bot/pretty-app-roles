-- (20 oct 2026) Filtro de solicitudes: sin todos los datos no se manda NADA a nadie,
-- y quien pide un profesional tiene que ser organizador (perfil 'empresario').
-- Antes cualquiera "probaba" y avisaba a profesionales reales: nombre "r" repartido a
-- 10 DJs, Kesia sin fecha ni lugar (0 respuestas), un DJ usando el formulario de
-- particular con su propio correo. Los formularios avisan, pero la barrera real es esta:
-- una llamada directa a la API se salta el formulario, el trigger no.

-- 1) Texto de teclazos/prueba: "r", "jajaja", "hjajajjaja", "asdf", "test", sin vocales.
CREATE OR REPLACE FUNCTION public.solicitud_texto_basura(t text)
RETURNS boolean
LANGUAGE sql IMMUTABLE
AS $function$
  SELECT CASE
    WHEN t IS NULL THEN true
    WHEN length(regexp_replace(lower(btrim(t)), '[^[:alpha:]]', '', 'g')) < 2 THEN true
    WHEN regexp_replace(lower(t), '\s', '', 'g') ~ '^(.)\1{2,}$' THEN true
    WHEN length(regexp_replace(lower(t), '\s', '', 'g')) >= 4
         AND regexp_replace(lower(t), '\s', '', 'g') ~ '^[jhaeiou]+$'
         AND length(regexp_replace(lower(t), '[^j]', '', 'g')) >= 2 THEN true
    WHEN lower(t) ~ '(^|[^[:alpha:]])(asdf|qwer|zxcv|xxxx|test|prueba|pruebas|probando|fake|nada|ninguno)([^[:alpha:]]|$)' THEN true
    WHEN length(regexp_replace(lower(t), '[^[:alpha:]]', '', 'g')) >= 4
         AND lower(t) !~ '[aeiouáéíóúü]' THEN true
    ELSE false
  END;
$function$;

-- 2) Fecha real (YYYY-MM-DD) de hoy o futura, día de Madrid.
CREATE OR REPLACE FUNCTION public.solicitud_fecha_valida(d text)
RETURNS boolean
LANGUAGE plpgsql STABLE
AS $function$
DECLARE f date;
BEGIN
  IF d IS NULL OR d !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN RETURN false; END IF;
  f := d::date;
  RETURN f >= (now() AT TIME ZONE 'Europe/Madrid')::date;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.solicitud_contacto_valido(c text)
RETURNS boolean
LANGUAGE sql IMMUTABLE
AS $function$
  SELECT c IS NOT NULL AND (
    btrim(c) ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]{2,}$'
    OR length(regexp_replace(c, '[^0-9]', '', 'g')) >= 9
  );
$function$;

CREATE OR REPLACE FUNCTION public.es_organizador(p_user uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = p_user AND role = 'empresario');
$function$;

GRANT EXECUTE ON FUNCTION public.es_organizador(uuid) TO authenticated;

-- 3) Reservas / solicitudes a profesionales (flash_bookings).
-- Se exime lo interno: chat, manual_offline, mcp_agent y autorregistro (bolo propio).
CREATE OR REPLACE FUNCTION public.flash_bookings_exige_datos()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE falta text[] := ARRAY[]::text[];
BEGIN
  IF COALESCE(NEW.es_autorregistro, false)
     OR COALESCE(NEW.source, '') IN ('chat', 'manual_offline', 'mcp_agent')
     OR public.es_admin() THEN
    RETURN NEW;
  END IF;

  IF public.solicitud_texto_basura(NEW.requester_name) THEN falta := falta || 'nombre'; END IF;
  IF NOT public.solicitud_contacto_valido(NEW.requester_contact) THEN falta := falta || 'contacto'; END IF;
  IF NOT public.solicitud_fecha_valida(NEW.event_date) THEN falta := falta || 'fecha'; END IF;
  IF length(regexp_replace(COALESCE(NEW.event_location, ''), '[^[:alpha:]]', '', 'g')) < 3
     OR public.solicitud_texto_basura(NEW.event_location) THEN falta := falta || 'lugar'; END IF;

  IF array_length(falta, 1) > 0 THEN
    RAISE EXCEPTION 'SOLICITUD_INCOMPLETA:%', array_to_string(falta, ',')
      USING HINT = 'Sin todos los datos no se manda nada a ningún profesional';
  END IF;

  -- Quien tiene cuenta y pide un profesional debe ser organizador. Los particulares
  -- entran por la función particular-solicitud (source 'particular') y las anónimas
  -- no llevan created_by.
  IF NEW.created_by IS NOT NULL AND COALESCE(NEW.source, '') <> 'particular'
     AND NOT public.es_organizador(NEW.created_by) THEN
    RAISE EXCEPTION 'NECESITAS_PERFIL_ORGANIZADOR'
      USING HINT = 'Para pedir un profesional crea antes un perfil de organizador (Empresa / Sala)';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS flash_bookings_exige_datos ON public.flash_bookings;
CREATE TRIGGER flash_bookings_exige_datos
  BEFORE INSERT ON public.flash_bookings
  FOR EACH ROW EXECUTE FUNCTION public.flash_bookings_exige_datos();

-- 4) Ofertas del organizador (event_requests): antes INSERT público sin comprobar nada.
DROP POLICY IF EXISTS er_insert ON public.event_requests;
CREATE POLICY er_insert ON public.event_requests FOR INSERT TO authenticated
  WITH CHECK (client_user_id = (SELECT auth.uid())::text);

CREATE OR REPLACE FUNCTION public.event_requests_exige_datos()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE falta text[] := ARRAY[]::text[];
BEGIN
  -- Clave de servicio / SQL Editor (sin sesión) y admin pasan.
  IF auth.uid() IS NULL OR public.es_admin() THEN RETURN NEW; END IF;

  IF NOT public.es_organizador(auth.uid()) THEN
    RAISE EXCEPTION 'NECESITAS_PERFIL_ORGANIZADOR'
      USING HINT = 'Para publicar una oferta crea antes un perfil de organizador (Empresa / Sala)';
  END IF;

  IF public.solicitud_texto_basura(NEW.client_name) THEN falta := falta || 'nombre'; END IF;
  IF COALESCE(btrim(NEW.event_type), '') = '' THEN falta := falta || 'tipo de evento'; END IF;
  IF length(regexp_replace(COALESCE(NEW.city, ''), '[^[:alpha:]]', '', 'g')) < 3
     OR public.solicitud_texto_basura(NEW.city) THEN falta := falta || 'ciudad'; END IF;
  IF NOT (
       (NEW.event_dates IS NOT NULL AND array_length(NEW.event_dates, 1) > 0
          AND NOT EXISTS (SELECT 1 FROM unnest(NEW.event_dates) d WHERE d < (now() AT TIME ZONE 'Europe/Madrid')::date))
    OR public.solicitud_fecha_valida(NEW.event_date)
  ) THEN falta := falta || 'fecha'; END IF;
  IF NEW.budget_min IS NULL OR NEW.budget_max IS NULL OR NEW.budget_max < NEW.budget_min THEN falta := falta || 'presupuesto'; END IF;
  IF NEW.roles_needed IS NULL OR array_length(NEW.roles_needed, 1) IS NULL THEN falta := falta || 'profesionales'; END IF;
  IF COALESCE(btrim(NEW.description), '') = '' THEN falta := falta || 'descripcion'; END IF;

  IF array_length(falta, 1) > 0 THEN
    RAISE EXCEPTION 'SOLICITUD_INCOMPLETA:%', array_to_string(falta, ',')
      USING HINT = 'Sin todos los datos no se publica nada';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS event_requests_exige_datos ON public.event_requests;
CREATE TRIGGER event_requests_exige_datos
  BEFORE INSERT ON public.event_requests
  FOR EACH ROW EXECUTE FUNCTION public.event_requests_exige_datos();

-- 5) Para particular-solicitud: ¿ese email ya es una cuenta de profesional sin perfil
-- de organizador? Solo la clave de servicio puede llamarla.
CREATE OR REPLACE FUNCTION public.cuenta_profesional_sin_organizador(p_email text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE lower(u.email) = lower(p_email)
      AND COALESCE(u.raw_user_meta_data->>'particular', '') <> 'true'
      AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id AND p.role NOT IN ('pending', 'empresario'))
      AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id AND p.role = 'empresario')
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.cuenta_profesional_sin_organizador(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cuenta_profesional_sin_organizador(text) TO service_role;
