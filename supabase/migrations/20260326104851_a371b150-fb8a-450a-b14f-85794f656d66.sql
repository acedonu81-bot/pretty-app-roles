
-- 1. Add DELETE policy on user_roles - admin only
CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Add restrictive DELETE policy on transactions - admin only
CREATE POLICY "Only admins can delete transactions"
ON public.transactions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add restrictive UPDATE policy on transactions - admin only
CREATE POLICY "Only admins can update transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Add DELETE policy on flash_jobs - owner or admin only
CREATE POLICY "Employers or admins can delete jobs"
ON public.flash_jobs FOR DELETE
TO authenticated
USING (employer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
