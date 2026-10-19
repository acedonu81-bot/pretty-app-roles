-- (19 oct 2026) Concurso DJ Madrid: cada cuenta reparte como mucho 3 votos
-- en total (antes, uno por sesión sin tope). Decisión del usuario con el
-- concurso en marcha; nadie tenía más de 3, así que no se anula ningún voto.
-- Quitar un voto libera el hueco (el DELETE no pasa por aquí).
--
-- Trigger y no política RLS: la política no puede contar sin carreras, el
-- trigger se serializa por usuario con un bloqueo de transacción.

CREATE OR REPLACE FUNCTION public.concurso_maximo_votos()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.content_key NOT LIKE 'concurso-dj-madrid-2026:%' THEN RETURN NEW; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('concurso-votos:' || NEW.user_id::text));
  IF (SELECT count(*) FROM public.feed_likes
      WHERE user_id = NEW.user_id AND content_key LIKE 'concurso-dj-madrid-2026:%') >= 3 THEN
    RAISE EXCEPTION 'LIMITE_VOTOS_CONCURSO' USING HINT = 'Máximo 3 votos por persona';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS concurso_maximo_votos ON public.feed_likes;
CREATE TRIGGER concurso_maximo_votos
  BEFORE INSERT ON public.feed_likes
  FOR EACH ROW EXECUTE FUNCTION public.concurso_maximo_votos();
