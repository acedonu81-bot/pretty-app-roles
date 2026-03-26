-- Allow authenticated users to read active, non-expired flash jobs
CREATE POLICY "Authenticated users can read active flash jobs"
  ON public.flash_jobs
  FOR SELECT
  TO authenticated
  USING (is_active = true AND expires_at > now());

-- Allow employers to see their own jobs (including inactive)
CREATE POLICY "Employers can read own flash jobs"
  ON public.flash_jobs
  FOR SELECT
  TO authenticated
  USING (employer_id = auth.uid());