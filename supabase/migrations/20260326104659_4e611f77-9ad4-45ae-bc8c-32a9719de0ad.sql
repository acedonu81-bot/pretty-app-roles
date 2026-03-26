
-- 1. Secure function to get phone only for profile owner
CREATE OR REPLACE FUNCTION public.get_profile_phone(p_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT phone FROM public.profiles
  WHERE user_id = p_user_id AND p_user_id = auth.uid()
$$;

-- 2. Create a public-safe view that hides phone from non-owners
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  id, user_id, display_name, role, hourly_rate, specialty, zone,
  instagram, photo_url, is_flash_active, is_verified, is_premium,
  subscription_tier, created_at, updated_at,
  CASE WHEN user_id = auth.uid() THEN phone ELSE NULL END AS phone
FROM public.profiles;

-- 3. Update trigger to also protect 'role' field from user self-modification
CREATE OR REPLACE FUNCTION public.protect_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_verified := OLD.is_verified;
    NEW.is_premium := OLD.is_premium;
    NEW.subscription_tier := OLD.subscription_tier;
    -- Prevent professional role changes without admin approval
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Ensure the trigger is attached (recreate if needed)
DROP TRIGGER IF EXISTS protect_privileged_fields_trigger ON public.profiles;
CREATE TRIGGER protect_privileged_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_privileged_fields();

-- 5. Ensure user_roles has no INSERT/UPDATE for regular users (verify existing)
-- Already no INSERT/UPDATE policies exist, but add explicit deny via no policy = denied
-- No action needed since RLS is enabled and no INSERT/UPDATE policies exist for non-admins
