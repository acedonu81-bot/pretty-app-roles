-- xpeak-review-reminder (creado el 11 sep 2026) se creó con el mismo patrón
-- roto que ya se conocía y se corrigió el 2 sep para los otros 4 crons de
-- email: current_setting('app.service_role_key') nunca se configuró en la
-- base de datos, devuelve NULL, y NULL || texto es NULL en SQL — el jsonb de
-- headers quedaba inválido y la petición no llegaba a salir. El job existía y
-- estaba activo pero no se había ejecutado ni una sola vez (0 filas en
-- cron.job_run_details), así que el fallo pasó desapercibido hasta esta
-- auditoría del 12 sep.
--
-- Mismo arreglo que 20260902150000_fix_cron_email_jobs.sql: la clave anon
-- incrustada directamente en la definición del job, que es lo que pg_cron
-- ejecuta tal cual (el rol de la API no puede leer parámetros de base de
-- datos con ALTER DATABASE SET).

SELECT cron.unschedule('xpeak-review-reminder');
SELECT cron.schedule(
  'xpeak-review-reminder',
  '0 10 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/review-reminder',
      headers := jsonb_build_object(
        'Authorization', 'Bearer <<CLAVE_ANON — ver .env, no se versiona>>',
        'Content-Type', 'application/json'),
      body    := '{}'::jsonb
    );
  $job$
);

-- NOTA: la clave real no se versiona aqui. Este archivo documenta el arreglo;
-- la version aplicada en produccion lleva la clave anon incrustada, porque
-- pg_cron ejecuta el comando tal cual y el rol de la API no puede leer
-- parametros de base de datos.
