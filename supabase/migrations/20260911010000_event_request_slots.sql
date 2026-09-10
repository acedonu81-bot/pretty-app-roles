-- Multi-rol/multi-cantidad en una oferta: hasta hoy roles_needed era un
-- array plano de texto ("DJ / Artista", "Camarero / Staff") sin cantidad ni
-- estado propio — un organizador que necesitaba 1 DJ + 2 camareros no tenía
-- forma de pedirlo en una sola oferta, tenía que publicar varias.
--
-- Una fila = una plaza concreta. "2 camareros" son 2 filas en esta tabla,
-- cada una con su propio estado libre/preseleccionada/cubierta — así se
-- puede mostrar "1 de 2 camareros cubiertos" y cada plaza se elige y acepta
-- de forma independiente (decisión explícita del usuario, no un contador
-- ciego).
CREATE TABLE IF NOT EXISTS public.event_request_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_request_slots_request_idx
  ON public.event_request_slots (request_id);

ALTER TABLE public.event_request_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Slots públicos de ofertas abiertas" ON public.event_request_slots;
CREATE POLICY "Slots públicos de ofertas abiertas" ON public.event_request_slots
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id
      AND (r.status = 'open' OR r.client_user_id = auth.uid()::text OR public.es_admin())
  ));

DROP POLICY IF EXISTS "Owner gestiona slots" ON public.event_request_slots;
CREATE POLICY "Owner gestiona slots" ON public.event_request_slots
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id AND r.client_user_id = auth.uid()::text
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id AND r.client_user_id = auth.uid()::text
  ));

-- Migrar datos existentes: cada rol de roles_needed → una plaza (cantidad 1,
-- que es lo único que había hasta hoy).
INSERT INTO public.event_request_slots (request_id, role, created_at)
SELECT r.id, unnest(r.roles_needed), r.created_at
FROM public.event_requests r
WHERE r.roles_needed IS NOT NULL AND cardinality(r.roles_needed) > 0
ON CONFLICT DO NOTHING;

-- event_request_responses pasa a apuntar a una plaza concreta, no a la
-- oferta entera. slot_id nullable durante la migración: las respuestas ya
-- existentes se asocian a la primera plaza de su mismo rol (best-effort,
-- solo afecta a datos anteriores a hoy).
ALTER TABLE public.event_request_responses
  ADD COLUMN IF NOT EXISTS slot_id uuid REFERENCES public.event_request_slots(id) ON DELETE CASCADE;

UPDATE public.event_request_responses err
SET slot_id = (
  SELECT s.id FROM public.event_request_slots s
  WHERE s.request_id = err.request_id
  ORDER BY s.created_at ASC
  LIMIT 1
)
WHERE err.slot_id IS NULL;

CREATE INDEX IF NOT EXISTS event_request_responses_slot_idx
  ON public.event_request_responses (slot_id);
