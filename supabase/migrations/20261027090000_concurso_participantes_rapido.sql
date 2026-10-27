-- 27 oct 2026: la página del concurso tardaba 2,1 s con solo 151 votos y crecía con cada voto.
-- Causa: concurso_participantes llamaba a concurso_votante_valido una vez por VOTO, y esa
-- llamaba a email_domain_blocked, que recorría entera blocked_email_domains (9.925 filas,
-- con OR y LIKE, sin índice). ~15 ms por voto.
-- Arreglo 1: email_domain_blocked busca por la clave primaria (dominio y sus sufijos).
-- Arreglo 2: concurso_participantes valida cada votante una sola vez.
-- Mismo resultado que antes: comprobado con 272 emails reales y 403 sintéticos (0 diferencias).

CREATE OR REPLACE FUNCTION public.email_domain_blocked(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  -- Bloqueado si el dominio, o cualquier sufijo suyo tras un punto, está en la lista
  -- (igual que antes: d = dominio o d LIKE '%.dominio'), pero buscando por índice.
  SELECT EXISTS (
    SELECT 1
    FROM public.blocked_email_domains b
    WHERE b.domain = ANY (
      SELECT array_to_string((string_to_array(lower(split_part(p_email, '@', 2)), '.'))[i:], '.')
      FROM generate_series(
        1,
        coalesce(array_length(string_to_array(lower(split_part(p_email, '@', 2)), '.'), 1), 0)
      ) AS i
    )
  );
$function$;

CREATE OR REPLACE FUNCTION public.concurso_participantes(p_concurso text DEFAULT 'dj-madrid-2026'::text)
RETURNS TABLE(user_id uuid, display_name text, photo_url text, zone text, soundcloud_url text, me_gusta bigint, frase text, frase_cambiada_en timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH votos AS (
    SELECT l.content_key, l.user_id
    FROM public.feed_likes l
    WHERE l.content_key LIKE 'concurso-' || p_concurso || ':%'
      AND l.created_at < '2026-11-03 00:00 Europe/Madrid'::timestamptz
  ),
  validos AS MATERIALIZED (
    SELECT v.user_id FROM (SELECT DISTINCT votos.user_id FROM votos) v
    WHERE public.concurso_votante_valido(v.user_id)
  )
  SELECT i.user_id, p.display_name, p.photo_url, p.zone, i.soundcloud_url,
    (SELECT count(*) FROM votos
     WHERE votos.content_key = 'concurso-' || i.concurso || ':' || i.user_id
       AND votos.user_id <> i.user_id
       AND votos.user_id IN (SELECT validos.user_id FROM validos)) AS me_gusta,
    i.frase, i.frase_cambiada_en
  FROM public.concurso_inscripciones i
  LEFT JOIN LATERAL (
    SELECT display_name, photo_url, zone FROM public.profiles
    WHERE profiles.user_id = i.user_id
    ORDER BY is_primary DESC NULLS LAST
    LIMIT 1
  ) p ON true
  WHERE i.concurso = p_concurso AND i.estado = 'aceptada'
  ORDER BY i.created_at;
$function$;
