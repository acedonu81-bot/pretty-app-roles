-- (20 oct 2026) Concurso DJ Madrid: al tener puestos los 3 votos ya no se pueden
-- quitar ni cambiar ("si no, es un cachondeo": se vota, se quita y se vuelve a
-- repartir). Con menos de 3 votos se puede quitar uno mientras dure el plazo.
--
-- Solo frena al propio votante (auth.uid() = su user_id). Borrados de
-- mantenimiento (SQL Editor, clave de servicio, borrar cuenta) tienen
-- auth.uid() nulo y pasan: así se siguen pudiendo limpiar cuentas falsas.

CREATE OR REPLACE FUNCTION public.concurso_votos_fijos()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.content_key LIKE 'concurso-dj-madrid-2026:%'
     AND auth.uid() IS NOT NULL AND auth.uid() = OLD.user_id
     AND (SELECT count(*) FROM public.feed_likes
          WHERE user_id = OLD.user_id AND content_key LIKE 'concurso-dj-madrid-2026:%') >= 3 THEN
    RAISE EXCEPTION 'VOTOS_FIJOS_CONCURSO' USING HINT = 'Con los 3 votos puestos ya no se pueden cambiar';
  END IF;
  RETURN OLD;
END;
$function$;

DROP TRIGGER IF EXISTS concurso_votos_fijos ON public.feed_likes;
CREATE TRIGGER concurso_votos_fijos
  BEFORE DELETE ON public.feed_likes
  FOR EACH ROW EXECUTE FUNCTION public.concurso_votos_fijos();
