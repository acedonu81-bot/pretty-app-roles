-- Concurso DJ XPEAK Madrid: arreglos de la auditoría del 13 oct 2026.
--
-- 1) La fecha de cada voto (feed_likes.created_at) la pone el servidor. Antes
--    el navegador podía mandarla, y es la que se usa al cierre para detectar
--    ráfagas de votos y votos fuera de plazo.
CREATE OR REPLACE FUNCTION public.feed_likes_fecha_servidor()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  NEW.created_at := now();
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS feed_likes_fecha_servidor ON public.feed_likes;
CREATE TRIGGER feed_likes_fecha_servidor
  BEFORE INSERT ON public.feed_likes
  FOR EACH ROW EXECUTE FUNCTION public.feed_likes_fecha_servidor();

-- 2) Votos del concurso: solo dentro de plazo, solo a sesiones publicadas y
--    nunca a uno mismo. feed_likes es genérica (feed, perfiles...) y aceptaba
--    cualquier content_key en cualquier momento. RESTRICTIVE: se suma a las
--    políticas que ya hay y solo afecta a las claves del concurso.
DROP POLICY IF EXISTS concurso_votos_en_plazo ON public.feed_likes;
CREATE POLICY concurso_votos_en_plazo ON public.feed_likes
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    content_key NOT LIKE 'concurso-dj-madrid-2026:%'
    OR (
      now() >= '2026-10-13 00:00 Europe/Madrid'::timestamptz
      AND now() <  '2026-11-03 00:00 Europe/Madrid'::timestamptz
      AND content_key <> 'concurso-dj-madrid-2026:' || auth.uid()::text
      AND EXISTS (
        SELECT 1 FROM public.concurso_inscripciones i
        WHERE i.concurso = 'dj-madrid-2026' AND i.estado = 'aceptada'
          AND 'concurso-dj-madrid-2026:' || i.user_id::text = feed_likes.content_key
      )
    )
  );

-- Quitar un voto del concurso, igual: solo mientras está abierto.
DROP POLICY IF EXISTS concurso_quitar_voto_en_plazo ON public.feed_likes;
CREATE POLICY concurso_quitar_voto_en_plazo ON public.feed_likes
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    content_key NOT LIKE 'concurso-dj-madrid-2026:%'
    OR now() < '2026-11-03 00:00 Europe/Madrid'::timestamptz
  );

-- 3) El recuento público solo suma votos anteriores al cierre.
CREATE OR REPLACE FUNCTION public.concurso_participantes(p_concurso text DEFAULT 'dj-madrid-2026')
RETURNS TABLE (
  user_id        uuid,
  display_name   text,
  photo_url      text,
  zone           text,
  soundcloud_url text,
  me_gusta       bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT i.user_id, p.display_name, p.photo_url, p.zone, i.soundcloud_url,
    (SELECT count(*) FROM public.feed_likes l
     WHERE l.content_key = 'concurso-' || i.concurso || ':' || i.user_id
       AND l.user_id <> i.user_id
       AND l.created_at < '2026-11-03 00:00 Europe/Madrid'::timestamptz) AS me_gusta
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

-- 4) Inscribirse exige también ser de la Comunidad de Madrid (region la
--    deriva la BD de la ciudad del perfil). Antes solo lo filtraba la página.
--    Y abre el 13 oct, como dicen las bases.
DROP POLICY IF EXISTS concurso_insert_propia ON public.concurso_inscripciones;
CREATE POLICY concurso_insert_propia ON public.concurso_inscripciones
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND estado = 'pendiente'
    AND concurso = 'dj-madrid-2026'
    AND now() >= '2026-10-13 00:00 Europe/Madrid'::timestamptz
    AND now() <  '2026-11-03 00:00 Europe/Madrid'::timestamptz
    AND EXISTS (
      SELECT 1 FROM public.profiles pr
      WHERE pr.user_id = auth.uid()
        AND coalesce(btrim(pr.photo_url), '') <> ''
        AND coalesce(btrim(pr.bio), '') <> ''
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles pr
      WHERE pr.user_id = auth.uid() AND pr.region = 'Madrid'
    )
  );
