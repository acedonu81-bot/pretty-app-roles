-- Cierre de votos del concurso DJ Madrid (00:00 del 3 nov 2026, hora de Madrid).
-- Las personas ya no pueden votar ni quitar votos desde la API. SQL Editor y
-- service role (auth.uid() null) siguen pudiendo, para anular votos falsos.
CREATE OR REPLACE FUNCTION public.concurso_votos_cerrados()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE k text;
BEGIN
  k := CASE WHEN TG_OP = 'DELETE' THEN OLD.content_key ELSE NEW.content_key END;
  IF k LIKE 'concurso-dj-madrid-2026:%'
     AND now() >= '2026-11-03 00:00 Europe/Madrid'::timestamptz
     AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'CONCURSO_CERRADO' USING HINT = 'Los votos del concurso están cerrados';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$function$;

DROP TRIGGER IF EXISTS concurso_votos_cerrados ON public.feed_likes;
CREATE TRIGGER concurso_votos_cerrados
  BEFORE INSERT OR DELETE ON public.feed_likes
  FOR EACH ROW EXECUTE FUNCTION public.concurso_votos_cerrados();
