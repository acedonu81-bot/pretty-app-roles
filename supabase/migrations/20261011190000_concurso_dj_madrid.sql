-- Concurso DJ XPEAK Madrid (1ª edición, 12 oct - 2 nov 2026).
-- Ficha XDS 71,9 aprobada por el usuario el 11 oct 2026 como prueba manual:
-- inscripción con enlace de SoundCloud y perfil completo (foto + bio); los
-- me gusta (feed_likes, content_key 'concurso-dj-madrid-2026:<user_id>')
-- eligen 3 finalistas y el jurado decide entre ellos. Cada inscripción la
-- revisa un admin antes de salir en la página.

CREATE TABLE IF NOT EXISTS public.concurso_inscripciones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concurso       text NOT NULL DEFAULT 'dj-madrid-2026',
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  soundcloud_url text NOT NULL CHECK (soundcloud_url ~* '^https://(www\.|m\.)?soundcloud\.com/[^/?#]+/[^/?#]+'),
  acepta_bases   boolean NOT NULL CHECK (acepta_bases),
  estado         text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptada', 'rechazada')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (concurso, user_id)
);

ALTER TABLE public.concurso_inscripciones ENABLE ROW LEVEL SECURITY;

-- Cada DJ se inscribe una vez, solo dentro del plazo y siempre como
-- 'pendiente': el estado lo cambia un admin, nunca el propio participante.
CREATE POLICY concurso_insert_propia ON public.concurso_inscripciones
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND estado = 'pendiente'
    AND concurso = 'dj-madrid-2026'
    AND now() >= '2026-10-12 00:00 Europe/Madrid'::timestamptz
    AND now() <  '2026-11-03 00:00 Europe/Madrid'::timestamptz
    -- Perfil completo: foto y bio en algún perfil propio.
    AND EXISTS (
      SELECT 1 FROM public.profiles pr
      WHERE pr.user_id = auth.uid()
        AND coalesce(btrim(pr.photo_url), '') <> ''
        AND coalesce(btrim(pr.bio), '') <> ''
    )
  );

CREATE POLICY concurso_select_propia ON public.concurso_inscripciones
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.es_admin());

CREATE POLICY concurso_admin_update ON public.concurso_inscripciones
  FOR UPDATE TO authenticated
  USING (public.es_admin())
  WITH CHECK (public.es_admin());

CREATE POLICY concurso_admin_delete ON public.concurso_inscripciones
  FOR DELETE TO authenticated
  USING (public.es_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.concurso_inscripciones TO authenticated;

-- Lista pública de participantes ya revisados (la página del concurso se ve
-- sin cuenta). Solo expone lo que ya es público en el perfil: nombre, foto,
-- zona y la sesión que el DJ ha enviado para que se escuche. me_gusta no
-- cuenta el like que el DJ se dé a sí mismo; el resto del filtrado (cuentas
-- falsas, ráfagas) lo hace un admin a mano antes de elegir finalistas.
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
       AND l.user_id <> i.user_id) AS me_gusta
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

GRANT EXECUTE ON FUNCTION public.concurso_participantes(text) TO anon, authenticated;
