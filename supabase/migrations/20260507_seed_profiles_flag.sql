-- Add flag to identify seed/demo profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_seed_profile boolean NOT NULL DEFAULT false;
