-- El panel admin (AdminMetrics.tsx) cuenta event_request_responses con
-- hired_at no nulo para "Aceptadas" en la tarjeta Flash Booking, pero la
-- única policy de SELECT era "eres el profesional O el dueño de la oferta"
-- — el admin no encajaba en ninguna, así que la query siempre devolvía 0
-- filas desde el cliente aunque hubiera contrataciones reales (caso real:
-- Gonzalo/Burger Gourmet Fest 10 sep, "Aceptadas" mostraba 0 con 1 real).
DROP POLICY IF EXISTS "Pro and owner read responses" ON public.event_request_responses;
CREATE POLICY "Pro and owner read responses" ON public.event_request_responses
  FOR SELECT TO authenticated
  USING (
    (SELECT auth.uid()) = professional_user_id
    OR EXISTS (
      SELECT 1 FROM public.event_requests r
      WHERE r.id = event_request_responses.request_id
        AND r.client_user_id = (SELECT auth.uid())::text
    )
    OR public.es_admin()
  );
