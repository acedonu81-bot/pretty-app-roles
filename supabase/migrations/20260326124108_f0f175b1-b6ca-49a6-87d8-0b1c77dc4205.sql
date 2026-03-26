
-- 1) Fix user_roles: replace blanket false INSERT policy with explicit admin-only check
DROP POLICY IF EXISTS "No authenticated insert on roles" ON public.user_roles;
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Fix user_roles: replace blanket false UPDATE policy with explicit admin-only check
DROP POLICY IF EXISTS "No authenticated update on roles" ON public.user_roles;
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Fix community_votes: allow profile owners to read votes on their profile
CREATE POLICY "Profile owners can view votes on their profile"
  ON public.community_votes
  FOR SELECT
  TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- 4) Allow voters to delete their own votes (retraction)
CREATE POLICY "Users can delete own votes"
  ON public.community_votes
  FOR DELETE
  TO authenticated
  USING (voter_id = auth.uid());
