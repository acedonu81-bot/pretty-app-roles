-- (19 oct 2026) Frase corta del DJ junto al me gusta para pedir el voto,
-- en cursiva en su ficha del concurso. Ficha XDS 72,8; el usuario la valida.
-- Death Line: usarla para sacar el contacto fuera de XPEAK. Mitigación: 80
-- caracteres, sin números largos, @, enlaces ni dominios (aquí y en el
-- cliente), y el admin la borra desde la pestaña Concurso DJ.
-- Se cambia como mucho una vez al día (día de Madrid), petición del usuario.

ALTER TABLE public.concurso_inscripciones
  ADD COLUMN IF NOT EXISTS frase text CHECK (frase IS NULL OR char_length(frase) <= 80),
  ADD COLUMN IF NOT EXISTS frase_cambiada_en timestamptz;

CREATE OR REPLACE FUNCTION public.concurso_poner_frase(p_concurso text, p_frase text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  f text := nullif(btrim(p_frase), '');
  ultima timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sin sesión'; END IF;
  SELECT frase_cambiada_en INTO ultima FROM public.concurso_inscripciones
  WHERE concurso = p_concurso AND user_id = auth.uid() FOR UPDATE;
  IF ultima IS NOT NULL AND (ultima AT TIME ZONE 'Europe/Madrid')::date = (now() AT TIME ZONE 'Europe/Madrid')::date THEN
    RAISE EXCEPTION 'FRASE_YA_CAMBIADA_HOY';
  END IF;
  IF f IS NOT NULL AND (char_length(f) > 80
     OR f ~* '(\d[\s.-]*){6,}|@|https?://|www\.|\.(com|es|net|org|site|me|io|link)\b') THEN
    RAISE EXCEPTION 'FRASE_NO_PERMITIDA';
  END IF;
  UPDATE public.concurso_inscripciones SET frase = f, frase_cambiada_en = now()
  WHERE concurso = p_concurso AND user_id = auth.uid();
END;
$function$;

GRANT EXECUTE ON FUNCTION public.concurso_poner_frase(text, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.concurso_poner_frase(text, text) FROM anon;

-- Cambia la forma del resultado (añade frase): DROP + CREATE.
DROP FUNCTION IF EXISTS public.concurso_participantes(text);
CREATE FUNCTION public.concurso_participantes(p_concurso text DEFAULT 'dj-madrid-2026'::text)
RETURNS TABLE(user_id uuid, display_name text, photo_url text, zone text, soundcloud_url text, me_gusta bigint, frase text, frase_cambiada_en timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT i.user_id, p.display_name, p.photo_url, p.zone, i.soundcloud_url,
    (SELECT count(*) FROM public.feed_likes l
     WHERE l.content_key = 'concurso-' || i.concurso || ':' || i.user_id
       AND l.user_id <> i.user_id
       AND l.created_at < '2026-11-03 00:00 Europe/Madrid'::timestamptz) AS me_gusta,
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

GRANT EXECUTE ON FUNCTION public.concurso_participantes(text) TO anon, authenticated;
