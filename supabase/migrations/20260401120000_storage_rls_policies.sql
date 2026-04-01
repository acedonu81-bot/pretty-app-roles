
-- Storage RLS policies for audio-sessions bucket
-- Without these, only service_role can write; authenticated users can't upload

-- Make bucket public (reads without auth)
UPDATE storage.buckets SET public = true WHERE id = 'audio-sessions';

-- Allow authenticated users to upload to their own folder (any subfolder)
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'audio-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to list/read files in their own folder
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'audio-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read of all files (for displaying photos, audio, portfolio)
CREATE POLICY "Public can read all files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'audio-sessions');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'audio-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update (replace) their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'audio-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
