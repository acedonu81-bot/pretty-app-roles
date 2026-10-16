-- Cambiar la sesión inscrita en el Concurso DJ (17 oct 2026): la sesión de un
-- aspirante (DJ VIZARD) dejó de existir en SoundCloud y no había forma de
-- poner otra (una inscripción por DJ). Lo hace el propio DJ mientras dure el
-- concurso; la nueva sesión vuelve a "pendiente" y la revisa el admin antes de
-- salir (así no se puede cambiar por otra cosa tras ser aceptada). Los me gusta
-- no se pierden: van ligados al DJ (concurso-dj-madrid-2026:<user_id>).

CREATE OR REPLACE FUNCTION public.cambiar_sesion_concurso(p_url text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'sin sesión'; END IF;
  IF now() >= '2026-11-02 23:00:00+00'::timestamptz THEN RAISE EXCEPTION 'el concurso ha cerrado'; END IF;
  IF p_url IS NULL OR length(p_url) > 500
     OR p_url !~* '^https://(www\.|m\.)?soundcloud\.com/[^/?#]+/[^/?#]+' THEN
    RAISE EXCEPTION 'enlace no válido';
  END IF;

  UPDATE public.concurso_inscripciones
     SET soundcloud_url = p_url, estado = 'pendiente'
   WHERE user_id = v_uid AND concurso = 'dj-madrid-2026';
  IF NOT FOUND THEN RAISE EXCEPTION 'no tienes una sesión inscrita'; END IF;

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.cambiar_sesion_concurso(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cambiar_sesion_concurso(text) TO authenticated;
