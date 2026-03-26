
-- 1. Block anon access to user_roles entirely
CREATE POLICY "No anon access to roles"
ON public.user_roles FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 2. Restrict profile INSERT to safe defaults
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile safely"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND is_verified = false
  AND is_premium = false
  AND subscription_tier = 'free'
);
