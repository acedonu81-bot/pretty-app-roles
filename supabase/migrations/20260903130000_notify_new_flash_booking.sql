-- Notificación in-app al profesional cuando le llega una nueva solicitud de
-- Flash Booking, para que le aparezca en la campana de la topbar (dropdown ya
-- existente en DashboardTopbar.tsx) tanto en vivo como al volver a entrar
-- horas después (la campana carga is_read=false de la tabla al montar).
--
-- flash_bookings acepta inserts anónimos (organizador público sin login, ver
-- policy "Anyone can insert flash bookings"), así que el trigger tiene que
-- ser SECURITY DEFINER para poder escribir en notifications sin depender del
-- rol de quien crea el booking — mismo patrón que auto_respond_seed_booking.
--
-- AFTER INSERT (no BEFORE): a diferencia de auto_respond_seed_booking, este
-- trigger no modifica la fila del booking, solo inserta un efecto derivado.
--
-- Sin notificar cuando el perfil es is_seed_profile: esos bookings se
-- auto-declinan en el mismo insert (ver seed_auto_respond_trigger) y avisar
-- de una solicitud que ya se rechazó sola no aporta nada al profesional.
CREATE OR REPLACE FUNCTION public.notify_new_flash_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_is_seed boolean;
  v_when text;
BEGIN
  IF NEW.professional_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT is_seed_profile INTO v_is_seed
  FROM public.profiles
  WHERE user_id = NEW.professional_user_id;

  IF v_is_seed IS TRUE THEN
    RETURN NEW;
  END IF;

  -- event_date se guarda como texto ISO (YYYY-MM-DD) en el 100% de los casos
  -- actuales, pero es un campo de texto libre sin constraint — si algún día
  -- llega un valor no parseable, el body cae al texto crudo en vez de romper
  -- el insert del booking (el trigger no puede fallar el flujo de reserva).
  -- Los meses se mapean a mano (sin to_char con TM) para no depender del
  -- locale del servidor de Postgres, que puede no tener es_ES instalado.
  v_when := NULLIF(trim(NEW.event_date), '');
  IF v_when IS NOT NULL THEN
    BEGIN
      v_when := extract(day from v_when::date)::text || ' de ' || (ARRAY[
        'enero','febrero','marzo','abril','mayo','junio',
        'julio','agosto','septiembre','octubre','noviembre','diciembre'
      ])[extract(month from v_when::date)::int];
    EXCEPTION WHEN OTHERS THEN
      NULL; -- se queda con el texto crudo de event_date
    END;
  END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    NEW.professional_user_id,
    'booking',
    'Nueva solicitud de reserva',
    trim(both ' ' from
      COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
      || ' quiere contratarte'
      || CASE WHEN v_when IS NOT NULL THEN ' para el ' || v_when ELSE '' END
      || CASE WHEN NULLIF(trim(NEW.event_location), '') IS NOT NULL
              THEN ' en ' || NEW.event_location ELSE '' END
    ),
    '/dashboard?view=flashbooking'
  );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_new_flash_booking_trigger ON public.flash_bookings;
CREATE TRIGGER notify_new_flash_booking_trigger
  AFTER INSERT ON public.flash_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_flash_booking();
