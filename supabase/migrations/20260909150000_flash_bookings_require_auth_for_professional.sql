-- Hasta ahora "Anyone can insert flash bookings" (WITH CHECK true) permitía
-- contactar a un profesional concreto sin sesión, con created_by = NULL.
-- Esto causó el problema de solicitudes huérfanas resuelto en
-- 20260904120000_rescatar_solicitudes_huerfanas.sql. El frontend ya no
-- permite este camino desde hoy (09 sep 2026): todo botón de contacto de
-- perfil/directorio exige registrarse antes de abrir el formulario.
--
-- Este cambio cierra el mismo hueco a nivel de RLS, para que no se pueda
-- saltar el gate llamando directamente a la API. Se mantiene el INSERT
-- anónimo SOLO para leads genéricos sin profesional asociado (el checklist
-- de /checklist-evento-empresa, que es captación SEO, no contacto directo).

DROP POLICY IF EXISTS "Anyone can insert flash bookings" ON public.flash_bookings;

CREATE POLICY "Anon can insert generic leads only"
  ON public.flash_bookings FOR INSERT TO anon
  WITH CHECK (professional_user_id IS NULL AND created_by IS NULL);

CREATE POLICY "Authenticated can insert own bookings"
  ON public.flash_bookings FOR INSERT TO authenticated
  WITH CHECK (created_by IS NULL OR created_by = auth.uid());
