-- (19 oct 2026) Concurso DJ: solo votan (y solo cuentan) cuentas fiables.
-- Alguien fabricaba votos con correos desechables de dominios que rotaban
-- (juicehour.com, proguidex.com, iconcubic.com...: cuenta + voto en 4-6 s).
-- Una lista negra siempre va por detrás, así que se invierte: vale la cuenta
-- que entró con Google o cuyo correo es de un proveedor grande. Crear
-- cuentas de Gmail/Hotmail/Yahoo/iCloud a mano cuesta mucho más que sacar
-- una dirección de usar y tirar. Se aplica a los votos nuevos (trigger) y al
-- recuento (concurso_participantes), así que los votos falsos ya hechos dejan
-- de contar aunque sigan en la tabla.

CREATE OR REPLACE FUNCTION public.concurso_votante_valido(p_user uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p_user
      AND NOT public.email_domain_blocked(u.email)
      AND (
        COALESCE(u.raw_app_meta_data->'providers', '[]'::jsonb) ? 'google'
        OR lower(split_part(u.email, '@', 2)) IN (
          'gmail.com','googlemail.com',
          'hotmail.com','hotmail.es','outlook.com','outlook.es','live.com','live.es','msn.com',
          'yahoo.com','yahoo.es','ymail.com','icloud.com','me.com','mac.com',
          'proton.me','protonmail.com','gmx.com','gmx.es','movistar.es','telefonica.net','terra.es','orange.es'
        )
      )
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.concurso_votante_valido(uuid) FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.concurso_votante_fiable()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.content_key LIKE 'concurso-dj-madrid-2026:%' AND NOT public.concurso_votante_valido(NEW.user_id) THEN
    RAISE EXCEPTION 'VOTANTE_NO_VALIDO' USING HINT = 'Entra con Google o con un correo de Gmail, Hotmail, Outlook, Yahoo o iCloud';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS concurso_votante_fiable ON public.feed_likes;
CREATE TRIGGER concurso_votante_fiable
  BEFORE INSERT ON public.feed_likes
  FOR EACH ROW EXECUTE FUNCTION public.concurso_votante_fiable();

DROP FUNCTION IF EXISTS public.concurso_participantes(text);
CREATE FUNCTION public.concurso_participantes(p_concurso text DEFAULT 'dj-madrid-2026'::text)
RETURNS TABLE(user_id uuid, display_name text, photo_url text, zone text, soundcloud_url text, me_gusta bigint, frase text, frase_cambiada_en timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT i.user_id, p.display_name, p.photo_url, p.zone, i.soundcloud_url,
    (SELECT count(*) FROM public.feed_likes l
     WHERE l.content_key = 'concurso-' || i.concurso || ':' || i.user_id
       AND l.user_id <> i.user_id
       AND l.created_at < '2026-11-03 00:00 Europe/Madrid'::timestamptz
       AND public.concurso_votante_valido(l.user_id)) AS me_gusta,
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
