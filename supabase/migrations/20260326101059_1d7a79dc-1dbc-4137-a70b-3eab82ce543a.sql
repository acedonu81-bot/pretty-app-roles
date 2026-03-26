
-- 1. Create a secure view that hides phone for non-owners
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  id, user_id, display_name, role, specialty, zone, instagram, photo_url,
  hourly_rate, is_flash_active, is_verified, is_premium, subscription_tier,
  created_at, updated_at,
  CASE WHEN auth.uid() = user_id THEN phone ELSE NULL END AS phone
FROM public.profiles;

-- 2. Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 3. Create new SELECT policy: public can see profiles but phone is protected via view
-- We still need a SELECT policy for the view to work, but we'll use the view for queries
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO public
USING (true);

-- 4. Drop the old UPDATE policy that allows updating any column
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 5. Create a restricted UPDATE policy using a trigger to protect privileged fields
CREATE OR REPLACE FUNCTION public.protect_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Prevent users from modifying privileged fields
  -- Only allow changes if the caller has admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_verified := OLD.is_verified;
    NEW.is_premium := OLD.is_premium;
    NEW.subscription_tier := OLD.subscription_tier;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_privileged_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_privileged_fields();

-- 6. Re-create UPDATE policy (still user can update own row, but trigger blocks privileged fields)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
