-- Add fan_tier column to profile_posts for Fan Club exclusive content
ALTER TABLE public.profile_posts
  ADD COLUMN IF NOT EXISTS fan_tier text DEFAULT 'fan'
    CHECK (fan_tier IN ('fan', 'vip'));

-- Index for fan queries
CREATE INDEX IF NOT EXISTS profile_posts_fan_tier_idx ON public.profile_posts (user_id, fan_tier);
