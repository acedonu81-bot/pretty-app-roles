
-- Languages spoken by the professional
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
