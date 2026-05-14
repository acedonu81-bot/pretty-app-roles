-- ══════════════════════════════════════════════════════════════════════
-- Bot de respuesta automática para perfiles seed
-- Cuando alguien envía un Flash Booking a un perfil de demo,
-- el sistema responde automáticamente indicando que está ocupado.
-- ══════════════════════════════════════════════════════════════════════

-- 1. Añadir campo de nota/respuesta del profesional en flash_bookings
ALTER TABLE public.flash_bookings
  ADD COLUMN IF NOT EXISTS professional_note text;

-- 2. Función trigger para auto-responder en perfiles seed
CREATE OR REPLACE FUNCTION public.auto_respond_seed_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_seed boolean;
BEGIN
  -- Comprobar si el profesional es un perfil seed
  SELECT is_seed_profile INTO v_is_seed
  FROM public.profiles
  WHERE user_id = NEW.professional_user_id;

  IF v_is_seed IS TRUE THEN
    -- Auto-rechazar con mensaje realista
    NEW.status := 'declined';
    NEW.professional_note := 'Hola, muchas gracias por contactarme. Lamentablemente ya tengo esa fecha ocupada con otro evento. ¡Espero que encuentres al profesional perfecto para tu evento! Saludos.';
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger BEFORE INSERT para modificar el registro antes de guardarlo
DROP TRIGGER IF EXISTS seed_auto_respond_trigger ON public.flash_bookings;
CREATE TRIGGER seed_auto_respond_trigger
  BEFORE INSERT ON public.flash_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_respond_seed_booking();
