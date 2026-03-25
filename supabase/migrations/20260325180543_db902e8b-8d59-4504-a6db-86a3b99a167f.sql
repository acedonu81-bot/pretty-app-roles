
-- Community votes table with daily uniqueness via trigger
CREATE TABLE IF NOT EXISTS public.community_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(voter_id, profile_id, vote_date)
);

ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read votes" ON public.community_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own votes" ON public.community_votes
  FOR INSERT TO authenticated WITH CHECK (voter_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_vote_count(p_profile_id uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.community_votes WHERE profile_id = p_profile_id
$$;

CREATE OR REPLACE FUNCTION public.has_voted_today(p_voter_id uuid, p_profile_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_votes 
    WHERE voter_id = p_voter_id AND profile_id = p_profile_id 
    AND vote_date = CURRENT_DATE
  )
$$;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_hourly_rate_check;
