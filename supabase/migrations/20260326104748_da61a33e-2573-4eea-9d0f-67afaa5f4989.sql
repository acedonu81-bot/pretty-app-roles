
-- 1. PHONE PRIVACY: Replace broad SELECT with owner-sees-all + others-see-no-phone
-- Since RLS is row-level, we use a column-masking approach via a generated column isn't possible,
-- so we create a separate secure table for contact info

CREATE TABLE IF NOT EXISTS public.profile_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  phone text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;

-- Only the owner can see their own contact info
CREATE POLICY "Owner can read own contacts"
ON public.profile_contacts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Owner can update own contacts"
ON public.profile_contacts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owner can insert own contacts"
ON public.profile_contacts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Migrate existing phone data to profile_contacts
INSERT INTO public.profile_contacts (user_id, phone)
SELECT user_id, COALESCE(phone, '')
FROM public.profiles
WHERE phone IS NOT NULL AND phone != ''
ON CONFLICT (user_id) DO NOTHING;

-- Clear phone from profiles table (set to empty/null so it's not exposed)
UPDATE public.profiles SET phone = NULL;

-- 2. ADMIN ROLE PROTECTION: Add explicit restrictive policies on user_roles
-- Ensure only admins can insert/update roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
