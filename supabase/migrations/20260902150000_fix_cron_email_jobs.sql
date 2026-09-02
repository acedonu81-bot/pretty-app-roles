-- Los 4 cron jobs de emails llevaban fallando desde el 3 may 2026: 150
-- ejecuciones, 150 errores, 0 exitos. Todos con el mismo mensaje,
-- "invalid input syntax for type json".
--
-- Causa: las migraciones construian la cabecera concatenando
-- current_setting('app.service_role_key'), pero ese parametro nunca se
-- configuro en la base de datos. Devolvia NULL, y como NULL || texto es NULL
-- en SQL, el jsonb de headers quedaba invalido y la peticion no llegaba a
-- salir. Ningun recordatorio de perfil incompleto, aviso de bolo 24h antes ni
-- aniversario se ha enviado en 4 meses.
--
-- No se puede arreglar con ALTER DATABASE SET: el rol de la API de Supabase no
-- tiene permiso para fijar parametros a nivel de base de datos. Se dejan por
-- tanto la url y la clave incrustadas en la definicion del job, que es lo que
-- pg_cron ejecuta directamente.

SELECT cron.unschedule('xpeak-profile-incomplete-reminder');
SELECT cron.schedule(
  'xpeak-profile-incomplete-reminder',
  '0 11 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/profile-incomplete-reminder',
      headers := jsonb_build_object(
        'Authorization', 'Bearer <<CLAVE_ANON — ver .env, no se versiona>>',
        'Content-Type', 'application/json'),
      body    := '{}'::jsonb
    );
  $job$
);

SELECT cron.unschedule('xpeak-bolo-reminder-24h');
SELECT cron.schedule(
  'xpeak-bolo-reminder-24h',
  '0 9 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/bolo-reminder-24h',
      headers := jsonb_build_object(
        'Authorization', 'Bearer <<CLAVE_ANON — ver .env, no se versiona>>',
        'Content-Type', 'application/json'),
      body    := '{}'::jsonb
    );
  $job$
);

SELECT cron.unschedule('xpeak-anniversary-emails');
SELECT cron.schedule(
  'xpeak-anniversary-emails',
  '0 10 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/anniversary-emails',
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
