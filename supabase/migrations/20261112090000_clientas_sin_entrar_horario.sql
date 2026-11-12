-- 12 nov 2026: "X, 2 profesionales te esperan" salió a la 01:00 hora de Madrid
-- (Cristina, 1 nov). El cron corre cada hora; ahora solo avisa de 9:00 a 21:59
-- hora de Madrid. La ventana de 48 h hace que lo de la noche salga por la mañana.
CREATE OR REPLACE FUNCTION public.avisar_clientas_sin_entrar()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  r record;
  v_hdr jsonb;
  v_ins int;
BEGIN
  IF extract(hour FROM now() AT TIME ZONE 'Europe/Madrid') NOT BETWEEN 9 AND 21 THEN
    RETURN;
  END IF;
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
