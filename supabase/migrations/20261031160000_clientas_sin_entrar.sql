-- 31 oct 2026: clientas particulares que nunca han entrado a XPEAK (Cristina,
-- Patricia: 0 entradas y 0 mensajes con 2 "sí" cada una).
--
-- 1) Señal para el panel admin: qué solicitudes son de una cuenta que no ha
--    iniciado sesión nunca. Solo lectura y solo admin.
CREATE OR REPLACE FUNCTION public.panel_admin_solicitudes_clientas_sin_entrar()
RETURNS TABLE(id uuid)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.es_admin() THEN RAISE EXCEPTION 'Solo admin'; END IF;
  RETURN QUERY
  SELECT b.id
    FROM public.flash_bookings b
    JOIN auth.users u ON u.id = b.created_by
   WHERE b.created_at > now() - interval '14 days'
     AND u.raw_user_meta_data->>'particular' = 'true'
     AND u.last_sign_in_at IS NULL;
END;
$function$;
REVOKE ALL ON FUNCTION public.panel_admin_solicitudes_clientas_sin_entrar() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_admin_solicitudes_clientas_sin_entrar() TO authenticated;

-- 2) Empujón a la hora: si a una clienta particular le han dicho que sí hace más
--    de 1 h (y menos de 48 h) y no ha abierto el aviso, un correo con el botón de
--    entrada. Como mucho 1 al día (email_logs_user_type_day_unique) y 2 en total.
CREATE OR REPLACE FUNCTION public.avisar_clientas_sin_entrar()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_hdr jsonb;
  v_ins int;
BEGIN
  FOR r IN
    SELECT n.user_id,
           COALESCE(NULLIF(trim(u.raw_user_meta_data->>'display_name'), ''), 'Hola') AS nombre,
           u.email,
           (SELECT COALESCE(jsonb_agg(DISTINCT b.professional_name), '[]'::jsonb)
              FROM public.flash_bookings b
             WHERE b.created_by = n.user_id AND b.status IN ('disponible', 'confirmed', 'accepted')) AS pros
      FROM public.notifications n
      JOIN auth.users u ON u.id = n.user_id
     WHERE n.type = 'reserva_disponible'
       AND n.is_read = false
       AND n.created_at < now() - interval '60 minutes'
       AND n.created_at > now() - interval '48 hours'
       AND u.raw_user_meta_data->>'particular' = 'true'
     GROUP BY n.user_id, u.raw_user_meta_data, u.email
  LOOP
    IF (SELECT count(*) FROM public.email_logs WHERE user_id = r.user_id AND type = 'particular_te_esperan') >= 2 THEN
      CONTINUE;
    END IF;
    INSERT INTO public.email_logs (user_id, type) VALUES (r.user_id, 'particular_te_esperan')
      ON CONFLICT DO NOTHING;
    GET DIAGNOSTICS v_ins = ROW_COUNT;
    IF v_ins = 0 THEN CONTINUE; END IF;
    BEGIN
      v_hdr := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
        'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_email_internal_secret'),
        'Content-Type', 'application/json');
      PERFORM net.http_post(
        url := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
        headers := v_hdr,
        body := jsonb_build_object('type', 'particular_te_esperan', 'data', jsonb_build_object(
          'user_id', r.user_id, 'name', r.nombre, 'profesionales', r.pros, 'n', jsonb_array_length(r.pros))));
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'avisar_clientas_sin_entrar: aviso % : %', r.user_id, SQLERRM;
    END;
  END LOOP;
END;
$function$;
REVOKE ALL ON FUNCTION public.avisar_clientas_sin_entrar() FROM PUBLIC, anon, authenticated;

-- La programación (cada 15 min) se crea APARTE, después de desplegar send-email con la plantilla
-- particular_te_esperan: select cron.schedule('xpeak-clientas-sin-entrar', '*/15 * * * *', 'select public.avisar_clientas_sin_entrar()');
