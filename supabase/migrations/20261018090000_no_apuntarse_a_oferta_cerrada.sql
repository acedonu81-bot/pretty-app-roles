-- 18 oct 2026: un profesional podía apuntarse a una oferta ya cerrada o caducada
-- (la policy "Pro inserts own response" solo mira que la fila sea suya). Con la
-- pantalla desactualizada (caso Burguerfest, cerrada el 13 oct con Dj Poly
-- contratado) cualquiera podía pulsar "Me interesa este bolo" y el organizador
-- recibía el aviso de una oferta que ya tenía DJ.
--
-- Trigger y no policy: la policy de lectura de event_requests ya consulta
-- event_request_responses (ver fix_event_requests_rls_recursion) y consultar
-- event_requests desde una policy de responses reabriría el ciclo.
CREATE OR REPLACE FUNCTION public.bloquear_apuntarse_oferta_cerrada()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = NEW.request_id
      AND r.status = 'open'
      AND r.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'oferta_cerrada' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.bloquear_apuntarse_oferta_cerrada() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_bloquear_apuntarse_oferta_cerrada ON public.event_request_responses;
CREATE TRIGGER trg_bloquear_apuntarse_oferta_cerrada
  BEFORE INSERT ON public.event_request_responses
  FOR EACH ROW EXECUTE FUNCTION public.bloquear_apuntarse_oferta_cerrada();
