-- Amplía la analítica propia para responder las preguntas que de verdad
-- cambian decisiones, y que la versión inicial no cubría:
--
--   1. ¿Qué busca la gente DENTRO de XPEAK y no encuentra? (dato que ni GA4
--      ni Search Console dan: es búsqueda interna, no de Google)
--   2. ¿Se pincha algún enlace de afiliado, y cuál? Sin esto la afiliación es
--      fe ciega: Amazon solo reporta ventas, no clics por producto.
--   3. ¿Qué artículos del blog traen tráfico y cuáles no?
--
-- La tabla original guardaba solo ruta/origen/dispositivo. Se le añade una
-- columna de detalle para el término buscado, el producto pinchado, etc.
ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS detalle text;

COMMENT ON COLUMN public.analytics_events.detalle IS
  'Contexto del evento: término buscado, producto de afiliado, rol filtrado. Nunca datos personales.';

CREATE INDEX IF NOT EXISTS idx_analytics_detalle
  ON public.analytics_events (event_name, detalle)
  WHERE detalle IS NOT NULL;

-- Se rehace la función de escritura para aceptar el detalle y ampliar la lista
-- blanca con los eventos nuevos. Mantiene la firma antigua funcionando (el
-- parámetro va al final con DEFAULT) para que un cliente sin actualizar del
-- todo, o una pestaña abierta con el bundle viejo, siga registrando visitas.
CREATE OR REPLACE FUNCTION public.log_analytics_event(
  p_event_name text,
  p_path text DEFAULT NULL,
  p_referrer text DEFAULT NULL,
  p_device text DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_detalle text DEFAULT NULL
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
    'affiliate_click', 'search', 'search_sin_resultados', 'filtro_rol',
    'cta_click'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.analytics_events (event_name, path, referrer, device, session_id, user_id, detalle)
  VALUES (
    p_event_name,
    left(p_path, 300),
    left(p_referrer, 200),
    left(p_device, 20),
    left(p_session_id, 64),
    auth.uid(),
    -- 120 caracteres bastan para un término de búsqueda o un nombre de
    -- producto, y evitan que se use el campo para volcar texto arbitrario.
    left(p_detalle, 120)
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.log_analytics_event(text, text, text, text, text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- BÚSQUEDAS INTERNAS
--
-- Lo que la gente escribe en el buscador de XPEAK. Las que no devuelven
-- resultados son la lista de la compra del negocio: dicen qué inventario
-- falta, con qué palabras lo piden y en qué volumen.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.analytics_busquedas(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (termino text, veces bigint, sin_resultados bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT
    lower(trim(detalle)) AS termino,
    count(*) FILTER (WHERE event_name = 'search')::bigint AS veces,
    count(*) FILTER (WHERE event_name = 'search_sin_resultados')::bigint AS sin_resultados
  FROM public.analytics_events
  WHERE event_name IN ('search', 'search_sin_resultados')
    AND detalle IS NOT NULL AND trim(detalle) <> ''
    AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    AND (user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  GROUP BY lower(trim(detalle))
  ORDER BY 2 DESC, 3 DESC
  LIMIT LEAST(GREATEST(p_limite, 1), 100);
$function$;

-- ---------------------------------------------------------------------------
-- AFILIACIÓN
--
-- Clics por producto. Amazon solo informa de VENTAS, nunca de clics por
-- artículo, así que sin esto es imposible saber si el escaparate no vende
-- porque nadie lo pincha (problema de visibilidad) o porque se pincha y no se
-- compra (problema de selección de producto). Son dos arreglos distintos.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.analytics_afiliados(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (producto text, clics bigint, desde text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT
    detalle AS producto,
    count(*)::bigint AS clics,
    -- De dónde salió el clic: panel de Recursos o un artículo del blog.
    (CASE WHEN bool_or(path LIKE '/blog%') AND NOT bool_or(path NOT LIKE '/blog%')
          THEN 'blog'
          WHEN bool_or(path NOT LIKE '/blog%') AND NOT bool_or(path LIKE '/blog%')
          THEN 'panel'
          ELSE 'ambos' END)::text AS desde
  FROM public.analytics_events
  WHERE event_name = 'affiliate_click'
    AND detalle IS NOT NULL
    AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    AND (user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  GROUP BY detalle
  ORDER BY 2 DESC
  LIMIT LEAST(GREATEST(p_limite, 1), 100);
$function$;

-- ---------------------------------------------------------------------------
-- BLOG
--
-- Rendimiento por artículo. El proyecto tiene ~380 URLs de blog y hasta ahora
-- no había forma de saber cuáles trabajan: se escribían a ciegas.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.analytics_blog(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (articulo text, visitas bigint, sesiones bigint, desde_buscador bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT
    path AS articulo,
    count(*)::bigint AS visitas,
    count(DISTINCT session_id)::bigint AS sesiones,
    count(*) FILTER (
      WHERE referrer ILIKE '%google%' OR referrer ILIKE '%bing%'
         OR referrer ILIKE '%duckduckgo%' OR referrer ILIKE '%ecosia%'
    )::bigint AS desde_buscador
  FROM public.analytics_events
  WHERE event_name = 'page_view'
    AND path LIKE '/blog%'
    AND created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
    AND (user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  GROUP BY path
  ORDER BY 2 DESC
  LIMIT LEAST(GREATEST(p_limite, 1), 100);
$function$;

-- ---------------------------------------------------------------------------
-- EMBUDO
--
-- Visita → registro → solicitud. Es la única cifra que dice si el tráfico
-- sirve para algo: 400 visitas con 0 solicitudes es un problema distinto de
-- 40 visitas con 4 solicitudes, y la gráfica de tráfico sola no lo distingue.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.analytics_embudo(p_dias int DEFAULT 30)
RETURNS TABLE (paso text, orden int, cantidad bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  WITH ev AS (
    SELECT event_name, session_id
    FROM public.analytics_events
    WHERE created_at >= now() - (LEAST(GREATEST(p_dias, 1), 365) || ' days')::interval
      AND (user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles r WHERE r.user_id = analytics_events.user_id AND r.role = 'admin'))
  )
  SELECT 'Visitan'::text, 1, count(DISTINCT session_id)::bigint FROM ev WHERE event_name = 'page_view'
  UNION ALL
  SELECT 'Buscan'::text, 2, count(DISTINCT session_id)::bigint FROM ev WHERE event_name IN ('search', 'filtro_rol')
  UNION ALL
  SELECT 'Ven un perfil'::text, 3, count(DISTINCT session_id)::bigint FROM ev WHERE event_name = 'profile_view'
  UNION ALL
  SELECT 'Contactan o se registran'::text, 4, count(DISTINCT session_id)::bigint
    FROM ev WHERE event_name IN ('contact_click', 'signup', 'flash_request')
  ORDER BY 2;
$function$;

-- Envoltorios con control de admin, igual que los del panel original.
CREATE OR REPLACE FUNCTION public.panel_analytics_busquedas(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (termino text, veces bigint, sin_resultados bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_busquedas(p_dias, p_limite);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_afiliados(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (producto text, clics bigint, desde text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_afiliados(p_dias, p_limite);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_blog(p_dias int DEFAULT 30, p_limite int DEFAULT 20)
RETURNS TABLE (articulo text, visitas bigint, sesiones bigint, desde_buscador bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_blog(p_dias, p_limite);
END;
$function$;

CREATE OR REPLACE FUNCTION public.panel_analytics_embudo(p_dias int DEFAULT 30)
RETURNS TABLE (paso text, orden int, cantidad bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY SELECT * FROM public.analytics_embudo(p_dias);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.analytics_busquedas(int, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_afiliados(int, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_blog(int, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_embudo(int) FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.panel_analytics_busquedas(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_afiliados(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_blog(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_embudo(int) TO authenticated;

-- ---------------------------------------------------------------------------
-- RETENCIÓN DE DATOS
--
-- Una tabla de analítica crece sin límite y nadie la mira nunca. A 12 meses
-- los datos ya no deciden nada y sí ocupan (el plan gratuito de Supabase tiene
-- 500 MB). Se purga sola, y de paso cumple el principio de limitación del
-- plazo de conservación del RGPD.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purgar_analytics_antiguos()
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $function$
  DELETE FROM public.analytics_events WHERE created_at < now() - interval '12 months';
$function$;
