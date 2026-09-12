-- Auditoría del panel admin (12 sep 2026): "Reseñas Pendientes" y "Códigos
-- Promo" son las dos únicas pestañas que aparecían OK en el frontend pero
-- estaban completamente rotas por RLS, mismo patrón ya conocido en memoria
-- ("RLS olvida al admin") — se añadieron al panel sin llevarse la policy de
-- admin que sí tienen flash_bookings, profile_deletions, etc.
--
-- reviews: la única SELECT existente es approved=true (público). No había
-- ninguna policy que permitiera al admin ver approved=false, ni UPDATE
-- (aprobar) ni DELETE (rechazar) — con reviews vacía hoy el bug no se nota,
-- pero en cuanto llegue la primera reseña pendiente la pestaña dirá "no hay
-- nada" aunque exista.
DROP POLICY IF EXISTS "Admins read all reviews" ON public.reviews;
CREATE POLICY "Admins read all reviews"
  ON public.reviews FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update reviews" ON public.reviews;
CREATE POLICY "Admins update reviews"
  ON public.reviews FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete reviews" ON public.reviews;
CREATE POLICY "Admins delete reviews"
  ON public.reviews FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- promo_codes: la única policy existente es SELECT is_active=true. No había
-- NINGUNA policy de INSERT/UPDATE/DELETE — crear, activar/desactivar o
-- borrar un código promo desde el panel admin fallaba por RLS en todos los
-- casos, silenciosamente en activar/borrar porque AdminPromoCodes.tsx no
-- comprueba el error de esas dos llamadas.
DROP POLICY IF EXISTS "Admins read all promo codes" ON public.promo_codes;
CREATE POLICY "Admins read all promo codes"
  ON public.promo_codes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins insert promo codes" ON public.promo_codes;
CREATE POLICY "Admins insert promo codes"
  ON public.promo_codes FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update promo codes" ON public.promo_codes;
CREATE POLICY "Admins update promo codes"
  ON public.promo_codes FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete promo codes" ON public.promo_codes;
CREATE POLICY "Admins delete promo codes"
  ON public.promo_codes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
