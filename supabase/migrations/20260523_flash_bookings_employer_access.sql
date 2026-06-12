-- ════════════════════════════════════════════════════════════════
-- Flash Bookings — allow employers (created_by) to read and update
-- their own bookings. Previously only professionals could access.
-- ════════════════════════════════════════════════════════════════

-- Update SELECT policy
DROP POLICY IF EXISTS "Professional and admin can read flash bookings" ON public.flash_bookings;

CREATE POLICY "Professional and employer can read flash bookings"
  ON public.flash_bookings FOR SELECT TO authenticated
  USING (
    professional_user_id = auth.uid()
    OR created_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- Update UPDATE policy
DROP POLICY IF EXISTS "Professional and admin can update flash bookings" ON public.flash_bookings;

CREATE POLICY "Professional and employer can update flash bookings"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING (
    professional_user_id = auth.uid()
    OR created_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );
