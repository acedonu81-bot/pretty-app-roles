-- Fix crítico: la policy "leads_select_admin" comprobaba auth.role() =
-- 'authenticated' en vez de rol de admin — cualquier usuario registrado
-- (cualquier DJ/fotógrafo/empresario con cuenta) podía leer TODA la tabla de
-- emails capturados en el blog, no solo los admins. Corregido a has_role().
DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;

CREATE POLICY "leads_select_admin" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
