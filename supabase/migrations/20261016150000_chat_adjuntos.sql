-- Fotos y vídeos en el chat (16 oct 2026).
-- Hasta hoy el botón de foto del chat no podía funcionar: no existía el bucket
-- 'message-attachments' ni las columnas en messages. Los adjuntos son PRIVADOS:
-- solo los dos participantes de la conversación los ven (URL firmada).
-- Ojo: messages tiene permisos por columna, así que las columnas nuevas
-- necesitan GRANT explícito (si no, el SELECT de la tabla falla).

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS video_url text;

GRANT SELECT (photo_url, video_url), INSERT (photo_url, video_url) ON public.messages TO authenticated;

-- El archivo tiene que estar en la carpeta de quien envía el mensaje.
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_adjunto_en_carpeta_propia;
ALTER TABLE public.messages ADD CONSTRAINT messages_adjunto_en_carpeta_propia CHECK (
  (photo_url IS NULL OR photo_url LIKE sender_id::text || '/%')
  AND (video_url IS NULL OR video_url LIKE sender_id::text || '/%')
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments', 'message-attachments', false, 26214400,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','video/webm']
)
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "message_attachments_insert_own" ON storage.objects;
CREATE POLICY "message_attachments_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'message-attachments'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "message_attachments_select_participants" ON storage.objects;
CREATE POLICY "message_attachments_select_participants" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'message-attachments'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR EXISTS (
        SELECT 1
        FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE (m.photo_url = storage.objects.name OR m.video_url = storage.objects.name)
          AND m.deleted_at IS NULL
          AND (SELECT auth.uid()) IN (c.participant_a, c.participant_b)
      )
    )
  );

DROP POLICY IF EXISTS "message_attachments_delete_own" ON storage.objects;
CREATE POLICY "message_attachments_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'message-attachments'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
