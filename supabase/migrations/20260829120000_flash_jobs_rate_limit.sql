-- ════════════════════════════════════════════════════════════════
-- Rate-limit server-side para flash_jobs, igual que ya existe para
-- flash_bookings (enforce_flash_booking_rate_limit). El guard de
-- doble-submit en el cliente (FlashTab.tsx) no protege nada frente
-- a un insert directo a la API, así que sin esto un empresario
-- podía inundar el feed de profesionales con ofertas ilimitadas.
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.enforce_flash_jobs_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  burst_count INT;
BEGIN
  SELECT COUNT(DISTINCT date_trunc('minute', created_at) + (extract(second FROM created_at)::int / 30) * interval '30 seconds')
    INTO burst_count
  FROM public.flash_jobs
  WHERE employer_id = NEW.employer_id
    AND created_at > now() - INTERVAL '10 minutes';

  IF burst_count >= 3 THEN
    RAISE EXCEPTION 'rate_limit_exceeded: demasiadas ofertas Flash Job recientes, espera unos minutos'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS flash_jobs_rate_limit ON public.flash_jobs;

CREATE TRIGGER flash_jobs_rate_limit
  BEFORE INSERT ON public.flash_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_flash_jobs_rate_limit();
