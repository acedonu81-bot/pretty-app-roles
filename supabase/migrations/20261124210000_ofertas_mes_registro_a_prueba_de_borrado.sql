-- 24 nov 2026: endurece 20261124200000 tras la revisión de seguridad.
--  1) created_at lo ponía el cliente (la policy de INSERT solo mira professional_user_id):
--     con una fecha de otro mes la respuesta no contaba. Ahora el trigger la fija a now().
--  2) El profesional puede BORRAR su respuesta ("Pro deletes own response") y el
--     contador se reiniciaba. El consumo pasa a un registro que el borrado no toca.
--  3) El plan salía de un perfil cualquiera del usuario y, sin perfil, quedaba NULL y
--     no se aplicaba el tope. Ahora se usa el perfil principal (igual que las
--     estadísticas) y, sin perfil, cuenta como nivel base.
-- Volver a apuntarse a la MISMA oferta no gasta otra: el registro es único por oferta.

CREATE TABLE IF NOT EXISTS public.ofertas_mes_registro (
  user_id    uuid        NOT NULL,
  request_id uuid        NOT NULL,
  creado     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, request_id)
);
ALTER TABLE public.ofertas_mes_registro ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ofertas_mes_registro FROM PUBLIC, anon, authenticated;
-- Sin policies a propósito: solo lo tocan las funciones SECURITY DEFINER.

-- Lo ya apuntado (cualquier mes) entra en el registro con su fecha real.
INSERT INTO public.ofertas_mes_registro (user_id, request_id, creado)
SELECT professional_user_id, request_id, min(created_at)
  FROM public.event_request_responses
 GROUP BY 1, 2
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.ofertas_mes_usadas(p_user uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT count(*)::int
    FROM public.ofertas_mes_registro r
   WHERE r.user_id = p_user
     AND r.creado >= date_trunc('month', now() AT TIME ZONE 'Europe/Madrid') AT TIME ZONE 'Europe/Madrid';
$$;
REVOKE ALL ON FUNCTION public.ofertas_mes_usadas(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.limitar_ofertas_mes_nivel_base()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_plan text;
  v_otra boolean;
BEGIN
  -- La fecha la pone el servidor, nunca el cliente.
  NEW.created_at := now();

  SELECT public.plan_para_limites(p.id, p.subscription_tier) INTO v_plan
    FROM public.profiles p WHERE p.user_id = NEW.professional_user_id
   ORDER BY p.is_primary DESC, p.created_at LIMIT 1;

  IF coalesce(v_plan, 'free') = 'free' THEN
    -- ¿Ya gastó este mes la oferta en una oferta DISTINTA de esta?
    SELECT EXISTS (
      SELECT 1 FROM public.ofertas_mes_registro r
       WHERE r.user_id = NEW.professional_user_id
         AND r.request_id <> NEW.request_id
         AND r.creado >= date_trunc('month', now() AT TIME ZONE 'Europe/Madrid') AT TIME ZONE 'Europe/Madrid'
    ) INTO v_otra;
    IF v_otra THEN
      RAISE EXCEPTION 'limite_ofertas_mes' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- Se anota siempre (también Profesional/Premium): si baja de plan, el mes ya cuenta.
  INSERT INTO public.ofertas_mes_registro (user_id, request_id)
  VALUES (NEW.professional_user_id, NEW.request_id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limitar_ofertas_mes_nivel_base() FROM PUBLIC, anon, authenticated;

-- mis_ofertas_mes: mismo perfil principal que el trigger.
CREATE OR REPLACE FUNCTION public.mis_ofertas_mes()
RETURNS TABLE(limite integer, usadas integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE WHEN public.plan_para_limites(p.id, p.subscription_tier) = 'free' THEN 1 ELSE NULL END,
         public.ofertas_mes_usadas(p.user_id)
    FROM public.profiles p
   WHERE p.user_id = auth.uid()
   ORDER BY p.is_primary DESC, p.created_at
   LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.mis_ofertas_mes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mis_ofertas_mes() TO authenticated;
