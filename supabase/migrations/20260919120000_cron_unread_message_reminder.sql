-- Cron diario: recordatorio de mensaje sin responder pasadas ~24h.
-- Misma limitación que el resto de crons de email — el rol de la API de
-- Supabase no puede fijar parámetros a nivel de base de datos, así que la
-- url y la clave van incrustadas en la definición del job.

SELECT cron.schedule(
  'xpeak-unread-message-reminder',
  '0 12 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/unread-message-reminder',
      headers := jsonb_build_object(
        'Authorization', 'Bearer <<CLAVE_ANON — ver .env, no se versiona>>',
        'Content-Type', 'application/json'),
      body    := '{}'::jsonb
    );
  $job$
);
