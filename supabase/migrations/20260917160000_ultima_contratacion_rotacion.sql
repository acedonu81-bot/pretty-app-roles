-- El banner de "última contratación" pasa de mostrar 1 fila fija a una cola
-- de hasta 10 contrataciones recientes, para que el frontend las rote en
-- carrusel: la más antigua sale sola de la cola cuando entra una nueva (por
-- el LIMIT) o cuando pasa la ventana de 60 días. Misma lógica de exclusión
-- de autocontratos y solicitudes anónimas que ya tenía la función.
CREATE OR REPLACE FUNCTION public.ultima_contratacion_publica()
 RETURNS TABLE(professional_user_id uuid, fecha timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT professional_user_id, fecha FROM (
    SELECT fb.professional_user_id, fb.created_at AS fecha
    FROM public.flash_bookings fb
    WHERE fb.status IN ('confirmed', 'completed')
      AND fb.created_at > now() - interval '60 days'
      AND fb.professional_user_id IS NOT NULL
      AND fb.created_by IS NOT NULL
      AND fb.created_by <> fb.professional_user_id
    UNION ALL
    SELECT err.professional_user_id, err.hired_at AS fecha
    FROM public.event_request_responses err
    JOIN public.event_requests er ON er.id = err.request_id
    WHERE err.hired_at IS NOT NULL
      AND err.hired_at > now() - interval '60 days'
      AND err.professional_user_id IS NOT NULL
      -- Comparado como texto a propósito: client_user_id es text, y un cast a
      -- uuid tumbaría el banner entero el día que una fila traiga un valor que
      -- no sea un uuid.
      AND er.client_user_id IS NOT NULL
      AND er.client_user_id <> err.professional_user_id::text
  ) combinado
  ORDER BY fecha DESC
  LIMIT 10;
$function$;
