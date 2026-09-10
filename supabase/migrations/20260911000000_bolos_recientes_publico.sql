-- Función pública para el popup "Nuevo bolo/trabajo conseguido" de la
-- landing (social-proof): solo rol + rango de fechas del evento, últimos 7
-- días, SIN nombre ni empresa ni ciudad — ver feedback_no_sacar_contacto_fuera_app.
--
-- Solo lee event_request_responses (es la única de las 3 tablas del flujo
-- "alguien busca profesional" con un hired_at fiable hoy; flash_jobs no tiene
-- columna de "cubierto" y flash_bookings está vacía — ver
-- reference_multiples_caminos_entrada si en el futuro se amplía).
CREATE OR REPLACE FUNCTION public.bolos_recientes_publico()
RETURNS TABLE (role text, event_date text, event_dates text[])
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    (SELECT r.roles_needed[1] FROM public.event_requests r WHERE r.id = err.request_id) AS role,
    (SELECT r.event_date FROM public.event_requests r WHERE r.id = err.request_id) AS event_date,
    (SELECT r.event_dates FROM public.event_requests r WHERE r.id = err.request_id) AS event_dates
  FROM public.event_request_responses err
  WHERE err.hired_at IS NOT NULL
    AND err.hired_at > now() - interval '7 days'
  ORDER BY err.hired_at DESC
  LIMIT 20;
$$;

GRANT EXECUTE ON FUNCTION public.bolos_recientes_publico() TO anon, authenticated;
