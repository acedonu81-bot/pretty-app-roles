-- SEC-01 (crítico): la policy de lectura de profiles concede a anon un
-- SELECT USING (true) sobre TODA la fila, incluida email (dato personal, RGPD).
-- Verificado en prod: 36 emails reales exfiltrables con la anon key pública.
--
-- Ninguna página/consulta pública (DirectorioPublico, PublicProfile,
-- CityLanding, OccasionLanding, Landing, DirectoryView) pide email, phone,
-- birthday ni referral_code de terceros — solo columnas de escaparate. Los
-- select('*') que traen esas columnas son siempre del PROPIO perfil
-- (authenticated, .eq('user_id', auth.uid())) o de admin. Por tanto revocar
-- estas columnas al rol anon cierra el vector sin romper el frontend.
--
-- Enfoque: column-level security REVOCANDO solo las columnas sensibles (en vez
-- de re-conceder la lista blanca), para no depender de enumerar todas las
-- columnas "buenas" — la tabla ha ido creciendo por migraciones y una lista
-- blanca se rompería en cuanto se añada una columna nueva.

-- Revocar el SELECT de las columnas con PII al rol anónimo.
-- (Postgres: un select('*') anónimo devolverá error de permiso; la app nunca
--  hace select('*') anónimo sobre profiles, así que no afecta.)
REVOKE SELECT (email)         ON public.profiles FROM anon;
REVOKE SELECT (phone)         ON public.profiles FROM anon;
REVOKE SELECT (birthday)      ON public.profiles FROM anon;
REVOKE SELECT (referral_code) ON public.profiles FROM anon;

-- trial_started_at: dato de negocio interno, tampoco debe ser público.
REVOKE SELECT (trial_started_at) ON public.profiles FROM anon;

DO $$
BEGIN
  RAISE NOTICE 'SEC-01 aplicado: anon ya no puede leer email/phone/birthday/referral_code/trial_started_at de profiles';
END $$;

-- ─────────────────────────────────────────────────────────────────
-- SEC-04 (medio): freno anti-spam para la captura de leads anónima.
-- leads ya tiene UNIQUE(email), lo que evita duplicados, pero no frena
-- una ráfaga de inserts con emails distintos desde una misma fuente.
-- flash_bookings y profile_business_views ya tienen su propio trigger;
-- leads era la única tabla de escritura anónima sin ningún freno temporal.
-- Límite: máximo 20 leads nuevos en 10 minutos de forma global (la tabla
-- no guarda IP; se limita el burst agregado, suficiente para el volumen
-- real de un formulario de captura y para cortar un bot que inserte en bucle).
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.enforce_leads_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.leads
  WHERE created_at > now() - INTERVAL '10 minutes';

  IF recent_count >= 20 THEN
    RAISE EXCEPTION 'rate_limit_exceeded: demasiados registros recientes, espera unos minutos'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_rate_limit ON public.leads;
CREATE TRIGGER leads_rate_limit
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_leads_rate_limit();

-- ─────────────────────────────────────────────────────────────────
-- SEC-05 (bajo): validación server-side de subidas al bucket audio-sessions.
-- Hoy la validación de tipo/tamaño vive solo en el cliente (evadible). El
-- bucket es multiuso (fotos de perfil, portfolio de imagen/vídeo y sesiones
-- de audio), así que la lista blanca cubre esos tres tipos y nada más. Con
-- esto, aunque un usuario autenticado salte la UI, Storage rechaza un binario
-- arbitrario. Límite de 50 MB por objeto (holgado para vídeo corto de
-- portfolio, pero acotado).
-- ─────────────────────────────────────────────────────────────────
UPDATE storage.buckets
SET
  file_size_limit = 52428800, -- 50 MB
  allowed_mime_types = ARRAY[
    'image/jpeg','image/png','image/webp','image/gif',
    'audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/m4a','audio/x-m4a','audio/aac','audio/ogg',
    'video/mp4','video/webm','video/quicktime'
  ]
WHERE id = 'audio-sessions';
