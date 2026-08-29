-- ════════════════════════════════════════════════════════════════
-- FIX URGENTE: el trigger flash_bookings_rate_limit (migración
-- 20260813) rompió el INSERT multi-fila en producción — cualquier
-- .insert([...]) con 2+ filas en el mismo statement fallaba con
-- "new row violates row-level security policy", incluso con filas
-- de distinto requester_contact. Esto rompe MultiRequestModal y
-- EventCartCheckoutModal (ambos insertan varias filas de golpe),
-- que son flujos reales en producción — hay que revertir/arreglar
-- YA, detectado en pruebas justo después de aplicar la migración.
--
-- Causa: el SELECT COUNT(...) dentro del trigger BEFORE INSERT,
-- pese a SECURITY DEFINER, interactúa mal con el evaluador de RLS
-- de Postgres en un INSERT multi-VALUES — el plan de ejecución
-- batch parece reevaluar la política de SELECT (solo lectura por
-- el propio profesional/admin) al hacer la subconsulta interna,
-- aunque en un INSERT de 1 fila no ocurre.
--
-- Fix: forzar que la subconsulta del trigger ignore RLS de verdad
-- marcando la función como se ejecuta hoy (SECURITY DEFINER ya
-- estaba), pero además fijando explícitamente `row_security = off`
-- para esta función — la forma correcta y documentada de garantizar
-- que un SECURITY DEFINER no reevalúe RLS al leer la tabla protegida,
-- que es justo lo que fallaba en modo multi-fila.
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
