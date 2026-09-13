-- Cuando el admin aprueba una reseña (approved: false → true), se avisa por
-- email a quien la recibió: "te han dejado una reseña, ¿por qué no dejas tú
-- también la tuya?" — cierra el ciclo de reciprocidad entre organizador y
-- profesional, en vez de que cada uno solo se entere si entra a mirar su
-- panel. Se dispara al APROBAR, no al insertar, porque hasta ese momento la
-- reseña ni siquiera es visible para el reseñado (RLS: reviews_read_approved).
--
-- Mismo patrón que notify_admin_review_pending.sql (net.http_post a
-- send-email), pero en UPDATE y con SECURITY DEFINER porque quien aprueba es
-- el admin, no el reseñado — necesita leer su email en auth.users sin RLS de
-- por medio.
CREATE OR REPLACE FUNCTION public.notify_reviewed_user_on_approve()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_email text;
  v_name text;
BEGIN
  SELECT u.email, p.display_name INTO v_email, v_name
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = NEW.reviewed_user_id;

  IF v_email IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk',
      'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'type', 'te_han_dejado_una_resena',
      'data', jsonb_build_object(
        'email', v_email,
        'name', COALESCE(v_name, ''),
        'reviewer_name', COALESCE(NEW.reviewer_name, 'Alguien'),
        'rating', NEW.rating,
        'comment', COALESCE(NEW.comment, '')
      )
    )
  );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS notify_reviewed_user_on_approve_trigger ON public.reviews;
CREATE TRIGGER notify_reviewed_user_on_approve_trigger
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.approved IS DISTINCT FROM true AND NEW.approved IS TRUE)
  EXECUTE FUNCTION public.notify_reviewed_user_on_approve();
