-- ════════════════════════════════════════════════════════════════
-- Restaura el trigger de rate-limit (eliminado temporalmente para
-- descartar que fuera la causa de un fallo de RLS en insert
-- multi-fila — se confirmó que el fallo real venía de usar
-- `.select()` tras el insert en el script de diagnóstico, algo que
-- el código real de producción (MultiRequestModal, EventCart
-- CheckoutModal) NUNCA hace. El trigger en sí era correcto.
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.enforce_flash_booking_rate_limit()
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
  FROM public.flash_bookings
  WHERE requester_contact = NEW.requester_contact
    AND created_at > now() - INTERVAL '10 minutes';

  IF burst_count >= 3 THEN
    RAISE EXCEPTION 'rate_limit_exceeded: demasiadas solicitudes recientes, espera unos minutos'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS flash_bookings_rate_limit ON public.flash_bookings;

CREATE TRIGGER flash_bookings_rate_limit
  BEFORE INSERT ON public.flash_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_flash_booking_rate_limit();
