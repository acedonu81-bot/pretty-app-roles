-- Auditoría de seguridad 10 nov 2026, puntos 3 y 4.
--
-- 1. Las 9 funciones que lanza el cron (recordatorios y recálculo) ahora exigen
--    el secreto interno (ver supabase/functions/_shared/soloInterno.ts). Los
--    crons lo leen del vault en cada ejecución y lo mandan en x-internal-secret.
--    Se añade la cabecera al comando que ya existe, sin tocar nada más.
SELECT cron.alter_job(
  jobid,
  command := replace(
    command,
    '''Content-Type''',
    '''x-internal-secret'', (select decrypted_secret from vault.decrypted_secrets where name = ''send_email_internal_secret''), ''Content-Type'''
  )
)
FROM cron.job
WHERE jobname IN (
  'xpeak-anniversary-emails', 'xpeak-profile-incomplete-reminder', 'xpeak-review-reminder',
  'xpeak-unread-message-reminder', 'xpeak-photo-missing-digest', 'xpeak-bolo-reminder-24h',
  'xpeak-complete-review-reminder', 'xpeak-organizador-segundo-perfil-reminder', 'xpeak-response-bucket'
)
AND command NOT LIKE '%x-internal-secret%';

-- 2. El bucket público 'portfolios' aceptaba cualquier tipo de archivo (HTML o
--    SVG servidos desde el dominio de Supabase). Está vacío; se limita a
--    imagen, audio y vídeo, igual que 'audio-sessions'.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg','image/png','image/webp','image/gif',
  'audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/m4a','audio/x-m4a','audio/aac','audio/ogg',
  'video/mp4','video/webm','video/quicktime'
]
WHERE id = 'portfolios';
