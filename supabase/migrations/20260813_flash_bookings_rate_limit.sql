-- ════════════════════════════════════════════════════════════════
-- Rate limit en flash_bookings — el formulario "Solicitar presupuesto"
-- (y el carrito multi-profesional) permite INSERT anónimo por diseño
-- (organizadores nunca se registran para contactar), pero no tenía
-- ningún límite: un script o agente automatizado podía mandar
-- solicitudes ilimitadas. Con la exposición futura de estas acciones
-- a agentes de IA (MCP), este límite es obligatorio antes de exponer
-- nada nuevo — la validación en el cliente (JS) no protege nada
-- porque se puede saltar sin tocar el servidor.
--
-- OJO: MultiRequestModal inserta VARIAS filas de golpe (una por cada
-- profesional de una categoría/ciudad — puede ser >20 en Madrid) como
-- un único envío legítimo del usuario. El límite NO puede contar filas,
-- tiene que contar "envíos" (ráfagas). Se agrupan las filas creadas en
-- los últimos 30 segundos como un solo envío, y se limitan los envíos
-- por requester_contact en la ventana de 10 minutos — no las filas.
--
-- Límite: máximo 3 envíos (ráfagas) por el mismo requester_contact
-- en 10 minutos, sea 1 fila (Flash Booking individual) o 30 (multi-pro).
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.enforce_flash_booking_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  burst_count INT;
BEGIN
  -- Cuenta envíos distintos (agrupados en ventanas de 30s), no filas sueltas.
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
