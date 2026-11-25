-- Facebook en la ficha, con la misma regla que Instagram y TikTok (25 nov 2026, Daniel):
-- deja de ser "Próximamente" y pasa a ser ventaja real de Profesional y Premium.
-- El valor real vive en redes_profesional.facebook; profiles.facebook es la copia
-- publicada (vacía si el plan no incluye redes). Se guarda la ruta de la página
-- ("mipagina" o "profile.php?id=123"), nunca una URL entera: la web siempre monta
-- https://www.facebook.com/<ruta>, así no se puede colar otro dominio ni javascript:.
-- Las funciones son las de 20261118120000_redes_segun_plan.sql (comprobado el 25 nov
-- que producción coincide con el repo) con facebook añadido.

ALTER TABLE public.redes_profesional ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook text;

-- Limpia lo que pegue la persona: quita https://, www., m., facebook.com/, fb.com/,
-- la @ y la barra final. Si queda algo raro (espacios, otro dominio), se descarta.
CREATE OR REPLACE FUNCTION public.limpiar_facebook(p text)
RETURNS text
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $$
  -- De los parámetros (?mibextid=..., ?ref=...) solo se conserva ?id= de profile.php.
  SELECT CASE WHEN w ~ '^[A-Za-z0-9._\-]+(/[A-Za-z0-9._\-]+)*(\?id=[0-9]+)?$' THEN w END
    FROM (SELECT regexp_replace(
                   CASE WHEN v ~ '^profile\.php\?id=[0-9]+' THEN substring(v from '^profile\.php\?id=[0-9]+')
                        ELSE regexp_replace(v, '[?#].*$', '') END,
                   '/+$', '') AS w
            FROM (SELECT regexp_replace(
                           regexp_replace(btrim(coalesce(p, '')), '^(https?://)?((www|m|web|es-es)\.)?(facebook\.com|fb\.com)/', '', 'i'),
                           '^@', '') AS v) s) t;
$$;

CREATE OR REPLACE FUNCTION public.publicar_redes(p_profile uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  PERFORM set_config('xpeak.publicando_redes', 'on', true);
  UPDATE public.profiles p
     SET instagram = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END,
         tiktok    = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END,
         facebook  = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.facebook END
    FROM public.redes_profesional r
   WHERE p.id = p_profile AND r.profile_id = p.id
     AND (p.instagram IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END
       OR p.tiktok IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END
       OR p.facebook IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.facebook END);
  PERFORM set_config('xpeak.publicando_redes', '', true);
END;
$$;
REVOKE ALL ON FUNCTION public.publicar_redes(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.republicar_redes()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE n integer;
BEGIN
  PERFORM set_config('xpeak.publicando_redes', 'on', true);
  UPDATE public.profiles p
     SET instagram = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END,
         tiktok    = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END,
         facebook  = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.facebook END
    FROM public.redes_profesional r
   WHERE r.profile_id = p.id
     AND (p.instagram IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END
       OR p.tiktok IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END
       OR p.facebook IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.facebook END);
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM set_config('xpeak.publicando_redes', '', true);
  RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.republicar_redes() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.redes_profesional_publicar()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('xpeak.publicando_redes', true) = 'on' THEN RETURN NEW; END IF;
  NEW.instagram := nullif(btrim(regexp_replace(coalesce(NEW.instagram, ''), '^@', '')), '');
  NEW.tiktok := nullif(btrim(regexp_replace(coalesce(NEW.tiktok, ''), '^@', '')), '');
  NEW.facebook := public.limpiar_facebook(NEW.facebook);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.zz_profiles_redes_publicadas()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE r record;
BEGIN
  IF current_setting('xpeak.publicando_redes', true) = 'on' THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' OR NEW.instagram IS DISTINCT FROM OLD.instagram OR NEW.tiktok IS DISTINCT FROM OLD.tiktok
     OR NEW.facebook IS DISTINCT FROM OLD.facebook THEN
    PERFORM set_config('xpeak.publicando_redes', 'on', true);
    INSERT INTO public.redes_profesional AS rp (profile_id, user_id, instagram, tiktok, facebook)
    VALUES (NEW.id, NEW.user_id,
            nullif(btrim(regexp_replace(coalesce(NEW.instagram, ''), '^@', '')), ''),
            nullif(btrim(regexp_replace(coalesce(NEW.tiktok, ''), '^@', '')), ''),
            public.limpiar_facebook(NEW.facebook))
    ON CONFLICT (profile_id) DO UPDATE SET
      instagram = CASE WHEN TG_OP = 'INSERT' OR NEW.instagram IS DISTINCT FROM OLD.instagram THEN EXCLUDED.instagram ELSE rp.instagram END,
      tiktok    = CASE WHEN TG_OP = 'INSERT' OR NEW.tiktok IS DISTINCT FROM OLD.tiktok THEN EXCLUDED.tiktok ELSE rp.tiktok END,
      facebook  = CASE WHEN TG_OP = 'INSERT' OR NEW.facebook IS DISTINCT FROM OLD.facebook THEN EXCLUDED.facebook ELSE rp.facebook END,
      updated_at = now();
    PERFORM set_config('xpeak.publicando_redes', '', true);
  END IF;

  SELECT instagram, tiktok, facebook INTO r FROM public.redes_profesional WHERE profile_id = NEW.id;
  IF FOUND AND public.redes_visibles(NEW.id, NEW.subscription_tier) THEN
    NEW.instagram := r.instagram;
    NEW.tiktok := r.tiktok;
    NEW.facebook := r.facebook;
  ELSE
    NEW.instagram := NULL;
    NEW.tiktok := NULL;
    NEW.facebook := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zz_profiles_redes_publicadas ON public.profiles;
CREATE TRIGGER zz_profiles_redes_publicadas
  BEFORE INSERT OR UPDATE OF instagram, tiktok, facebook, subscription_tier ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.zz_profiles_redes_publicadas();
