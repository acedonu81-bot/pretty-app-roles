-- event_requests: cualquiera podía modificar la solicitud de cualquier otro.
--
-- La política de UPDATE era `qual: true` para el rol `public`: sin necesidad de
-- estar logueado, se podía cambiar cualquier fila — presupuesto, fecha, email
-- de contacto o estado de la solicitud de otra persona.
--
-- La tabla está hoy vacía (0 filas), así que no ha habido daño. Se cierra ahora
-- justamente por eso: cuando empiece a usarse ya estará bien.
--
-- Solo el dueño de la solicitud puede modificarla. Las anónimas
-- (client_user_id NULL) no las puede tocar nadie desde el cliente: se gestionan
-- con service_role, que salta la RLS.
DROP POLICY IF EXISTS "er_update" ON public.event_requests;

CREATE POLICY "er_update"
ON public.event_requests FOR UPDATE TO authenticated
-- client_user_id es TEXT en esta tabla, de ahí el cast explícito.
USING (client_user_id IS NOT NULL AND client_user_id = auth.uid()::text)
WITH CHECK (client_user_id IS NOT NULL AND client_user_id = auth.uid()::text);
