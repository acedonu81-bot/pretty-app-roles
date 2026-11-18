-- 18 nov 2026. Dos cosas:
-- A) Endurecer los límites de sets y portafolio (revisión de seguridad automática):
--    1. El trigger decidía el límite con NEW.subscription_tier, que el propio usuario
--       puede falsear en la misma UPDATE (el trigger de privilegios corre DESPUÉS por
--       orden alfabético). Ahora usa el plan ya guardado (OLD) y en altas, Esencial.
--    2. Faltaba la ruta INSERT: un perfil nuevo podía nacer con 40 sets.
--    3. limites_plan se podía llamar para cualquier perfil; ahora solo perfiles públicos
--       o el propio.
--    Las escrituras del servidor (service_role, postgres: webhook, altas asistidas,
--    migraciones) no pasan por el límite.
-- B) Estadísticas según el plan: mi_plan_efectivo, origen de cada visita, visitas por
--    día y por origen (solo Premium; antes del lanzamiento, abiertas a todos).

-- ── A) Límites ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.limites_plan(p_profile uuid)
RETURNS TABLE(sets integer, portafolio integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT l.sets, l.portafolio
    FROM public.profiles p,
         LATERAL public.limites_de(public.plan_para_limites(p.id, p.subscription_tier)) l
   WHERE p.id = p_profile
     AND (p.user_id = auth.uid() OR p.is_public);
$$;
REVOKE ALL ON FUNCTION public.limites_plan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.limites_plan(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.limites_plan_al_guardar()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_tier text;
  v_plan text;
  v_lim record;
  v_nombre text;
  sets_nuevo int := coalesce(cardinality(NEW.audio_session_urls), 0);
  port_nuevo int := coalesce(cardinality(NEW.portfolio_urls), 0) + coalesce(cardinality(NEW.video_session_urls), 0);
  sets_viejo int := 0;
  port_viejo int := 0;
BEGIN
  -- El servidor (webhook de Stripe, altas asistidas, migraciones) no tiene límite.
  IF coalesce(current_setting('role', true), '') IN ('', 'service_role', 'postgres', 'supabase_admin')
     OR session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_tier := OLD.subscription_tier;  -- el plan ya guardado, nunca el que llega en esta misma UPDATE
    sets_viejo := coalesce(cardinality(OLD.audio_session_urls), 0);
    port_viejo := coalesce(cardinality(OLD.portfolio_urls), 0) + coalesce(cardinality(OLD.video_session_urls), 0);
  ELSE
    v_tier := 'free';                 -- un perfil recién creado es Esencial
  END IF;

  v_plan := public.plan_para_limites(NEW.id, v_tier);
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

DROP TRIGGER IF EXISTS limites_plan_al_guardar ON public.profiles;
CREATE TRIGGER limites_plan_al_guardar
  BEFORE INSERT OR UPDATE OF audio_session_urls, portfolio_urls, video_session_urls ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.limites_plan_al_guardar();

-- ── B) Estadísticas ─────────────────────────────────────────────────────────
-- Plan efectivo del propio perfil: pre (sin lanzar), free, starter (de pago o
-- fundador) o business. Solo lo ve su dueño.
CREATE OR REPLACE FUNCTION public.mi_plan_efectivo(p_profile uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT public.plan_para_limites(p.id, p.subscription_tier)
    FROM public.profiles p
   WHERE p.id = p_profile AND p.user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.mi_plan_efectivo(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mi_plan_efectivo(uuid) TO authenticated;

-- Origen de cada visita (solo valores conocidos; cualquier otro se rechaza).
ALTER TABLE public.profile_business_views ADD COLUMN IF NOT EXISTS fuente text;
ALTER TABLE public.profile_business_views DROP CONSTRAINT IF EXISTS profile_business_views_fuente_check;
ALTER TABLE public.profile_business_views ADD CONSTRAINT profile_business_views_fuente_check
  CHECK (fuente IS NULL OR fuente IN ('directo', 'buscador', 'redes', 'otra_web', 'inicio_premium', 'inicio_nuevo', 'interno'));

-- Visitas por día (hora de Madrid), solo para Premium (o antes del lanzamiento).
CREATE OR REPLACE FUNCTION public.mis_visitas_por_dia(p_dias integer DEFAULT 30)
RETURNS TABLE(dia date, visitas integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_plan text;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  SELECT public.plan_para_limites(p.id, p.subscription_tier) INTO v_plan
    FROM public.profiles p WHERE p.user_id = auth.uid() ORDER BY p.is_primary DESC, p.created_at LIMIT 1;
  IF v_plan NOT IN ('business', 'pre') THEN RETURN; END IF;
  p_dias := least(greatest(coalesce(p_dias, 30), 1), 90);
  RETURN QUERY
  SELECT d::date, coalesce(c.n, 0)::integer
    FROM generate_series((now() AT TIME ZONE 'Europe/Madrid')::date - (p_dias - 1), (now() AT TIME ZONE 'Europe/Madrid')::date, interval '1 day') d
    LEFT JOIN (
      SELECT (v.created_at AT TIME ZONE 'Europe/Madrid')::date AS dia, count(*) AS n
        FROM public.profile_business_views v
       WHERE v.viewed_user_id = auth.uid()
         AND v.created_at >= ((now() AT TIME ZONE 'Europe/Madrid')::date - (p_dias - 1))::timestamp AT TIME ZONE 'Europe/Madrid'
       GROUP BY 1) c ON c.dia = d::date
   ORDER BY 1;
END;
$$;
REVOKE ALL ON FUNCTION public.mis_visitas_por_dia(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_visitas_por_dia(integer) TO authenticated;

-- De dónde llegan las visitas (solo las registradas desde que existe la columna).
CREATE OR REPLACE FUNCTION public.mis_visitas_por_origen(p_dias integer DEFAULT 30)
RETURNS TABLE(fuente text, visitas integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_plan text;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  SELECT public.plan_para_limites(p.id, p.subscription_tier) INTO v_plan
    FROM public.profiles p WHERE p.user_id = auth.uid() ORDER BY p.is_primary DESC, p.created_at LIMIT 1;
  IF v_plan NOT IN ('business', 'pre') THEN RETURN; END IF;
  p_dias := least(greatest(coalesce(p_dias, 30), 1), 90);
  RETURN QUERY
  SELECT v.fuente, count(*)::integer
    FROM public.profile_business_views v
   WHERE v.viewed_user_id = auth.uid() AND v.fuente IS NOT NULL
     AND v.created_at >= now() - make_interval(days => p_dias)
   GROUP BY v.fuente
   ORDER BY 2 DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.mis_visitas_por_origen(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_visitas_por_origen(integer) TO authenticated;
