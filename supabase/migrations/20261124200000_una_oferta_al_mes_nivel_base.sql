-- 24 nov 2026 (decisión de Daniel): el nivel base (plan_para_limites = 'free': sin
-- suscripción de pago, no fundador, ya lanzados los cobros) puede apuntarse a UNA
-- oferta Flash al mes. Profesional, Premium, fundadores y el periodo previo al
-- lanzamiento ('pre') no tienen tope.
--
-- El tope va en un trigger y no solo en la web: la policy "Pro inserts own response"
-- deja insertar a cualquier profesional, y un tope solo visual se salta con una
-- llamada directa. Mes natural en hora de Madrid.
--
-- Se cuentan las respuestas creadas este mes por ese profesional. El trigger de
-- "oferta cerrada" se llama trg_bloquear_..., se ejecuta antes (orden alfabético) y
-- una oferta cerrada no gasta la del mes.

CREATE OR REPLACE FUNCTION public.ofertas_mes_usadas(p_user uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT count(*)::int
    FROM public.event_request_responses r
   WHERE r.professional_user_id = p_user
     AND r.created_at >= date_trunc('month', now() AT TIME ZONE 'Europe/Madrid') AT TIME ZONE 'Europe/Madrid';
$$;
REVOKE ALL ON FUNCTION public.ofertas_mes_usadas(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.limitar_ofertas_mes_nivel_base()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_plan text;
BEGIN
  SELECT public.plan_para_limites(p.id, p.subscription_tier) INTO v_plan
    FROM public.profiles p WHERE p.user_id = NEW.professional_user_id;
  IF v_plan = 'free' AND public.ofertas_mes_usadas(NEW.professional_user_id) >= 1 THEN
    RAISE EXCEPTION 'limite_ofertas_mes' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limitar_ofertas_mes_nivel_base() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_limitar_ofertas_mes_nivel_base ON public.event_request_responses;
CREATE TRIGGER trg_limitar_ofertas_mes_nivel_base
  BEFORE INSERT ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.limitar_ofertas_mes_nivel_base();

-- Lo que lee la web para avisar: limite NULL = sin tope. Solo el propio perfil.
CREATE OR REPLACE FUNCTION public.mis_ofertas_mes()
RETURNS TABLE(limite integer, usadas integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE WHEN public.plan_para_limites(p.id, p.subscription_tier) = 'free' THEN 1 ELSE NULL END,
         public.ofertas_mes_usadas(p.user_id)
    FROM public.profiles p
   WHERE p.user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.mis_ofertas_mes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_ofertas_mes() TO authenticated;
