-- 24 nov 2026: segunda revisión de seguridad del tope de 1 oferta al mes.
--  1) Carrera: dos INSERT simultáneos a ofertas distintas pasaban los dos la
--     comprobación antes de que ninguno se anotara. Candado por usuario dentro
--     de la transacción: el segundo espera al primero y ya ve su registro.
--  2) Edición: la policy "Preseleccionado responde" deja al profesional hacer UPDATE
--     de su fila sin limitar columnas, así que podía apuntarse a A y cambiar
--     request_id a B sin gastar otra. Ningún flujo cambia request_id,
--     professional_user_id ni created_at (solo hired_at, chosen_at,
--     review_asked_at, slot_id): se bloquean esos tres.

CREATE OR REPLACE FUNCTION public.limitar_ofertas_mes_nivel_base()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_plan text;
  v_otra boolean;
BEGIN
  NEW.created_at := now();
  -- Serializa las altas del mismo profesional (se libera al acabar la transacción).
  PERFORM pg_advisory_xact_lock(hashtextextended('ofertas_mes:' || NEW.professional_user_id::text, 0));

  SELECT public.plan_para_limites(p.id, p.subscription_tier) INTO v_plan
    FROM public.profiles p WHERE p.user_id = NEW.professional_user_id
   ORDER BY p.is_primary DESC, p.created_at LIMIT 1;

  IF coalesce(v_plan, 'free') = 'free' THEN
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

  INSERT INTO public.ofertas_mes_registro (user_id, request_id)
  VALUES (NEW.professional_user_id, NEW.request_id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limitar_ofertas_mes_nivel_base() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.respuesta_oferta_campos_fijos()
RETURNS trigger
LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.request_id IS DISTINCT FROM OLD.request_id
     OR NEW.professional_user_id IS DISTINCT FROM OLD.professional_user_id THEN
    RAISE EXCEPTION 'respuesta_no_editable' USING ERRCODE = 'P0001';
  END IF;
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.respuesta_oferta_campos_fijos() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_respuesta_oferta_campos_fijos ON public.event_request_responses;
CREATE TRIGGER trg_respuesta_oferta_campos_fijos
  BEFORE UPDATE ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.respuesta_oferta_campos_fijos();
