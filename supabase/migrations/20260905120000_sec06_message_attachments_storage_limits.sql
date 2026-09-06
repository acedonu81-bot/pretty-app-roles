-- ─────────────────────────────────────────────────────────────────
-- SEC-06 (bajo): validación server-side de subidas al bucket
-- message-attachments. Hoy la validación de tipo/tamaño vive solo en
-- el cliente (MessagesView.tsx: solo imágenes, máx 5MB), evadible por
-- cualquiera que hable directo con la API de Storage. Este bucket
-- nunca se creó vía migración (se hizo desde el dashboard), así que
-- no tenía file_size_limit ni allowed_mime_types aplicados en remoto.
-- Replica el mismo patrón que SEC-05 aplicó a audio-sessions.
-- ─────────────────────────────────────────────────────────────────
UPDATE storage.buckets
SET
  file_size_limit = 5242880, -- 5 MB, igual que el límite del cliente
  allowed_mime_types = ARRAY[
    'image/jpeg','image/png','image/webp','image/gif'
  ]
WHERE id = 'message-attachments';
