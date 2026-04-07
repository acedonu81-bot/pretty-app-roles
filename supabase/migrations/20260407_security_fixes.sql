-- ════════════════════════════════════════════════════════════════
-- Security fixes — 2026-04-07
-- 1. Prevent self-verification (is_verified only writable by admins)
-- 2. Fix flash_bookings RLS (requester contact data was world-readable)
-- 3. Add professional_user_id to flash_bookings for proper access control
-- ════════════════════════════════════════════════════════════════

-- ── 1. Trigger: prevent users from setting their own is_verified = true ──────
CREATE OR REPLACE FUNCTION public.prevent_self_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the caller is not an admin, silently restore the original is_verified value
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_verified := OLD.is_verified;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS no_self_verify ON public.profiles;
CREATE TRIGGER no_self_verify
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_verification();

-- ── 2. Add professional_user_id to flash_bookings ───────────────────────────
ALTER TABLE public.flash_bookings
  ADD COLUMN IF NOT EXISTS professional_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── 3. Fix flash_bookings SELECT policy ─────────────────────────────────────
-- Old policy allowed ANY authenticated user to read ALL bookings including contacts.
-- New policy: only the professional who received the booking + admins can read.

DROP POLICY IF EXISTS "Authenticated can read flash bookings" ON public.flash_bookings;

CREATE POLICY "Professional and admin can read flash bookings"
  ON public.flash_bookings FOR SELECT TO authenticated
  USING (
    professional_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- ── 4. Allow professionals to update status of their own bookings ────────────
DROP POLICY IF EXISTS "Authenticated can update status" ON public.flash_bookings;

CREATE POLICY "Professional and admin can update flash bookings"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING (
    professional_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );
