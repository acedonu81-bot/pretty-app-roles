-- Analítica propia de XPEAK: tráfico por día y por hora sin depender de nadie.
--
-- Hasta ahora track() mandaba todo a GA4 vía GTM y no guardaba copia: los
-- datos son de Google, se leen en una interfaz que al usuario le cuesta, y
-- Vercel Analytics devuelve 404 porque exige plan Pro. Resultado: no había
-- forma de responder "¿cuánta gente entró ayer?" sin pelearse con GA4.
--
-- Esta tabla guarda el evento mínimo imprescindible para reconstruir tráfico
-- por día/hora. NO guarda IP, ni user-agent completo, ni nada que identifique
-- a una persona: solo la ruta, el tipo de evento, el origen y una marca de
-- tiempo. Con eso basta para las gráficas y evita convertir la tabla en un
-- fichero de datos personales sujeto a consentimiento previo (RGPD).
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id           bigserial PRIMARY KEY,
  event_name   text NOT NULL,
  path         text,
  -- Hostname del referrer (google.com, chatgpt.com…), nunca la URL completa:
  -- una URL de referrer puede llevar términos de búsqueda o identificadores.
  referrer     text,
  -- 'mobile' | 'desktop' | 'tablet'. Categoría, no huella del dispositivo.
  device       text,
  -- Sesión anónima y efímera (sessionStorage): permite distinguir "1 persona
  -- viendo 8 páginas" de "8 personas". Se pierde al cerrar la pestaña y no se
  -- puede cruzar con ninguna identidad.
  session_id   text,
  -- Solo si hay sesión iniciada. Sirve para separar tráfico propio del real.
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.analytics_events IS
  'Analítica propia (tráfico por día/hora). Sin IP ni datos personales: solo ruta, origen y tipo de dispositivo.';

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events (event_name, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Nadie lee la tabla en crudo salvo admin. Las gráficas se sirven de las
-- funciones agregadas de más abajo, que no exponen filas individuales.
DROP POLICY IF EXISTS "Admins leen analytics" ON public.analytics_events;
CREATE POLICY "Admins leen analytics"
ON public.analytics_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

-- Escritura vía RPC SECURITY DEFINER: la visita hay que registrarla también
-- para usuarios anónimos (que son la mayoría del tráfico de Google), así que
-- no puede depender de RLS para 'authenticated'.
--
-- Anti-basura: los campos se recortan y event_name se restringe a una lista
-- blanca. Sin la lista, cualquiera podría inflar la tabla con nombres
-- arbitrarios y ensuciar las gráficas para siempre.
CREATE OR REPLACE FUNCTION public.log_analytics_event(
  p_event_name text,
  p_path text DEFAULT NULL,
  p_referrer text DEFAULT NULL,
  p_device text DEFAULT NULL,
  p_session_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF p_event_name IS NULL OR p_event_name NOT IN (
    'page_view', 'signup', 'login', 'flash_request', 'message_sent',
    'profile_view', 'contact_click', 'favorite', 'resources_view',
    'affiliate_click'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.analytics_events (event_name, path, referrer, device, session_id, user_id)
  VALUES (
    p_event_name,
    left(p_path, 300),
    left(p_referrer, 200),
    left(p_device, 20),
    left(p_session_id, 64),
    auth.uid()
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.log_analytics_event(text, text, text, text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Funciones de lectura para el panel. Devuelven series ya agregadas.
--
-- Cada una excluye por defecto el tráfico de usuarios admin: el propio
-- trabajo de Daniel entrando a mirar el panel inflaba las cifras (ya pasó con
-- GA4: 454 sesiones brutas de las que ~85 eran previews y logins propios).
-- ---------------------------------------------------------------------------

-- Tráfico por DÍA en los últimos N días.
CREATE OR REPLACE FUNCTION public.analytics_por_dia(p_dias int DEFAULT 30)
RETURNS TABLE (dia date, visitas bigint, sesiones bigint, registros bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH dias AS (
    SELECT generate_series(
      (now() AT TIME ZONE 'Europe/Madrid')::date - (LEAST(GREATEST(p_dias, 1), 365) - 1),
      (now() AT TIME ZONE 'Europe/Madrid')::date,
      '1 day'::interval
    )::date AS dia
  ),
  ev AS (
    SELECT
      (created_at AT TIME ZONE 'Europe/Madrid')::date AS dia,
      event_name, session_id
    FROM public.analytics_events
    WHERE created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
      AND (user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  )
  SELECT
    d.dia,
    count(*) FILTER (WHERE e.event_name = 'page_view')::bigint AS visitas,
    count(DISTINCT e.session_id) FILTER (WHERE e.event_name = 'page_view')::bigint AS sesiones,
    count(*) FILTER (WHERE e.event_name = 'signup')::bigint AS registros
  FROM dias d
  LEFT JOIN ev e ON e.dia = d.dia
  GROUP BY d.dia
  ORDER BY d.dia;
$function$;

-- Tráfico por HORA del día (0-23), agregando los últimos N días. Responde a
-- "¿a qué hora entra mi gente?", que es lo que decide cuándo publicar y
-- cuándo lanzar campañas.
CREATE OR REPLACE FUNCTION public.analytics_por_hora(p_dias int DEFAULT 7)
RETURNS TABLE (hora int, visitas bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH horas AS (SELECT generate_series(0, 23) AS hora),
  ev AS (
    SELECT extract(hour FROM created_at AT TIME ZONE 'Europe/Madrid')::int AS hora
    FROM public.analytics_events
    WHERE event_name = 'page_view'
      AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 90) || ' days')::interval
      AND (user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  )
  SELECT h.hora, count(e.hora)::bigint AS visitas
  FROM horas h LEFT JOIN ev e ON e.hora = h.hora
  GROUP BY h.hora ORDER BY h.hora;
$function$;

-- Top de páginas y de orígenes de tráfico.
CREATE OR REPLACE FUNCTION public.analytics_top(p_dias int DEFAULT 30, p_limite int DEFAULT 10)
RETURNS TABLE (tipo text, valor text, visitas bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH ev AS (
    SELECT path, referrer, device
    FROM public.analytics_events
    WHERE event_name = 'page_view'
      AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
      AND (user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  )
  (SELECT 'pagina'::text, coalesce(path, '(desconocida)'), count(*)::bigint
   FROM ev GROUP BY path ORDER BY 3 DESC LIMIT LEAST(GREATEST(p_limite, 1), 50))
  UNION ALL
  (SELECT 'origen'::text, coalesce(nullif(referrer, ''), '(directo)'), count(*)::bigint
   FROM ev GROUP BY referrer ORDER BY 3 DESC LIMIT LEAST(GREATEST(p_limite, 1), 50))
  UNION ALL
  (SELECT 'dispositivo'::text, coalesce(device, '(desconocido)'), count(*)::bigint
   FROM ev GROUP BY device ORDER BY 3 DESC LIMIT 5);
$function$;

-- Actividad real del negocio por día, leída de las tablas que YA existen (no
-- necesita el tracking nuevo, así que estas gráficas tienen histórico desde
-- el primer día del proyecto).
CREATE OR REPLACE FUNCTION public.analytics_negocio_por_dia(p_dias int DEFAULT 30)
RETURNS TABLE (dia date, altas bigint, solicitudes bigint, mensajes bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH dias AS (
    SELECT generate_series(
      (now() AT TIME ZONE 'Europe/Madrid')::date - (LEAST(GREATEST(p_dias, 1), 365) - 1),
      (now() AT TIME ZONE 'Europe/Madrid')::date,
      '1 day'::interval
    )::date AS dia
  )
  SELECT
    d.dia,
    (SELECT count(*) FROM public.profiles p
      WHERE (p.created_at AT TIME ZONE 'Europe/Madrid')::date = d.dia)::bigint AS altas,
    (SELECT count(*) FROM public.flash_bookings f
      WHERE (f.created_at AT TIME ZONE 'Europe/Madrid')::date = d.dia)::bigint AS solicitudes,
    (SELECT count(*) FROM public.messages m
      WHERE (m.created_at AT TIME ZONE 'Europe/Madrid')::date = d.dia)::bigint AS mensajes
  FROM dias d
  ORDER BY d.dia;
$function$;

-- Solo admin ejecuta las lecturas: son SECURITY DEFINER y saltan RLS, así que
-- sin este REVOKE cualquier usuario autenticado leería las cifras del negocio.
REVOKE EXECUTE ON FUNCTION public.analytics_por_dia(int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_por_hora(int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_top(int, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_negocio_por_dia(int) FROM anon, authenticated;

-- Se conceden a authenticated pero cada función comprueba el rol admin dentro
-- mediante la vista de abajo. Postgres no permite condicionar un GRANT al
-- contenido de una tabla, así que el filtro va en una capa envolvente.
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin');
$function$;

GRANT EXECUTE ON FUNCTION public.es_admin() TO authenticated;

-- Envoltorios que sí puede llamar el cliente: comprueban admin y delegan.
CREATE OR REPLACE FUNCTION public.panel_analytics_dia(p_dias int DEFAULT 30)
RETURNS TABLE (dia date, visitas bigint, sesiones bigint, registros bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_por_dia(p_dias);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_hora(p_dias int DEFAULT 7)
RETURNS TABLE (hora int, visitas bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_por_hora(p_dias);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_top(p_dias int DEFAULT 30, p_limite int DEFAULT 10)
RETURNS TABLE (tipo text, valor text, visitas bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_top(p_dias, p_limite);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_negocio(p_dias int DEFAULT 30)
RETURNS TABLE (dia date, altas bigint, solicitudes bigint, mensajes bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_negocio_por_dia(p_dias);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.panel_analytics_dia(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_hora(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_top(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_negocio(int) TO authenticated;
