-- Redes (Instagram y TikTok) según el plan (18 nov 2026, decisiones de Daniel):
-- - En Esencial no se ven, en ningún oficio. Con Profesional o Premium, sí.
-- - Nunca se borran: el valor real vive en redes_profesional (solo dueño y admin)
--   y profiles.instagram / profiles.tiktok son la copia PUBLICADA, que la BD
--   rellena o deja vacía. Así las ~15 pantallas que leen profiles siguen igual.
-- - Fundadores: todo perfil profesional que exista el día del lanzamiento las
--   mantiene un año (sin tope de número). Se fija con activar_lanzamiento_redes().
-- - Hasta que se active el lanzamiento (cobros_config.lanzamiento vacío) todo se
--   publica como hasta ahora: esta migración no cambia nada visible.
-- Mismo patrón que el teléfono (profiles_phone_a_privado → profile_private_data).

-- ── Config y fundadores ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cobros_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  lanzamiento timestamptz
);
INSERT INTO public.cobros_config (id) VALUES (true) ON CONFLICT DO NOTHING;
ALTER TABLE public.cobros_config ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.redes_fundadores (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  hasta timestamptz NOT NULL
);
ALTER TABLE public.redes_fundadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redes_fundadores: admin lee" ON public.redes_fundadores
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.redes_fundadores TO authenticated;

-- ── Valor real de las redes ─────────────────────────────────────────────────
-- FK diferida: el trigger de profiles guarda aquí en BEFORE INSERT, antes de que
-- exista la fila del perfil; se comprueba al cerrar la transacción.
CREATE TABLE IF NOT EXISTS public.redes_profesional (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
  user_id uuid NOT NULL,
  instagram text,
  tiktok text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS redes_profesional_user_idx ON public.redes_profesional (user_id);
ALTER TABLE public.redes_profesional ENABLE ROW LEVEL SECURITY;

CREATE POLICY "redes_profesional: dueño lee" ON public.redes_profesional
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "redes_profesional: dueño crea" ON public.redes_profesional
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));
CREATE POLICY "redes_profesional: dueño cambia" ON public.redes_profesional
  FOR UPDATE TO authenticated USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));
GRANT SELECT, INSERT, UPDATE ON public.redes_profesional TO authenticated;

-- ── Regla de visibilidad ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.redes_visibles(p_profile uuid, p_tier text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN l IS NULL OR now() < l THEN true
    WHEN p_tier IN ('starter', 'business', 'premium', 'agency', 'elite') THEN true
    WHEN EXISTS (SELECT 1 FROM public.redes_fundadores f WHERE f.profile_id = p_profile AND f.hasta > now()) THEN true
    ELSE false
  END
  FROM (SELECT (SELECT lanzamiento FROM public.cobros_config LIMIT 1) AS l) c;
$$;
REVOKE ALL ON FUNCTION public.redes_visibles(uuid, text) FROM PUBLIC, anon, authenticated;

-- ── Publicar la copia en profiles ───────────────────────────────────────────
-- La marca xpeak.publicando_redes evita bucles entre los dos triggers.
CREATE OR REPLACE FUNCTION public.publicar_redes(p_profile uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  PERFORM set_config('xpeak.publicando_redes', 'on', true);
  UPDATE public.profiles p
     SET instagram = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END,
         tiktok    = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END
    FROM public.redes_profesional r
   WHERE p.id = p_profile AND r.profile_id = p.id
     AND (p.instagram IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END
       OR p.tiktok IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END);
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
         tiktok    = CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END
    FROM public.redes_profesional r
   WHERE r.profile_id = p.id
     AND (p.instagram IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.instagram END
       OR p.tiktok IS DISTINCT FROM CASE WHEN public.redes_visibles(p.id, p.subscription_tier) THEN r.tiktok END);
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM set_config('xpeak.publicando_redes', '', true);
  RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.republicar_redes() FROM PUBLIC, anon, authenticated;

-- Cuando el dueño (o un admin) cambia sus redes, se publica lo que toque.
CREATE OR REPLACE FUNCTION public.redes_profesional_publicar()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('xpeak.publicando_redes', true) = 'on' THEN RETURN NEW; END IF;
  NEW.instagram := nullif(btrim(regexp_replace(coalesce(NEW.instagram, ''), '^@', '')), '');
  NEW.tiktok := nullif(btrim(regexp_replace(coalesce(NEW.tiktok, ''), '^@', '')), '');
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER redes_profesional_limpiar BEFORE INSERT OR UPDATE ON public.redes_profesional
  FOR EACH ROW EXECUTE FUNCTION public.redes_profesional_publicar();

CREATE OR REPLACE FUNCTION public.redes_profesional_tras_cambio()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('xpeak.publicando_redes', true) = 'on' THEN RETURN NULL; END IF;
  PERFORM public.publicar_redes(NEW.profile_id);
  RETURN NULL;
END;
$$;
CREATE TRIGGER redes_profesional_publica AFTER INSERT OR UPDATE ON public.redes_profesional
  FOR EACH ROW EXECUTE FUNCTION public.redes_profesional_tras_cambio();

-- Escrituras directas en profiles (altas, scripts, o alguien saltándose la app):
-- el valor va a redes_profesional y en profiles queda solo lo publicable.
-- Se llama "zz_" para correr el ÚLTIMO de los BEFORE: así ve el subscription_tier
-- ya corregido por trg_prevent_privilege_escalation y no se le puede engañar.
CREATE OR REPLACE FUNCTION public.zz_profiles_redes_publicadas()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE r record;
BEGIN
  IF current_setting('xpeak.publicando_redes', true) = 'on' THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' OR NEW.instagram IS DISTINCT FROM OLD.instagram OR NEW.tiktok IS DISTINCT FROM OLD.tiktok THEN
    PERFORM set_config('xpeak.publicando_redes', 'on', true);
    INSERT INTO public.redes_profesional AS rp (profile_id, user_id, instagram, tiktok)
    VALUES (NEW.id, NEW.user_id,
            nullif(btrim(regexp_replace(coalesce(NEW.instagram, ''), '^@', '')), ''),
            nullif(btrim(regexp_replace(coalesce(NEW.tiktok, ''), '^@', '')), ''))
    ON CONFLICT (profile_id) DO UPDATE SET
      instagram = CASE WHEN TG_OP = 'INSERT' OR NEW.instagram IS DISTINCT FROM OLD.instagram THEN EXCLUDED.instagram ELSE rp.instagram END,
      tiktok    = CASE WHEN TG_OP = 'INSERT' OR NEW.tiktok IS DISTINCT FROM OLD.tiktok THEN EXCLUDED.tiktok ELSE rp.tiktok END,
      updated_at = now();
    PERFORM set_config('xpeak.publicando_redes', '', true);
  END IF;

  SELECT instagram, tiktok INTO r FROM public.redes_profesional WHERE profile_id = NEW.id;
  IF FOUND AND public.redes_visibles(NEW.id, NEW.subscription_tier) THEN
    NEW.instagram := r.instagram;
    NEW.tiktok := r.tiktok;
  ELSE
    NEW.instagram := NULL;
    NEW.tiktok := NULL;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER zz_profiles_redes_publicadas
  BEFORE INSERT OR UPDATE OF instagram, tiktok, subscription_tier ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.zz_profiles_redes_publicadas();

-- ── Pasar los datos actuales ────────────────────────────────────────────────
SELECT set_config('xpeak.publicando_redes', 'on', true);
INSERT INTO public.redes_profesional (profile_id, user_id, instagram, tiktok)
SELECT id, user_id,
       nullif(btrim(regexp_replace(coalesce(instagram, ''), '^@', '')), ''),
       nullif(btrim(regexp_replace(coalesce(tiktok, ''), '^@', '')), '')
  FROM public.profiles
 WHERE nullif(btrim(coalesce(instagram, '')), '') IS NOT NULL
    OR nullif(btrim(coalesce(tiktok, '')), '') IS NOT NULL
ON CONFLICT (profile_id) DO NOTHING;
SELECT set_config('xpeak.publicando_redes', '', true);

-- ── Estado para el panel del dueño ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.mis_redes_estado(p_profile uuid)
RETURNS TABLE(visibles boolean, fundador_hasta timestamptz, lanzado boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT public.redes_visibles(p.id, p.subscription_tier),
         (SELECT f.hasta FROM public.redes_fundadores f WHERE f.profile_id = p.id),
         coalesce((SELECT lanzamiento <= now() FROM public.cobros_config LIMIT 1), false)
    FROM public.profiles p
   WHERE p.id = p_profile AND p.user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.mis_redes_estado(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_redes_estado(uuid) TO authenticated;

-- ── Activar el lanzamiento (se ejecuta UNA vez, el día del lanzamiento) ────
-- Fundadores = todo perfil profesional existente en ese momento, sin tope.
CREATE OR REPLACE FUNCTION public.activar_lanzamiento_redes(p_fecha timestamptz)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE n integer;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Solo admin';
  END IF;
  UPDATE public.cobros_config SET lanzamiento = p_fecha;
  INSERT INTO public.redes_fundadores (profile_id, hasta)
  SELECT p.id, p_fecha + interval '1 year'
    FROM public.profiles p
   WHERE p.created_at < p_fecha
     AND p.role IS NOT NULL
     AND p.role NOT IN ('pending', 'empresario', 'particular', 'local_eventos', 'event_manager', 'organizador')
     AND NOT p.is_seed AND NOT p.is_seed_profile
  ON CONFLICT (profile_id) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM public.republicar_redes();
  RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.activar_lanzamiento_redes(timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.activar_lanzamiento_redes(timestamptz) TO authenticated;

-- Cada día: caducan los fundadores y se aplica el lanzamiento si su hora llegó.
SELECT cron.schedule('republicar-redes-diario', '15 4 * * *', 'SELECT public.republicar_redes()');
