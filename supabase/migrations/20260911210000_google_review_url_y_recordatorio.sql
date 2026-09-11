-- 0 reseñas en 6+ meses de producción: el sistema de reviews existe y está
-- verificado (RLS exige booking real), pero nunca se le pide al organizador
-- que valore tras el evento. Este cambio prepara el terreno para el
-- recordatorio automático (edge function review-reminder) y para el botón
-- "también en Google" que se muestra tras dejar una reseña en XPEAK.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS google_review_url text;

COMMENT ON COLUMN public.profiles.google_review_url IS
  'Enlace directo al formulario de reseña de Google del profesional (search.google.com/local/writereview?placeid=...). Opcional, lo configura el propio profesional en Ajustes. Se usa para el botón "¿También en Google?" tras dejar una reseña en XPEAK — no existe API para publicar reseñas en Google Business Profile de forma automática, así que esto es un enlace, no una sincronización.';

-- Cron diario: busca flash_bookings de eventos ya pasados (>=3 días, para dar
-- margen a que el bolo termine de verdad) que sigan confirmados/completados y
-- sin reseña de ese organizador a ese profesional, y dispara el recordatorio
-- por email. Mismo patrón que xpeak-bolo-reminder-24h.
SELECT cron.schedule(
  'xpeak-review-reminder',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/review-reminder',
    headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb);
  $$
);
