-- 13 oct 2026: send-push pasa a exigir x-internal-secret (o clave de servicio).
-- El aviso de "Nueva solicitud Flash Booking" lo mandaba el navegador del
-- solicitante (puede ser un visitante anónimo) llamando a send-push con su
-- propia sesión; con la función cerrada eso ya no puede funcionar, así que el
-- aviso sale ahora de un trigger, como el resto de pushes.

CREATE OR REPLACE FUNCTION public.push_nueva_reserva_flash()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_extra text; v_cuerpo text;
BEGIN
  IF NEW.professional_user_id IS NULL OR NEW.professional_user_id IS NOT DISTINCT FROM NEW.created_by THEN
    RETURN NEW;
  END IF;
  BEGIN
    v_extra := concat_ws('. ',
      CASE WHEN NEW.agreed_price IS NOT NULL THEN 'Caché: ' || NEW.agreed_price || '€' END,
      NULLIF(trim(NEW.event_description), ''));
    v_cuerpo := COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
      || ' quiere contratarte'
      || COALESCE(' para el ' || NULLIF(trim(NEW.event_date), ''), '')
      || CASE WHEN v_extra <> '' THEN '. ' || v_extra ELSE '' END;
    IF length(v_cuerpo) > 180 THEN v_cuerpo := left(v_cuerpo, 180) || '…'; END IF;
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', NEW.professional_user_id,
        'title', 'Nueva solicitud Flash Booking', 'body', v_cuerpo,
        'url', '/dashboard?view=flashbooking&tab=solicitudes', 'tag', 'flash-' || NEW.id));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'push_nueva_reserva_flash: %', SQLERRM;
  END;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_push_nueva_reserva_flash ON public.flash_bookings;
CREATE TRIGGER trg_push_nueva_reserva_flash
  AFTER INSERT ON public.flash_bookings
  FOR EACH ROW EXECUTE FUNCTION public.push_nueva_reserva_flash();
