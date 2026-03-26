
-- Remove anon access to profiles table entirely - phone is sensitive
DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;
