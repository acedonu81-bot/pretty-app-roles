-- Aviso por email al admin cuando llega una reseña nueva pendiente de
-- aprobar (13 sep 2026). Antes el único sitio donde se veía era la pestaña
-- "Reseñas" del panel admin (AdminReviews.tsx) — si el admin no entraba ahí,
-- una reseña podía quedar semanas sin aprobar/rechazar sin que nadie se
-- enterara. Complementa el badge en tiempo real de AdminView.tsx (para
-- cuando ya estás en el panel), este trigger es para cuando no lo estás.
--
-- AFTER INSERT vía net.http_post a send-email, mismo patrón que
-- notify_new_flash_booking.sql pero llamando a una edge function en vez de
-- insertar en notifications — porque este aviso es solo para el admin
-- (email fijo), no un usuario con sesión que vea la campana in-app.
--
-- SECURITY DEFINER: reviews acepta inserts desde el flujo público de
-- valoración (organizador/profesional sin panel admin), así que el trigger
-- no puede depender de permisos del usuario que inserta.
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

DROP TRIGGER IF EXISTS notify_admin_review_pending_trigger ON public.reviews;
CREATE TRIGGER notify_admin_review_pending_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_review_pending();
