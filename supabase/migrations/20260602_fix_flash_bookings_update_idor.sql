-- ════════════════════════════════════════════════════════════════
-- Fix IDOR: split UPDATE policy so employers cannot change status.
-- Only the professional (or admin) can accept/reject a booking.
-- ════════════════════════════════════════════════════════════════

-- Remove the overly-permissive combined policy
DROP POLICY IF EXISTS "Professional and employer can update flash bookings" ON public.flash_bookings;

-- Policy 1: Professional can update their own bookings (accept / reject / close)
CREATE POLICY "Professional can update own flash bookings"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING  (professional_user_id = auth.uid())
  WITH CHECK (professional_user_id = auth.uid());

-- Policy 2: Admin retains full update access
CREATE POLICY "Admin can update any flash booking"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Note: employers (created_by) no longer have UPDATE access.
-- If employer cancellation is needed in the future, add a separate
-- policy with WITH CHECK (status = 'cancelled') to restrict transitions.
