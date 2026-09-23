-- La policy event_requests_authenticated_read (harden_public_data, 23 sep)
-- consultaba event_request_responses, cuya policy de lectura consulta a su
-- vez event_requests → "infinite recursion detected in policy". Cualquier
-- lectura autenticada de event_requests fallaba: panel admin de contratos
-- (Gonzalo DJ ↔ Burger Gourmet Fest), solicitudes del organizador y ofertas
-- del profesional. Se rompe el ciclo con un helper SECURITY DEFINER.

CREATE OR REPLACE FUNCTION public.contratado_en_solicitud(p_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.event_request_responses r
    WHERE r.request_id = p_request_id
      AND r.professional_user_id = auth.uid()
      AND r.hired_at IS NOT NULL
  );
$$;
REVOKE ALL ON FUNCTION public.contratado_en_solicitud(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contratado_en_solicitud(uuid) TO authenticated;

DROP POLICY IF EXISTS "event_requests_authenticated_read" ON public.event_requests;
CREATE POLICY "event_requests_authenticated_read"
ON public.event_requests FOR SELECT TO authenticated
USING (
  COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (
    (status = 'open' AND expires_at > now())
    OR client_user_id = (SELECT auth.uid())::text
    OR public.contratado_en_solicitud(id)
    OR public.es_admin()
  )
);
