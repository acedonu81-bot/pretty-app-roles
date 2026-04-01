
-- Add audio embed URL field for DJs to link their hearthis.at / Mixcloud / SoundCloud profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_embed_url TEXT;
