-- Programa el email organizador_segundo_perfil (ya existia en send-email pero
-- nunca se disparaba desde ningun sitio). Semanal, no diario: es una campana
-- de invitacion sin urgencia, no un aviso transaccional. La funcion
-- organizador-segundo-perfil-reminder hace su propio dedupe via email_logs,
-- asi que ejecutar de mas nunca reenvia a quien ya lo recibio.
SELECT cron.schedule(
  'xpeak-organizador-segundo-perfil-reminder',
  '0 11 * * 1',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/organizador-segundo-perfil-reminder',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'Content-Type', 'application/json'),
      body    := '{}'::jsonb
    );
  $job$
);
