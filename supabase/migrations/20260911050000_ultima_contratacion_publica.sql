-- El banner "Última contratación" (prueba social pública en el directorio,
-- UltimaContratacion.tsx) consultaba flash_bookings directamente desde el
-- cliente anónimo — pero esa tabla nunca tuvo política SELECT para 'anon'
-- (solo authenticated dueño/admin), así que el banner llevaba desaparecido
-- de TODA la web desde siempre para un visitante real, sin ningún error
-- visible. A eso se sumó que las contrataciones reales migraron al sistema
-- nuevo event_requests/event_request_responses (10 sep 2026 en adelante),
-- que tiene la misma restricción de RLS.
--
-- Se expone solo lo mínimo que el banner necesita (quién, qué rol, cuándo)
-- vía función pública SECURITY DEFINER — nunca el nombre de quien contrata
-- ni el precio, tal y como ya documentaba el propio componente.
CREATE OR REPLACE FUNCTION public.ultima_contratacion_publica()
RETURNS TABLE (professional_user_id uuid, fecha timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
STABLE
AS $function$
  SELECT professional_user_id, fecha FROM (
    SELECT fb.professional_user_id, fb.created_at AS fecha
    FROM public.flash_bookings fb
    WHERE fb.status IN ('confirmed', 'completed')
      AND fb.created_at > now() - interval '60 days'
    UNION ALL
    SELECT err.professional_user_id, err.hired_at AS fecha
    FROM public.event_request_responses err
    WHERE err.hired_at IS NOT NULL
      AND err.hired_at > now() - interval '60 days'
  ) combinado
  ORDER BY fecha DESC
  LIMIT 1;
$function$;

GRANT EXECUTE ON FUNCTION public.ultima_contratacion_publica() TO anon, authenticated;
