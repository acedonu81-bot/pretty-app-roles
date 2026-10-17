-- 17 oct 2026: cuando un profesional acepta una reserva Flash, el aviso al que la
-- pidió llevaba a "Flash Booking" y decía "escríbele", pero no había chat. Ahora
-- el aviso (campana y push) abre directamente el chat con el profesional. Solo
-- cambia el enlace y el texto del caso 'confirmed'; el de 'rejected' sigue igual.
CREATE OR REPLACE FUNCTION public.avisar_organizador_estado_reserva()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_pro text; v_titulo text; v_cuerpo text; v_link text;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status OR NEW.created_by IS NULL
     OR NEW.status NOT IN ('confirmed', 'rejected')
     OR auth.uid() = NEW.created_by THEN
    RETURN NEW;
  END IF;
  BEGIN
    v_pro := COALESCE(NULLIF(trim(NEW.professional_name), ''), 'El profesional');
    v_link := '/dashboard?view=flashbooking';
    IF NEW.status = 'confirmed' THEN
      v_titulo := v_pro || ' ha dicho que sí';
      v_cuerpo := v_pro || ' puede' || COALESCE(' el ' || public.fecha_legible(NEW.event_date), '')
                  || '. Pulsa para hablar con él y cerrar los detalles.';
      IF NEW.professional_user_id IS NOT NULL THEN
        v_link := '/dashboard?view=messages&con=' || NEW.professional_user_id::text
                  || '&nombre=' || replace(regexp_replace(v_pro, '[&#?=+%]', '', 'g'), ' ', '%20');
      END IF;
    ELSE
      v_titulo := v_pro || ' no está disponible';
      v_cuerpo := v_pro || ' no puede aceptar tu solicitud' || COALESCE(' para el ' || public.fecha_legible(NEW.event_date), '')
                  || '. Puedes buscar a otro profesional o publicar una oferta para recibir propuestas.';
    END IF;
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.created_by, 'reserva_' || NEW.status, v_titulo, v_cuerpo, v_link);
    PERFORM net.http_post(
      url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', NEW.created_by, 'title', v_titulo, 'body', v_cuerpo, 'url', v_link));
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'avisar_organizador_estado_reserva: %', SQLERRM;
  END;
  RETURN NEW;
END $function$;
