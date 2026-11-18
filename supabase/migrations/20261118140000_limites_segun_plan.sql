-- Límites de sets y portafolio según el plan (18 nov 2026, decisiones de Daniel):
-- - Sets (archivos y enlaces de SoundCloud/Mixcloud/hearthis, todo cuenta igual):
--   Esencial 3, Profesional 10, Premium ilimitados.
-- - Portafolio (fotos + vídeos): Esencial 6, Profesional 12, Premium 20.
-- - Fundadores (redes_fundadores, ver 20261118120000): durante su año, en Esencial
--   tienen los límites de Profesional (cubre a los 21 que ya tienen más de 6).
-- - Antes del lanzamiento: como hasta ahora (3 sets en Esencial, 12 en portafolio).
-- - Quien tenga más de lo que permite su plan no pierde nada: solo no puede añadir.
--   Lo que sobra se oculta en la ficha (la web lee limites_plan) y vuelve al subir.
-- Sustituye al trigger limite_sets_free (1 nov 2026).

CREATE OR REPLACE FUNCTION public.plan_para_limites(p_profile uuid, p_tier text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN p_tier = 'starter' THEN 'starter'
    WHEN p_tier IN ('business', 'premium', 'agency', 'elite') THEN 'business'
    WHEN l IS NULL OR now() < l THEN 'pre'
    WHEN EXISTS (SELECT 1 FROM public.redes_fundadores f WHERE f.profile_id = p_profile AND f.hasta > now()) THEN 'starter'
    ELSE 'free'
  END
  FROM (SELECT (SELECT lanzamiento FROM public.cobros_config LIMIT 1) AS l) c;
$$;
REVOKE ALL ON FUNCTION public.plan_para_limites(uuid, text) FROM PUBLIC, anon, authenticated;

-- NULL = ilimitado.
CREATE OR REPLACE FUNCTION public.limites_de(p_plan text, OUT sets integer, OUT portafolio integer)
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $$
  SELECT CASE p_plan WHEN 'business' THEN NULL WHEN 'starter' THEN 10 ELSE 3 END,
         CASE p_plan WHEN 'business' THEN 20 WHEN 'starter' THEN 12 WHEN 'pre' THEN 12 ELSE 6 END;
$$;

-- Lo que la web usa para pintar la ficha (cualquiera) y el panel (el dueño).
CREATE OR REPLACE FUNCTION public.limites_plan(p_profile uuid)
RETURNS TABLE(sets integer, portafolio integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT l.sets, l.portafolio
    FROM public.profiles p,
         LATERAL public.limites_de(public.plan_para_limites(p.id, p.subscription_tier)) l
   WHERE p.id = p_profile;
$$;
REVOKE ALL ON FUNCTION public.limites_plan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.limites_plan(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.limites_plan_al_guardar()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_plan text := public.plan_para_limites(NEW.id, NEW.subscription_tier);
  v_lim record;
  v_nombre text;
  sets_nuevo int := coalesce(cardinality(NEW.audio_session_urls), 0);
  sets_viejo int := coalesce(cardinality(OLD.audio_session_urls), 0);
  port_nuevo int := coalesce(cardinality(NEW.portfolio_urls), 0) + coalesce(cardinality(NEW.video_session_urls), 0);
  port_viejo int := coalesce(cardinality(OLD.portfolio_urls), 0) + coalesce(cardinality(OLD.video_session_urls), 0);
BEGIN
  SELECT * INTO v_lim FROM public.limites_de(v_plan);
  v_nombre := CASE v_plan WHEN 'business' THEN 'Premium' WHEN 'starter' THEN 'Profesional' ELSE 'Esencial' END;
  IF v_lim.sets IS NOT NULL AND sets_nuevo > v_lim.sets AND sets_nuevo > sets_viejo THEN
    RAISE EXCEPTION 'En el plan % puedes tener hasta % sets publicados', v_nombre, v_lim.sets USING errcode = 'P0001';
  END IF;
  IF v_lim.portafolio IS NOT NULL AND port_nuevo > v_lim.portafolio AND port_nuevo > port_viejo THEN
    RAISE EXCEPTION 'En el plan % puedes tener hasta % fotos y vídeos en tu portafolio', v_nombre, v_lim.portafolio USING errcode = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS limite_sets_free ON public.profiles;
CREATE TRIGGER limites_plan_al_guardar
  BEFORE UPDATE OF audio_session_urls, portfolio_urls, video_session_urls ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.limites_plan_al_guardar();
