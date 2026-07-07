-- ════════════════════════════════════════════════════════════════
-- Fix: anonymous INSERT on flash_bookings was returning 401 (RLS
-- policy 42501) in production, even though the original migration
-- (20260402_flash_bookings.sql) created "Anyone can insert flash
-- bookings" TO public WITH CHECK (true). The policy was apparently
-- altered/dropped outside of migrations (Supabase dashboard), since
-- no later migration in this repo touches INSERT.
--
-- This breaks both the individual "Solicitar presupuesto" button
-- (FlashBookingRequestModal) and the multi-professional event cart —
-- both insert anonymously, without an authenticated session, by design
-- (organizers are never asked to register to contact professionals).
-- ════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Anyone can insert flash bookings" ON public.flash_bookings;

CREATE POLICY "Anyone can insert flash bookings"
  ON public.flash_bookings FOR INSERT TO public
  WITH CHECK (true);
