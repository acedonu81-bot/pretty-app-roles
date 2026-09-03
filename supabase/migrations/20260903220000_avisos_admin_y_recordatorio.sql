-- Nadie se enteró de la solicitud de Ramón.
--
-- El 22 ago 2026 un cliente real (sin cuenta, desde el directorio público)
-- pidió un camarero para un cumpleaños en Torrent el 19 de septiembre. Mandó la
-- petición a 5 profesionales. Ninguno respondió: los avisos al profesional
-- estaban rotos por los cron caídos, y el email al admin se perdió entre otros
-- correos. Se descubrió el 3 sep, con el evento a 16 días.
--
-- Esta migración añade tres cosas para que no vuelva a pasar:
--   1. Notificación al admin en su propia campana (el panel es donde se entra a
--      mirar; un correo se pierde, como pasó aquí).
--   2. Recordatorio automático 1 hora después si la solicitud sigue sin
--      responder, al profesional y al admin.
--   3. Una vista que expone las solicitudes sin responder, para pintarlas en el
--      panel de admin.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Avisar también al admin cuando entra una solicitud
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_new_flash_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_is_seed boolean;
  v_when text;
  v_cuerpo text;
  v_admin uuid;
BEGIN
  -- event_date se guarda como texto ISO (YYYY-MM-DD) en el 100% de los casos
  -- actuales, pero es texto libre sin constraint: si llega algo no parseable,
  -- el cuerpo cae al texto crudo en vez de romper el insert de la reserva.
  -- Los meses se mapean a mano para no depender del locale del servidor.
  v_when := NULLIF(trim(NEW.event_date), '');
  IF v_when IS NOT NULL THEN
    BEGIN
      v_when := extract(day from v_when::date)::text || ' de ' || (ARRAY[
        'enero','febrero','marzo','abril','mayo','junio',
        'julio','agosto','septiembre','octubre','noviembre','diciembre'
      ])[extract(month from v_when::date)::int];
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  v_cuerpo := trim(both ' ' from
    COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
    || ' quiere contratar'
    || CASE WHEN NULLIF(trim(NEW.professional_name), '') IS NOT NULL
            THEN ' a ' || NEW.professional_name ELSE 'te' END
    || CASE WHEN v_when IS NOT NULL THEN ' para el ' || v_when ELSE '' END
    || CASE WHEN NULLIF(trim(NEW.event_location), '') IS NOT NULL
            THEN ' en ' || NEW.event_location ELSE '' END
  );

  -- Aviso al profesional (salvo perfiles semilla, que se auto-declinan en el
  -- mismo insert: avisar de algo ya rechazado no aporta nada).
  IF NEW.professional_user_id IS NOT NULL THEN
    SELECT is_seed_profile INTO v_is_seed
    FROM public.profiles WHERE user_id = NEW.professional_user_id;

    IF v_is_seed IS DISTINCT FROM TRUE THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        NEW.professional_user_id, 'booking', 'Nueva solicitud de reserva',
        trim(both ' ' from
          COALESCE(NULLIF(trim(NEW.requester_name), ''), 'Alguien')
          || ' quiere contratarte'
          || CASE WHEN v_when IS NOT NULL THEN ' para el ' || v_when ELSE '' END
          || CASE WHEN NULLIF(trim(NEW.event_location), '') IS NOT NULL
                  THEN ' en ' || NEW.event_location ELSE '' END),
        '/dashboard?view=flashbooking'
      );
    END IF;
  END IF;

  -- Aviso a cada admin, SIEMPRE: incluso sin professional_user_id (solicitudes
  -- que no apuntan a nadie concreto) o a un perfil semilla. Justo esos casos
  -- son los que nadie ve y los que hay que atender a mano.
  FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      v_admin, 'admin_booking', 'Solicitud nueva de un cliente', v_cuerpo,
      '/dashboard?view=admin'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Recordatorio a la hora si nadie ha respondido
-- ─────────────────────────────────────────────────────────────────────────────
-- Se marca la fila para no repetir el recordatorio en cada pasada del cron.
ALTER TABLE public.flash_bookings
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

COMMENT ON COLUMN public.flash_bookings.reminder_sent_at IS
  'Cuándo se envió el recordatorio de "sigue sin responder". NULL = aún no enviado.';

CREATE OR REPLACE FUNCTION public.remind_pending_flash_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_admin uuid;
  v_horas int;
BEGIN
  FOR r IN
    SELECT * FROM public.flash_bookings
    WHERE status = 'pending'
      AND reminder_sent_at IS NULL
      AND created_at < now() - interval '1 hour'
      -- Ventana de 48h: pasado ese punto la solicitud ya está perdida y el
      -- recordatorio solo sería ruido. Evita además que, al desplegar esto,
      -- se disparen de golpe recordatorios de solicitudes viejas (las 30
      -- pendientes de agosto).
      AND created_at > now() - interval '48 hours'
  LOOP
    v_horas := GREATEST(1, EXTRACT(EPOCH FROM (now() - r.created_at)) / 3600)::int;

    IF r.professional_user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        r.professional_user_id, 'booking_reminder',
        'Tienes una solicitud sin responder',
        COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
          || ' te escribió hace ' || v_horas || ' h y sigue esperando respuesta.'
          || ' Contesta aunque sea para decir que no puedes: quien responde recibe más encargos.',
        '/dashboard?view=flashbooking'
      );
    END IF;

    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        v_admin, 'admin_booking_reminder',
        'Solicitud sin responder (' || v_horas || ' h)',
        COALESCE(NULLIF(trim(r.requester_name), ''), 'Un cliente')
          || ' sigue sin respuesta'
          || CASE WHEN NULLIF(trim(r.professional_name), '') IS NOT NULL
                  THEN ' de ' || r.professional_name ELSE '' END
          || '. Contacto: ' || COALESCE(NULLIF(trim(r.requester_contact), ''), 'sin datos'),
        '/dashboard?view=admin'
      );
    END LOOP;

    UPDATE public.flash_bookings SET reminder_sent_at = now() WHERE id = r.id;
  END LOOP;
END;
$function$;

-- Cada 15 minutos: el recordatorio sale como muy tarde 1h15 después de la
-- solicitud. Minuto 7 en vez de 0 para no coincidir con el resto de crons.
SELECT cron.unschedule('xpeak-flash-booking-reminder')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'xpeak-flash-booking-reminder');

SELECT cron.schedule(
  'xpeak-flash-booking-reminder',
  '7,22,37,52 * * * *',
  $$SELECT public.remind_pending_flash_bookings()$$
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Vista de solicitudes sin responder, para el panel de admin
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.admin_pending_bookings AS
SELECT
  b.id,
  b.requester_name,
  b.requester_contact,
  b.professional_name,
  b.professional_user_id,
  b.event_date,
  b.event_location,
  b.event_description,
  b.created_at,
  b.reminder_sent_at,
  EXTRACT(EPOCH FROM (now() - b.created_at)) / 3600 AS horas_esperando
FROM public.flash_bookings b
WHERE b.status = 'pending'
ORDER BY b.created_at DESC;

COMMENT ON VIEW public.admin_pending_bookings IS
  'Solicitudes de reserva que ningún profesional ha respondido. Alimenta el aviso del panel de admin: el caso de Ramón (22 ago 2026) fue invisible durante 12 días.';

REVOKE ALL ON public.admin_pending_bookings FROM anon, authenticated;
GRANT SELECT ON public.admin_pending_bookings TO authenticated;
