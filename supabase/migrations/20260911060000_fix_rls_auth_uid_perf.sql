-- El advisor de rendimiento de Supabase marca 3 políticas RLS que llaman a
-- auth.uid() directamente en vez de (select auth.uid()): Postgres reevalúa
-- la función por cada fila comprobada en vez de una sola vez por consulta.
-- Sin impacto real todavía (poco volumen), pero es gratis arreglarlo ahora
-- y evita que se note cuando haya más tráfico.
DROP POLICY IF EXISTS "Slots públicos de ofertas abiertas" ON public.event_request_slots;
CREATE POLICY "Slots públicos de ofertas abiertas" ON public.event_request_slots
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id
      AND (r.status = 'open' OR r.client_user_id = (SELECT auth.uid())::text OR public.es_admin())
  ));

DROP POLICY IF EXISTS "Owner gestiona slots" ON public.event_request_slots;
CREATE POLICY "Owner gestiona slots" ON public.event_request_slots
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id AND r.client_user_id = (SELECT auth.uid())::text
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_requests r
    WHERE r.id = event_request_slots.request_id AND r.client_user_id = (SELECT auth.uid())::text
  ));

DROP POLICY IF EXISTS "Preseleccionado responde" ON public.event_request_responses;
CREATE POLICY "Preseleccionado responde" ON public.event_request_responses
  FOR UPDATE TO authenticated
  USING (professional_user_id = (SELECT auth.uid()))
  WITH CHECK (professional_user_id = (SELECT auth.uid()));
