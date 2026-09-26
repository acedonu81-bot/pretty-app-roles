-- notify_admin_review_pending (13 sep 2026) no incluía el id de la reseña en
-- el payload a send-email, así que no había forma de deduplicar si la
-- llamada async de pg_net (net.http_post) se reintentaba. Caso real (13 sep
-- 2026): 1 sola fila insertada en reviews, pero 2 emails "Nueva reseña
-- pendiente" enviados a info@xpeak.site en 14 minutos — la fila en reviews
-- confirma que no fue un doble-submit del formulario, así que el duplicado
-- vino de la infraestructura del trigger (reintento de pg_net), no del
-- cliente. Añadimos review_id para que send-email pueda deduplicar por él.
CREATE OR REPLACE FUNCTION public.notify_admin_review_pending()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_professional_name text;
BEGIN
  IF NEW.approved IS TRUE THEN
    RETURN NEW;
  END IF;

  SELECT display_name INTO v_professional_name
  FROM public.profiles
  WHERE user_id = NEW.reviewed_user_id;

  PERFORM net.http_post(
    url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'type', 'resena_pendiente',
      'data', jsonb_build_object(
        'review_id', NEW.id,
        'reviewed_user_id', NEW.reviewed_user_id,
        'reviewer_name', COALESCE(NEW.reviewer_name, 'Alguien'),
        'professional_name', COALESCE(v_professional_name, 'un profesional'),
        'rating', NEW.rating,
        'comment', COALESCE(NEW.comment, '')
      )
    )
  );

  RETURN NEW;
END;
$function$;
