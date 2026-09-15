-- Cron diario: recuerda a empresarios con reseñas aprobadas anteriores al
-- 16 sep 2026 (sin las 3 preguntas nuevas) que pueden completarlas.
-- Nunca alcanza a cuentas demo (ver isDemoAccount.ts en la función).
SELECT cron.schedule(
  'xpeak-complete-review-reminder',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/complete-review-reminder',
    headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb);
  $$
);
