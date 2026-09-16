-- El banner de "última contratación" del directorio es prueba social: solo
-- puede contar contrataciones entre DOS personas distintas. Un profesional que
-- se genera un contrato a sí mismo (created_by = professional_user_id) estaba
-- entrando como contratación real — el 16 sep 2026 el banner que veía todo
-- visitante anunciaba a "Dj Poly", y era su propio autocontrato.
--
-- También se exigen ambos extremos identificados: una fila sin created_by /
-- client_user_id (solicitud anónima) no puede demostrarse que sea de un
-- tercero, así que tampoco cuenta.
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
  LIMIT 1;
$function$;
