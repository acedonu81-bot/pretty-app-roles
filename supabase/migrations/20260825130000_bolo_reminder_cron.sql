-- pg_cron: run bolo-reminder-24h every day at 09:00 UTC (10:00 hora España
-- en invierno, 11:00 en verano) — recuerda por email los bolos de mañana a
-- quien tenga la alerta "24h antes del evento" activada.
select cron.schedule(
  'xpeak-bolo-reminder-24h',
  '0 9 * * *',
  $$
    select net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/bolo-reminder-24h',
      headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
      body   := '{}'::jsonb
    );
  $$
);
