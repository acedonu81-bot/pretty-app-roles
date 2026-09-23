-- El formulario "búsqueda sin resultados" (DirectoryView, dentro del panel)
-- lo envían usuarios con sesión iniciada, y leads solo tenía policy de INSERT
-- para anon: todo intento acababa en 42501 sin guardar nada. Mismo permiso
-- que anon (solo INSERT); la lectura sigue restringida a admin.
DROP POLICY IF EXISTS "leads_insert_authenticated" ON public.leads;
CREATE POLICY "leads_insert_authenticated" ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (true);
