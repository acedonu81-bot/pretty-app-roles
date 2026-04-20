-- Profile posts / experiences (like X/Twitter feed per professional)
CREATE TABLE IF NOT EXISTS public.profile_posts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content     text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  media_url   text,
  post_type   text        DEFAULT 'text' CHECK (post_type IN ('text', 'audio', 'video', 'image')),
  created_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profile_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_posts_public_read"
  ON public.profile_posts FOR SELECT USING (true);

CREATE POLICY "profile_posts_own_insert"
  ON public.profile_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profile_posts_own_delete"
  ON public.profile_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Bio video URL on profiles (for public profile embed)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio_video_url text;

-- Background music URL on profiles (SoundCloud/Spotify/YouTube embed)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_music_url text;
