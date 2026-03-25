
-- Create storage bucket for audio sessions
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-sessions', 'audio-sessions', true);

-- Storage RLS: anyone can read, authenticated users can upload their own
CREATE POLICY "Public read audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio-sessions');
CREATE POLICY "Auth users upload audio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'audio-sessions');
CREATE POLICY "Users delete own audio" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'audio-sessions' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Favorites table for empresarios
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites" ON public.favorites FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete favorites" ON public.favorites FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Flash jobs table
CREATE TABLE IF NOT EXISTS public.flash_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL DEFAULT 'Madrid Centro',
  pay text NOT NULL,
  role_needed text NOT NULL DEFAULT 'dj',
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.flash_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active flash jobs" ON public.flash_jobs FOR SELECT USING (is_active = true AND expires_at > now());
CREATE POLICY "Employers can insert flash jobs" ON public.flash_jobs FOR INSERT TO authenticated WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Employers can update own jobs" ON public.flash_jobs FOR UPDATE TO authenticated USING (employer_id = auth.uid());
