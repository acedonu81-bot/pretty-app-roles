-- Responder a una oferta de evento DENTRO de XPEAK.
--
-- Hasta hoy (10 sep 2026) event_requests solo se podía responder llamando al
-- teléfono o escribiendo al email que el organizador dejaba en la ficha: la
-- conversación se iba fuera, sin registro, sin trazabilidad y sin que XPEAK
-- pudiera demostrar que el bolo salió de aquí.
--
-- Esta tabla es el "Me interesa": queda quién se apuntó, cuándo y con qué
-- mensaje, y permite avisar al organizador por su campana (que es donde mira,
-- no en el correo).
CREATE TABLE IF NOT EXISTS public.event_request_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  professional_user_id uuid NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Un profesional no se apunta dos veces a la misma oferta.
  UNIQUE (request_id, professional_user_id)
);

CREATE INDEX IF NOT EXISTS event_request_responses_request_idx
  ON public.event_request_responses (request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS event_request_responses_pro_idx
  ON public.event_request_responses (professional_user_id, created_at DESC);

ALTER TABLE public.event_request_responses ENABLE ROW LEVEL SECURITY;

-- El profesional se apunta a sí mismo, nunca en nombre de otro.
DROP POLICY IF EXISTS "Pro inserts own response" ON public.event_request_responses;
CREATE POLICY "Pro inserts own response"
  ON public.event_request_responses FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = professional_user_id);

-- Lee su propia respuesta el profesional, y todas las de su oferta el
-- organizador que la publicó. Nadie más: son datos de quién busca trabajo.
DROP POLICY IF EXISTS "Pro and owner read responses" ON public.event_request_responses;
CREATE POLICY "Pro and owner read responses"
  ON public.event_request_responses FOR SELECT TO authenticated
  USING (
    (SELECT auth.uid()) = professional_user_id
    OR EXISTS (
      SELECT 1 FROM public.event_requests r
      WHERE r.id = event_request_responses.request_id
        AND r.client_user_id = (SELECT auth.uid())::text
    )
  );

-- El profesional puede retirar su candidatura.
DROP POLICY IF EXISTS "Pro deletes own response" ON public.event_request_responses;
CREATE POLICY "Pro deletes own response"
  ON public.event_request_responses FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = professional_user_id);
