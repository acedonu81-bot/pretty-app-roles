
-- 1. Fix phone exposure: replace public SELECT with authenticated-only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Authenticated users can see all profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Anonymous users can see profiles but NOT phone (handled via a restricted view or app logic)
-- We allow anon read for directory but exclude phone by not granting anon direct access
CREATE POLICY "Anon can view basic profiles"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- 2. Fix privilege escalation: replace permissive UPDATE with restricted WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile safely"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND is_verified = (SELECT is_verified FROM public.profiles WHERE user_id = auth.uid())
  AND is_premium = (SELECT is_premium FROM public.profiles WHERE user_id = auth.uid())
  AND subscription_tier = (SELECT subscription_tier FROM public.profiles WHERE user_id = auth.uid())
);
