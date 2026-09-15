-- Cron diario que recalcula profiles.response_bucket para todos los
-- profesionales con conversaciones elegibles. Mismo patrón que
-- xpeak-review-reminder (net.http_post a una edge function).
SELECT cron.schedule(
  'xpeak-response-bucket',
  '30 3 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/response-bucket-recalc',
    headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb);
  $$
);
