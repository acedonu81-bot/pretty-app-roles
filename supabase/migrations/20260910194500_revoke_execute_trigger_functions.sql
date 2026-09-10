-- Las funciones de trigger no deben ser invocables por REST.
--
-- Los advisors de Supabase avisaron de que notify_new_flash_job,
-- notify_new_event_request y notify_event_request_response (y la preexistente
-- notify_new_flash_booking) tenían EXECUTE para anon y authenticated: quedan
-- expuestas en /rest/v1/rpc/<nombre>. Son SECURITY DEFINER y escriben en
-- notifications, así que la superficie sobra por completo: solo las debe
-- ejecutar el propio trigger, que corre como el dueño de la tabla.
--
-- Aplica la regla fija del proyecto: auditar los GRANT de todo lo que se crea,
-- sin esperar a que salte el aviso.
REVOKE EXECUTE ON FUNCTION public.notify_new_flash_job() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_event_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_event_request_response() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_flash_booking() FROM PUBLIC, anon, authenticated;
