-- Versiona en git los límites de tamaño/tipo de los buckets de Storage.
-- Aplicados directamente en el dashboard de Supabase en algún momento
-- anterior a esta migración (verificado en producción el 18 ago 2026 en la
-- auditoría de seguridad) — sin esto, reconstruir el proyecto desde las
-- migraciones no recuperaría esta protección, dejando los buckets sin
-- límite real de tamaño/tipo de archivo.

update storage.buckets
set
  file_size_limit = 157286400, -- 150MB
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a', 'audio/mp4'
  ]
where name = 'audio-sessions';

update storage.buckets
set file_size_limit = 20971520 -- 20MB
where name = 'Music';

update storage.buckets
set file_size_limit = 20971520 -- 20MB
where name = 'portfolios';
