
-- 1. Drop phone column from profiles entirely - data already migrated to profile_contacts
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- 2. Restrict community_votes SELECT to own votes only
DROP POLICY IF EXISTS "Anyone authenticated can read votes" ON public.community_votes;

CREATE POLICY "Users can read own votes"
ON public.community_votes FOR SELECT
TO authenticated
USING (voter_id = auth.uid());
