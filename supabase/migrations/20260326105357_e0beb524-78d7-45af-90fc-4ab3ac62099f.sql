
-- Remove existing permissive INSERT/UPDATE policies on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;

-- Create RESTRICTIVE policies that deny all authenticated users from INSERT/UPDATE
-- Only the handle_new_user trigger (SECURITY DEFINER) can insert roles
CREATE POLICY "No authenticated insert on roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No authenticated update on roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);
