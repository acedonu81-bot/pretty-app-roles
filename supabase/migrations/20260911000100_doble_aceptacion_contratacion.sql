-- Doble aceptación: hasta hoy "Contratar" del empresario cerraba la oferta
-- al instante, sin que el profesional confirmara nada. Ahora el empresario
-- ELIGE (chosen_at) y el profesional debe ACEPTAR (hired_at) para que se
-- cierre — si rechaza, chosen_at vuelve a NULL y la oferta sigue abierta
-- para que el empresario elija a otro. Los demás inscritos no ven ningún
-- cambio mientras el elegido no responde (decisión explícita: no avisar de
-- "preseleccionado" a nadie).
--
-- notify_contratacion ya existe y solo dispara con hired_at NULL->valor en
-- UPDATE — se reutiliza tal cual para el cierre real cuando el profesional
-- acepta, no hace falta tocarlo.

ALTER TABLE public.event_request_responses
  ADD COLUMN IF NOT EXISTS chosen_at timestamptz;

CREATE OR REPLACE FUNCTION public.notify_preseleccion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_titulo text;
BEGIN
  IF NEW.chosen_at IS NULL OR OLD.chosen_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(trim(client_name), ''), 'un organizador')
  INTO v_titulo FROM public.event_requests WHERE id = NEW.request_id;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    NEW.professional_user_id, 'preseleccionado',
    '¡Te han elegido para un bolo!',
    v_titulo || ' quiere contratarte. Entra a confirmar antes de que elija a otro.',
    '/dashboard?view=flashbooking'
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_preseleccion_trigger ON public.event_request_responses;
CREATE TRIGGER notify_preseleccion_trigger
  AFTER UPDATE ON public.event_request_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_preseleccion();

-- El profesional preseleccionado puede marcar su propia hired_at (aceptar) o
-- volver a poner chosen_at a NULL (rechazar) — política propia, sin depender
-- de la del organizador que ya existe para otras columnas.
DROP POLICY IF EXISTS "Preseleccionado responde" ON public.event_request_responses;
CREATE POLICY "Preseleccionado responde" ON public.event_request_responses
  FOR UPDATE TO authenticated
  USING (professional_user_id = auth.uid())
  WITH CHECK (professional_user_id = auth.uid());
