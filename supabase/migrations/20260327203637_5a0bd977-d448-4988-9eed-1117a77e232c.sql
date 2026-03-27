ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stream_url text,
ADD COLUMN IF NOT EXISTS stream_title text,
ADD COLUMN IF NOT EXISTS trial_started_at timestamp with time zone NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS birthday date;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS annual_billing boolean NOT NULL DEFAULT false;

UPDATE public.profiles
SET trial_started_at = COALESCE(trial_started_at, created_at, now())
WHERE trial_started_at IS NULL;